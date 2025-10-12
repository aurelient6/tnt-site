import { ROUTES } from '../constantes/routes.js';

export const servicesData = {
  bienEtre: [
    {
      id: 1,
      name: "Toilettage",
      slug: "toilettage",
      price: "45€/30'",
      image: "/images/services/toilettage/toilettage.jpg",
      category: "Bien-être",
      description: "Service complet de toilettage pour votre chien incluant bain, séchage, coupe, épilation des poils, nettoyage des oreilles et coupe des griffes.",
      objectif: "Maintenir l'hygiène et le bien-être de votre compagnon tout en lui offrant un moment de détente.",
      duree: "30 minutes à 1h selon la taille",
      remarques: "Nous utilisons uniquement des produits hypoallergéniques adaptés à chaque type de pelage.",
      equipe: "Marie Dupont",
      gallery: [
        "/images/services/toilettage/toilettage2.jpg",
        "/images/services/toilettage/toilettage3.jpg",
        "/images/services/toilettage/toilettage4.jpg"
      ]
    },
    {
      id: 2,
      name: "Massage",
      slug: "massage",
      price: "35€/h",
      image: "/images/services/massage/massage2.jpg",
      category: "Bien-être",
      description: "Massage thérapeutique relaxant pour décontracter les muscles et améliorer la circulation sanguine de votre chien.",
      objectif: "Détendre votre chien, soulager les tensions musculaires et améliorer son bien-être général.",
      duree: "45 minutes à 1 heure",
      remarques: "Particulièrement recommandé pour les chiens âgés ou sportifs.",
      equipe: "Lucie Benoit",
      gallery: [
        "/images/services/massage/massage.jpg"          
      ]
    },
    {
      id: 3,
      name: "Physiothérapie",
      slug: "physiotherapie",
      price: "35€",
      image: "/images/services/physiotherapie/physiotherapie.jpg",
      category: "Bien-être",
      description: "Séances de kinésithérapie canine pour la rééducation après blessure ou pour l'entretien de la condition physique.",
      objectif: "Favoriser la récupération fonctionnelle et prévenir les blessures.",
      duree: "1 heure",
      remarques: "Sur prescription vétérinaire. Bilan initial obligatoire.",
      equipe: "Paul Lemoine",
      gallery: [
        "/images/services/physiotherapie/physiotherapie2.jpg"
      ]
    }
  ],
  olfaction: [
    {
      id: 4,
      name: "Main training",
      slug: "main-training",
      price: "45€",
      image: "/images/services/maintraining/maintraining2.jpg",
      category: "Olfaction",
      description: "Formation à la recherche de personnes, développement des capacités olfactives naturelles de votre chien.",
      objectif: "Développer les capacités de recherche, renforcer l'obéissance et la complicité maître-chien.",
      duree: "1 heure",
      remarques: "Activité progressive adaptée à tous les niveaux.",
      equipe: "Élise Roux",
      gallery: [
        "/images/services/maintraining/maintraining.jpg"
      ]
    },
    {
      id: 5,
      name: "Hooper",
      slug: "hooper",
      price: "35€",
      image: "/images/services/hooper/hooper3.jpg",
      category: "Olfaction",
      description: "Parcours ludiques avec cerceaux et tunnels, activité sans saut parfaite pour tous les chiens.",
      objectif: "Stimulation mentale et physique adaptée aux chiens sensibles ou âgés.",
      duree: "45 minutes",
      remarques: "Alternative douce à l'agility, recommandée pour tous les âges.",
      equipe: "Sophie Girard",
      gallery: [
        "/images/services/hooper/hooper2.jpg"
      ]
    },
    {
      id: 6,
      name: "Agility",
      slug: "agility",
      price: "35€",
      image: "/images/services/agility/agility3.jpg",
      category: "Olfaction",
      description: "Parcours d'obstacles pour développer l'agilité, la coordination et renforcer la complicité.",
      objectif: "Stimulation physique et mentale complète, développement de la confiance.",
      duree: "45 minutes",
      remarques: "Niveau débutant à expert. Évaluation préalable recommandée.",
      equipe: "Sophie Girard",
      gallery: [
        "/images/services/agility/agility2.jpg",
        "/images/services/agility/agility.jpg"
      ]
    }
  ],
  sport: [
    {
      id: 7,
      name: "Hydrothérapie",
      slug: "hydrotherapie",
      price: "45€",
      image: "/images/services/hydrotherapie/hydrotherapie2.jpg",
      category: "Sport",
      description: "Séance sur tapis roulant aquatique pour la rééducation en douceur et le renforcement musculaire.",
      objectif: "Rééducation post-opératoire, renforcement musculaire sans impact sur les articulations.",
      duree: "30 minutes",
      remarques: "Particulièrement efficace pour l'arthrose et la récupération post-chirurgicale.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: [
        "/images/services/hydrotherapie/hydrotherapie3.jpg",
        "/images/services/hydrotherapie/hydrotherapie.jpg"
      ]
    },
    {
      id: 8,
      name: "Tapis de course",
      slug: "tapis-de-course",
      price: "35€",
      image: "/images/services/tapisdecourse/tapisdecourse.jpg",
      category: "Sport",
      description: "Entraînement cardiovasculaire contrôlé sur tapis de course spécialement adapté aux chiens.",
      objectif: "Maintenir la condition physique et l'endurance de votre chien.",
      duree: "20 minutes",
      remarques: "Séance progressive avec surveillance constante.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: []
    }
  ],
  dressage: [
    {
      id: 9,
      name: "Dressage",
      slug: "dressage",
      price: "Voir tableau des prix",
      image: "/images/services/dressage/dressage.jpg",
      category: "Dressage",
      description: "L'apprentissage de comportements et de tâches spécifiques qu'un chien exécute sur un ordre, visant à développer des aptitudes professionnelles ou de loisir",
      objectif: "Améliorer l'obéissance et l'éducation de votre chien.",
      duree: "30' à 2h",
      remarques: "Aucune base nécéssaire, nous nous adaptons au niveau de votre chien pour le faire progresser au mieux.",
      equipe: "Julien Martin",
      gallery: [
        "/images/services/dressage/dressage2.jpg",
        "/images/services/dressage/dressage3.jpg"
      ]
    }
  ]
};

export const SERVICES_PRIMARY = [
  { label: 'Toilettage', href: `${ROUTES.service}${ROUTES.toilettage}` },
  { label: 'Massage', href: `${ROUTES.service}${ROUTES.massage}` },
  { label: 'Physiothérapie', href: `${ROUTES.service}${ROUTES.physiotherapie}` },
  { label: 'Main training', href: `${ROUTES.service}${ROUTES.mainTraining}` },
];

export const SERVICES_SECONDARY = [
  { label: 'Hooper', href: `${ROUTES.service}${ROUTES.hooper}` },
  { label: 'Agility', href: `${ROUTES.service}${ROUTES.agility}` },
  { label: 'Hydrothérapie', href: `${ROUTES.service}${ROUTES.hydrotherapie}` },
  { label: 'Tapis de course', href: `${ROUTES.service}${ROUTES.tapisDeCourse}` },
  { label: 'Dressage', href: `${ROUTES.service}${ROUTES.dressage}` },
];

export const getAllServices = () => {
  return Object.values(servicesData).flat();
};

export const getServiceBySlug = (slug) => {
  return getAllServices().find(service => service.slug === slug);
};

export const getServiceById = (id) => {
  return getAllServices().find(service => service.id === id);
};

export const getServicesByCategory = (category) => {
  return servicesData[category] || [];
};
