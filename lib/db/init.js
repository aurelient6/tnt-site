import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger manuellement les variables d'environnement
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
  console.error('❌ Erreur: DATABASE_URL ou POSTGRES_URL non défini');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function initDatabase() {
  try {
    console.log('🗄️  Initialisation de la base de données...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0] || 'base de données'}\n`);

    // Lire le schéma SQL
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('📋 Création des tables...');

    // Exécuter chaque commande SQL séparément
    const commands = schema
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (const command of commands) {
      try {
        await sql([command]);
        console.log(`   ✅ Commande exécutée`);
      } catch (error) {
        // Ignorer les erreurs "already exists"
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  Table déjà existante (OK)`);
        } else {
          console.error(`   ❌ Erreur:`, error.message);
        }
      }
    }

    console.log('\n✅ Base de données initialisée avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. npm run seed');
    console.log('   2. npm run dev');
    console.log('   3. npm run generate-slots');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initDatabase();
