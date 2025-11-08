# Prochaines étapes

## Mails:
- Ajouter un mail de confirmation après la réservation

## Messages:
- Envoyer un sms de rappel de rendez-vous la veille

## Stripe/moyen de paiement
- Ajouter Stripe à la fin de la réservation

## Boutons réservations
- Ajouter des boutons de réservations dans la page d'accueil et plus haut dans le service détaillé

## Créneaux horaires
- Masquer les propositions des heures passées

## A propos
- Ajouter la page d'à propos

## Import des données de service
- `lib/db/seed.js` : import les services data
- Vérifier si aucune donnée n'est hardcodée ailleurs

# Futur
- Faire des sessions JWT pour la partie admin?
- Faire des logs d'audit?
- Rate limiting: bloquer les connexions après 5 échecs
- Modifier les réservations
- Exporter les réservations en excel/ pdf?
- Revoir le système de génération de créneaux? Pouvoir ajouter via l'interface admin et avec un rôle déterminé
- Différents rôles avec différentes autorisations
- Réserver plusieurs créneaux d'un coup