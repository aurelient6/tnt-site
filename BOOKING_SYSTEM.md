# Système de Réservation - T&T

## 📋 Vue d'ensemble

Le système de réservation permet aux clients de réserver des créneaux horaires pour les différents services proposés par T&T (toilettage, massage, physiothérapie, etc.).

## 🗄️ Structure de la base de données

### Tables principales

1. **`services`** - Liste des services disponibles
   - `id`, `slug`, `name`, `duration`

2. **`time_slots`** - Créneaux horaires disponibles
   - `id`, `service_id`, `slot_date`, `slot_time`, `is_available`
   - Contrainte unique : un seul créneau par service/date/heure

3. **`bookings`** - Réservations confirmées
   - Informations client (`client_name`, `client_firstname`, `client_email`, etc.)
   - Détails de la réservation (`time_slot_id`, `total_price`, `form_responses`)
   - Statut (`pending`, `confirmed`, `cancelled`, `completed`)

## 🚀 Installation et Configuration

### Étape 1 : Configuration de la base de données

1. **Créer un fichier `.env.local` à la racine du projet** :
```bash
# Base de données (utilisez celle fournie par Vercel/Neon)
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

### 1. Créer les tables dans PostgreSQL

Exécutez le schéma SQL dans votre base de données Vercel Postgres :
utilisez le dashboard Vercel Postgres pour exécuter le contenu de `lib/db/schema.sql`.

### 2. Insérer les services

```sql
INSERT INTO services (slug, name, duration) VALUES
  ('toilettage', 'Toilettage', 60),
  ('massage', 'Massage', 60),
  ('physiotherapie', 'Physiothérapie', 45),
  ('main-training', 'Main Training', 60),
  ('hooper', 'Hooper', 60),
  ('agility', 'Agility', 90),
  ('hydrotherapie', 'Hydrothérapie', 45),
  ('tapis-de-course', 'Tapis de course', 45),
  ('dressage', 'Dressage', 60);
```

### 3. Générer les créneaux initiaux

Utilisez le script de génération :

```bash
node scripts/generate-slots.js
```

Ou appelez directement l'API depuis un client HTTP (Postman, curl) :

```bash
curl -X POST http://localhost:3000/api/slots/generate \
  -H "Content-Type: application/json" \
  -d '{
    "serviceSlug": "toilettage",
    "startDate": "2025-01-20",
    "endDate": "2025-03-20",
    "timeSlots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
    "excludeWeekends": true
  }'
```

## 📡 API Routes

### GET `/api/slots/available`

Récupère les créneaux disponibles pour un service.

**Paramètres :**
- `service` (string) : slug du service (ex: "toilettage")
- `date` (string, optionnel) : date spécifique (format YYYY-MM-DD)

**Exemple :**
```
GET /api/slots/available?service=toilettage&date=2025-01-20
```

**Réponse :**
```json
{
  "2025-01-20": [
    {"id": 1, "slot_date": "2025-01-20", "slot_time": "09:00:00"},
    {"id": 2, "slot_date": "2025-01-20", "slot_time": "10:00:00"}
  ]
}
```

---

### POST `/api/slots/generate`

Génère des créneaux horaires en masse (admin uniquement).

**Body :**
```json
{
  "serviceSlug": "toilettage",
  "startDate": "2025-01-20",
  "endDate": "2025-03-20",
  "timeSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"],
  "excludeWeekends": true
}
```

**Réponse :**
```json
{
  "message": "Slots generated successfully",
  "count": 210
}
```

---

### POST `/api/bookings`

Crée une nouvelle réservation.

**Body :**
```json
{
  "service_slug": "toilettage",
  "time_slot_id": 42,
  "client_name": "Dupont",
  "client_firstname": "Marie",
  "client_email": "marie@example.com",
  "client_phone": "0612345678",
  "dog_breed": "Golden Retriever",
  "form_responses": { ... },
  "total_price": 40,
  "price_details": [...]
}
```

**Réponse :**
```json
{
  "id": 123,
  "created_at": "2025-01-19T10:30:00Z"
}
```

---

### GET `/api/bookings`

Récupère toutes les réservations (admin).

**Réponse :**
```json
[
  {
    "id": 123,
    "service_name": "Toilettage",
    "client_name": "Dupont",
    "client_firstname": "Marie",
    "booking_date": "2025-01-20",
    "booking_time": "09:00:00",
    "status": "confirmed",
    "total_price": 40
  }
]
```

---

### GET `/api/bookings/[id]`

Récupère une réservation spécifique.

**Exemple :**
```
GET /api/bookings/123
```

## 🎨 Composants React

### `TimeSlotSelector`

Composant de sélection de créneau avec deux étapes :
1. Sélection de la date (dropdown avec dates disponibles)
2. Sélection de l'heure (dropdown avec heures disponibles pour la date choisie)

**Props :**
- `serviceSlug` (string) : slug du service
- `onSlotSelect` (function) : callback appelé lors de la sélection → `(slotId, date, time) => void`

**États :**
- Loading : affiche un spinner pendant le chargement
- Error : affiche un message d'erreur avec bouton de réessai
- Empty : aucun créneau disponible
- Confirmation : affiche le créneau sélectionné avec un checkmark vert

# 📊 État du Système de Réservation

**Fonctionnalités** :
- Insère les 9 services en base
- Mise à jour automatique si déjà existants (ON CONFLICT)
- Messages de progression clairs

---

## 🎯 Fonctionnement du Système

### Architecture

```
┌─────────────────┐
│  Client (Web)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   /reserver/[serviceSlug]       │
│   - Formulaire multi-étapes     │
│   - TimeSlotSelector            │
│   - Calcul prix en temps réel   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   API Routes                    │
│   ├─ /api/slots/available       │ ← Charge créneaux disponibles
│   ├─ /api/slots/generate        │ ← Génère nouveaux créneaux
│   └─ /api/bookings              │ ← Crée réservation
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Base de Données (Neon)        │
│   ├─ services                   │
│   ├─ time_slots                 │
│   └─ bookings                   │
└─────────────────────────────────┘
```

### Flux de Réservation

```
1. Page de réservation (/reserver/toilettage)
   │
   ├─ Étape 1-3 : Questions spécifiques au service
   │  └─ Calcul prix en temps réel
   │
   ├─ Étape finale : Coordonnées + Créneau
   │  │
   │  ├─ TimeSlotSelector charge les créneaux
   │  │  └─ GET /api/slots/available?service=toilettage
   │  │
   │  └─ Utilisateur sélectionne date + heure
   │
   ├─ Confirmation
   │  └─ POST /api/bookings
   │     ├─ Vérifie disponibilité du créneau
   │     ├─ Crée la réservation
   │     └─ Marque le créneau comme indisponible
   │
   └─ Redirection → /confirmation?bookingId=XXX
```




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

### Les créneaux ne se chargent pas

**Vérifications** :
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs réseau dans l'onglet "Network"
3. Tester l'API directement : http://localhost:3000/api/slots/available?service=toilettage

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

- Les créneaux générés excluent les dimanches par défaut
- Un créneau réservé devient automatiquement `is_available = false`
- Le prix est calculé côté client ET stocké en base pour référence