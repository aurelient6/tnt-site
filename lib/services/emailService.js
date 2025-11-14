import * as brevo from '@getbrevo/brevo';
import { INFORMATIONS } from '../../app/constantes/infos.js';

// Initialisation conditionnelle de Brevo
let apiInstance = null;

function getBrevoInstance() {
  if (!apiInstance && process.env.BREVO_API_KEY) {
    apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );
  }
  return apiInstance;
}

export async function sendBookingConfirmation({ 
  clientEmail, 
  clientName, 
  serviceName, 
  date, 
  time,
  bookingId,
  clientPhone,
  dogBreed,
  totalPrice
}) {
  const sendSmtpEmail = {
    to: [{ email: clientEmail, name: clientName }],
    sender: { email: "auretav04@gmail.com", name: `${INFORMATIONS.name} - Réservations` },
    subject: `✅ Réservation confirmée - ${INFORMATIONS.name}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0d3b66; margin-bottom: 20px;">✅ Réservation confirmée !</h1>
          <p style="font-size: 16px; color: #333;">Bonjour <strong>${clientName}</strong>,</p>
          <p style="font-size: 16px; color: #333;">Votre réservation a bien été enregistrée avec succès.</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d3b66;">
            <h3 style="margin-top: 0; color: #0d3b66;">📋 Détails de votre réservation</h3>
            <p style="margin: 10px 0;"><strong>🔢 Numéro de réservation :</strong> #${bookingId}</p>
            <p style="margin: 10px 0;"><strong>🐕 Service :</strong> ${serviceName}</p>
            <p style="margin: 10px 0;"><strong>📅 Date :</strong> ${date}</p>
            <p style="margin: 10px 0;"><strong>⏰ Heure :</strong> ${time}</p>
            ${totalPrice ? `<p style="margin: 10px 0;"><strong>💰 Prix :</strong> ${totalPrice}€</p>` : ''}
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>ℹ️ Informations importantes :</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
              <li>Merci d'arriver 10 minutes avant votre rendez-vous</li>
              <li>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</li>
              <li>Conservez ce mail comme confirmation de votre réservation</li>
            </ul>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>📞 Besoin de nous contacter ?</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">Téléphone : ${INFORMATIONS.phone}</p>
            <p style="margin: 5px 0; font-size: 14px;">Email : ${INFORMATIONS.email}</p>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
            Nous avons hâte de vous accueillir !<br>
            <strong>L'équipe ${INFORMATIONS.name}</strong>
          </p>
        </div>
        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      </div>
    `
  };

  try {
    const apiInstance = getBrevoInstance();
    
    // Si Brevo n'est pas configuré, logger l'erreur mais ne pas crasher
    if (!apiInstance) {
      console.warn('⚠️ BREVO_API_KEY non configuré - Email non envoyé');
      return { success: false, error: 'Brevo not configured' };
    }

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur Brevo complète:', error.response?.body || error);
    return { success: false, error };
  }
}