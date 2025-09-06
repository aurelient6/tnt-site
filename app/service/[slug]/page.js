import ServiceDetail from '../../components/ServiceDetail';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServices } from '../../data/servicesData';

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service non trouvé',
    };
  }

  return {
    title: `${service.name} - Nos Services`,
    description: service.description,
  };
}

// Optionnel : générer statiquement les pages pour toutes les routes
export async function generateStaticParams() {
  const services = getAllServices();
  
  return services.map((service) => ({
    slug: service.slug,
  }));
}