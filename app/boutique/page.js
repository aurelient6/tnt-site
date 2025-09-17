'use client';
import { useState, useEffect } from 'react';
import '../style/boutique.css';
import ProductCard from '../components/ProductCard';
import { getProductsByType, getCategories, getProductsByCategory, PRODUCT_TYPES } from '../data/boutiqueData';

export default function BoutiquePage() {
  const [activeType, setActiveType] = useState(PRODUCT_TYPES.VETEMENTS);
  
  // Récupérer les produits et catégories pour le type actif
  const products = getProductsByType(activeType);
  const categories = getCategories(activeType);

  useEffect(() => {
    // Configuration de l'observer pour les animations au scroll
    const observerOptions = {
      threshold: 0.1, // Déclenche quand 10% de l'élément est visible
      rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit complètement visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Fonction pour observer tous les éléments animables
    const observeElements = () => {
      // Observer toutes les sections de catégories de produits
      const categorySections = document.querySelectorAll('.product-category-section');
      categorySections.forEach((section) => {
        observer.observe(section);
      });
    };

    // Observer les éléments après un court délai pour s'assurer qu'ils sont rendus
    const timeoutId = setTimeout(observeElements, 100);

    // Nettoyage
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [activeType]); // Re-observer quand le type de produit change

  const handleTypeChange = (newType) => {
    // Petite transition pour le changement
    const content = document.querySelector('.boutique-content');
    if (content) {
      content.style.opacity = '0.7';
      setTimeout(() => {
        setActiveType(newType);
        content.style.opacity = '1';
      }, 150);
    } else {
      setActiveType(newType);
    }
  };

  return (
    <section className="boutique-main">
      <div className="boutique-header">
        <h1>Notre boutique</h1>
        <p>
          Découvrez notre sélection de produits pour le bien-être de votre compagnon.
          <br/>
          Pour réserver, merci de prendre contact avec nous !
          <br/>
          Le système de commande en ligne arrive prochainement !
        </p>
       
        {/* Switch pour changer de type */}
        <div className="product-type-switch">
          <button
            className={`switch-button ${activeType === PRODUCT_TYPES.VETEMENTS ? 'active' : ''}`}
            onClick={() => handleTypeChange(PRODUCT_TYPES.VETEMENTS)}
          >
            Vêtements
          </button>
          <button
            className={`switch-button ${activeType === PRODUCT_TYPES.NOURRITURE ? 'active' : ''}`}
            onClick={() => handleTypeChange(PRODUCT_TYPES.NOURRITURE)}
          >
            Nourriture
          </button>
        </div>
      </div>
      
      {/* Affichage par catégories */}
      <div className="boutique-content">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(activeType, category);
         
          return (
            <div key={category} className="product-category-section">
              <h2 className="category-title">{category}</h2>
              <div className="products-grid">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}