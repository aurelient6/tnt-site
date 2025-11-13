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
 * Script de réparation : libère tous les créneaux qui n'ont pas de réservation confirmée/payée
 * À exécuter une seule fois pour corriger les données existantes
 */
async function fixBlockedSlots() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connecté à la base de données');

    // Trouver tous les créneaux bloqués sans réservation confirmée
    const result = await client.query(`
      UPDATE time_slots
      SET is_available = true
      WHERE is_available = false
        AND id NOT IN (
          SELECT DISTINCT time_slot_id 
          FROM bookings 
          WHERE payment_status = 'paid' 
            AND status = 'confirmed'
        )
      RETURNING id, slot_date, slot_time;
    `);

    if (result.rows.length > 0) {
      console.log(`🔓 ${result.rows.length} créneau(x) débloqué(s):`);
      result.rows.forEach(slot => {
        console.log(`   - Créneau #${slot.id} - ${slot.slot_date} ${slot.slot_time}`);
      });
    } else {
      console.log('✨ Aucun créneau à débloquer');
    }

    console.log('\n🎉 Réparation terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la réparation:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixBlockedSlots();
