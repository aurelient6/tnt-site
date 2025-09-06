import { calculateDiscount } from '../data/boutiqueData';
import '../style/productCard.css';

export default function ProductCard({ product }) {
  const discountPercentage = calculateDiscount(product.prix, product.prixSolde);

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
          <img src={product.photo} alt={product.nom} />
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
    </div>
  );
}