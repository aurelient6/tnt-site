# 🔒 Guide de Sécurité - Authentification Admin

La clé générée ne change jamais, sauf si vous le faites manuellement.

🔑 Fonctionnement de la clé secrète :
✅ La clé reste fixe :
Une fois générée et mise dans .env.local, elle ne change jamais automatiquement
C'est comme un "mot de passe maître" pour créer des admins
Vous la gardez tant que vous voulez
🔄 Quand la changer manuellement :
npm run generate-secret  # Nouvelle clé
# Remplacez dans .env.local

Changement de responsable : Si quelqu'un quitte l'équipe
npm run generate-secret  # Nouvelle clé
# L'ancienne devient inutile

Rotation de sécurité : Bonne pratique tous les 6-12 mois
npm run generate-secret  # Nouvelle clé

# Vous générez la clé une fois
npm run generate-secret
# ADMIN_SECRET_KEY=abc123...

# Vous l'ajoutez dans .env.local (une seule fois)
# Ensuite, chaque fois que vous voulez créer un admin :
npm run create-admin
# → Le script demande cette clé (toujours la même)

## 🎯 Niveaux de protection

### Niveau 1 : Base de données ✅
- Mots de passe hashés avec bcrypt (10 rounds)
- Impossible de récupérer le mot de passe en clair
- Même l'admin DB ne peut pas voir les mots de passe

### Niveau 2 : Variables d'environnement ✅
- `.env.local` dans `.gitignore`
- Jamais commité dans Git
- DATABASE_URL protégée

### Niveau 3 : Clé secrète (NOUVEAU) 🔐
- `ADMIN_SECRET_KEY` requise pour créer des admins
- Protège contre les attaques si quelqu'un a accès au code
- Unique pour chaque installation

---

## 🚨 Scénarios d'attaque et protections

| Scénario | Sans clé secrète | Avec clé secrète |
|----------|------------------|------------------|
| Pirate a le code + DB | ❌ Peut créer un admin | ✅ Bloqué sans la clé |
| Pirate a le code seulement | ✅ Aucun risque | ✅ Aucun risque |
| Pirate a la DB seulement | ⚠️ Peut insérer en SQL | ⚠️ Peut insérer en SQL |
| Pirate a le code + DB + clé | ❌ Accès total | ❌ Accès total |

---

## 🛡️ Configuration de la clé secrète

### Étape 1 : Générer une clé unique

```bash
npm run generate-secret
```

Sortie :
```
ADMIN_SECRET_KEY=d65566a0e5daedc8757990db0510d9862e71974a8b3f9c80bf0fb2e3d32c9f05
```

### Étape 2 : Ajouter dans `.env.local`

```env
# Base de données
DATABASE_URL=postgresql://...

# 🔐 Clé secrète admin (ne JAMAIS partager !)
ADMIN_SECRET_KEY=d65566a0e5daedc8757990db0510d9862e71974a8b3f9c80bf0fb2e3d32c9f05
```

### Étape 3 : Créer un admin

```bash
npm run create-admin
```

Le script demandera maintenant :
1. 🔑 Clé secrète (celle du .env.local)
2. 📧 Email
3. 🔒 Mot de passe
4. 👤 Nom

---

## 🔐 Protection supplémentaire contre l'injection SQL

### Scénario : Pirate a accès direct à la DB

Un pirate pourrait faire :
```sql
INSERT INTO admin_users (email, password_hash, name, is_active)
VALUES ('pirate@evil.com', '$2a$10$hashé...', 'Pirate', true);
```

### Solutions :

#### Option A : Ajouter un champ de vérification (RECOMMANDÉ)
Modifiez la table pour ajouter un jeton secret :

```sql
ALTER TABLE admin_users ADD COLUMN verification_token VARCHAR(64);

-- Seuls les admins avec le bon token peuvent se connecter
UPDATE admin_users SET verification_token = 'votre_token_secret' WHERE id = 1;
```

Modifiez l'API de login pour vérifier le token.

#### Option B : Whitelist d'emails
Dans `.env.local` :
```env
ALLOWED_ADMIN_EMAILS=votre@email.com,autre@email.com
```

L'API de login rejette les emails non listés.

#### Option C : Audit régulier
Script pour lister tous les admins :
```sql
SELECT id, email, name, created_at, last_login 
FROM admin_users 
ORDER BY created_at DESC;
```

---

## 📋 Checklist de sécurité

### Installation initiale
- [ ] Générer une `ADMIN_SECRET_KEY` unique
- [ ] Ajouter la clé dans `.env.local`
- [ ] Vérifier que `.env.local` est dans `.gitignore`
- [ ] Ne JAMAIS commiter le `.env.local`

### Création d'admin
- [ ] Utiliser `npm run create-admin` (avec clé secrète)
- [ ] Utiliser un mot de passe fort (12+ caractères)
- [ ] Noter le mot de passe de façon sécurisée (gestionnaire de mots de passe)

### Maintenance
- [ ] Auditer régulièrement les comptes admin
- [ ] Désactiver les anciens comptes (`is_active = false`)
- [ ] Monitorer les connexions (`last_login`)
- [ ] Changer la clé secrète si elle est compromise

### En production
- [ ] Utiliser HTTPS uniquement
- [ ] Activer les logs de connexion
- [ ] Mettre en place un rate limiting sur `/api/admin/login`
- [ ] Considérer l'authentification 2FA

---

## 🚀 Amélirations futures possibles

1. **Authentification à deux facteurs (2FA)**
   - QR code avec Google Authenticator
   - SMS avec Twilio

2. **Rate limiting**
   - Bloquer après 5 tentatives échouées
   - Délai exponentiel

3. **Logs d'audit**
   - Enregistrer toutes les tentatives de connexion
   - Alertes sur activités suspectes

4. **Sessions avec JWT**
   - Tokens révocables
   - Expiration courte avec refresh token

5. **Permissions et rôles**
   - Admin principal vs admin lecture seule
   - Permissions granulaires par service

---

## ⚠️ Que faire si la sécurité est compromise

### La clé secrète a fuité
```bash
# 1. Générer une nouvelle clé
npm run generate-secret

# 2. Remplacer dans .env.local
# 3. La nouvelle clé sera requise pour créer des admins
```

### Un admin non autorisé existe
```sql
-- Désactiver immédiatement
UPDATE admin_users SET is_active = false WHERE email = 'suspect@email.com';

-- Ou supprimer
DELETE FROM admin_users WHERE email = 'suspect@email.com';
```

### Le mot de passe d'un admin a fuité
```bash
# 1. Supprimer l'ancien compte
DELETE FROM admin_users WHERE email = 'email@compromise.com';

# 2. Recréer avec un nouveau mot de passe
npm run create-admin
```

---

## 💡 Bonnes pratiques

✅ **À FAIRE**
- Utiliser un gestionnaire de mots de passe
- Changer les mots de passe régulièrement
- Limiter le nombre d'admins au strict minimum
- Auditer les logs de connexion
- Utiliser HTTPS en production

❌ **À NE JAMAIS FAIRE**
- Commiter le `.env.local`
- Partager la clé secrète par email/Slack
- Réutiliser des mots de passe
- Garder des comptes admin inactifs
- Utiliser des mots de passe faibles
