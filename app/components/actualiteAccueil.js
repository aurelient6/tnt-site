import React from 'react';
import '../style/actualiteAccueil.css'

export default function ActualiteAccueil({ actualite }) {
  return (
    <div className="actualites-card">
      <div className="actualites-card__image-container">
        <img 
          src={actualite.image} 
          alt={`${actualite.title}`}
          className="actualites-card__image"
        />
      </div>
      
      <div className="actualites-card__content">
        <h3 className="actualites-card__title">
          {actualite.title} 
        </h3>
        
        <p className="actualites-card__date">
          {actualite.date}
        </p>
        
        <p className="actualites-card__description">
          {actualite.description}
        </p>
      </div>
    </div>
  );
}