import '../style/services.css';
import ServiceCard from '../components/serviceCard.js';
import { servicesData } from '../data/servicesData.js';

export default function ServicesPage() {
  return (
    <>
      <section className="main">
        <div>
          <main>
            <h1>Nos services</h1>
            <p>Découvrez tous les services que nous vous proposons.</p>
          </main>
        </div>

        <div className='services'>
          <h2>Bien-être</h2>
          <div className="cards-container">
            {servicesData.bienEtre.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        <div className='services'>
          <h2>Olfaction</h2>
          <div className="cards-container">
            {servicesData.olfaction.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        <div className='services'>
          <h2>Sport</h2>
          <div className="cards-container">
            {servicesData.sport.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}