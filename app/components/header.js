'use client'
import { useState, useEffect } from 'react';
import '../style/header.css';
import { INFORMATIONS } from '../constantes/infos.js';
import { ROUTES } from '../constantes/routes.js';
import { PAGES } from '../constantes/routes.js'
import Image from 'next/image';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Toggle hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking on a nav link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav role="navigation" aria-label="Navigation principale" className={isMenuOpen ? 'active' : ''}>
          <ul className="navList">
            <li className="navItem">
              <a href={ROUTES.services} className="navLink" onClick={closeMenu}>{PAGES.services}</a>
            </li>
            <li className="navItem">
              <a href={ROUTES.apropos} className="navLink" onClick={closeMenu}>{PAGES.apropos}</a>
            </li>
            <li className="navItem">
              <a href={ROUTES.boutique} className="navLink" onClick={closeMenu}>{PAGES.boutique}</a>
            </li>
            <li className="navItem">
              <a href={ROUTES.contact} className="navLink" onClick={closeMenu}>{PAGES.contact}</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}