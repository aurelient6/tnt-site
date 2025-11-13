import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env.local') });

/**
 * Script pour nettoyer les réservations non payées après 30 minutes
 * À exécuter régulièrement (cron job) pour libérer les créneaux
 */
async function cleanupUnpaidBookings() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connecté à la base de données');

    // Supprimer les réservations non payées créées il y a plus de 30 minutes
    // ET libérer les créneaux associés
    const result = await client.query(`
      WITH deleted_bookings AS (
        DELETE FROM bookings
        WHERE payment_status = 'pending'
          AND created_at < NOW() - INTERVAL '30 minutes'
        RETURNING id, client_email, booking_date, booking_time, time_slot_id
      )
      UPDATE time_slots
      SET is_available = true
      FROM deleted_bookings
      WHERE time_slots.id = deleted_bookings.time_slot_id
      RETURNING deleted_bookings.*;
    `);

    if (result.rows.length > 0) {
      console.log(`🧹 ${result.rows.length} réservation(s) non payée(s) supprimée(s) et créneau(x) libéré(s):`);
      result.rows.forEach(booking => {
        console.log(`   - Réservation #${booking.id} (${booking.client_email}) - ${booking.booking_date} ${booking.booking_time}`);
      });
    } else {
      console.log('✨ Aucune réservation à nettoyer');
    }

    console.log('\n🎉 Nettoyage terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

cleanupUnpaidBookings();
