import * as brevo from '@getbrevo/brevo';
import { INFORMATIONS } from '../../app/constantes/infos.js';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function sendBookingConfirmation({ 
  clientEmail, 
  clientName, 
  serviceName, 
  date, 
  time 
}) {
  const sendSmtpEmail = {
    to: [{ email: clientEmail, name: clientName }],
    // Utilise l'email par défaut de Brevo pour les tests
    // Pour la production, remplace par ton email vérifié dans Brevo
    sender: { email: "auretav04@gmail.com", name: `${INFORMATIONS.name} - Réservations` },
    subject: `✅ Réservation confirmée - ${INFORMATIONS.name}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0d3b66; margin-bottom: 20px;">✅ Réservation confirmée !</h1>
          <p style="font-size: 16px; color: #333;">Bonjour <strong>${clientName}</strong>,</p>
          <p style="font-size: 16px; color: #333;">Votre réservation a bien été enregistrée.</p>
          
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d3b66;">
            <p style="margin: 10px 0;"><strong>🐕 Service :</strong> ${serviceName}</p>
            <p style="margin: 10px 0;"><strong>📅 Date :</strong> ${date}</p>
            <p style="margin: 10px 0;"><strong>⏰ Heure :</strong> ${time}</p>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Nous avons hâte de vous accueillir !<br>
            L'équipe ${INFORMATIONS.name}
          </p>
        </div>
        <img src="images/logo/logo.png" alt="${INFORMATIONS.name} Logo" style="display: block; margin: 20px auto 0; max-width: 150px;">
      </div>
    `
  };

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur Brevo complète:', error.response?.body || error);
    return { success: false, error };
  }
}