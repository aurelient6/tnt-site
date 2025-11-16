/**
 * Script pour exécuter la migration de capacité multiple
 * Usage: node scripts/run-migration.js
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

async function runMigration() {
  try {
    console.log('🚀 Exécution de la migration de capacité multiple...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0]}\n`);

    // 1. Ajouter capacity à services
    console.log('📋 Étape 1: Ajout de capacity à services...');
    try {
      await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 1`;
      console.log('   ✅ Colonne capacity ajoutée à services');
    } catch (error) {
      console.log('   ⏭️  Colonne capacity existe déjà');
    }

    // 2. Mettre à jour la capacité pour dogsitting
    console.log('\n📋 Étape 2: Mise à jour de la capacité dogsitting...');
    await sql`UPDATE services SET capacity = 5 WHERE slug = 'dogsitting'`;
    console.log('   ✅ Capacité dogsitting mise à jour');

    // 3. Ajouter capacity à time_slots
    console.log('\n📋 Étape 3: Ajout de capacity à time_slots...');
    try {
      await sql`ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 1`;
      console.log('   ✅ Colonne capacity ajoutée à time_slots');
    } catch (error) {
      console.log('   ⏭️  Colonne capacity existe déjà');
    }

    // 4. Ajouter booked_count à time_slots
    console.log('\n📋 Étape 4: Ajout de booked_count à time_slots...');
    try {
      await sql`ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS booked_count INTEGER DEFAULT 0`;
      console.log('   ✅ Colonne booked_count ajoutée à time_slots');
    } catch (error) {
      console.log('   ⏭️  Colonne booked_count existe déjà');
    }

    // 5. Ajouter slot_type à time_slots
    console.log('\n📋 Étape 5: Ajout de slot_type à time_slots...');
    try {
      await sql`ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS slot_type VARCHAR(50)`;
      console.log('   ✅ Colonne slot_type ajoutée à time_slots');
    } catch (error) {
      console.log('   ⏭️  Colonne slot_type existe déjà');
    }

    // 6. Mettre à jour les créneaux existants de dogsitting
    console.log('\n📋 Étape 6: Mise à jour des créneaux dogsitting...');
    await sql`
      UPDATE time_slots 
      SET capacity = 5 
      WHERE service_id = (SELECT id FROM services WHERE slug = 'dogsitting')
    `;
    console.log('   ✅ Créneaux dogsitting mis à jour');

    // 7. Créer l'index
    console.log('\n📋 Étape 7: Création de l\'index...');
    try {
      await sql`
        CREATE INDEX IF NOT EXISTS idx_time_slots_capacity 
        ON time_slots(service_id, booked_count, capacity) 
        WHERE booked_count < capacity
      `;
      console.log('   ✅ Index créé');
    } catch (error) {
      console.log('   ⏭️  Index existe déjà');
    }

    console.log('\n✨ Migration terminée avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Reseed la base: node lib/db/seed.js');
    console.log('   2. Régénérer les créneaux: node scripts/generate-slots.js');

  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

runMigration().catch(console.error);
