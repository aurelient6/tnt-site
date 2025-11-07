# 🔐 Système d'authentification Admin - Base de données

## ✅ Ce qui a été mis en place

### 1. **Table `admin_users` dans PostgreSQL**
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### 2. **API de login sécurisée** (`/app/api/admin/login/route.js`)
- Vérifie l'email et le mot de passe contre la base de données
- Hash bcrypt pour les mots de passe (10 rounds)
- Mise à jour de `last_login` à chaque connexion
- Vérification du statut `is_active`

### 3. **Scripts de gestion**
- `npm run create-admin-table` : Crée la table
- `npm run create-admin` : Crée un nouvel administrateur

---

## 🚀 Installation (à faire UNE SEULE FOIS)

### Étape 1 : Créer la table dans Neon

Allez sur votre dashboard Neon → SQL Editor → Exécutez ce SQL :

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
```

### Étape 2 : Créer votre premier admin

1. **Exécutez le script interactif** :
   ```bash
   npm run create-admin
   ```

2. **Suivez les instructions** :
   - Entrez votre email
   - Entrez votre mot de passe (ne s'affichera pas à l'écran)
   - Entrez votre nom (optionnel)

3. **Connectez-vous** :
   - Allez sur : `http://localhost:3000/admin/login`
   - Utilisez l'email et mot de passe que vous venez de créer

---

## 👥 Créer d'autres administrateurs

**Relancez simplement le script** :
```bash
npm run create-admin
```

Le script vous demandera les informations, **rien n'est stocké dans le code** ! 🔒

---

## 🔒 Sécurité

### ✅ Avantages par rapport aux identifiants en fichier :

1. **Plusieurs admins** : Ajoutez autant d'administrateurs que nécessaire
2. **Mots de passe hashés** : Impossible de récupérer le mot de passe en clair
3. **Traçabilité** : Date de création, dernière connexion, etc.
4. **Désactivation sans suppression** : `UPDATE admin_users SET is_active = false WHERE email = '...'`
5. **Évolution facile** : Ajoutez des rôles, permissions, etc.

---

## 📊 Commandes SQL utiles

### Lister tous les admins
```sql
SELECT id, email, name, is_active, last_login 
FROM admin_users 
ORDER BY created_at DESC;
```

### Désactiver un admin
```sql
UPDATE admin_users 
SET is_active = false 
WHERE email = 'email@exemple.com';
```

### Réactiver un admin
```sql
UPDATE admin_users 
SET is_active = true 
WHERE email = 'email@exemple.com';
```

### Supprimer un admin
```sql
DELETE FROM admin_users 
WHERE email = 'email@exemple.com';
```

---

## ⚠️ Important

- ✅ **Les mots de passe ne sont JAMAIS stockés dans le code** - Le script demande les infos en ligne de commande
- ✅ **`.env.local` est dans `.gitignore`** - Vos variables d'environnement ne seront jamais committées
- ✅ **Les mots de passe sont hashés avec bcrypt** - Même en base de données, impossible de récupérer le mot de passe en clair
- 🔒 Utilisez des mots de passe forts (12+ caractères, majuscules, chiffres, symboles)
