import { calculateDiscount } from '../data/boutiqueData';
import '../style/productCard.css';
import { INFORMATIONS } from '../constantes/infos';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const discountPercentage = calculateDiscount(product.prix, product.prixSolde);

  const handleContactForProduct = () => {
    // Create a pre-filled contact message
    const message = `Bonjour, je suis intéressé(e) par le produit: ${product.nom} (${product.marque})
    J'aimerais ... examplaire(s) de ce produit.
    
    Nom: ...
    Numéro de téléphone: ...
    Merci !
    `;
    const mailtoLink = `mailto:${INFORMATIONS.email}?subject=Demande produit: ${product.nom}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="product-card">
      {/* Badge si présent */}
      {product.badge && (
        <div className={`product-badge ${product.badge.toLowerCase()}`}>
          {product.badge}
        </div>
      )}

      {/* Image du produit */}
      <div className="product-image">
        {product.photo ? (
          <Image
            src={product.photo}
            alt={product.nom}
            width={200}
            height={200}
            objectFit="cover"
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            📦
          </div>
        )}
      </div>

      {/* Informations du produit */}
      <div className="product-info">
        {/* Nom du produit */}
        <h3 className="product-name">{product.nom}</h3>
        
        {/* Marque */}
        <p className="product-brand">{product.marque}</p>
        
        {/* Prix */}
        <div className="product-pricing">
          {product.prixSolde ? (
            <>
              <span className="price-original">{product.prix.toFixed(2)}€</span>
              <span className="price-sale">{product.prixSolde.toFixed(2)}€</span>
              <span className="discount-percentage">-{discountPercentage}%</span>
            </>
          ) : (
            <span className="price-regular">{product.prix.toFixed(2)}€</span>
          )}
        </div>

        {/* Product details */}
        <div className="product-details">
          {/* Tailles disponibles */}
          {product.taillesDisponibles && product.taillesDisponibles.length > 0 && (
            <div className="product-sizes">
              <span className="options-label">Tailles :</span>
              <div className="sizes-container">
                {product.taillesDisponibles.map((taille, index) => (
                  <span key={index} className="size-option">
                    {taille}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Couleurs disponibles */}
          {product.couleursDisponibles && product.couleursDisponibles.length > 0 && (
            <div className="product-colors">
              <span className="options-label">Couleurs :</span>
              <div className="colors-container">
                {product.couleursDisponibles.map((couleur, index) => (
                  <div 
                    key={index} 
                    className="color-option"
                    style={{ backgroundColor: couleur.hex }}
                    title={couleur.nom}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="product-actions">
          <button className="btn-contact-primary" onClick={handleContactForProduct}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Réserver ce produit
          </button>
        </div>
      </div>
    </div>
  );
}