// app/page.js

import './style/accueil.css';

export default function HomePage() {
  return (
      <main className="main">
        <section className='title'>
          <h1>T&T, centre canin multidiscipline</h1>
        </section>
        <section className='description'>
          <div className="description-content">
            <h2>T&T, c'est quoi?</h2>
            <p>Nous sommes un endroit pensé pour le bien-être et le dressage de votre chien ! 
              <br/>
              A travers différentes activités, votre chien trouvera son bonheur: bien-être, olfaction, sport, dressage,...</p>
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
        </section>
        <section className='equipe'>
          <h2>Notre équipe</h2>
        </section>
        <section className='actualités'>
          <h2>Actualités</h2>
        </section>
      </main>
  );
}