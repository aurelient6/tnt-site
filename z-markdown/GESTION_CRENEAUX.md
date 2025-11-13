# Gestion des créneaux et paiements - Documentation

## 🔄 Nouveau flux de réservation

### 1. Client crée une réservation
```
POST /api/bookings
→ Réservation créée avec status='pending' et payment_status='pending'
→ Créneau RESTE DISPONIBLE (is_available = true)
→ Redirection vers Stripe pour le paiement
```

### 2. Client paie sur Stripe
```
Stripe → Webhook → POST /api/webhooks/stripe
→ Vérification : créneau toujours disponible ?
  ✅ OUI : Bloquer le créneau + Confirmer la réservation + Envoyer email
  ❌ NON : Erreur "Créneau déjà pris" (remboursement à faire manuellement)
```

### 3. Si le client NE paie PAS
```
Réservation reste en status='pending'
Créneau reste disponible
→ Après 30 minutes : suppression automatique (script cleanup)
```

---

## 🛡️ Protection contre les doubles réservations

Si 2 clients essaient de réserver le même créneau en même temps :

1. **Client A** crée réservation → Créneau disponible ✅
2. **Client B** crée réservation → Créneau disponible ✅
3. **Client A** paie en premier → Créneau bloqué ✅
4. **Client B** paie ensuite → **ERREUR** : Créneau déjà pris ❌

---

## 🧹 Nettoyage automatique

### Script de nettoyage
Supprime les réservations non payées après **30 minutes**.

**Commande** :
```bash
npm run cleanup-unpaid
```

### Automatisation (Cron Job)

**Sur serveur Windows** :
Utiliser le Planificateur de tâches pour exécuter :
```
npm run cleanup-unpaid
```
Toutes les 15 minutes.

**Sur Vercel** (Production) :
Utiliser Vercel Cron Jobs dans `vercel.json` :
```json
{
  "crons": [{
    "path": "/api/cron/cleanup-unpaid",
    "schedule": "*/15 * * * *"
  }]
}
```

---

## 📊 États des réservations

| État DB | Créneau bloqué ? | Email envoyé ? | Action |
|---------|------------------|----------------|---------|
| `pending` / `pending` | ❌ NON | ❌ NON | En attente de paiement |
| `confirmed` / `paid` | ✅ OUI | ✅ OUI | Réservation confirmée |
| `pending` / `failed` | ❌ NON | ❌ NON | Paiement échoué |

---

## 🧪 Tests recommandés

### Test 1 : Paiement réussi
1. Créer une réservation
2. Payer avec `4242 4242 4242 4242`
3. **Vérifier** :
   - ✅ Créneau bloqué dans la DB (`is_available = false`)
   - ✅ Email reçu
   - ✅ Status = `confirmed`, payment_status = `paid`

### Test 2 : Paiement annulé
1. Créer une réservation
2. Annuler le paiement
3. **Vérifier** :
   - ✅ Créneau TOUJOURS disponible (`is_available = true`)
   - ❌ Pas d'email
   - ✅ Status = `pending`, payment_status = `pending`
4. Attendre 30 min + lancer `npm run cleanup-unpaid`
5. **Vérifier** : Réservation supprimée

### Test 3 : Double réservation
1. Ouvrir 2 navigateurs (ou 1 normal + 1 incognito)
2. Créer 2 réservations pour le MÊME créneau
3. Payer dans le 1er navigateur → **Succès** ✅
4. Payer dans le 2ème navigateur → **Erreur** ❌
5. **Vérifier** : Un seul email envoyé, créneau bloqué pour 1 seule personne

---

## ⚠️ Points d'attention

### Remboursement manuel (rare)
Si 2 clients paient simultanément et que le 2ème paie mais que le créneau est déjà pris :
- Le webhook retourne une erreur
- **Action manuelle** : Aller sur le dashboard Stripe et rembourser le client

### Logs à surveiller
```
❌ Créneau déjà réservé par quelqu'un d'autre
```
→ Cas de double réservation : vérifier et rembourser si nécessaire

---

## 🚀 Déploiement en production

1. ✅ Tester en local avec cartes de test
2. ✅ Configurer le webhook Stripe en production
3. ✅ Configurer le cron job pour le cleanup
4. ✅ Passer les clés Stripe en mode LIVE
5. ✅ Surveiller les logs les premiers jours


Action	Créneau bloqué ?	Réservation en DB
Client crée réservation	❌ NON	✅ OUI (pending)
Client paie	✅ OUI	✅ OUI (paid)
Client annule	❌ NON	✅ OUI (pending)
Après 30 min (cleanup)	❌ NON	❌ NON (supprimée)