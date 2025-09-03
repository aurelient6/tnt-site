// app/components/footer.js

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2025 TandT. Tous droits réservés.</p>
    </footer>
  );
}

// Styles pour le footer
const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 0',
  },
  text: {
    margin: 0,
    fontSize: '14px',
  },
};
