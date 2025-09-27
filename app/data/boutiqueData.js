import { PRODUCT_CATEGORIES } from "../constantes/produitsCategories.js";
import { FOOD_CATEGORIES } from "../constantes/nourritureCategories.js";
import { MARQUES } from "../constantes/marques.js";

export const boutiqueData = {
  vetements: [
    {
      id: 1,
      nom: "Harnais comfort",
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
      badge: "New"
    },
    {
      id: 2,
      nom: "Manteau Imperméable Elite",
      photo: "/images/boutique/vetements/manteau-elite.png",
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
      badge: "%"
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
      badge: "%"
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
      couleursDisponibles: [],
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
      taillesDisponibles: ["S", "M", "L"],
      couleursDisponibles: [],
      badge: "%"
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
      badge: "New"
    },
    {
      id: 8,
      nom: "Complément Articulations",
      photo: "/images/boutique/nourriture/complement-articulations.jpg",
      prix: 32.99,
      prixSolde: 24.99,
      marque: MARQUES.ROYALCANIN,
      categorie: FOOD_CATEGORIES.COMPLEMENT,
      taillesDisponibles: ["30 comp.", "60 comp.", "120 comp."],
      couleursDisponibles: [],
      badge: "%"
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

// New function to get all brands for a product type
export const getAllBrands = (type) => {
  const products = getProductsByType(type);
  const brands = [...new Set(products.map(product => product.marque))];
  return brands.sort();
};

// New function to get all badges for a product type
export const getAllBadges = (type) => {
  const products = getProductsByType(type);
  const badges = [...new Set(products.map(product => product.badge).filter(badge => badge !== null))];
  return badges.sort();
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
  NOUVEAU: 'New',
  PROMO: '%',
  BIO: 'Bio'
};


export const ITEMS_PER_PAGE = 6;

export const paginateProducts = (products, page, itemsPerPage = ITEMS_PER_PAGE) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    products: products.slice(startIndex, endIndex),
    totalProducts: products.length,
    totalPages: Math.ceil(products.length / itemsPerPage),
    currentPage: page,
    hasNextPage: page < Math.ceil(products.length / itemsPerPage),
    hasPreviousPage: page > 1,
    itemsPerPage
  };
};

export const getPageInfo = (totalItems, currentPage, itemsPerPage = ITEMS_PER_PAGE) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    totalPages,
    startItem,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};