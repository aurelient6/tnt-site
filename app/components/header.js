'use client'
import { useState, useEffect } from 'react';
import '../style/header.css';
import { INFORMATIONS } from '../constantes/infos.js';
import { ROUTES } from '../constantes/routes.js';
import Image from 'next/image';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when at top (within 100px) or scrolling up
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else {
        // Scrolling down
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', controlHeader);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [lastScrollY]);

  return (
    <header className={`header ${isVisible ? 'header-visible' : 'header-hidden'}`}>
      <div className="container">
        <div className="logo">
          <Image
            src="/images/logo/logo.png"
            alt={`Logo ${INFORMATIONS.name}`}
            loading="lazy"
            width={55}
            height={55}
          />
          <a href={ROUTES.accueil} className="logoText" aria-label="Retour à l'accueil">
            {INFORMATIONS.name}
          </a>
        </div>
        <nav role="navigation" aria-label="Navigation principale">
          <ul className="navList">
            <li className="navItem">
              <a href={ROUTES.services} className="navLink">Nos services</a>
            </li>
            <li className="navItem">
              <a href={ROUTES.boutique} className="navLink">Boutique</a>
            </li>
            <li className="navItem">
              <a href={ROUTES.contact} className="navLink">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}