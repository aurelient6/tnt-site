# Configuration Stripe - Guide complet

## 🎯 Ce qui a été fait

### 1. Installation des packages
```bash
npm install stripe @stripe/stripe-js pg
```

### 2. Fichiers créés/modifiés

#### Nouveaux fichiers :
- `lib/services/stripeService.js` - Service Stripe (création sessions, webhooks)
- `app/api/checkout/route.js` - API pour créer une session de paiement
- `app/api/webhooks/stripe/route.js` - Webhook pour recevoir les événements Stripe
- `scripts/migrate-add-stripe.js` - Migration pour ajouter les colonnes de paiement

#### Fichiers modifiés :
- `app/api/bookings/route.js` - Ne plus envoyer l'email immédiatement
- `app/reserver/[servicesSlug]/page.js` - Rediriger vers Stripe après réservation
- `app/confirmation/page.js` - Afficher le statut de paiement
- `app/style/confirmation.css` - Styles pour les alertes de paiement
- `lib/db/schema.sql` - Ajout des colonnes Stripe

## 🔑 Configuration des clés API

### Étape 1 : Récupérer vos clés Stripe

1. Allez sur votre dashboard Stripe (mode Test) : https://dashboard.stripe.com/test/dashboard
2. Cliquez sur "Developers" (Développeurs) → "API keys" (Clés API)
3. Vous avez 2 clés :
   - **Clé publique** (commence par `pk_test_...`) 
   - **Clé secrète** (commence par `sk_test_...`) - **NE JAMAIS LA PARTAGER**

### Étape 2 : Ajouter les clés dans votre .env.local

Ouvrez votre fichier `.env.local` et remplacez ces lignes :

```env
# Stripe (mode Test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE_ICI
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI
STRIPE_WEBHOOK_SECRET=
```

Par exemple :
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Abc123...xyz
STRIPE_SECRET_KEY=sk_test_51Abc123...xyz
STRIPE_WEBHOOK_SECRET=
```

## 🌐 Configuration du Webhook (IMPORTANT pour la production)

Le webhook permet à Stripe de notifier votre serveur quand un paiement est réussi/échoué.

### Pour le développement local (avec Stripe CLI) :

1. **Installer Stripe CLI** : https://stripe.com/docs/stripe-cli
2. **Se connecter** :
   ```bash
   stripe login
   ```
3. **Lancer le forward des webhooks** :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copiez le **webhook signing secret** qui s'affiche (commence par `whsec_...`)
5. Ajoutez-le dans votre `.env.local` :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...votre_secret...
   ```

### Pour la production (Vercel/Netlify) :

1. Déployez votre site
2. Allez sur le dashboard Stripe → Developers → Webhooks
3. Cliquez sur "Add endpoint"
4. URL du webhook : `https://votre-domaine.com/api/webhooks/stripe`
5. Événements à écouter :
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
6. Copiez le **Signing secret** (commence par `whsec_...`)
7. Ajoutez-le dans vos variables d'environnement Vercel/Netlify

## 🧪 Tester le paiement

### Cartes de test Stripe :

```
✅ Paiement réussi :
   Numéro : 4242 4242 4242 4242
   Date : N'importe quelle date future (ex: 12/28)
   CVC : N'importe quel 3 chiffres (ex: 123)

❌ Paiement refusé :
   Numéro : 4000 0000 0000 0002

🔒 Authentification 3D Secure :
   Numéro : 4000 0027 6000 3184
```

### Flux de test :

1. **Démarrez votre serveur** :
   ```bash
   npm run dev
   ```

2. **Testez une réservation** :
   - Allez sur `/services`
   - Choisissez un service
   - Remplissez le formulaire
   - Cliquez sur "Réserver"
   - Vous serez redirigé vers Stripe
   - Utilisez la carte de test `4242 4242 4242 4242`
   - Validez le paiement

3. **Vérifiez** :
   - Vous êtes redirigé vers `/confirmation?token=...&payment=success`
   - Un email de confirmation est envoyé
   - Dans la base de données : `payment_status = 'paid'` et `status = 'confirmed'`

## 📊 Vérifier dans Stripe Dashboard

1. Allez sur https://dashboard.stripe.com/test/payments
2. Vous verrez tous les paiements de test
3. Cliquez sur un paiement pour voir les détails

## 🔄 Passer en mode Production (LIVE)

⚠️ **Ne faites ceci que lorsque tout fonctionne en mode Test !**

1. Dans le dashboard Stripe, passez du mode "Test" au mode "Live" (toggle en haut à droite)
2. Allez dans Developers → API keys
3. Récupérez vos **clés LIVE** (commencent par `pk_live_...` et `sk_live_...`)
4. Remplacez dans votre `.env.local` (ou variables d'environnement de production) :
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```
5. Configurez le webhook en mode Live (même processus qu'en test)

## 🚨 Sécurité

- ✅ Les clés secrètes ne sont JAMAIS exposées au client (uniquement côté serveur)
- ✅ Le webhook vérifie la signature Stripe pour éviter les faux événements
- ✅ Les tokens de confirmation empêchent l'accès non autorisé aux réservations
- ✅ Stripe gère la conformité PCI-DSS (vos serveurs ne voient jamais les numéros de carte)

## 📝 Base de données

La table `bookings` a maintenant ces colonnes supplémentaires :
- `stripe_session_id` - ID de la session Stripe
- `stripe_payment_intent` - ID du paiement Stripe
- `payment_status` - État du paiement : `pending`, `paid`, `failed`, `refunded`

## 🎉 C'est prêt !

Votre système de paiement est maintenant complètement intégré :

1. ✅ Client remplit le formulaire de réservation
2. ✅ Réservation créée en base (statut `pending`)
3. ✅ Redirection automatique vers Stripe
4. ✅ Client paie avec sa carte
5. ✅ Webhook reçoit la confirmation
6. ✅ Statut passe à `confirmed` + `paid`
7. ✅ Email de confirmation envoyé automatiquement
8. ✅ Client reçoit le PDF de confirmation

## 🆘 Dépannage

### Le webhook ne fonctionne pas en local :
- Vérifiez que Stripe CLI est lancé : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est dans `.env.local`

### L'email n'est pas envoyé après le paiement :
- Vérifiez les logs du webhook : regardez la console lors du paiement
- Vérifiez que Brevo est configuré (`BREVO_API_KEY` dans `.env.local`)

### Le paiement est accepté mais le statut reste "pending" :
- C'est probablement le webhook qui ne fonctionne pas
- Vérifiez les logs du serveur
- En production, vérifiez que l'URL du webhook est correcte dans Stripe Dashboard
