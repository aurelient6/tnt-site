import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import { isValidToken } from '@/lib/utils/crypto';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      );
    }

    // Valider le format du token
    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 400 }
      );
    }

    // Récupérer la réservation avec le token
    const result = await sql`
      SELECT 
        b.id,
        b.client_name,
        b.client_firstname,
        b.client_email,
        b.client_phone,
        b.dog_breed,
        b.booking_date,
        b.booking_time,
        b.total_price,
        b.price_details,
        b.form_responses,
        b.status,
        b.created_at,
        s.name as service_name,
        s.slug as service_slug
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.confirmation_token = ${token}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
