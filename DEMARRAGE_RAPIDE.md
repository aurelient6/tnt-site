# 🚀 Guide de Démarrage Rapide - Système de Réservation

## ⚠️ IMPORTANT : Ordre d'exécution des étapes

### ✅ Étape 1 : Fichier .env.local
**Statut : FAIT ✅**

Votre fichier `.env.local` contient déjà `DATABASE_URL`.

---

### ✅ Étape 2 : Installer les dépendances
**Statut : À VÉRIFIER**

```powershell
npm install
```

---

### 🔴 Étape 3 : Exécuter le schéma SQL dans Neon
**Statut : À FAIRE AVANT LE SEED**

#### Option A : Via l'interface web Neon (RECOMMANDÉ)

1. **Allez sur** : https://console.neon.tech
2. **Sélectionnez votre projet** : `odd-field-64716441`
3. **Cliquez sur "SQL Editor"** dans le menu de gauche
4. **Copiez-collez** TOUT le contenu du fichier `lib/db/schema.sql`
5. **Cliquez sur "Run"** (bouton vert en haut à droite)
6. **Vérifiez** : Vous devriez voir "Query executed successfully"

#### Option B : Via psql (ligne de commande)

```powershell
# Si vous avez psql installé
psql "postgresql://neondb_owner:npg_ErM8SAX2Jgdn@ep-dawn-snow-agzyghek-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require" -f lib/db/schema.sql
```

#### Comment vérifier que c'est fait ?

Dans le SQL Editor de Neon, exécutez :
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Vous devriez voir :
- `bookings`
- `services`
- `time_slots`

---

### 📝 Étape 4 : Lancer le seed (APRÈS l'étape 3)

```powershell
npm run seed
```

**Résultat attendu :**
```
🌱 Démarrage du seeding...
📡 Connexion à: ep-dawn-snow-agzyghek-pooler.c-2.eu-central-1.aws.neon.tech

📋 Insertion des services...
   ✅ Service ajouté: Toilettage
   ✅ Service ajouté: Massage
   ✅ Service ajouté: Physiothérapie
   ✅ Service ajouté: Main Training
   ✅ Service ajouté: Hooper
   ✅ Service ajouté: Agility
   ✅ Service ajouté: Hydrothérapie
   ✅ Service ajouté: Tapis de course
   ✅ Service ajouté: Dressage

✨ Seeding terminé avec succès !
```

---

### 📝 Étape 5 : Démarrer le serveur

```powershell
npm run dev
```

---

### 📝 Étape 6 : Générer les créneaux horaires

**Dans un NOUVEAU terminal PowerShell :**

```powershell
cd "C:\Users\aurelien\Documents\tnt-site - V2"
npm run generate-slots
```

**Résultat attendu :**
```
🚀 Génération des créneaux horaires...
📅 Période: 04/11/2025 - 03/01/2026

📋 Service: toilettage
   ✅ 420 créneaux générés

📋 Service: massage
   ✅ 300 créneaux générés
...

✨ Génération terminée !
```

---

## 🔍 Diagnostic des Erreurs

### Erreur : "Cannot use import statement outside a module"
**Solution** : ✅ CORRIGÉ - J'ai ajouté `"type": "module"` dans package.json

### Erreur : "relation 'services' does not exist"
**Cause** : Vous n'avez pas exécuté le schéma SQL (Étape 3)
**Solution** : Exécutez le fichier `lib/db/schema.sql` dans Neon

### Erreur : "DATABASE_URL non défini"
**Cause** : Le fichier `.env.local` n'est pas chargé
**Solution** : ✅ CORRIGÉ - Le script charge maintenant manuellement .env.local

---

## 📊 Vérification Finale

Une fois toutes les étapes terminées, testez :

1. **Allez sur** : http://localhost:3000/reserver/toilettage
2. **Vous devriez voir** :
   - Le formulaire de réservation
   - Le sélecteur de créneaux avec des dates disponibles
   - Le récapitulatif de prix

---

## 🆘 Besoin d'aide ?

### Vérifier l'état de la base de données

Dans le SQL Editor de Neon :

```sql
-- Vérifier les services
SELECT * FROM services;

-- Vérifier les créneaux (devrait être vide avant generate-slots)
SELECT COUNT(*) FROM time_slots;

-- Vérifier les réservations (devrait être vide au départ)
SELECT COUNT(*) FROM bookings;
```

---

## ⏭️ MAINTENANT : Faites l'Étape 3

**Étape 3 : Exécuter le schéma SQL**

1. Allez sur https://console.neon.tech
2. Cliquez sur "SQL Editor"
3. Copiez tout le contenu de `lib/db/schema.sql`
4. Collez dans l'éditeur
5. Cliquez sur "Run"
6. Revenez ici et lancez : `npm run seed`
