import crypto from 'crypto';

console.log('🔐 Génération d\'une clé secrète sécurisée...\n');

const secretKey = crypto.randomBytes(32).toString('hex');

console.log('✅ Clé générée avec succès !\n');
console.log('Ajoutez cette ligne dans votre fichier .env.local :\n');
console.log(`ADMIN_SECRET_KEY=${secretKey}`);
console.log('\n⚠️  IMPORTANT : Ne partagez JAMAIS cette clé !');
console.log('💡 Cette clé sera requise pour créer de nouveaux administrateurs.\n');
