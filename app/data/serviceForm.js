// Formulaire commun pour les coordonnées client (dernière étape)
export const coordonneesClientForm = {
  id: 'coordonnees',
  questions: [
    {
      id: 'nom',
      type: 'text',
      question: 'Votre nom',
      required: true
    },
    {
      id: 'prenom',
      type: 'text',
      question: 'Votre prénom',
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
    },
    {
      id: 4,
      type: "select",
      required: true,
      question: "Quand souhaitez-vous prendre rendez-vous ?",
      reponses: [
        { label: "Cette semaine", value: "semaine" },
        { label: "Le mois prochain", value: "mois" },
        { label: "Pas de préférence", value: "aucune" },
      ]
    }
  ],
  
  dressage: [
    {
      id: 1,
      type: "select",
      required: true,
      question: "Quelle durée de promenade souhaitez-vous ?",
      reponses: [
        { label: "30 minutes", value: "30min", prix: 15 },
        { label: "1 heure", value: "1h", prix: 25 },
        { label: "2 heures", value: "2h", prix: 40 },
      ]
    },
    {
      id: 2,
      type: "select",
      required: true,
      question: "Combien de fois par semaine ?",
      reponses: [
        { label: "1 fois", value: "1x", prix: 0 },
        { label: "3 fois", value: "3x", prix: -5 }, // Réduction
        { label: "5 fois", value: "5x", prix: -10 },
      ]
    }
  ]

  // Ajoutez d'autres services ici...
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