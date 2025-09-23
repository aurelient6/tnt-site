'use client'
import React, { useState, useEffect } from 'react';
import '../style/actualitesCarousel.css';
import ActualiteAccueil from './actualiteAccueil';
import { INFORMATIONS } from '../constantes/infos.js';

export default function ActualitesCarousel({ actualites }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(actualites.length / itemsPerPage);
  
  // Navigation vers la page suivante
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Navigation vers la page précédente
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };
  
  // Gestion du clavier
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Calculer les actualités à afficher
  const startIndex = currentIndex * itemsPerPage;
  const visibleActualites = actualites.slice(startIndex, startIndex + itemsPerPage);
  
  // Remplir avec des espaces vides si moins de 3 actualités sur la dernière page
  while (visibleActualites.length < itemsPerPage && actualites.length > itemsPerPage) {
    visibleActualites.push(null);
  }
  
  return (
    <section className='actualites' id="actualites">
      <div className="actualites-header">
        <h2>Actualités</h2>
        <p>Retrouvez les dernières actualités de {INFORMATIONS.name} !</p>
      </div>
      
      <div className="carousel-container">
        {/* Bouton précédent */}
        <button 
          className="carousel-btn carousel-btn--prev"
          onClick={prevSlide}
          disabled={actualites.length <= itemsPerPage}
          aria-label="Actualités précédentes"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Container des actualités */}
        <div className="actualites-carousel">
          <div 
            className="actualites-track"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${totalPages * 100}%`
            }}
          >
            {Array.from({ length: totalPages }, (_, pageIndex) => {
              const pageStartIndex = pageIndex * itemsPerPage;
              const pageActualites = actualites.slice(pageStartIndex, pageStartIndex + itemsPerPage);
              
              return (
                <div key={pageIndex} className="actualites-page">
                  {Array.from({ length: itemsPerPage }, (_, itemIndex) => {
                    const actualite = pageActualites[itemIndex];
                    return (
                      <div key={itemIndex} className="actualite-slot">
                        {actualite && (
                          <ActualiteAccueil actualite={actualite} />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Bouton suivant */}
        <button 
          className="carousel-btn carousel-btn--next"
          onClick={nextSlide}
          disabled={actualites.length <= itemsPerPage}
          aria-label="Actualités suivantes"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* Indicateurs de pages (optionnel) */}
      {actualites.length > itemsPerPage && (
        <div className="carousel-indicators">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'indicator--active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Aller à la page ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Info page actuelle */}
      {actualites.length > itemsPerPage && (
        <div className="carousel-info">
          <span>
            {currentIndex + 1} / {totalPages}
          </span>
        </div>
      )}
    </section>
  );
}