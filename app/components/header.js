// app/components/header.js

import Link from 'next/link';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo}>
            <a style={styles.logoText}>TandT</a>
        </div>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
                <a style={styles.navLink}>Services</a>
            </li>
            <li style={styles.navItem}>
                <a style={styles.navLink}>Boutique</a>
            </li>
            <li style={styles.navItem}>
                <a style={styles.navLink}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

// Styles simples en ligne pour un header basique
const styles = {
  header: {
    backgroundColor: '#333',
    padding: '10px 0',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  logoText: {
    color: '#fff',
    textDecoration: 'none',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
};
