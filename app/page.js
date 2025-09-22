// app/page.js

import './style/accueil.css';
import EquipeAccueil from './components/equipeAccueil.js';
import { getAllServices } from './data/servicesData.js';
import React from 'react';
import { equipeData } from './data/equipeData.js';
import { actualitesData } from './data/actualitesData';
import ActualitesCarousel from './components/ActualitesCarousel.js';
export default function HomePage() {
    const actualitesTriees = actualitesData.actualites.sort((a, b) => b.id - a.id);
    return (
      <main className="main">
        <section className='title'>
          <h1>T&T, centre canin multidiscipline</h1>
        </section>
       <section className='description'>
          <div className="description-content">
            <div className="description-text">
              <h2>T&T, c'est quoi?</h2>
              <p>
                Nous sommes un endroit pensé pour le bien-être et le dressage de votre chien ! 
                <br/>
                A travers différentes activités, votre chien trouvera son bonheur: bien-être, olfaction, sport, dressage,...
              </p>
              <ul className='liste-services'>
                {getAllServices().map((service) => (
                  <li key={service.id}>
                    <a href={`/service/${service.slug}`}>{service.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="description-image">
              <img src="/images/accueil/description.jpg" alt="Chien heureux chez T&T" />
            </div>
            
          </div>
        </section>
        <section className='equipe' id="equipe">
          <h2>Notre équipe</h2>
          <div className="equipe-grid">
            {equipeData.equipe.map((membre) => (
              <EquipeAccueil
                key={membre.id}
                membre={membre}
              />
            ))}
          </div>
        </section>
        <ActualitesCarousel actualites={actualitesTriees} />
      </main>
  );
}