import './style/globals.css';
import Header from './components/header';
import Footer from './components/footer';
import { INFORMATIONS } from './constantes/infos';

export const metadata = {
  title: `${INFORMATIONS.name} - Votre centre canin multidisciplinaire`,
  description: `Contactez ${INFORMATIONS.name} au ${INFORMATIONS.phone} - ${INFORMATIONS.address}`,
  keywords: 'centre canin, toilettage, physiothérapie, dressage, massage canin, agility',
  charset: 'UTF-8',
  openGraph: {
    title: `${INFORMATIONS.name} - Votre centre canin multidisciplinaire`,
    description: `Services professionnels pour votre chien - ${INFORMATIONS.address}`,
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header />
          <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}