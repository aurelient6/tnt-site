import { getAllServices } from '../data/servicesData';
import Image from 'next/image';

// Mapping des noms de services vers les fichiers SVG
const serviceIconFiles = {
  'Toilettage': '/icones/toilettage.svg',
  'Massage': '/icones/massage.svg',
  'Physiothérapie': '/icones/physiotherapie.svg',
  'Main Training': '/icones/maintraining.svg',
  'Hooper': '/icones/hooper.svg',
  'Agility': '/icones/agility.svg',
  'Hydrothérapie': '/icones/physiotherapie.svg', // ou créer un nouveau fichier
  'Tapis de course': '/icones/physiotherapie.svg', // ou créer un nouveau fichier
  'Dressage': '/icones/maintraining.svg', // ou créer un nouveau fichier
  'Dog Sitting': '/icones/maintraining.svg', // ou créer un nouveau fichier
};

// Générer dynamiquement ServiceIcons depuis servicesData
const generateServiceIcons = () => {
  const services = getAllServices();
  const icons = {};
  
  services.forEach(service => {
    const iconPath = serviceIconFiles[service.name] || '/icones/download-icon.svg';
    icons[service.name] = () => (
      <Image 
        src={iconPath}
        alt={service.name}
        width={45}
        height={45}
        className="service-icon-img"
      />
    );
  });
  
  // Default fallback icon
  icons['default'] = () => (
    <Image 
      src="/icones/download-icon.svg"
      alt="Service"
      width={45}
      height={45}
      className="service-icon-img"
    />
  );
  
  return icons;
};

export const ServiceIcons = generateServiceIcons();

export const getServiceIcon = (serviceName) => {
  const IconComponent = ServiceIcons[serviceName] || ServiceIcons['default'];
  return <IconComponent />;
};
