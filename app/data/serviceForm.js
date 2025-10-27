export const serviceForms = {
  toilettage: [
    {
      id: 1,
      question: "Quel est le type de poil de votre chien ?",
      reponses: [
        { label: "Poil court", value: "court" },
        { label: "Poil long", value: "long" },
      ]
    },
    {
      id: 2,
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
      question: "Souhaitez-vous ajouter un soin complémentaire ?",
      reponses: [
        { label: "Coupe des griffes (+10€)", value: "griffes" },
        { label: "Nettoyage des oreilles (+5€)", value: "oreilles" },
        { label: "Non merci", value: "aucun" },
      ]
    }
  ]
};