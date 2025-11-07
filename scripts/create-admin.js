import { sql } from '../lib/db/client.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import crypto from 'crypto';

// 🔐 CLÉ SECRÈTE : Changez cette valeur et ne la partagez JAMAIS !
// Pour générer une nouvelle clé : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
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

async function createAdmin() {
  try {
    console.log('🔐 Création d\'un nouvel administrateur\n');

    // Vérification de la clé secrète
    const secretKey = await question('🔑 Clé secrète admin (définie dans .env.local) : ');
    
    if (secretKey !== ADMIN_SECRET_KEY) {
      console.log('\n❌ Clé secrète incorrecte ! Accès refusé.');
      console.log('💡 Définissez ADMIN_SECRET_KEY dans votre .env.local');
      rl.close();
      process.exit(1);
    }

    console.log('✅ Clé secrète validée\n');

    // Demander les informations
    const email = await question('📧 Email : ');
    const password = await question('🔑 Mot de passe : ');
    const name = await question('👤 Nom (optionnel) : ') || 'Administrateur';

    rl.close();

    if (!email || !password) {
      console.log('❌ Email et mot de passe sont obligatoires');
      process.exit(1);
    }

    console.log('\n⏳ Création en cours...\n');

    // Hasher le mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Vérifier si l'admin existe déjà
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE email = ${email}
    `;

    if (existingAdmin.length > 0) {
      console.log('❌ Un administrateur avec cet email existe déjà.');
      console.log('Pour le mettre à jour, supprimez-le d\'abord avec cette commande SQL :');
      console.log(`   DELETE FROM admin_users WHERE email = '${email}';`);
      process.exit(1);
    }

    // Insérer l'administrateur
    const result = await sql`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email, name
    `;

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', result[0].email);
    console.log('👤 Nom:', result[0].name);
    console.log('\n� Le mot de passe a été hashé et stocké en sécurité.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createAdmin();
