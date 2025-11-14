import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Crée une session de paiement Stripe
 * @param {Object} params - Paramètres de la session
 * @param {string} params.bookingId - ID de la réservation
 * @param {string} params.serviceName - Nom du service
 * @param {number} params.amount - Montant en euros
 * @param {string} params.clientEmail - Email du client
 * @param {string} params.confirmationToken - Token de confirmation de la réservation
 * @returns {Promise<string>} - URL de la session de paiement
 */
export async function createCheckoutSession({ 
  bookingId, 
  serviceName, 
  amount, 
  clientEmail,
  confirmationToken 
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: serviceName,
              description: `Réservation ${serviceName} - T&T`,
            },
            unit_amount: Math.round(amount * 100), // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?token=${confirmationToken}&payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?token=${confirmationToken}&payment=cancelled`,
      client_reference_id: bookingId.toString(),
      customer_email: clientEmail,
      metadata: {
        bookingId: bookingId.toString(),
        confirmationToken,
      },
    });

    return session.url;
  } catch (error) {
    throw new Error('Impossible de créer la session de paiement');
  }
}

/**
 * Vérifie une signature webhook Stripe
 * @param {string} payload - Corps de la requête
 * @param {string} signature - Signature Stripe
 * @returns {Object} - Événement Stripe vérifié
 */
export function verifyWebhookSignature(payload, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET non configuré');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    throw new Error('Signature webhook invalide');
  }
}

/**
 * Récupère les détails d'une session de paiement
 * @param {string} sessionId - ID de la session Stripe
 * @returns {Promise<Object>} - Détails de la session
 */
export async function getCheckoutSession(sessionId) {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    throw new Error('Impossible de récupérer la session de paiement');
  }
}
