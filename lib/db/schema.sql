-- Table des services
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL, -- Durée en minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des créneaux horaires
CREATE TABLE IF NOT EXISTS time_slots (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(service_id, slot_date, slot_time)
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  time_slot_id INTEGER REFERENCES time_slots(id) ON DELETE SET NULL,
  
  -- Informations client
  client_name VARCHAR(255) NOT NULL,
  client_firstname VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  dog_breed VARCHAR(255) NOT NULL,
  
  -- Réponses du formulaire (JSON)
  form_responses JSONB,
  
  -- Prix
  total_price DECIMAL(10, 2) NOT NULL,
  price_details JSONB,
  
  -- Date et heure de la réservation
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_time_slots_service_date ON time_slots(service_id, slot_date);
CREATE INDEX idx_time_slots_available ON time_slots(is_available);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Index pour améliorer les performances des connexions
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Trigger pour mettre à jour updated_at sur admin_users
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
