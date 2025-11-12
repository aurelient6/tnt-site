import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function migrateAddStripeColumns() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connecté à la base de données');

    // Ajouter les colonnes Stripe
    console.log('📝 Ajout des colonnes Stripe...');
    await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS stripe_payment_intent VARCHAR(255),
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
    `);

    console.log('✅ Colonnes Stripe ajoutées avec succès');

    // Créer un index sur payment_status
    console.log('📝 Création de l\'index sur payment_status...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
    `);

    console.log('✅ Index créé avec succès');

    console.log('\n🎉 Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrateAddStripeColumns();
