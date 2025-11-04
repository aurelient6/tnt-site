import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
const sql = neon(databaseUrl);

async function cleanSlots() {
  try {
    console.log('🗑️  Suppression des créneaux disponibles futurs...\n');
    
    const result = await sql`
      DELETE FROM time_slots 
      WHERE is_available = true 
      AND slot_date >= CURRENT_DATE
    `;
    
    console.log(`✅ ${result.count || 'Tous les'} créneaux supprimés\n`);
    console.log('📝 Vous pouvez maintenant lancer: npm run generate-slots');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

cleanSlots();
