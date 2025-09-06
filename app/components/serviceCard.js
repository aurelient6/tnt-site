import Link from 'next/link';

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

  return (
    <Link href={`/service/${slug}`}>
      <div className="service-card">
        <h3 className="card-title">{service.name}</h3>
        <div className="card-image">
          {service.image ? (
            <img src={service.image} alt={service.name} />
          ) : (
            <div className="card-image-placeholder">
              🐕
            </div>
          )}
        </div>
        <div className="card-price">{service.price}</div>
      </div>
    </Link>
  );
}