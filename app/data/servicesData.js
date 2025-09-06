export const servicesData = {
  bienEtre: [
    {
      id: 1,
      name: "Toilettage",
      slug: "toilettage",
      price: "45€/30'",
      image: "/images/services/toilettage/toilettage.jpg",
      description: "Service complet de toilettage pour votre chien incluant bain, séchage, coupe, épilation des poils, nettoyage des oreilles et coupe des griffes.",
      objectif: "Maintenir l'hygiène et le bien-être de votre compagnon tout en lui offrant un moment de détente.",
      duree: "30 minutes à 1h selon la taille",
      remarques: "Nous utilisons uniquement des produits hypoallergéniques adaptés à chaque type de pelage.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: [
        "/images/services/toilettage/toilettage2.jpg",
        "/images/services/toilettage/toilettage3.jpg"
      ]
    },
    {
      id: 2,
      name: "Massage",
      slug: "massage",
      price: "35€/h",
      image: "/images/services/massage/massage.jpg",
      description: "Massage thérapeutique relaxant pour décontracter les muscles et améliorer la circulation sanguine de votre chien.",
      objectif: "Détendre votre chien, soulager les tensions musculaires et améliorer son bien-être général.",
      duree: "45 minutes à 1 heure",
      remarques: "Particulièrement recommandé pour les chiens âgés ou sportifs.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
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
      description: "Séances de kinésithérapie canine pour la rééducation après blessure ou pour l'entretien de la condition physique.",
      objectif: "Favoriser la récupération fonctionnelle et prévenir les blessures.",
      duree: "1 heure",
      remarques: "Sur prescription vétérinaire. Bilan initial obligatoire.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: []
    }
  ],
  olfaction: [
    {
      id: 4,
      name: "Main training",
      slug: "main-training",
      price: "45€",
      image: "/images/services/maintraining/maintraining.jpg",
      description: "Formation à la recherche de personnes, développement des capacités olfactives naturelles de votre chien.",
      objectif: "Développer les capacités de recherche, renforcer l'obéissance et la complicité maître-chien.",
      duree: "1 heure",
      remarques: "Activité progressive adaptée à tous les niveaux.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: []
    },
    {
      id: 5,
      name: "Hooper",
      slug: "hooper",
      price: "35€",
      image: "/images/services/hooper/hooper.jpg",
      description: "Parcours ludiques avec cerceaux et tunnels, activité sans saut parfaite pour tous les chiens.",
      objectif: "Stimulation mentale et physique adaptée aux chiens sensibles ou âgés.",
      duree: "45 minutes",
      remarques: "Alternative douce à l'agility, recommandée pour tous les âges.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: []
    },
    {
      id: 6,
      name: "Agility",
      slug: "agility",
      price: "35€",
      image: "/images/services/agility/agility.jpg",
      description: "Parcours d'obstacles pour développer l'agilité, la coordination et renforcer la complicité.",
      objectif: "Stimulation physique et mentale complète, développement de la confiance.",
      duree: "45 minutes",
      remarques: "Niveau débutant à expert. Évaluation préalable recommandée.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: []
    }
  ],
  sport: [
    {
      id: 7,
      name: "Hydrothérapie",
      slug: "hydrotherapie",
      price: "45€",
      image: "/images/services/hydrotherapie/hydrotherapie.jpg",
      description: "Séance sur tapis roulant aquatique pour la rééducation en douceur et le renforcement musculaire.",
      objectif: "Rééducation post-opératoire, renforcement musculaire sans impact sur les articulations.",
      duree: "30 minutes",
      remarques: "Particulièrement efficace pour l'arthrose et la récupération post-chirurgicale.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: []
    },
    {
      id: 8,
      name: "Tapis de course",
      slug: "tapis-de-course",
      price: "35€",
      image: "/images/services/tapisdecourse/tapisdecourse.jpg",
      description: "Entraînement cardiovasculaire contrôlé sur tapis de course spécialement adapté aux chiens.",
      objectif: "Maintenir la condition physique et l'endurance de votre chien.",
      duree: "20 minutes",
      remarques: "Séance progressive avec surveillance constante.",
      equipe: "Laure (lien vers section \"Notre équipe\" de la page d'accueil)",
      gallery: []
    }
  ]
};

// Fonctions utilitaires pour travailler avec les données
export const getAllServices = () => {
  return [...servicesData.bienEtre, ...servicesData.olfaction, ...servicesData.sport];
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
