import { sql } from '../lib/db/client.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';

// 🔐 CLÉ SECRÈTE : Même protection que create-admin
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'CHANGEZ_CETTE_CLE_SECRETE_MAINTENANT';

// Interface pour lire les entrées utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour poser une question
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function changePassword() {
  try {
    console.log('🔐 Modification du mot de passe admin\n');

    // Vérification de la clé secrète
    const secretKey = await question('🔑 Clé secrète admin (définie dans .env.local) : ');
    
    if (secretKey !== ADMIN_SECRET_KEY) {
      console.log('\n❌ Clé secrète incorrecte ! Accès refusé.');
      console.log('💡 Définissez ADMIN_SECRET_KEY dans votre .env.local');
      rl.close();
      process.exit(1);
    }

    console.log('✅ Clé secrète validée\n');

    // Demander l'email de l'admin
    const email = await question('📧 Email de l\'admin à modifier : ');

    if (!email) {
      console.log('❌ Email requis');
      rl.close();
      process.exit(1);
    }

    // Vérifier que l'admin existe
    const existingAdmin = await sql`
      SELECT id, email, name FROM admin_users WHERE email = ${email}
    `;

    if (existingAdmin.length === 0) {
      console.log(`\n❌ Aucun administrateur trouvé avec l'email : ${email}`);
      console.log('💡 Utilisez cette commande pour lister les admins :');
      console.log('   SELECT email, name FROM admin_users;');
      rl.close();
      process.exit(1);
    }

    const admin = existingAdmin[0];
    console.log(`\n✅ Admin trouvé : ${admin.name} (${admin.email})`);

    // Demander le nouveau mot de passe
    const newPassword = await question('\n🔑 Nouveau mot de passe : ');

    if (!newPassword || newPassword.length < 8) {
      console.log('❌ Le mot de passe doit contenir au moins 8 caractères');
      rl.close();
      process.exit(1);
    }

    // Confirmation
    const confirm = await question(`\n⚠️  Confirmer la modification du mot de passe pour ${email} ? (oui/non) : `);

    if (confirm.toLowerCase() !== 'oui') {
      console.log('❌ Modification annulée');
      rl.close();
      process.exit(0);
    }

    rl.close();

    console.log('\n⏳ Modification en cours...\n');

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    await sql`
      UPDATE admin_users
      SET password_hash = ${passwordHash},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${admin.id}
    `;

    console.log('✅ Mot de passe modifié avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', admin.name);
    console.log('\n🔒 Le nouveau mot de passe a été hashé et stocké en sécurité.');
    console.log('💡 Vous pouvez maintenant vous connecter avec le nouveau mot de passe.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la modification du mot de passe:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

changePassword();
