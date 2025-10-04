import React from 'react';
import '../style/equipeAccueil.css'
import Image from 'next/image';

export default function EquipeAccueil({ membre }) {
  return (
    <div className="equipe-card">
      <div className="equipe-card__image-container">
        <Image 
          src={membre.image}  
          alt={`${membre.firstName} ${membre.name}`}
          className="equipe-card__image"
          width={120}   
          height={120}  
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          loading="lazy"  
        />
      </div>
      
      <div className="equipe-card__content">
        <h3 className="equipe-card__name">
          {membre.firstName} {membre.name}
        </h3>
        
        <p className="equipe-card__profession">
          {membre.job}
        </p>
        
        <p className="equipe-card__description">
          {membre.description}
        </p>
      </div>
    </div>
  );
}