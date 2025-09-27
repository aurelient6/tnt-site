'use client';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ""
}) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate start and end of the visible range
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    // Always show first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      start = 1;
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      rangeWithDots.push(i);
    }

    // Always show last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (end < totalPages) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);


  const scrollToTop = () => {
  const targetDiv = document.querySelector('.boutique-content');
  if (targetDiv) {
    targetDiv.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
    setTimeout(() => {
      window.scrollBy(0, -300); 
    }, 100);
  }
};

  const handlePageChange = (page) => {
    onPageChange(page);
    scrollToTop();
  };

  return (
    <div className={`pagination-container ${className}`}>
      {/* Items info */}
      <div className="pagination-info">
        Affichage de {startItem} à {endItem} sur {totalItems} produits
      </div>

      {/* Pagination controls */}
      <div className="pagination-controls">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn pagination-prev"
          aria-label="Page précédente"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Précédent
        </button>

        {/* Page numbers */}
        <div className="pagination-numbers">
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className="pagination-dots">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn pagination-next"
          aria-label="Page suivante"
        >
          Suivant
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Quick page selector for mobile */}
      <div className="pagination-mobile">
        <select 
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          className="pagination-select"
          aria-label="Sélectionner une page"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>
        <span className="pagination-mobile-total">sur {totalPages}</span>
      </div>
    </div>
  );
}