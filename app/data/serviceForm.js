export const serviceForms = {
  toilettage: [
    {
      id: 1,
      type: "select", // Liste déroulante
      question: "Quel est le type de poil de votre chien ?",
      reponses: [
        { label: "Poil court", value: "court" },
        { label: "Poil long", value: "long" },
      ]
    },
    {
      id: 2,
      type: "select", // Liste déroulante
      question: "Quel soin souhaitez-vous effectuer ?",
      dependances: {
        court: [
          { label: "Bain simple (20€)", value: "bain_simple" },
          { label: "Bain + brossage (30€)", value: "bain_brossage" },
        ],
        long: [
          { label: "Bain + coupe (40€)", value: "bain_coupe" },
          { label: "Bain + démêlage (50€)", value: "bain_demelage" },
        ]
      }
    },
    {
      id: 3,
      questions: [
        {
          id: "3a",
          type: "checkbox", // Cases à cocher (choix multiples)
          question: "Souhaitez-vous ajouter des soins complémentaires ?",
          reponses: [
            { label: "Coupe des griffes (+10€)", value: "griffes" },
            { label: "Nettoyage des oreilles (+5€)", value: "oreilles" },
            { label: "Brossage dentaire (+8€)", value: "dents" },
          ]
        },
        {
          id: "3b",
          type: "select", // Liste déroulante
          question: "Quand souhaitez-vous prendre rendez-vous ?",
          reponses: [
            { label: "Cette semaine", value: "semaine" },
            { label: "Le mois prochain", value: "mois" },
            { label: "Pas de préférence", value: "aucune" },
          ]
        }
      ]
    }
  ]
};