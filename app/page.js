// app/page.js

import './style/accueil.css';
import EquipeAccueil from './components/equipeAccueil.js';
import ActualiteAccueil from './components/actualiteAccueil.js';
import React from 'react';
import { equipeData } from './data/equipeData.js';
import { actualitesData } from './data/actualitesData';

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
                <li>
                  <a href='/service/olfaction'>Massage</a>
                </li>
                <li>
                  <a href='/service/toilettage'>Toilettage</a>
                </li>
                <li>
                  <a href='/service/physiotherapie'>Physiothérapie</a>
                </li>
                <li>
                  <a href='/service/main-training'>Main-training</a>
                </li>
                <li>
                  <a href='/service/hooper'>Hooper</a>
                </li>
                <li>
                  <a href='/service/agility'>Agility</a>
                </li>
                <li>
                  <a href='/service/hydrotherapie'>Hydrothérapie</a>
                </li>
                <li>
                  <a href='/service/tapis-de-course'>Tapis de course</a>
                </li>
              </ul>
            </div>
            
            <div className="description-image">
              <img src="/images/accueil/description.jpg" alt="Chien heureux chez T&T" />
            </div>
            
          </div>
        </section>
        <section className='equipe'>
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
        <section className='actualites'>
          <h2>Actualités</h2>
          <p>Retrouvez les dernières actualités de T&T !</p>
          <div className="actualites-grid">
            {actualitesTriees.map((actualite) => (
              <ActualiteAccueil
                key={actualite.id}
                actualite={actualite}
              />
            ))}
          </div>
        </section>
      </main>
  );
}