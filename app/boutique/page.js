'use client';

import { useState } from 'react';
import '../style/boutique.css';
import ProductCard from '../components/ProductCard';
import { getProductsByType, getCategories, getProductsByCategory, PRODUCT_TYPES } from '../data/boutiqueData';

export default function BoutiquePage() {
  const [activeType, setActiveType] = useState(PRODUCT_TYPES.VETEMENTS);

  // Récupérer les produits et catégories pour le type actif
  const products = getProductsByType(activeType);
  const categories = getCategories(activeType);

  return (
    <section className="boutique-main">
      <div className="boutique-header">
        <h1>Notre boutique</h1>
        <p>
          Découvrez notre sélection de produits pour le bien-être de votre compagnon.
          <br/>
          Pour réserver, merci de prendre contact avec nous !
          <br/>
           Le système de commande en ligne arive prochainement !
        </p>

        
        {/* Switch pour changer de type */}
        <div className="product-type-switch">
          <button 
            className={`switch-button ${activeType === PRODUCT_TYPES.VETEMENTS ? 'active' : ''}`}
            onClick={() => setActiveType(PRODUCT_TYPES.VETEMENTS)}
          >
            Vêtements
          </button>
          <button 
            className={`switch-button ${activeType === PRODUCT_TYPES.NOURRITURE ? 'active' : ''}`}
            onClick={() => setActiveType(PRODUCT_TYPES.NOURRITURE)}
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
        
        {/* Message si aucun produit */}
        {products.length === 0 && (
          <div className="no-products">
            <p>Aucun produit disponible dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}