'use client'
import '../style/footer.css';
import { INFORMATIONS } from '../constantes/infos.js';
import { ROUTES, PAGES } from '../constantes/routes';
import { SERVICES_SECONDARY, SERVICES_PRIMARY } from '../data/servicesData.js';
import Image from 'next/image';

// Icon components
const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const EarthIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

// Data configuration
const SOCIAL_LINKS = [
  {
    name: 'Notre Facebook',
    href: 'https://facebook.com',
    icon: <FacebookIcon className="size-6" />,
  },
  {
    name: 'Notre partenaire',
    href: 'https://twisterbedbug.com',
    icon: <EarthIcon className="size-6" />,
  }, 
];

const QUICK_LINKS = [
  { label: PAGES.boutique, href: ROUTES.boutique },
  { label: PAGES.contact, href: ROUTES.contact },
  { label: PAGES.equipe, href: ROUTES.equipe },
  { label: PAGES.actualites, href: ROUTES.actualites },
];

const CONTACT_INFO = {
  address: INFORMATIONS.address,
  phone: INFORMATIONS.phone,
  email: INFORMATIONS.email,
};

// Component for footer links list
const FooterLinksList = ({ title, items }) => (
  <div>
    {title && <h3 className="footer-section-title">{title}</h3>}
    <ul className="footer-list" role="list">
      {items.map(({ label, href }) => (
        <li key={label} className="footer-list-item">
          <a href={href}>{label}</a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer role="contentinfo">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company info section */}
          <div>
            <a href={ROUTES.accueil} className="footer-logo-link" aria-label="Retour à l'accueil">
              <Image
                src="/images/logo/logo.png"
                className="footer-logo"
                alt={`Logo ${INFORMATIONS.name}`}
                loading="lazy"
                width={120}
                height={40}
              />
              <h2 className="footer-title">{INFORMATIONS.name}</h2>
            </a>
            <address className="footer-address">
              <p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Voir l'adresse sur Google Maps"
                >
                  {CONTACT_INFO.address}
                </a>
              </p>
              <p>
                <a href={`tel:${CONTACT_INFO.phone}`} aria-label={`Appeler ${INFORMATIONS.name}`}>
                  {CONTACT_INFO.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT_INFO.email}`} aria-label={`Envoyer un email à ${INFORMATIONS.name}`}>
                  {CONTACT_INFO.email}
                </a>
              </p>
            </address>
          </div>

          {/* Services sections */}
          <FooterLinksList title="Nos services" items={SERVICES_PRIMARY} />
          <FooterLinksList items={SERVICES_SECONDARY} />
          <FooterLinksList title="Liens rapides" items={QUICK_LINKS} />
        </div>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            {INFORMATIONS.name} © 2025. Tous droits réservés. Développé par{' '}
            <a 
              href="https://linktr.ee/aurelienTaverniers" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Aurélien Taverniers
            </a>
          </p>
          <ul className="footer-social-list" role="list">
            {SOCIAL_LINKS.map(({ name, icon, href }) => (
              <li key={name}>
                <a
                  href={href}
                  title={`${name}`}
                  className="footer-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Suivez-nous sur ${name} (ouvre dans un nouvel onglet)`}
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;