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

  return (
    <Link href={`/service/${slug}`}>
      <div className="service-card">
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
        <div className="card-price">{service.price}</div>
      </div>
    </Link>
  );
}