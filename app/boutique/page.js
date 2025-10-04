'use client';
import { useState, useEffect } from 'react';
import '../style/boutique.css';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { getProductsByType, getCategories, PRODUCT_TYPES, getAllBrands, getAllBadges, paginateProducts, ITEMS_PER_PAGE } from '../data/boutiqueData';

export default function BoutiquePage() {
  const [activeType, setActiveType] = useState(PRODUCT_TYPES.VETEMENTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // Get products and categories for active type
  const allProducts = getProductsByType(activeType);
  const categories = getCategories(activeType);
  const brands = getAllBrands(activeType);
  const badges = getAllBadges(activeType);

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = allProducts;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categorie === selectedCategory);
    }
    
    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.marque === selectedBrand);
    }
    
    // Filter by badge
    if (selectedBadge !== 'all') {
      filtered = filtered.filter(product => product.badge === selectedBadge);
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => (a.prixSolde || a.prix) - (b.prixSolde || b.prix));
      case 'price-desc':
        return filtered.sort((a, b) => (b.prixSolde || b.prix) - (a.prixSolde || a.prix));
      case 'name':
        return filtered.sort((a, b) => a.nom.localeCompare(b.nom));
      default:
        return filtered;
    }
  };

  const filteredProducts = getFilteredProducts();
  const paginationData = paginateProducts(filteredProducts, currentPage, itemsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, selectedCategory, selectedBrand, selectedBadge, sortBy, itemsPerPage]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach((section) => {
        observer.observe(section);
      });
    };

    const timeoutId = setTimeout(observeElements, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [currentPage, activeType, selectedCategory, selectedBrand, selectedBadge]);

  const handleTypeChange = (newType) => {
    const content = document.querySelector('.boutique-content');
    if (content) {
      content.style.opacity = '0.7';
      setTimeout(() => {
        setActiveType(newType);
        setSelectedCategory('all');
        setSelectedBrand('all');
        setSelectedBadge('all');
        setCurrentPage(1);
        content.style.opacity = '1';
      }, 150);
    } else {
      setActiveType(newType);
      setSelectedCategory('all');
      setSelectedBrand('all');
      setSelectedBadge('all');
      setCurrentPage(1);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedBadge('all');
    setSortBy('name');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand !== 'all' || selectedBadge !== 'all' || sortBy !== 'name';

  return (
    <section className="boutique-main">
      <div className="boutique-header">
        <h1>Notre boutique</h1>
        <p>
          Découvrez notre sélection de produits pour le bien-être de votre compagnon.
          <br/>
          Contactez-nous pour commander ou obtenir plus d&apos;informations !
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
      
      {/* Enhanced Filters and controls */}
      <div className="boutique-controls">
        <div className="controls-container">
          <div className="filters-row">
            <div className="filter-section">
              <label htmlFor="category-filter">Catégorie :</label>
              <select 
                id="category-filter"
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-section">
              <label htmlFor="brand-filter">Marque :</label>
              <select 
                id="brand-filter"
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="filter-select"
              >
                <option value="all">Toutes les marques</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <label htmlFor="badge-filter">Type :</label>
              <select 
                id="badge-filter"
                value={selectedBadge} 
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tous les types</option>
                {badges.map((badge) => (
                  <option key={badge} value={badge}>
                    {badge === 'New' && 'Nouveauté'}
                    {badge === '%' && 'Promotion'}
                    {badge === 'Bio' && 'Bio'}
                    {!['New', '%', 'Bio'].includes(badge) && badge}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-section">
              <label htmlFor="sort-select">Trier par :</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Nom A-Z</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>

            <div className="filter-section">
              <label htmlFor="items-per-page">Par page :</label>
              <select 
                id="items-per-page"
                value={itemsPerPage} 
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="filter-select"
              >
                <option value={ITEMS_PER_PAGE}>{ITEMS_PER_PAGE}</option>
                <option value={ITEMS_PER_PAGE*2}>{ITEMS_PER_PAGE*2}</option>
                <option value={ITEMS_PER_PAGE*3}>{ITEMS_PER_PAGE*3}</option>
              </select>
            </div>
          </div>
          
          <div className="controls-summary">
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Effacer les filtres
              </button>
            )}
            <div className="products-count">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
      
      {/* Product display */}
      <div className="boutique-content">
        {paginationData.products.length > 0 ? (
          <div className="products-grid animate-on-scroll">
            {paginationData.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <div className="no-products-icon">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.636-2.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos filtres ou de changer de catégorie.</p>
            {hasActiveFilters && (
              <button className="reset-filters-btn" onClick={clearAllFilters}>
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom pagination */}
      {paginationData.totalPages > 1 && (
        <div className="bottom-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            totalItems={paginationData.totalProducts}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
}