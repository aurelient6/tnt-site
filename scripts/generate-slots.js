/**
 * Script pour générer les créneaux horaires initiaux
 * À exécuter une seule fois au déploiement initial
 * 
 * Usage: node scripts/generate-slots.js
 */

const servicesConfig = [
  {
    slug: 'toilettage',
    duration: 60, // minutes
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
  },
  {
    slug: 'massage',
    duration: 60,
    slots: ['09:00', '10:30', '14:00', '15:30', '17:00']
  },
  {
    slug: 'physiotherapie',
    duration: 45,
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
  },
  {
    slug: 'main-training',
    duration: 60,
    slots: ['09:00', '10:30', '14:00', '15:30']
  },
  {
    slug: 'hooper',
    duration: 60,
    slots: ['09:00', '10:30', '14:00', '15:30', '17:00']
  },
  {
    slug: 'agility',
    duration: 90,
    slots: ['09:00', '11:00', '14:00', '16:00']
  },
  {
    slug: 'hydrotherapie',
    duration: 45,
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  {
    slug: 'tapis-de-course',
    duration: 45,
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
  },
  {
    slug: 'dressage',
    duration: 60,
    slots: ['09:00', '10:30', '14:00', '15:30', '17:00']
  }
];

async function generateSlots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Générer pour les 60 prochains jours
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 60);

  console.log('🚀 Génération des créneaux horaires...');
  console.log(`📅 Période: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
  
  for (const service of servicesConfig) {
    console.log(`\n📋 Service: ${service.slug}`);
    
    try {
      const response = await fetch(`${baseUrl}/api/slots/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceSlug: service.slug,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          timeSlots: service.slots,
          excludeWeekends: true // Optionnel: exclure les week-ends
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ${data.count} créneaux générés`);
      } else {
        const error = await response.json();
        console.error(`   ❌ Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error(`   ❌ Erreur réseau: ${error.message}`);
    }
  }

  console.log('\n✨ Génération terminée !');
}

// Exécution
generateSlots().catch(console.error);
