// app/page.js

import Header from './components/header';
import Footer from './components/footer';

export default function HomePage() {
  return (
    <div>
      <Header />
      <main style={styles.main}>
        <h1>Bienvenue sur notre site !</h1>
        <p>Explorez nos services et notre boutique.</p>
      </main>
      <Footer />
    </div>
  );
}

// Styles de la page d'accueil
const styles = {
  main: {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#f4f4f4',
    minHeight: 'calc(100vh - 160px)', // Assure que la page prend au moins toute la hauteur sauf le header et footer
  },
};
