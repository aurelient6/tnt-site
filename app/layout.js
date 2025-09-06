// app/layout.js
import './style/globals.css';
import Header from './components/header';
import Footer from './components/footer';

export default function Layout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>T&T - Votre centre canin multidisciplinaire</title>
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}