import { sql } from '../lib/db/client.js';

async function listAdmins() {
  try {
    console.log('👥 Liste des administrateurs\n');

    // Récupérer tous les admins
    const admins = await sql`
      SELECT id, email, name, is_active, created_at, last_login
      FROM admin_users
      ORDER BY created_at DESC
    `;

    if (admins.length === 0) {
      console.log('❌ Aucun administrateur trouvé dans la base de données.');
      console.log('💡 Créez un admin avec : npm run create-admin');
      process.exit(0);
    }

    console.log(`📊 ${admins.length} administrateur(s) trouvé(s) :\n`);
    console.log('─'.repeat(100));
    console.log('ID  | Email                          | Nom                | Actif | Dernière connexion');
    console.log('─'.repeat(100));

    admins.forEach(admin => {
      const id = String(admin.id).padEnd(4);
      const email = String(admin.email).padEnd(30);
      const name = String(admin.name || '-').padEnd(18);
      const active = admin.is_active ? '✅ Oui' : '❌ Non';
      const lastLogin = admin.last_login 
        ? new Date(admin.last_login).toLocaleString('fr-FR')
        : 'Jamais connecté';

      console.log(`${id}| ${email} | ${name} | ${active}  | ${lastLogin}`);
    });

    console.log('─'.repeat(100));
    console.log('\n💡 Pour modifier un mot de passe : npm run change-password');
    console.log('💡 Pour créer un admin : npm run create-admin\n');
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des admins:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

listAdmins();
