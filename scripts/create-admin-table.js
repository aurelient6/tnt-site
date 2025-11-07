import { sql } from '../lib/db/client.js';

async function createAdminTable() {
  try {
    console.log('🔄 Création de la table admin_users...');

    // Créer la table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `;

    // Créer les index
    await sql`
      CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active)
    `;

    console.log('✅ Table admin_users créée avec succès !');
    console.log('📝 Vous pouvez maintenant créer un administrateur avec : npm run create-admin');

  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createAdminTable();
