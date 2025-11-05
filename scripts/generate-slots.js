/**
 * Script pour générer les créneaux horaires initiaux
 * Génère directement dans la base de données
 * 
 * Usage: node scripts/generate-slots.js
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

const servicesConfig = [
  {
    slug: 'toilettage',
    duration: 60,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  },
  {
    slug: 'massage',
    duration: 60,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  },
  {
    slug: 'physiotherapie',
    duration: 45,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  },
  {
    slug: 'main-training',
    duration: 60,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  },
  {
    slug: 'hooper',
    duration: 60,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  },
  {
    slug: 'agility',
    duration: 90,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  },
  {
    slug: 'hydrotherapie',
    duration: 45,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  },
  {
    slug: 'tapis-de-course',
    duration: 45,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  },
  {
    slug: 'dressage',
    duration: 60,
    slots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  }
];

async function generateSlots() {
  try {
    console.log('🚀 Génération des créneaux horaires...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0]}\n`);
    
    // Générer pour les 60 prochains jours
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 60);

    console.log(`📅 Période: ${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}\n`);
    
    for (const serviceConfig of servicesConfig) {
      console.log(`📋 Service: ${serviceConfig.slug}`);
      
      try {
        // Récupérer l'ID du service
        const serviceResult = await sql`
          SELECT id FROM services WHERE slug = ${serviceConfig.slug}
        `;

        if (serviceResult.length === 0) {
          console.log(`   ⚠️  Service non trouvé en base`);
          continue;
        }

        const serviceId = serviceResult[0].id;
        let slotsCreated = 0;

        // Générer les créneaux
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        for (let i = 0; i <= totalDays; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Exclure uniquement le dimanche (0)
          const dayOfWeek = currentDate.getDay();
          if (dayOfWeek === 0) {
            continue; // Skip dimanche uniquement
          }

          const dateStr = currentDate.toISOString().split('T')[0];

          for (const time of serviceConfig.slots) {
            try {
              const result = await sql`
                INSERT INTO time_slots (service_id, slot_date, slot_time, is_available)
                VALUES (${serviceId}, ${dateStr}, ${time}, true)
                ON CONFLICT (service_id, slot_date, slot_time) DO NOTHING
                RETURNING id
              `;

              if (result.length > 0) {
                slotsCreated++;
              }
            } catch (error) {
              // Ignorer les erreurs de conflit
            }
          }
        }

        console.log(`   ✅ ${slotsCreated} créneaux générés`);
      } catch (error) {
        console.error(`   ❌ Erreur: ${error.message}`);
      }
    }

    console.log('\n✨ Génération terminée !');
    console.log('\n📝 Vous pouvez maintenant:');
    console.log('   1. Visiter http://localhost:3000/reserver/toilettage');
    console.log('   2. Tester une réservation complète');

  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécution
generateSlots().catch(console.error);
