/**
 * Script pour vérifier les créneaux dogsitting
 * Usage: node scripts/check-dogsitting-slots.js
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

async function checkSlots() {
  try {
    console.log('🔍 Vérification des créneaux dogsitting...');
    console.log(`📡 Connexion à: ${databaseUrl.split('@')[1]?.split('/')[0]}\n`);

    // Vérifier le service
    const service = await sql`
      SELECT * FROM services WHERE slug = 'dogsitting'
    `;
    
    console.log('📋 Service:');
    console.log(`   Nom: ${service[0].name}`);
    console.log(`   Capacité: ${service[0].capacity} chiens simultanés\n`);

    // Compter les créneaux par type
    const slotsByType = await sql`
      SELECT 
        slot_type,
        COUNT(*) as count,
        MIN(slot_time) as first_time,
        MAX(slot_time) as last_time
      FROM time_slots 
      WHERE service_id = ${service[0].id}
      GROUP BY slot_type
      ORDER BY slot_type
    `;

    console.log('📊 Créneaux par type:');
    for (const row of slotsByType) {
      console.log(`   ${row.slot_type || 'null'}: ${row.count} créneaux (${row.first_time} - ${row.last_time})`);
    }

    // Compter les créneaux par jour de la semaine
    console.log('\n📅 Créneaux par jour de la semaine:');
    const slotsByDay = await sql`
      SELECT 
        EXTRACT(DOW FROM slot_date) as day_of_week,
        COUNT(*) as count
      FROM time_slots 
      WHERE service_id = ${service[0].id}
      GROUP BY day_of_week
      ORDER BY day_of_week
    `;

    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    for (const row of slotsByDay) {
      console.log(`   ${days[row.day_of_week]}: ${row.count} créneaux`);
    }

    // Quelques exemples de créneaux
    console.log('\n📝 Exemples de créneaux:');
    const examples = await sql`
      SELECT slot_date, slot_time, slot_type, capacity, booked_count
      FROM time_slots 
      WHERE service_id = ${service[0].id}
      ORDER BY slot_date, slot_time
      LIMIT 10
    `;

    for (const slot of examples) {
      const date = new Date(slot.slot_date).toLocaleDateString('fr-FR');
      console.log(`   ${date} ${slot.slot_time} - ${slot.slot_type} (${slot.booked_count}/${slot.capacity})`);
    }

    console.log('\n✅ Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkSlots().catch(console.error);
