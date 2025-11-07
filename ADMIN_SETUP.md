# Gestion des Administrateurs

## 📋 Table des matières
1. [Créer la table admin_users](#créer-la-table)
2. [Créer un administrateur](#créer-un-admin)
3. [Supprimer un administrateur](#supprimer-un-admin)
4. [Lister les administrateurs](#lister-les-admins)

---

## 1. Créer la table admin_users

La table est déjà définie dans `lib/db/schema.sql`. Pour la créer, exécutez :

```bash
# Option 1 : Utiliser psql (si installé localement)
psql -h your-neon-host -U your-user -d neondb -f lib/db/schema.sql

# Option 2 : Copier-coller le SQL dans le dashboard Neon
# Ouvrez lib/db/schema.sql et copiez uniquement la partie "admin_users"
```

---

## 2. Créer un administrateur

### Méthode 1 : Via le script (RECOMMANDÉ)

1. **Modifiez le script** `scripts/create-admin.js` :
   ```javascript
   const email = 'votre@email.com';      // Changez l'email
   const password = 'VotreMotDePasse';   // Changez le mot de passe
   const name = 'Votre Nom';             // Changez le nom
   ```

2. **Exécutez le script** :
   ```bash
   npm run create-admin
   ```

### Méthode 2 : Directement en SQL (si vous connaissez déjà le hash)

```sql
INSERT INTO admin_users (email, password_hash, name)
VALUES ('admin@tnt-site.com', '$2a$10$...hash...', 'Administrateur');
```

---

## 3. Supprimer un administrateur

```sql
DELETE FROM admin_users WHERE email = 'email@exemple.com';
```

---

## 4. Lister les administrateurs

```sql
SELECT id, email, name, is_active, created_at, last_login
FROM admin_users
ORDER BY created_at DESC;
```

---

## 🔒 Sécurité

- ✅ Les mots de passe sont **hashés avec bcrypt** (10 rounds de salage)
- ✅ Sessions valides **24 heures**
- ✅ Cookies **httpOnly** (protection XSS)
- ✅ Possibilité de **désactiver un compte** sans le supprimer (`is_active = false`)

---

## 📝 Notes importantes

1. **Ne commitez JAMAIS** le fichier `create-admin.js` avec de vrais mots de passe
2. Changez toujours le mot de passe par défaut après la première connexion
3. Utilisez des mots de passe forts (minimum 12 caractères)
4. Pour production, ajoutez une fonctionnalité de changement de mot de passe

---

## 🚀 Première utilisation

```bash
# 1. Installer les dépendances
npm install

# 2. Créer la table (si pas déjà fait)
# Copiez la partie "admin_users" de schema.sql dans le dashboard Neon

# 3. Créer votre premier admin
npm run create-admin

# 4. Se connecter
# Allez sur http://localhost:3000/admin/login
```
