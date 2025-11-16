/**
 * Script pour supprimer les créneaux dogsitting existants
 * Usage: node scripts/delete-dogsitting-slots.js
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

async function deleteSlots() {
  try {
    console.log('🗑️  Suppression des créneaux dogsitting existants...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0]}\n`);

    const result = await sql`
      DELETE FROM time_slots 
      WHERE service_id = (SELECT id FROM services WHERE slug = 'dogsitting')
      RETURNING id
    `;

    console.log(`✅ ${result.length} créneaux supprimés`);
    console.log('\n📝 Vous pouvez maintenant régénérer les créneaux: node scripts/generate-slots.js');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

deleteSlots().catch(console.error);
