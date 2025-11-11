-- Migration : Ajouter le champ confirmation_token à la table bookings
-- Date : 2025-11-11

-- Ajouter la colonne confirmation_token
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmation_token VARCHAR(64) UNIQUE;

-- Générer des tokens pour les réservations existantes (si nécessaire)
UPDATE bookings 
SET confirmation_token = md5(random()::text || clock_timestamp()::text || id::text)
WHERE confirmation_token IS NULL;

-- Rendre la colonne NOT NULL après avoir rempli les valeurs
ALTER TABLE bookings ALTER COLUMN confirmation_token SET NOT NULL;

-- Créer l'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(confirmation_token);
