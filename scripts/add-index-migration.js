import { sql } from '../lib/db/client.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  try {
    console.log('🔄 Exécution de la migration add-index-created-at...');
    
    const migrationPath = join(__dirname, '../lib/db/migrations/add-index-created-at.sql');
    const migration = readFileSync(migrationPath, 'utf8');
    
    await sql.unsafe(migration);
    
    console.log('✅ Index créés avec succès sur bookings.created_at');
    console.log('   - idx_bookings_created_at');
    console.log('   - idx_bookings_created_payment');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigration();
