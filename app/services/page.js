import '../style/services.css';
import ServiceCard from '../components/serviceCard.js';
import { servicesData } from '../data/servicesData.js';
import { SERVICES_CATEGORIES } from "../constantes/servicesCategories.js";
import { PAGES } from '../constantes/routes.js';

export default function ServicesPage() {
  return (
    <>
      <section className="main">
        <div>
          <main>
            <h1>{PAGES.services}</h1>
            <p>Découvrez tous les services que nous vous proposons.</p>
          </main>
        </div>

        {Object.keys(SERVICES_CATEGORIES).map((categoryKey) => {
          const categoryLabel = SERVICES_CATEGORIES[categoryKey];
          const services = servicesData[categoryKey];
          return (
            <div className='services' key={categoryKey}>
              <h2>{categoryLabel}</h2>
              <div className="cards-container">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}