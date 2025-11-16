/**
 * Script pour vérifier les réservations dogsitting
 * Usage: node scripts/check-dogsitting-bookings.js
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

try {
  const envFile = readFileSync(envPath, 'utf-8');
  const envVars = envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...values] = line.split('=');
      if (key && values.length) {
        acc[key.trim()] = values.join('=').trim();
      }
      return acc;
    }, {});
  
  Object.assign(process.env, envVars);
} catch (error) {
  console.error('⚠️  Impossible de charger .env.local:', error.message);
}

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL non défini');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function checkBookings() {
  try {
    console.log('🔍 Vérification des réservations dogsitting...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0]}\n`);

    // Récupérer toutes les réservations dogsitting
    const bookings = await sql`
      SELECT 
        b.*,
        s.slug as service_slug
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE s.slug = 'dogsitting'
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `;

    console.log(`📊 Nombre de réservations: ${bookings.length}\n`);

    if (bookings.length === 0) {
      console.log('⚠️  Aucune réservation trouvée');
      return;
    }

    bookings.forEach((booking, index) => {
      console.log(`\n📋 Réservation ${index + 1}:`);
      console.log(`   ID: ${booking.id}`);
      console.log(`   Client: ${booking.client_firstname} ${booking.client_name}`);
      console.log(`   Date: ${booking.booking_date}`);
      console.log(`   Heure: ${booking.booking_time}`);
      console.log(`   Statut paiement: ${booking.payment_status}`);
      console.log(`   Statut: ${booking.status}`);
      console.log(`   Prix: ${booking.total_price}€`);
      
      // Parser et afficher form_responses
      try {
        const formResponses = typeof booking.form_responses === 'string' 
          ? JSON.parse(booking.form_responses) 
          : booking.form_responses;
        
        console.log(`   Type de garde (question 1): ${formResponses['1']}`);
        console.log(`   Form responses complet:`);
        console.log(JSON.stringify(formResponses, null, 2));
      } catch (error) {
        console.log(`   ⚠️  Erreur parsing form_responses: ${error.message}`);
      }
    });

    console.log('\n✅ Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkBookings().catch(console.error);
