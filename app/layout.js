// app/layout.js
import './style/globals.css';
import Header from './components/header';
import Footer from './components/footer';
import { INFORMATIONS } from './constantes/infos';

export const metadata = {
  title: `${INFORMATIONS.name} - Votre centre canin multidisciplinaire`,
  description: `Contactez ${INFORMATIONS.name} au ${INFORMATIONS.phone} - ${INFORMATIONS.address}`,
  charset: 'UTF-8',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}