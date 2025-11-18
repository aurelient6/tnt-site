-- Migration: Ajouter index sur bookings.created_at pour optimiser les notifications
-- Date: 2025-11-17

-- Index pour accélérer les requêtes de notifications (WHERE created_at > timestamp)
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Index composite pour optimiser davantage (created_at + payment_status)
CREATE INDEX IF NOT EXISTS idx_bookings_created_payment ON bookings(created_at DESC, payment_status);

COMMENT ON INDEX idx_bookings_created_at IS 'Optimise les requêtes de notifications par date de création';
COMMENT ON INDEX idx_bookings_created_payment IS 'Optimise les requêtes de notifications par date et statut de paiement';
