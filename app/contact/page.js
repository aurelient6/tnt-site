import '../style/contact.css';
import { INFORMATIONS } from '../constantes/infos.js';
import { PAGES } from '../constantes/routes.js';

export default function ContactPage() {
  return (
      <div>
          <main className="main">
              <div className='title'>
                <h1>{PAGES.contact}</h1>
              </div>
              <section className='contact'>
                <h2>Coordonnées</h2> 
                <div className="contact-container">
                  <div className="contact-left">
                    <div className="contact-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                      <a href={`tel:${INFORMATIONS.phone}`}>{INFORMATIONS.phone}</a>
                    </div>
                    <div className="contact-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      <a href={`mailto:${INFORMATIONS.email}`}>{INFORMATIONS.email}</a>
                    </div>
                  </div>
                  <div className="vertical-line"></div>
                  <div className="contact-right">
                    <div className="contact-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                      </svg>
                      <span>{INFORMATIONS.name}</span>
                    </div>
                    <div className="contact-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      <span>{INFORMATIONS.address}</span>
                    </div>
                  </div>
                </div>
              </section>
              <section className='horaires'>
                <h2>Horaires</h2>
                <div className="horaires-container">
                  <div className="horaires-left"> 
                    <div className="horaire-item">Lundi: Fermé</div>
                    <div className="horaire-item">Mardi: 9h - 18h</div>
                    <div className="horaire-item">Mercredi: 10h - 18h30</div>
                  </div>
                  <div className="vertical-line-horaires"></div>
                  <div className="horaires-right">
                    <div className="horaire-item">Jeudi: 9h - 19h</div>
                    <div className="horaire-item">Vendredi: 10h30 - 20h30</div>
                    <div className="horaire-item">Samedi: 9h - 20h30</div>
                  </div>
                </div>
                <div className="last-day-container">
                  <div className="horaire-item last-day">Dimanche: fermé</div>
                </div>
              </section>
              <section className='carteInteractive'>
                <div className="container">
                    <h2>Nous trouver</h2>
                    <a href={`https://www.google.com/maps?q=${INFORMATIONS.address}`} target="_blank">{INFORMATIONS.address}</a>
                    <div className="map-container">
                      <iframe 
                        src="https://www.openstreetmap.org/export/embed.html?bbox=5.091%2C50.617%2C5.097%2C50.621&layer=mapnik&marker=50.6191%2C5.0940"
                        allowFullScreen="" 
                        loading="lazy"
                        title={`Localisation OpenStreetMap - ${INFORMATIONS.address}`}>
                      </iframe>
                    </div>
                </div>
              </section>
              <section className='infosPratiques'>
              <h2>Informations</h2>
              <div className="infos-container">
                <div className="info-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5ZM9 7H12.5C14.433 7 16 8.567 16 10.5C16 12.433 14.433 14 12.5 14H11V17H9V7ZM11 9V12H12.5C13.3284 12 14 11.3284 14 10.5C14 9.67157 13.3284 9 12.5 9H11Z"></path>
                  </svg>
                  <span>Parking aisé</span>
                </div>
                
                <div className="info-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M7.99837 10.3413L7.99793 12.5352C6.80239 13.2268 5.99805 14.5195 5.99805 16C5.99805 18.2091 7.78891 20 9.99805 20C11.4786 20 12.7712 19.1957 13.4628 18.0001L15.6565 18.0004C14.8327 20.3306 12.6103 22 9.99805 22C6.68434 22 3.99805 19.3137 3.99805 16C3.99805 13.3874 5.66782 11.1649 7.99837 10.3413ZM11.998 17C10.3412 17 8.99805 15.6569 8.99805 14V10C8.99805 8.95561 9.53172 8.03587 10.3412 7.49861C9.53172 6.96413 8.99805 6.04439 8.99805 5C8.99805 3.34315 10.3412 2 11.998 2C13.6549 2 14.998 3.34315 14.998 5C14.998 6.04439 14.4644 6.96413 13.6548 7.50139C14.4644 8.03587 14.998 8.95561 14.998 10V14.999L16.4319 15C17.0803 15 17.6849 15.3141 18.0584 15.8362L18.1468 15.971L20.8555 20.4855L19.1406 21.5145L16.4319 17L14.998 16.999L11.998 17ZM11.998 9C11.4458 9 10.998 9.44772 10.998 10V14C10.998 14.5523 11.4458 15 11.998 15H12.997L12.998 10C12.998 9.44772 12.5503 9 11.998 9ZM11.998 4C11.4458 4 10.998 4.44772 10.998 5C10.998 5.55228 11.4458 6 11.998 6C12.5503 6 12.998 5.55228 12.998 5C12.998 4.44772 12.5503 4 11.998 4Z"></path>
                  </svg>
                  <span>Accès PMR</span>
                </div>
                
                <div className="info-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M17 20H7V21C7 21.5523 6.55228 22 6 22H5C4.44772 22 4 21.5523 4 21V20H3V12H2V8H3V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V8H22V12H21V20H20V21C20 21.5523 19.5523 22 19 22H18C17.4477 22 17 21.5523 17 21V20ZM5 5V14H19V5H5ZM5 16V18H9V16H5ZM15 16V18H19V16H15Z"></path>
                  </svg>
                  <span>Atteignable en transport en commun</span>
                </div>
              </div>
            </section>
          </main>
      </div>
  );
}
