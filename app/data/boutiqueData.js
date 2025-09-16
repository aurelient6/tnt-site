/*
un article :
- nom
- photo
- prix
- marque
- catégorie
- tailles disponibles
- couleurs disponibles
- badge éventuel
*/

// data/boutiqueData.js
import { PRODUCT_CATEGORIES } from "../constantes/produitsCategories.js";
import { FOOD_CATEGORIES } from "../constantes/nourritureCategories.js";
import { MARQUES } from "../constantes/marques.js";

export const boutiqueData = {
  vetements: [
    {
      id: 1,
      nom: "Harnais confort",
      photo: "/images/boutique/vetements/harnaisVert.jpg",
      prix: 45.99,
      prixSolde: null,
      marque: MARQUES.ROYALCANIN,
      categorie: PRODUCT_CATEGORIES.HARNAIS,
      taillesDisponibles: ["S", "M", "L", "XL"],
      couleursDisponibles: [
        { nom: "Noir", hex: "#000000" },
        { nom: "Rouge", hex: "#e74c3c" },
        { nom: "Bleu", hex: "#3498db" }
      ],
      badge: "Nouveau"
    },
    {
      id: 2,
      nom: "Manteau Imperméable Elite",
      photo: "/images/boutique/vetements/manteau-elite.jpg",
      prix: 79.99,
      prixSolde: 59.99,
      marque: MARQUES.PEDIGREE,
      categorie: PRODUCT_CATEGORIES.MANTEAU,
      taillesDisponibles: ["XS", "S", "M", "L"],
      couleursDisponibles: [
        { nom: "Kaki", hex: "#8d6e63" },
        { nom: "Marine", hex: "#1a237e" },
        { nom: "Orange", hex: "#ff5722" }
      ],
      badge: "Promo"
    },
    {
      id: 3,
      nom: "Collier Cuir Artisanal",
      photo: "/images/boutique/vetements/collier-cuir.jpg",
      prix: 35.00,
      prixSolde: null,
      marque: MARQUES.ROYALCANIN,
      categorie: PRODUCT_CATEGORIES.COLLIER,
      taillesDisponibles: ["S", "M", "L"],
      couleursDisponibles: [
        { nom: "Marron", hex: "#8d6e63" },
        { nom: "Noir", hex: "#000000" },
        { nom: "Cognac", hex: "#a0522d" }
      ],
      badge: null
    },
    {
      id: 4,
      nom: "Pull Tricot Hiver",
      photo: "/images/boutique/vetements/pull-tricot.jpg",
      prix: 29.99,
      prixSolde: 19.99,
      marque: MARQUES.PURINA,
      categorie: PRODUCT_CATEGORIES.PULL,
      taillesDisponibles: ["XS", "S", "M", "L", "XL"],
      couleursDisponibles: [
        { nom: "Beige", hex: "#f5f5dc" },
        { nom: "Gris", hex: "#808080" },
        { nom: "Bordeaux", hex: "#800020" }
      ],
      badge: "Promo"
    }
  ],
  
  nourriture: [
    {
      id: 5,
      nom: "Croquettes Saumon Bio",
      photo: "/images/boutique/nourriture/croquettes-saumon.jpg",
      prix: 24.99,
      prixSolde: null,
      marque: MARQUES.PEDIGREE,
      categorie: FOOD_CATEGORIES.CROQUETTE, 
      taillesDisponibles: ["2kg", "5kg", "10kg"],
      couleursDisponibles: [], // Pas de couleurs pour la nourriture
      badge: "Bio"
    },
    {
      id: 6,
      nom: "Friandises Dentaires",
      photo: "/images/boutique/nourriture/friandises-dentaires.jpg",
      prix: 12.99,
      prixSolde: 9.99,
      marque: MARQUES.PURINA,
      categorie: FOOD_CATEGORIES.FRIANDISE,
      taillesDisponibles: ["S", "M", "L"], // Tailles des friandises
      couleursDisponibles: [],
      badge: "Promo"
    },
    {
      id: 7,
      nom: "Pâtée Agneau Premium",
      photo: "/images/boutique/nourriture/patee-agneau.jpg",
      prix: 18.50,
      prixSolde: null,
      marque: MARQUES.TECKELSHOP,
      categorie: FOOD_CATEGORIES.PATEE,
      taillesDisponibles: ["400g", "800g"],
      couleursDisponibles: [],
      badge: "Nouveau"
    },
    {
      id: 8,
      nom: "Complément Articulations",
      photo: "/images/boutique/nourriture/complement-articulations.jpg",
      prix: 32.99,
      prixSolde: 24.99,
      marque: MARQUES.ROYALCANIN,
      categorie: FOOD_CATEGORIES.COMPLEMENT,
      taillesDisponibles: ["30 comprimés", "60 comprimés", "120 comprimés"],
      couleursDisponibles: [],
      badge: "Promo"
    }
  ]
};

// Fonctions utilitaires
export const getAllProducts = () => {
  return [...boutiqueData.vetements, ...boutiqueData.nourriture];
};

export const getProductsByType = (type) => {
  return boutiqueData[type] || [];
};

export const getProductById = (id) => {
  return getAllProducts().find(product => product.id === id);
};

export const getCategories = (type) => {
  const products = getProductsByType(type);
  const categories = [...new Set(products.map(product => product.categorie))];
  return categories.sort();
};

export const getProductsByCategory = (type, category) => {
  return getProductsByType(type).filter(product => product.categorie === category);
};

// Fonction pour calculer le pourcentage de réduction
export const calculateDiscount = (prix, prixSolde) => {
  if (!prixSolde) return null;
  return Math.round(((prix - prixSolde) / prix) * 100);
};

// Types de produits disponibles
export const PRODUCT_TYPES = {
  VETEMENTS: 'vetements',
  NOURRITURE: 'nourriture'
};

// Types de badges
export const BADGE_TYPES = {
  NOUVEAU: 'Nouveau',
  PROMO: 'Promo'
};

export const CATEGORIES = {
  HARNAIS: 'Harnais',
  COLLIER: 'Collier',
  PULL: 'Pull'
};