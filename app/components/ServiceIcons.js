import {ROUTES} from '../constantes/routes';
import { getAllServices } from '../data/servicesData';

// Wrapper component for SVG images that need to be white
const WhiteSVGIcon = ({ src, alt }) => (
  <div style={{ 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    filter: 'brightness(0) invert(1)' // Makes any color white
  }}>
    <img 
      src={src}
      alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </div>
);

// Custom SVG icons pour les services sans icône dans servicesData
const CustomSVGIcons = {
  'Hydrothérapie': () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.69L17 7.24V11.5C17 15.09 14.41 18.16 11 18.9C7.59 18.16 5 15.09 5 11.5V7.24L12 2.69Z" 
            stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 8C10.5 8 9 9.5 9 11C9 12.5 10 13.5 12 15C14 13.5 15 12.5 15 11C15 9.5 13.5 8 12 8Z" 
            fill="white"/>
    </svg>
  ),
  
  'Tapis de course': () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14L12 14L11 22L21 10L12 10L13 2Z" 
            fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="17" cy="6" r="2" fill="white"/>
    </svg>
  ),
  
  'Dressage': () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L13.09 9.26L19 8L14.5 12.5L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.5 12.5L5 8L10.91 9.26L12 3Z" 
            fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
};

// Générer dynamiquement ServiceIcons depuis servicesData
const generateServiceIcons = () => {
  const services = getAllServices();
  const icons = {};
  
  services.forEach(service => {
    if (service.icon) {
      // Service avec icône dans servicesData
      icons[service.name] = () => <WhiteSVGIcon src={service.icon} alt={service.name} />;
    } else if (CustomSVGIcons[service.name]) {
      // Service avec custom SVG
      icons[service.name] = CustomSVGIcons[service.name];
    }
  });
  
  // Default fallback icon
  icons['default'] = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
      <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  
  return icons;
};

export const ServiceIcons = generateServiceIcons();

export const getServiceIcon = (serviceName) => {
  const IconComponent = ServiceIcons[serviceName] || ServiceIcons['default'];
  return <IconComponent />;
};
