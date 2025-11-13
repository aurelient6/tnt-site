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

        console.log('✅ Paiement réussi pour la réservation:', bookingId);

        // Récupérer les détails de la réservation AVANT la mise à jour
        const bookingCheck = await sql`
          SELECT b.*, s.name as service_name
          FROM bookings b
          JOIN services s ON b.service_id = s.id
          WHERE b.id = ${bookingId}
        `;

        if (bookingCheck.length === 0) {
          console.log('❌ Réservation non trouvée:', bookingId);
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const bookingData = bookingCheck[0];

        // Vérifier que le créneau est toujours disponible
        const slotCheck = await sql`
          SELECT is_available FROM time_slots WHERE id = ${bookingData.time_slot_id}
        `;

        if (slotCheck.length === 0 || !slotCheck[0].is_available) {
          console.log('❌ Créneau déjà réservé par quelqu\'un d\'autre');
          // TODO: Rembourser le client automatiquement via Stripe
          return NextResponse.json({ 
            error: 'Time slot no longer available',
            message: 'Le créneau a été réservé par quelqu\'un d\'autre pendant votre paiement'
          }, { status: 409 });
        }

        // Mise à jour conditionnelle : SEULEMENT si payment_status est 'pending'
        // ET bloquer le créneau en même temps (transaction atomique)
        const updateResult = await sql`
          WITH slot_update AS (
            UPDATE time_slots 
            SET is_available = false 
            WHERE id = ${bookingData.time_slot_id} 
              AND is_available = true
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
          console.log('⚠️ Paiement déjà traité ou créneau indisponible, skip');
          return NextResponse.json({ received: true, message: 'Already processed or slot unavailable' });
        }

        console.log('🔒 Créneau bloqué et paiement confirmé');
        console.log('✉️ Envoi de l\'email de confirmation...');

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

        console.log('📧 Email de confirmation envoyé');

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const bookingId = session.metadata.bookingId;

        console.log('⏰ Session expirée pour la réservation:', bookingId);

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
        
        console.log('❌ Paiement échoué:', paymentIntent.id);

        // Marquer le paiement comme échoué
        await sql`
          UPDATE bookings 
          SET payment_status = 'failed'
          WHERE stripe_payment_intent = ${paymentIntent.id}
        `;

        break;
      }

      default:
        console.log('ℹ️ Événement non géré:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Erreur webhook Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur traitement webhook' },
      { status: 400 }
    );
  }
}
