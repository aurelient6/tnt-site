'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../style/serviceDetail.css';

export default function ServiceDetail({ service }) {
  // Créer un tableau avec l'image principale + les images de la galerie
  const allImages = [service.image, ...(service.gallery || [])].filter(Boolean);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="service-detail">
      {/* Bouton retour */}
      <div className="back-button-container">
        <Link href="/services" className="back-button">
          ← Retour aux services
        </Link>
      </div>
      <div className="service-header">
        <div className="service-image-main">
          {allImages.length > 1 ? (
            // Carrousel avec plusieurs images
            <div className="image-carousel">
              <button 
                className="carousel-button carousel-button-prev" 
                onClick={goToPrevious}
                aria-label="Image précédente"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <img 
                src={allImages[currentImageIndex]} 
                alt={`${service.name} ${currentImageIndex + 1}`}
                className="carousel-image"
              />
              <button 
                className="carousel-button carousel-button-next" 
                onClick={goToNext}
                aria-label="Image suivante"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {/* Indicateurs de position */}
              <div className="carousel-indicators">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Aller à l'image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Image unique sans carrousel
            <img src={service.image} alt={service.name} />
          )}
        </div>
        
        <div className="service-info-main">
          <h1 className="service-title">{service.name}</h1>
          <div className="service-objectif-main">
            <strong>Objectif</strong>
              <br/>
              {service.objectif}
          </div>
          <div className="service-duration">
            <strong>Durée :</strong> {service.duree}
            <br/>
            <strong>Prix :</strong> {service.price}
          </div>
        </div>
      </div>
      <div className="service-content">
        <div className="service-section">
          <h2>Description</h2>
          <p>{service.description}</p>
        </div>
        {service.remarques && (
          <div className="service-section">
            <h2>Remarques importantes</h2>
            <p>{service.remarques}</p>
          </div>
        )}
        <div className="service-section">
          <h2>Notre équipe</h2>
          <p>{service.equipe}</p>
        </div>
        <div className="service-cta">
          <a href="/contact">
            <button className="cta-button">
              Interessé? Contactez-nous !
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}