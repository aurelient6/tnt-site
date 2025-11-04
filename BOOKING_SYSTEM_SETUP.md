# 🎯 Système de Réservation - Guide de Configuration

## ✅ Corrections Appliquées

### 1. **Bugs corrigés dans `/api/bookings/route.js`**
- Ajout des paramètres manquants dans les requêtes SQL
- Ajout de la sérialisation JSON pour `form_responses` et `price_details`

### 2. **Compatibilité TimeSlotSelector**
- Ajout de la propriété `slotId` dans les données retournées
- Correction de l'interface entre le composant et la page de réservation

### 3. **Client de base de données centralisé**
- Création de `/lib/db/client.js` pour une configuration unique
- Support de `POSTGRES_URL` (Vercel) et `DATABASE_URL` (fallback)

### 4. **Scripts npm ajoutés**
- `npm run seed` : Initialiser les services en base
- `npm run generate-slots` : Générer les créneaux horaires

---

## 🚀 Installation et Configuration

### Étape 1 : Configuration de la base de données

1. **Créer un fichier `.env.local` à la racine du projet** :
```bash
# Base de données (utilisez celle fournie par Vercel/Neon)
POSTGRES_URL=postgresql://...
# OU
DATABASE_URL=postgresql://...

# URL de base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2. **Exécuter le schéma SQL** :
   - Connectez-vous à votre base de données Neon/Vercel
   - Exécutez le contenu de `/lib/db/schema.sql`

### Étape 2 : Initialiser les données

```powershell
# 1. Installer les dépendances
npm install

# 2. Insérer les services en base
npm run seed

# 3. Démarrer le serveur
npm run dev

# 4. Dans un autre terminal, générer les créneaux horaires
npm run generate-slots
```

---

## 📋 Vérification du Fonctionnement

### ✅ Checklist

- [ ] Le serveur démarre sans erreur (`npm run dev`)
- [ ] La base de données contient les 9 services
- [ ] Les créneaux horaires sont générés (vérifier dans la table `time_slots`)
- [ ] La page `/services/toilettage` s'affiche
- [ ] La page `/reserver/toilettage` affiche le formulaire
- [ ] Le sélecteur de créneaux affiche les dates disponibles
- [ ] La création d'une réservation fonctionne

### Test manuel

1. **Aller sur** : http://localhost:3000/reserver/toilettage
2. **Remplir le formulaire** (choisir options avec prix)
3. **Sélectionner un créneau** dans le TimeSlotSelector
4. **Vérifier** que le récapitulatif affiche le bon prix
5. **Cliquer sur "Confirmer la réservation"**
6. **Vérifier** la redirection vers `/confirmation`

---

## 🔍 Debug

### Le TimeSlotSelector ne s'affiche pas

**Problème** : Aucun créneau disponible

**Solution** :
```powershell
# Vérifier que les créneaux ont été générés
npm run generate-slots
```

### Erreur "Service not found"

**Problème** : Les services ne sont pas en base

**Solution** :
```powershell
# Ré-exécuter le seed
npm run seed
```

### Erreur de connexion à la base de données

**Problème** : Variable d'environnement manquante

**Solution** :
- Vérifier que `.env.local` existe avec `POSTGRES_URL` ou `DATABASE_URL`
- Redémarrer le serveur après avoir modifié `.env.local`

### Les créneaux ne se chargent pas

**Vérifications** :
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs réseau dans l'onglet "Network"
3. Tester l'API directement : http://localhost:3000/api/slots/available?service=toilettage

---

## 📊 Structure de la Base de Données

### Tables créées

1. **services** : Liste des services (toilettage, massage, etc.)
2. **time_slots** : Créneaux horaires disponibles par service
3. **bookings** : Réservations effectuées par les clients

### Relations

```
services (1) ---> (n) time_slots
services (1) ---> (n) bookings
time_slots (1) ---> (n) bookings
```

---

## 🎨 Flux de Réservation

1. **Client** → Accède à `/reserver/[serviceSlug]`
2. **Formulaire** → Remplit les étapes (questions spécifiques au service)
3. **TimeSlotSelector** → Charge les créneaux depuis `/api/slots/available`
4. **Sélection** → Choisit date + heure
5. **Récapitulatif** → Affiche le prix calculé
6. **Confirmation** → POST vers `/api/bookings`
7. **Réservation** → Crée la réservation + Marque le créneau comme non disponible
8. **Redirection** → Vers `/confirmation?bookingId=XXX`

---

## 🛠️ Maintenance

### Ajouter de nouveaux créneaux

```powershell
# Régénérer les créneaux pour les 60 prochains jours
npm run generate-slots
```

### Ajouter un nouveau service

1. Modifier `/lib/db/seed.js` pour ajouter le service
2. Créer le formulaire dans `/app/data/serviceForm.js`
3. Exécuter `npm run seed`
4. Générer les créneaux avec `npm run generate-slots`

---

## 📝 Notes Importantes

- Les créneaux générés excluent les week-ends par défaut
- Un créneau réservé devient automatiquement `is_available = false`
- Les réservations ont le statut `confirmed` par défaut
- Le prix est calculé côté client ET stocké en base pour référence

---

## 🐛 Problèmes Résolus

### ✅ Paramètres SQL manquants
**Avant** :
```javascript
const result = await sql`SELECT id FROM services WHERE slug = `;
```

**Après** :
```javascript
const result = await sql`SELECT id FROM services WHERE slug = ${service_slug}`;
```

### ✅ Interface TimeSlotSelector
**Avant** :
```javascript
onSlotSelect={(slotId, date, time) => { ... }}
```

**Après** :
```javascript
onSlotSelect={(slotData) => { 
  handleChange(questionId, slotData);
}}
```

### ✅ Propriété manquante
**Avant** :
```javascript
onSlotSelect({ id: slot.id, ... })
```

**Après** :
```javascript
onSlotSelect({ slotId: slot.id, id: slot.id, ... })
```

---

## ✨ Le système est maintenant fonctionnel !

Pour toute question ou problème, vérifiez d'abord :
1. Les logs du serveur
2. La console du navigateur (F12)
3. Les données en base de données
