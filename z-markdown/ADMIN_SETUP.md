# Gestion des Administrateurs

## 📋 Table des matières
1. [Créer un administrateur](#1-créer-un-administrateur)
2. [Lister les administrateurs](#2-lister-les-administrateurs)
3. [Modifier le mot de passe](#3-modifier-le-mot-de-passe-dun-administrateur)
4. [Commandes SQL avancées](#-commandes-sql)
---

## 1. Créer un administrateur

### Commande
**npm run create-admin**

### Étapes
1. **Clé secrète** : Le script demande la valeur de `ADMIN_SECRET_KEY` présente dans `.env.local`
2. **Email** : Entrez l'adresse email du nouvel administrateur
3. **Mot de passe** : Choisissez un mot de passe fort (minimum 8 caractères)
4. **Nom** : Entrez le nom de l'administrateur

### ⚠️ Notes importantes
- Il est impossible de créer un administrateur avec un email déjà utilisé
- Le mot de passe est automatiquement hashé avec bcrypt avant stockage
- La clé secrète protège contre toute création non autorisée

---

## 2. Lister les administrateurs

### Commande
**npm run list-admins**

### Affichage
Cette commande affiche un tableau avec :
- **ID** : Identifiant unique de l'administrateur
- **Email** : Adresse email
- **Nom** : Nom complet
- **Actif** : Statut du compte (✅ Oui / ❌ Non)
- **Dernière connexion** : Date et heure de la dernière connexion

---

## 3. Modifier le mot de passe d'un administrateur

### Commande
**npm run change-password**

### Étapes
1. **Clé secrète** : Entrez la valeur de `ADMIN_SECRET_KEY`
2. **Email** : Spécifiez l'email de l'admin à modifier
3. **Nouveau mot de passe** : Entrez le nouveau mot de passe (minimum 8 caractères)
4. **Confirmation** : Tapez `oui` pour confirmer la modification

---

## 📊 Commandes SQL avancées

### Désactiver un admin (sans le supprimer)
```sql
UPDATE admin_users 
SET is_active = false 
WHERE email = 'email@exemple.com';
```
*L'admin ne pourra plus se connecter mais ses données sont conservées*

### Réactiver un admin
```sql
UPDATE admin_users 
SET is_active = true 
WHERE email = 'email@exemple.com';
```
*Restaure l'accès à un compte désactivé*

### Supprimer définitivement un admin
```sql
DELETE FROM admin_users 
WHERE email = 'email@exemple.com';
```

### Lister tous les admins 
```sql
SELECT id, email, name, is_active, last_login 
FROM admin_users 
ORDER BY created_at DESC;
```

---

## 🔐 Informations de sécurité

### Protection des comptes
- **Hashing** : Mots de passe hashés avec bcrypt (10 rounds de salage)
- **Sessions** : Validité de 24 heures
- **Cookies** : httpOnly (protection contre XSS)
- **Clé secrète** : `ADMIN_SECRET_KEY` requise pour créer/modifier des admins

### Bonnes pratiques
- ✅ Utilisez des mots de passe forts (minimum 12 caractères recommandés)
- ✅ Changez régulièrement les mots de passe
- ✅ Désactivez plutôt que supprimez (pour garder l'historique)
- ✅ Ne partagez jamais votre `ADMIN_SECRET_KEY`
- ✅ Vérifiez régulièrement la liste des admins actifs

## Sécurité

🔑 Fonctionnement de la clé secrète :
✅ La clé reste fixe :
Une fois générée et mise dans .env.local, elle ne change jamais automatiquement
C'est comme un "mot de passe maître" pour créer des admins
Vous la gardez tant que vous voulez
🔄 Quand la changer manuellement :
npm run generate-secret  # Nouvelle clé
# Remplacez dans .env.local

La clé générée ne change jamais, sauf si vous le faites manuellement.

npm run generate-secret  # Nouvelle clé, a faire tous les 6 mois

