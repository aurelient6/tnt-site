import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env.local (pour les scripts)
// Next.js charge automatiquement .env.local, mais pas les scripts Node.js
if (!process.env.VERCEL) {
  dotenv.config({ path: '.env.local' });
}

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
});
