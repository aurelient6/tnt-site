import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/services/stripeService';
import { sql } from '@/lib/db/client';
import { sendBookingConfirmation } from '@/lib/services/emailService';

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    // Vérifier la signature du webhook
    const event = verifyWebhookSignature(body, signature);

    // Traiter l'événement
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId = session.metadata.bookingId;
        const confirmationToken = session.metadata.confirmationToken;

        // Récupérer les détails de la réservation AVANT la mise à jour
        const bookingCheck = await sql`
          SELECT b.*, s.name as service_name
          FROM bookings b
          JOIN services s ON b.service_id = s.id
          WHERE b.id = ${bookingId}
        `;

        if (bookingCheck.length === 0) {
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const bookingData = bookingCheck[0];

        // Vérifier que le créneau a encore de la place
        const slotCheck = await sql`
          SELECT capacity, booked_count 
          FROM time_slots 
          WHERE id = ${bookingData.time_slot_id}
        `;

        if (slotCheck.length === 0 || slotCheck[0].booked_count >= slotCheck[0].capacity) {
          // TODO: Rembourser le client automatiquement via Stripe
          return NextResponse.json({ 
            error: 'Time slot is full',
            message: 'Le créneau est complet'
          }, { status: 409 });
        }

        // Mise à jour conditionnelle : SEULEMENT si payment_status est 'pending'
        // ET incrémenter booked_count en même temps (transaction atomique)
        const updateResult = await sql`
          WITH slot_update AS (
            UPDATE time_slots 
            SET booked_count = booked_count + 1,
                is_available = CASE 
                  WHEN booked_count + 1 >= capacity THEN false 
                  ELSE true 
                END
            WHERE id = ${bookingData.time_slot_id} 
              AND booked_count < capacity
            RETURNING id
          )
          UPDATE bookings 
          SET payment_status = 'paid',
              status = 'confirmed',
              stripe_session_id = ${session.id},
              stripe_payment_intent = ${session.payment_intent}
          WHERE id = ${bookingId} 
            AND payment_status = 'pending'
            AND EXISTS (SELECT 1 FROM slot_update)
          RETURNING id
        `;

        // Si aucune ligne mise à jour, c'est que c'était déjà traité ou créneau plus disponible
        if (updateResult.length === 0) {
          return NextResponse.json({ received: true, message: 'Already processed or slot unavailable' });
        }

        // Formater la date correctement
        const formattedDate = new Date(bookingData.booking_date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Europe/Paris'
        });
        
        // Formater l'heure (HH:MM)
        const formattedTime = bookingData.booking_time.slice(0, 5);
        
        // Envoyer l'email de confirmation
        await sendBookingConfirmation({
          clientEmail: bookingData.client_email,
          clientName: `${bookingData.client_firstname} ${bookingData.client_name}`,
          serviceName: bookingData.service_name,
          date: formattedDate,
          time: formattedTime,
          bookingId: bookingData.id,
          clientPhone: bookingData.client_phone,
          dogBreed: bookingData.dog_breed,
          totalPrice: bookingData.total_price,
          confirmationToken: bookingData.confirmation_token,
        });

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const bookingId = session.metadata.bookingId;

        // Marquer le paiement comme échoué
        await sql`
          UPDATE bookings 
          SET payment_status = 'failed'
          WHERE id = ${bookingId}
        `;

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;

        // Marquer le paiement comme échoué
        await sql`
          UPDATE bookings 
          SET payment_status = 'failed'
          WHERE stripe_payment_intent = ${paymentIntent.id}
        `;

        break;
      }

      default:
        // Événement non géré
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur traitement webhook' },
      { status: 400 }
    );
  }
}
