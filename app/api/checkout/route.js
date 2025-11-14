import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/services/stripeService';
import { sql } from '@/lib/db/client';

export async function POST(request) {
  try {
    const { bookingId, confirmationToken } = await request.json();

    if (!bookingId || !confirmationToken) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Récupérer les informations de la réservation
    const result = await sql`
      SELECT 
        b.id,
        b.client_email,
        b.total_price,
        b.confirmation_token,
        b.payment_status,
        b.time_slot_id,
        s.name as service_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.id = ${bookingId} AND b.confirmation_token = ${confirmationToken}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    const booking = result[0];

    // Vérifier si déjà payé
    if (booking.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Cette réservation a déjà été payée' },
        { status: 400 }
      );
    }

    // ✨ NOUVEAU : Vérifier que le créneau est toujours disponible
    const slotCheck = await sql`
      SELECT is_available FROM time_slots WHERE id = ${booking.time_slot_id}
    `;

    if (slotCheck.length === 0 || !slotCheck[0].is_available) {
      return NextResponse.json(
        { 
          error: 'Ce créneau a déjà été réservé par quelqu\'un d\'autre',
          code: 'SLOT_UNAVAILABLE'
        },
        { status: 409 }
      );
    }

    // Créer la session Stripe
    const sessionUrl = await createCheckoutSession({
      bookingId: booking.id,
      serviceName: booking.service_name,
      amount: parseFloat(booking.total_price),
      clientEmail: booking.client_email,
      confirmationToken: booking.confirmation_token,
    });

    return NextResponse.json({ url: sessionUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
