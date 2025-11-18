import { neon } from '@neondatabase/serverless';

// Next.js charge automatiquement .env.local pour l'application
// Pour les scripts Node.js, ils doivent charger dotenv individuellement

// Utilise POSTGRES_URL de Vercel ou DATABASE_URL en fallback
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('La variable d\'environnement POSTGRES_URL ou DATABASE_URL doit être définie');
}

// Configuration avec timeout plus long pour Neon serverless
export const sql = neon(databaseUrl, {
  fetchOptions: {
    cache: 'no-store',
  },
  fullResults: false,
  arrayMode: false,
  // Augmenter le nombre de tentatives de connexion
  fetchConnectionCache: true,
});
