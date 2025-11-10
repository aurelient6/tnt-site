'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ServiceCard({ service }) {
  // Convertir le nom en slug pour l'URL
  const slug = service.name.toLowerCase()
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/à/g, 'a')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const handleReserveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/reserver/${slug}`;
  };

  return (
    <div className="service-card">
      <Link href={`/services/${slug}`} className="card-content-link">
        <h3 className="card-title">{service.name}</h3>
        <div className="card-image">
          {service.image ? (
            <Image src={service.image} alt={service.name} width={200} height={200} />
          ) : (
            <div className="card-image-placeholder">
              🐕
            </div>
          )}
        </div>
      </Link>
      
      <div className="card-actions">
        <button 
          onClick={handleReserveClick}
          className="card-reserve-btn"
        >
          <span>Réserver maintenant</span>
        </button>
        <Link href={`/services/${slug}`} className="card-details-link">
          <span className="action-text">Voir les détails</span>
          <span className="action-icon">→</span>
        </Link>
      </div>
    </div>
  );
}