import '../style/contact.css';

export default function ContactPage() {
  return (
    <section>
        <div>
            <main className="main">
                <h1>Contact & infos pratiques</h1>
                <section className='contact'>
                  <h3>Téléphone</h3>
                  <h3>Mail</h3>
                  ligne verticale
                  <h3>T&T</h3>
                  <h3>Adresse</h3>
                </section>
                <section className='carteInteractive'>
                  <div classname="container">
                      <h1>Nous trouver</h1>
                      <div classname="map-container">
                          <iframe 
                              src="https://www.openstreetmap.org/export/embed.html?bbox=5.091%2C50.617%2C5.097%2C50.621&layer=mapnik&marker=50.6191%2C5.0940"
                              allowfullscreen="" 
                              loading="lazy"
                              title="Localisation OpenStreetMap - Rue de la Dîme 14, 4260 Braives">
                          </iframe>
                      </div>
                      
                      <div classname="map-info">
                          <p>🗺️ Carte fournie par OpenStreetMap - Solution open source et respectueuse de la vie privée</p>
                      </div>
                  </div>
                </section>
                <section className='horaires'>
                  <h3>Horaires</h3>
                  lundi
                  mardi
                  mercredi
                  jeudi
                  vendredi
                  samedi
                  dimanche
                </section>
                <section className='infosPratiques'>
                  Parking aisé
                  Atteignable en transport en commun
                </section>
            </main>
        </div>
    </section>
  );
}