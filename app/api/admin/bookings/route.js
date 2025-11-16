import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import { isAuthenticated } from '@/lib/middleware/adminAuth';

export async function GET(request) {
  // Vérifier l'authentification
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const serviceSlug = searchParams.get('service');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!serviceSlug) {
      return NextResponse.json(
        { error: 'Service slug is required' },
        { status: 400 }
      );
    }

    // Récupérer le service
    const serviceResult = await sql`
      SELECT id FROM services WHERE slug = ${serviceSlug}
    `;

    if (serviceResult.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const serviceId = serviceResult[0].id;

    // Query de base
    let query;
    
    if (startDate && endDate) {
      // Récupérer les réservations pour une période spécifique
      query = sql`
        SELECT 
          b.id,
          b.client_name,
          b.client_firstname,
          b.client_email,
          b.client_phone,
          b.dog_breed,
          b.total_price,
          b.price_details,
          b.status,
          b.payment_status,
          b.created_at,
          b.form_responses,
          t.slot_date,
          t.slot_time,
          s.name as service_name,
          s.slug as service_slug
        FROM bookings b
        JOIN time_slots t ON b.time_slot_id = t.id
        JOIN services s ON b.service_id = s.id
        WHERE b.service_id = ${serviceId}
          AND t.slot_date >= ${startDate}
          AND t.slot_date <= ${endDate}
        ORDER BY t.slot_date ASC, t.slot_time ASC
      `;
    } else {
      // Récupérer toutes les réservations futures
      query = sql`
        SELECT 
          b.id,
          b.client_name,
          b.client_firstname,
          b.client_email,
          b.client_phone,
          b.dog_breed,
          b.total_price,
          b.price_details,
          b.status,
          b.payment_status,
          b.created_at,
          b.form_responses,
          t.slot_date,
          t.slot_time,
          s.name as service_name,
          s.slug as service_slug
        FROM bookings b
        JOIN time_slots t ON b.time_slot_id = t.id
        JOIN services s ON b.service_id = s.id
        WHERE b.service_id = ${serviceId}
          AND t.slot_date >= CURRENT_DATE
        ORDER BY t.slot_date ASC, t.slot_time ASC
      `;
    }

    const bookings = await query;

    return NextResponse.json({
      bookings,
      count: bookings.length
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
