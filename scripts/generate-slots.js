/**
 * Script pour générer les créneaux horaires initiaux
 * Génère directement dans la base de données
 * Exclut automatiquement les dimanches et les jours fériés français
 * 
 * Usage: node scripts/generate-slots.js
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { shouldExcludeDate, getHolidayName } from '../lib/utils/holidays.js';
import { getAllServicesBasicInfo, slots } from '../app/data/servicesData.js';

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

// Générer la configuration des services depuis servicesData.js
const servicesConfig = getAllServicesBasicInfo().map(service => ({
  slug: service.slug,
  duration: service.duration,
  capacity: service.capacity || 1,
  slots: slots
}));

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
        let daysExcluded = 0;
        let excludedReasons = { sundays: 0, holidays: 0 };

        // Définir les créneaux spécifiques pour dogsitting
        // Pour dogsitting : UN SEUL créneau par jour (la date)
        // L'horaire exact sera déterminé par le choix de l'utilisateur dans le formulaire
        const dogsittingSlots = {
          daily: [
            { time: '00:00:00', type: null }  // Créneau "journée entière" - l'heure exacte dépend du formulaire
          ]
        };

        // Générer les créneaux
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        for (let i = 0; i <= totalDays; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          const dayOfWeek = currentDate.getDay(); // 0=dimanche, 1=lundi, ..., 5=vendredi, 6=samedi
          
          // Pour dogsitting : ne pas exclure le dimanche pour les créneaux soirée
          // Mais exclure les jours fériés et dimanche pour les créneaux journée/demi-journée
          const isWeekendDay = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0; // vendredi, samedi, dimanche
          const holidayName = getHolidayName(currentDate);
          
          // Pour les services normaux (non dogsitting), exclure dimanches et jours fériés
          if (serviceConfig.slug !== 'dogsitting' && shouldExcludeDate(currentDate)) {
            daysExcluded++;
            
            if (dayOfWeek === 0) {
              excludedReasons.sundays++;
            } else if (holidayName) {
              excludedReasons.holidays++;
              console.log(`   ⏭️  ${currentDate.toLocaleDateString('fr-FR')} - ${holidayName}`);
            }
            
            continue;
          }

          // Pour dogsitting, exclure les jours fériés seulement
          if (serviceConfig.slug === 'dogsitting' && holidayName) {
            daysExcluded++;
            excludedReasons.holidays++;
            console.log(`   ⏭️  ${currentDate.toLocaleDateString('fr-FR')} - ${holidayName}`);
            continue;
          }

          const dateStr = currentDate.toISOString().split('T')[0];

          // Logique spécifique pour dogsitting
          if (serviceConfig.slug === 'dogsitting') {
            // Pour dogsitting : créer UN SEUL créneau par jour disponible
            // Les jours fériés sont déjà exclus ci-dessus
            // Les dimanches sont autorisés (pour soirée weekend)
            
            for (const slot of dogsittingSlots.daily) {
              try {
                const result = await sql`
                  INSERT INTO time_slots (service_id, slot_date, slot_time, is_available, capacity, booked_count, slot_type)
                  VALUES (${serviceId}, ${dateStr}, ${slot.time}, true, ${serviceConfig.capacity}, 0, ${slot.type})
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
          } else {
            // Logique pour les autres services (inchangée)
            for (const time of serviceConfig.slots) {
              try {
                const result = await sql`
                  INSERT INTO time_slots (service_id, slot_date, slot_time, is_available, capacity, booked_count)
                  VALUES (${serviceId}, ${dateStr}, ${time}, true, ${serviceConfig.capacity}, 0)
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
        }

        console.log(`   ✅ ${slotsCreated} créneaux générés`);
        console.log(`   ⏭️  ${daysExcluded} jours exclus (${excludedReasons.sundays} dimanches, ${excludedReasons.holidays} jours fériés)`);
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
