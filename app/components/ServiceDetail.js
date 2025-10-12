'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../style/serviceDetail.css';
import { equipeData } from '../data/equipeData';
import { ROUTES } from '../constantes/routes.js';
import Image from 'next/image';

export default function ServiceDetail({ service }) {
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

  // Find the responsible team member by name only
  const findResponsablePerson = () => {
    if (!service.equipe) return null;
    
    // Extract the name from service.equipe (removing "(lien vers section...)" part)
    const responsableName = service.equipe.split('(')[0].trim();
    
    // Find the person in equipeData by name matching
    return equipeData.equipe.find(member => {
      const fullName = `${member.firstName} ${member.name}`;
      const reverseName = `${member.name} ${member.firstName}`;
      
      // Match by full name (both orders)
      return fullName === responsableName || reverseName === responsableName;
    });
  };

  const responsablePerson = findResponsablePerson();

  // Icons components
  const ClockIcon = () => (
    <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CurrencyIcon = () => (
    <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );

  const TargetIcon = () => (
    <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const InfoIcon = () => (
    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const BookIcon = () => (
    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const SupportIcon = () => (
    <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  );
  

  return (
    <section className="service-detail">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href={ROUTES.accueil}>Accueil</Link>
        <span>›</span>
        <Link href={ROUTES.services}>Services</Link>
        <span>›</span>
        <span>{service.name}</span>
      </nav>

      {/* Back Button */}
      <div className="back-button-container">
        <Link href={ROUTES.services} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
          Retour aux services
        </Link>
      </div>

      {/* Header */}
      <div className="service-header">
        <div className="service-image-main">
          {allImages.length > 1 ? (
            <div className="image-carousel">
              <button 
                className="carousel-button carousel-button-prev" 
                onClick={goToPrevious}
                aria-label="Image précédente"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
                </svg>
              </button>
              <Image 
                src={allImages[currentImageIndex]} 
                alt={`${service.name} ${currentImageIndex + 1}`}
                className="carousel-image"
                height={400}
                width={400}
                objectFit="cover"
                loading="lazy"
              />
              <button 
                className="carousel-button carousel-button-next" 
                onClick={goToNext}
                aria-label="Image suivante"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18L15 12L9 6" />
                </svg>
              </button>
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
            <Image
              src={service.image}
              alt={service.name}
              width={400}
              height={400}
              objectFit="cover"
              loading="lazy"
            />
          )}
        </div>
        
        <div className="service-info-main">
          <h1 className="service-title">{service.name}</h1>
          <p className="service-subtitle">{service.objectif}</p>
          
          <div className="service-meta">
            <div className="meta-item">
              <ClockIcon />
              <div className="meta-content">
                <strong>Durée :</strong> {service.duree}
              </div>
            </div>
            <div className="meta-item">
              <CurrencyIcon />
              <div className="meta-content">
                <strong>Prix :</strong> {service.price}
              </div>
            </div>
            <div className="meta-item">
              <TargetIcon />
              <div className="meta-content">
                <strong>Spécialité :</strong> {service.category}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="service-content">
        <div className="service-section">
          <h2>Description du service</h2>
          <p>{service.description}</p>
        </div>

        {service.remarques && (
          <div className="service-section">
            <h2>Informations importantes</h2>
            <p>{service.remarques}</p>
          </div>
        )}

        <div className="service-section">
          <h2>Notre équipe</h2>
          {responsablePerson ? (
            <div className="team-member-profile">
              <div className="member-image">
                <Image 
                  src={responsablePerson.image} 
                  alt={`${responsablePerson.firstName} ${responsablePerson.name}`}
                  width={120}
                  height={120}
                  objectFit="cover"
                  loading="lazy"
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">
                  {responsablePerson.firstName} {responsablePerson.name}
                </h3>
                <p className="member-job">{responsablePerson.job}</p>
                <p className="member-description">{responsablePerson.description}</p>
              </div>
            </div>
          ) : (
            <p>{service.equipe}</p>
          )}
        </div>

        <div className="cta-cards">
          <div className="cta-card">
            <div className="cta-card-content">
              <InfoIcon className="cta-card-icon" />
              <h4>Plus d&apos;informations</h4>
              <p>Besoin de détails supplémentaires ? Contactez notre équipe.</p>
            </div>
            <Link href={ROUTES.contact} className="cta-card-button">
              En savoir plus
            </Link>
          </div>
          
          <div className="cta-card">
            <div className="cta-card-content">
              <BookIcon className="cta-card-icon" />
              <h4>Réserver une séance</h4>
              <p>Planifiez votre rendez-vous en nous contactant par mail ou par téléphone.</p>
            </div>
            <Link href={ROUTES.contact} className="cta-card-button">
              Réserver
            </Link>
          </div>
          
          <div className="cta-card">
            <div className="cta-card-content">
              <SupportIcon className="cta-card-icon" />
              <h4>Support personnalisé</h4>
              <p>Une question spécifique ? Notre équipe vous accompagne.</p>
            </div>
            <Link href={ROUTES.contact} className="cta-card-button">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}