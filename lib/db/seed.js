import { sql } from './client.js';

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
