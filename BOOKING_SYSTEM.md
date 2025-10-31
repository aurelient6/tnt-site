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

## 🔄 Flux de réservation

1. **Client remplit le formulaire de service** (questions spécifiques)
2. **Sélection du créneau** via `TimeSlotSelector`
   - Affiche les dates disponibles pour les 30 prochains jours
   - Sélection de la date → affichage des horaires disponibles
3. **Coordonnées client** (nom, prénom, email, téléphone, race du chien)
4. **Confirmation** → création de la réservation + marquage du créneau comme indisponible
5. **Page de confirmation** avec récapitulatif

## 🚀 Déploiement initial

### 1. Créer les tables dans PostgreSQL

Exécutez le schéma SQL dans votre base de données Vercel Postgres :

```bash
psql <votre_database_url> < lib/db/schema.sql
```

Ou utilisez le dashboard Vercel Postgres pour exécuter le contenu de `lib/db/schema.sql`.

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

## 🔐 Sécurité

- Transaction SQL atomique pour éviter les double-réservations
- Contrainte UNIQUE sur `(service_id, slot_date, slot_time)` au niveau DB
- Validation des champs requis côté API
- Status enum pour suivre le cycle de vie des réservations

## 🔮 Améliorations futures

- [ ] Interface admin pour voir et gérer les réservations
- [ ] Notifications par email (confirmation, rappel 24h avant)
- [ ] Système d'annulation avec remise en disponibilité du créneau
- [ ] Paiement en ligne (Stripe)
- [ ] Gestion des jours fériés
- [ ] Créneaux récurrents (générer automatiquement chaque semaine)
- [ ] Multi-langue
- [ ] Export des réservations (CSV, PDF)

## 📝 Notes importantes

- Les créneaux sont générés manuellement ou via script
- Un créneau réservé devient `is_available = false` de manière **définitive** (pas de système d'expiration)
- Les prix sont calculés côté client mais stockés en DB pour référence
- Le champ `form_responses` stocke toutes les réponses au format JSON
