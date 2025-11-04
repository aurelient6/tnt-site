import { neon } from '@neondatabase/serverless';

// Utilise POSTGRES_URL de Vercel ou DATABASE_URL en fallback
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('La variable d\'environnement POSTGRES_URL ou DATABASE_URL doit être définie');
}

export const sql = neon(databaseUrl);
