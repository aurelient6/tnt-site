import './style/accueil.css';
import EquipeAccueil from './components/equipeAccueil.js';
import { getAllServices } from './data/servicesData.js';
import React from 'react';
import { equipeData } from './data/equipeData.js';
import { actualitesData } from './data/actualitesData';
import ActualitesCarousel from './components/ActualitesCarousel.js';
import { INFORMATIONS } from './constantes/infos.js';
import { ROUTES } from './constantes/routes';
import Head from 'next/head';
import Image from 'next/image';
import { neon } from '@neondatabase/serverless';

export default async function HomePage() {
  const actualitesTriees = actualitesData.actualites.sort((a, b) => b.id - a.id);
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/images/accueil/contact.jpg"
          as="image"
          type="image/jpeg"
        />
      </Head>
      <main className="main">
        <section className='title'>
          <h1>{INFORMATIONS.name}, votre centre canin multidisciplinaire</h1>
        </section>
        <section className='description'>
          <div className="description-content">
            <div className="description-text">
              <h2>{INFORMATIONS.name}, c&apos;est quoi?</h2>
              <p>
                Nous sommes un endroit pensé pour le bien-être et le dressage de votre chien ! 
                <br/>
                A travers différentes activités, votre chien trouvera son bonheur: bien-être, olfaction, sport, dressage,...
              </p>
              <ul className='liste-services'>
                {getAllServices().map((service) => (
                  <li key={service.id}>
                    <a href={`${ROUTES.service}/${service.slug}`}>{service.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="description-image"> 
              <Image 
                src="/images/accueil/description.jpg" 
                alt={`Chien heureux chez ${INFORMATIONS.name}`}
                loading="lazy"
                width={300}
                height={300}
                sizes="(max-width: 480px) 180px, (max-width: 767px) 200px, 300px"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '300px',
                  aspectRatio: '1/1'
                }}
              />
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
    </>
  );
}