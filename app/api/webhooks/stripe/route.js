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

        // Mise à jour conditionnelle : SEULEMENT si payment_status est 'pending'
        // Cela évite les doublons même si deux webhooks arrivent en même temps
        const updateResult = await sql`
          UPDATE bookings 
          SET payment_status = 'paid',
              status = 'confirmed',
              stripe_session_id = ${session.id},
              stripe_payment_intent = ${session.payment_intent}
          WHERE id = ${bookingId} 
            AND payment_status = 'pending'
          RETURNING id
        `;

        // Si aucune ligne mise à jour, c'est que c'était déjà traité
        if (updateResult.length === 0) {
          console.log('⚠️ Paiement déjà traité, skip email');
          return NextResponse.json({ received: true, message: 'Already processed' });
        }

        console.log('✉️ Envoi de l\'email de confirmation...');

        // Récupérer les détails de la réservation pour l'email
        const result = await sql`
          SELECT 
            b.*,
            s.name as service_name
          FROM bookings b
          JOIN services s ON b.service_id = s.id
          WHERE b.id = ${bookingId}
        `;

        if (result.length > 0) {
          const booking = result[0];
          
          // Formater la date correctement
          const formattedDate = new Date(booking.booking_date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Europe/Paris'
          });
          
          // Formater l'heure (HH:MM)
          const formattedTime = booking.booking_time.slice(0, 5);
          
          // Envoyer l'email de confirmation
          await sendBookingConfirmation({
            clientEmail: booking.client_email,
            clientName: `${booking.client_firstname} ${booking.client_name}`,
            serviceName: booking.service_name,
            date: formattedDate,
            time: formattedTime,
            bookingId: booking.id,
            clientPhone: booking.client_phone,
            dogBreed: booking.dog_breed,
            totalPrice: booking.total_price,
            confirmationToken: booking.confirmation_token,
          });

          console.log('📧 Email de confirmation envoyé');
        }

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
