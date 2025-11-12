# 🚀 Démarrage du serveur de développement

## Chaque jour, vous avez 2 options :

### Option 1 : Script automatique (RECOMMANDÉ) ⚡
**Une seule commande lance tout !**

```bash
npm run dev:stripe
```

Cette commande lance automatiquement :
- ✅ Le serveur Next.js (`npm run dev`)
- ✅ Le webhook Stripe (pour recevoir les confirmations de paiement)

Pour arrêter : **Ctrl + C**

---

### Option 2 : Manuel (2 terminaux) 🔧

Si le script ne fonctionne pas, lancez dans **2 terminaux séparés** :

**Terminal 1 :**
```bash
npm run dev
```

**Terminal 2 :**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## ⚠️ Important

- **Le webhook doit être actif** pour que :
  - Le statut passe de "pending" à "paid" après le paiement
  - L'email de confirmation soit envoyé automatiquement
  
- **Sans le webhook** :
  - Le paiement Stripe fonctionne quand même
  - Mais le statut reste "pending" dans votre base de données
  - L'email n'est pas envoyé

---

## 🧪 Test rapide

1. Lancez `npm run dev:stripe`
2. Allez sur http://localhost:3000
3. Faites une réservation
4. Payez avec la carte de test : **4242 4242 4242 4242**
5. Vérifiez que vous recevez l'email ✉️

---

## 🆘 Dépannage

### "stripe : commande introuvable"
Le PATH n'est pas configuré. Relancez :
```bash
$env:PATH += ";$env:USERPROFILE\stripe-cli"
stripe --version
```

### Le webhook ne fonctionne pas
Vérifiez que `STRIPE_WEBHOOK_SECRET` est dans votre `.env.local` :
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Script PowerShell bloqué
Autorisez l'exécution :
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
