/**
 * Script pour exécuter la migration : ajout du champ confirmation_token
 * Usage: node scripts/migrate-add-token.js
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger manuellement les variables d'environnement depuis .env.local
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

async function migrate() {
  try {
    console.log('🚀 Début de la migration...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0]}\n`);

    // 1. Ajouter la colonne
    console.log('📝 Ajout de la colonne confirmation_token...');
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmation_token VARCHAR(64)`;
    
    // 2. Générer des tokens pour les réservations existantes
    console.log('🔑 Génération des tokens pour les réservations existantes...');
    const result = await sql`
      UPDATE bookings 
      SET confirmation_token = md5(random()::text || clock_timestamp()::text || id::text)
      WHERE confirmation_token IS NULL
      RETURNING id
    `;
    console.log(`   ✅ ${result.length} tokens générés`);

    // 3. Ajouter la contrainte UNIQUE
    console.log('🔒 Ajout de la contrainte UNIQUE...');
    await sql`
      DO $$ 
      BEGIN
        ALTER TABLE bookings ADD CONSTRAINT bookings_confirmation_token_key UNIQUE (confirmation_token);
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `;

    // 4. Rendre la colonne NOT NULL
    console.log('✔️  Ajout de la contrainte NOT NULL...');
    await sql`ALTER TABLE bookings ALTER COLUMN confirmation_token SET NOT NULL`;

    // 5. Créer l'index
    console.log('📊 Création de l\'index...');
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(confirmation_token)`;

    console.log('\n✨ Migration terminée avec succès !');
    console.log('\n🎉 Les réservations sont maintenant sécurisées avec des tokens uniques.\n');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Exécution
migrate().catch(console.error);
