'use client'
import React, { useState, useEffect, useRef } from 'react';
import '../style/actualitesCarousel.css';
import ActualiteAccueil from './actualiteAccueil';
import { INFORMATIONS } from '../constantes/infos.js';

export default function ActualitesCarousel({ actualites }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const trackRef = useRef(null);
  
  // Sécurité : vérifier que actualites existe
  const safeActualites = actualites || [];
  
  // Calculer le nombre d'éléments visibles selon la largeur
  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (!trackRef.current) return;
      
      const trackWidth = trackRef.current.offsetWidth;
      const gap = 32; // 2rem en pixels (approximation)
      const minCardWidth = 300;
      
      // Calculer combien de cards peuvent tenir sur une ligne
      let itemsCount = Math.floor((trackWidth + gap) / (minCardWidth + gap));
      itemsCount = Math.max(1, itemsCount); // Au minimum 1
      
      // Forcer 1 card par page sur mobile et tablette étroite
      if (window.innerWidth < 768 && itemsCount === 1) {
        itemsCount = 1;
      } else if (window.innerWidth < 500) {
        itemsCount = 1;
      }
      
      setItemsPerPage(itemsCount);
    };
    
    // Calculer au chargement
    calculateItemsPerPage();
    
    // Recalculer au redimensionnement
    window.addEventListener('resize', calculateItemsPerPage);
    
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);
  
  // Calculer le nombre total de pages en fonction du nombre d'items par page
  const totalPages = Math.ceil(safeActualites.length / itemsPerPage);
  
  // Réinitialiser l'index si on dépasse le nombre de pages
  useEffect(() => {
    if (currentIndex >= totalPages && totalPages > 0) {
      setCurrentIndex(totalPages - 1);
    }
  }, [totalPages, currentIndex]);
  
  // Obtenir les actualités pour la page actuelle
  const getCurrentPageActualites = () => {
    const start = currentIndex * itemsPerPage;
    const end = start + itemsPerPage;
    return safeActualites.slice(start, end);
  };
  
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + totalPages) % totalPages);
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalPages);
  };
  
  return (
    <section className='actualites' id="actualites">
      <div className="actualites-header">
        <h2>Actualités</h2>
        <p>Retrouvez les dernières actualités de {INFORMATIONS.name} !</p>
      </div>
      
      <div className="carousel-container">
        {/* Carousel content */}
        <div className="actualites-carousel">
          <div 
            className={`actualites-track ${getCurrentPageActualites().length === 1 ? 'single-item' : ''}`}
            ref={trackRef}
          >
            {getCurrentPageActualites().map((actualite) => (
              <div key={actualite.id} className="actualite-slot">
                <ActualiteAccueil actualite={actualite} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation controls - afficher seulement s'il y a plusieurs pages */}
        {totalPages > 1 && (
          <div className="carousel-controls">
            <button 
              onClick={goToPrevious}
              className="carousel-button carousel-button-prev"
              aria-label="Page précédente"
            >
              ←
            </button>
            
            {/* Indicateurs de page */}
            <div className="carousel-indicators">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                  aria-label={`Aller à la page ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={goToNext}
              className="carousel-button carousel-button-next"
              aria-label="Page suivante"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}