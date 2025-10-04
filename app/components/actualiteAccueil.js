import React from 'react';
import '../style/actualiteAccueil.css'
import Image from 'next/image';

export default function ActualiteAccueil({ actualite }) {
  return (
    <div className="actualites-card">
      <div className="actualites-card__image-container">
        <Image 
          src={actualite.image} 
          alt={`${actualite.title}`}
          className="actualites-card__image"
          width={320}
          height={200}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
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