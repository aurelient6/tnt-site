/**
 * Script pour nettoyer et régénérer tous les créneaux horaires
 * À utiliser quand on change les horaires ou les jours d'ouverture
 * 
 * Usage: node scripts/regenerate-slots.js
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

async function regenerateSlots() {
  try {
    console.log('🔄 Nettoyage et régénération des créneaux horaires...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0]}\n`);
    
    // 1. Supprimer tous les créneaux futurs NON réservés
    console.log('🗑️  Suppression des anciens créneaux disponibles...');
    const deleteResult = await sql`
      DELETE FROM time_slots 
      WHERE is_available = true 
      AND slot_date >= CURRENT_DATE
    `;
    console.log(`   ✅ ${deleteResult.count || 0} créneaux supprimés\n`);

    // 2. Lancer le script de génération
    console.log('📅 Génération des nouveaux créneaux...\n');
    const { default: generateModule } = await import('./generate-slots.js');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

regenerateSlots();
