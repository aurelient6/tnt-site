# Mode d'emploi et fonctionnalités

## Réservation
1. Aller sur le service que l'on veut réserver et cliquer sur un des boutons de réservations. Il y a trois boutons: 
   - Dans la liste des services
   - Dans le header du détail service
   - Dans le footer du détail service
2. Une série de questions seront posées, ils peuvent différer en fonction des réponses du client. Le prix est calculé automatiquement en fonction des réponses de l'utilisateur.
3. Le dernier formulaire demande les infos personnelles et sur le chien. C'est à ce moment-là que le client choisi son créneau (jour + heure)
4. Dès lors, l'utilisateur est redirigé vers Stripe pour effectuer le paiement du montant calculé auparavant. 
   5a. Si le paiement se passe bien, une confirmation de réservation est affichée. Cette confirmation est téléchargeable via un bouton. Cette confirmation est également envoyée par mail au client.
   5b. Si le paiement est refusé, la réservation est ajoutée en attente dans base de données mais reste disponible dans le choix des créneaux. Cette réservation reste enregistrée 30 minutes si aucun paiement n'est effectué par la suite. Si un autre utilisateur réserve ce créneau et paie avant, ce dernier aura la réservation. Le "mauvais payeur" recevra un message lui disant que le créneau choisi a été pris et qu'il doit faire une autre réservation.
6. Dans la partie Admin, chaque service a son propre calendrier de réservations, distribué semaine par semaine. Chaque réservation est affichée à l'endroit du créneau correspondant. En cliquant sur les réservations, on voit ses détails.