// Formulaire commun pour les coordonnées client (dernière étape)
export const coordonneesClientForm = {
  id: 'coordonnees',
  questions: [
    {
      id: 'creneau',
      type: 'timeslot',
      question: 'Choisissez votre créneau',
      required: true
    },
    {
      id: 'prenom',
      type: 'text',
      question: 'Votre prénom',
      required: true
    },
    {
      id: 'nom',
      type: 'text',
      question: 'Votre nom',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      question: 'Votre email',
      required: true
    },
    {
      id: 'telephone',
      type: 'tel',
      question: 'Votre téléphone',
      required: true
    },
    {
      id: 'race_chien',
      type: 'text',
      question: 'Race de votre chien',
      required: true
    },
    {
      id: 'remarques',
      type: 'text',
      question: 'Remarques éventuelles / problèmes de santé',
      required: false
    }
  ]
};

// Formulaires spécifiques par service (sans les coordonnées)
const serviceFormsBase = {
  toilettage: [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Quel est le type de poil de votre chien ?",
      reponses: [
        { label: "Poil court", value: "court", prix: 20 },
        { label: "Poil long", value: "long", prix: 40 },
      ]
    },
    {
      id: 2,
      type: "select",
      question: "Quel soin souhaitez-vous effectuer ?",
      required: true,
      dependances: {
        court: [
          { label: "Bain simple", value: "bain_simple", prix: 0 },
          { label: "Bain + brossage", value: "bain_brossage", prix: 10 },
        ],
        long: [
          { label: "Bain + coupe", value: "bain_coupe", prix: 0},
          { label: "Bain + démêlage", value: "bain_demelage", prix: 10 },
        ]
      }
    },
    {
      id: 3,
      questions: [
        {
          id: 'soins_complementaires',
          type: "checkbox",
          required: false,
          question: "Souhaitez-vous ajouter des soins complémentaires ?",
          reponses: [
            { label: "Coupe des griffes", value: "griffes", prix: 10 },
            { label: "Nettoyage des oreilles", value: "oreilles", prix: 5 },
            { label: "Brossage dentaire", value: "dents", prix: 8 },
          ]
        }
      ]
    }
  ],
  
  massage: [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Quel massage souhaitez-vous choisir?",
      reponses: [
        { label: "Massage court", value: "30min", prix: 40 },
        { label: "Massage complet", value: "1h", prix: 60 },
      ]
    }
  ],

  physiotherapie: [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Le motif du rendez-vous",
      reponses: [
        { label: "Arthrose", value: "arthrose", prix: 50 },
        { label: "Post-opératoire", value: "post_op", prix: 50 },
        { label: "Blessure musculaire", value: "blessure_musculaire", prix: 50 },
        { label: "Rééducation post-accident", value: "reeducation_post_accident", prix: 50 },
        { label: "Mobilité/Vieillissement", value: "mobilite_vieillissement", prix: 50 },
        { label: "Autres", value: "autres", prix: 50 },
      ]
    },
    {
      id: 2,
      type: "checkbox",
      required: true,
      question: "Ordonnance vétérinaire ?",
      reponses: [
        { label: "Oui", value: "Oui", prix: 0 },
        { label: "Non", value: "Non", prix: 0},
      ]
    },
    {
      id: 3,
      type: "checkbox",
      required: true,
      question: "Zone(s) concernée(s)",
      reponses: [
        { label: "Membres antérieurs", value: "membres_ant", prix: 0 },
        { label: "Membres postérieurs", value: "membres_post", prix: 0 },
        { label: "Dos", value: "dos", prix: 0 },
        { label: "Hanches", value: "hanches", prix: 0 },
        { label: "Epaules", value: "epaules", prix: 0 },
        { label: "Généralisé", value: "generalise", prix: 0 },
      ]
    }
  ],
  
  'main-training': [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Type de séance",
      reponses: [
        { label: "Initiation", value: "initiation", prix: 50 },
        { label: "Séance standard", value: "standard", prix: 70 }, 
        { label: "Séance intensive", value: "intensive", prix: 100 },
      ]
    },
    {
      id: 2,
      type: "select",
      required: true,
      question: "Niveau du chien",
      reponses: [
        { label: "Débutant", value: "debutant", prix: 0 },
        { label: "Intermédiaire", value: "intermediaire", prix: 0 },
        { label: "Avancé", value: "avance", prix: 0 },
        { label: "Compétition", value: "competition", prix: 0 },
      ]
    },
    {
      id: 3,
      type: "select",
      required: true,
      question: "Objectif ?",
      reponses: [
        { label: "Loisir/découverte", value: "loisir", prix: 0 },
        { label: "Formation professionnelle", value: "formation_pro", prix: 0 }, // Réduction
        { label: "Préparation certification", value: "preparation_certif", prix: 0 },
        { label: "Entretien des acquis", value: "entretien_acquis", prix: 0 },
      ]
    }
  ],

  hooper: [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Niveau du chien",
      reponses: [
        { label: "Débutant", value: "debutant", prix: 50 },
        { label: "Intermédiaire", value: "intermediaire", prix: 60 },
        { label: "Avancé", value: "avance", prix: 70 },
      ]
    },
    {
      id: 2,
      type: "select",
      required: true,
      question: "Age du chien",
      reponses: [
        { label: "Jeune (< 2 ans)", value: "jeune", prix: 0 },
        { label: "Adulte (2-7 ans)", value: "adulte", prix: 0 },
        { label: "Senior (> 7 ans)", value: "senior", prix: 0 },
      ]
    },
    {
      id: 3,
      type: "select",
      required: true,
      question: "Tempérament du chien",
      reponses: [
        { label: "Calme", value: "calme", prix: 0 },
        { label: "Actif", value: "actif", prix: 0 },
        { label: "Craintif", value: "craintif", prix: 0 },
      ]
    }
  ],

  agility: [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Durée de séance",
      reponses: [
        { label: "Initiation (45min)", value: "initiation", prix: 60 },
        { label: "Standard (1h30)", value: "standard", prix: 70 },
        { label: "Perfectionnement (2h)", value: "perfectionnement", prix: 80 },
      ]
    },
    {
      id: 2,
      type: "select",
      required: true,
      question: "Niveau du chien",
      reponses: [
        { label: "Débutant", value: "debutant", prix: 0 },
        { label: "Intermédiaire", value: "intermediaire", prix: 0 },
        { label: "Avancé", value: "avance", prix: 0 },
        { label: "Compétition", value: "competition", prix: 0 },
      ]
    },
    {
      id: 3,
      type: "select",
      required: true,
      question: "Age du chien",
      reponses: [
        { label: "Jeune (< 2 ans)", value: "jeune", prix: 0 },
        { label: "Adulte (2-7 ans)", value: "adulte", prix: 0 },
        { label: "Senior (> 7 ans)", value: "senior", prix: 0 },
      ]
    },
    {
      id: 4,
      type: "select",
      required: true,
      question: "Taille du chien",
      reponses: [
        { label: "Petit (< 30 cm)", value: "petit", prix: 0 },
        { label: "Moyen (30-60 cm)", value: "moyen", prix: 0 },
        { label: "Grand (> 60 cm)", value: "grand", prix: 0 },
      ]
    },
  ],
  
  hydrotherapie: [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Type de séance",
      reponses: [
        { label: "Découverte (20min)", value: "decouverte", prix: 50 },
        { label: "Standard (30min)", value: "standard", prix: 60 },
        { label: "Intensive (45min)", value: "intensive", prix: 70 },
      ]
    },
    {
      id: 2,
      type: "select",
      required: true,
      question: "Motif de la séance ?",
      reponses: [
        { label: "Rééducation post-opératoire", value: "reeducation", prix: 0 },
        { label: "Arthrose/problèmes articulaires", value: "arthrose", prix: 0 },
        { label: "Renforcement musculaire", value: "renforcement", prix: 0 },
        { label: "Maintien de la forme", value: "maintien", prix: 0 },
        { label: "Préparation physique", value: "preparation", prix: 0 },
        { label: "Bien-être", value: "bien_etre", prix: 0 },
      ]
    },
    {
      id: 3,
      type: "checkbox",
      required: true,
      question: "Ordonnance vétérinaire ?",
      reponses: [
        { label: "Oui", value: "Oui", prix: 0 },
        { label: "Non", value: "Non", prix: 0 },
      ]
    },
  ],  
  
  'tapis-de-course': [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Durée souhaitée ?",
      reponses: [
        { label: "15 minutes", value: "15min", prix: 40 },
        { label: "30 minutes", value: "30min", prix: 70 },
        { label: "45 minutes", value: "45min", prix: 100 },
      ]
    },
    {
      id: 2,
      type: "select",
      required: true,
      question: "Objectif de la séance",
      reponses: [
        { label: "Rééducation", value: "reeducation", prix: 0 },
        { label: "Perte de poids", value: "perte_de_poids", prix: 0 }, // Réduction
        { label: "Entraînement sportif", value: "entrainement_sportif", prix: 0 },
        { label: "Alternative balade", value: "alternative_balade", prix: 0 },
        { label: "Dépense énergétique", value: "depense_energetique", prix: 0 },
      ]
    },
    {
      id: 3,
      type: "select",
      required: true,
      question: "Expérience préalable ?",
      reponses: [
        { label: "Jamais fait", value: "jamais", prix: 0 },
        { label: "Quelques séances", value: "quelques", prix: 0 },
        { label: "Habitué", value: "habitué", prix: 0 },
      ]
    },
  ],

  dressage: [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Type d'éducation ?",
      reponses: [
        { label: "Education de base", value: "base", prix: 50 },
        { label: "Obéissance", value: "obeissance", prix: 55 },
        { label: "Education avancée", value: "avancee", prix: 60 },
        { label: "Préparation compétitions", value: "competitions", prix: 70 },
      ]
    },
    {
      id: 2,
      type: "select",
      required: true,
      question: "Âge du chien",
      reponses: [
        { label: "Jeune (< 2 ans)", value: "jeune", prix: 0 },
        { label: "Adulte (2-7 ans)", value: "adulte", prix: 0 },
        { label: "Senior (> 7 ans)", value: "senior", prix: 0 },
      ]
    },
    {
      id: 3,
      type: "select",
      required: true,
      question: "Niveau actuel",
      reponses: [
        { label: "Aucune éducation", value: "aucune", prix: 0 },
        { label: "Bases acquises", value: "bases", prix: 0 },
        { label: "Niveau intermédiaire", value: "intermediaire", prix: 0 },
        { label: "Perfectionnement", value: "perfectionnement", prix: 0 },
      ]
    },
  ]

  
};

// Fonction helper pour ajouter automatiquement le formulaire coordonnées
const addCoordonneesForm = (forms) => {
  const lastId = forms.length > 0 ? Math.max(...forms.map(f => f.id)) : 0;
  return [
    ...forms,
    {
      ...coordonneesClientForm,
      id: lastId + 1
    }
  ];
};

// Export final avec coordonnées ajoutées automatiquement
export const serviceForms = Object.keys(serviceFormsBase).reduce((acc, key) => {
  acc[key] = addCoordonneesForm(serviceFormsBase[key]);
  return acc;
}, {});