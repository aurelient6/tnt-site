import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger manuellement les variables d'environnement depuis .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '..', '.env.local');

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
  console.error('❌ Erreur: DATABASE_URL ou POSTGRES_URL non défini dans .env.local');
  process.exit(1);
}

const sql = neon(databaseUrl);

const services = [
  { slug: 'toilettage', name: 'Toilettage', duration: 60 },
  { slug: 'massage', name: 'Massage', duration: 60 },
  { slug: 'physiotherapie', name: 'Physiothérapie', duration: 45 },
  { slug: 'main-training', name: 'Main Training', duration: 60 },
  { slug: 'hooper', name: 'Hooper', duration: 60 },
  { slug: 'agility', name: 'Agility', duration: 90 },
  { slug: 'hydrotherapie', name: 'Hydrothérapie', duration: 45 },
  { slug: 'tapis-de-course', name: 'Tapis de course', duration: 45 },
  { slug: 'dressage', name: 'Dressage', duration: 60 }
];

async function seed() {
  try {
    console.log('🌱 Démarrage du seeding...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0] || 'base de données'}\n`);

    // Insérer les services
    console.log('📋 Insertion des services...');
    for (const service of services) {
      await sql`
        INSERT INTO services (slug, name, duration)
        VALUES (${service.slug}, ${service.name}, ${service.duration})
        ON CONFLICT (slug) DO UPDATE 
        SET name = ${service.name}, duration = ${service.duration}
      `;
      console.log(`   ✅ Service ajouté: ${service.name}`);
    }

    console.log('\n✨ Seeding terminé avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Lancez le serveur: npm run dev');
    console.log('   2. Générez les créneaux: npm run generate-slots');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
}

seed();
