-- Migration: Ajout du système de capacité multiple pour dogsitting
-- Date: 2025-11-16
-- Description: Ajoute capacity aux services et time_slots pour permettre plusieurs réservations simultanées

-- 1. Ajouter capacity à la table services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 1;

-- 2. Mettre à jour la capacité pour dogsitting
UPDATE services 
SET capacity = 5 
WHERE slug = 'dogsitting';

-- 3. Ajouter les colonnes nécessaires à time_slots
ALTER TABLE time_slots 
ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 1;

ALTER TABLE time_slots 
ADD COLUMN IF NOT EXISTS booked_count INTEGER DEFAULT 0;

ALTER TABLE time_slots 
ADD COLUMN IF NOT EXISTS slot_type VARCHAR(50);

-- 4. Mettre à jour les créneaux existants de dogsitting avec leur capacité
UPDATE time_slots 
SET capacity = 5 
WHERE service_id = (SELECT id FROM services WHERE slug = 'dogsitting');

-- 5. Créer un index pour optimiser les recherches de créneaux disponibles
CREATE INDEX IF NOT EXISTS idx_time_slots_capacity 
ON time_slots(service_id, booked_count, capacity) 
WHERE booked_count < capacity;

-- 6. Vérification
SELECT 
  s.name,
  s.capacity as service_capacity,
  COUNT(ts.id) as total_slots,
  SUM(CASE WHEN ts.booked_count < ts.capacity THEN 1 ELSE 0 END) as available_slots
FROM services s
LEFT JOIN time_slots ts ON s.id = ts.service_id
GROUP BY s.name, s.capacity
ORDER BY s.name;
