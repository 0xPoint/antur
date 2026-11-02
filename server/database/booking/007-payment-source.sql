ALTER TABLE bookings ADD COLUMN payment_source text NOT NULL DEFAULT 'manual' CHECK (payment_source IN ('manual','online'));
UPDATE bookings SET payment_source='online' WHERE status='paid';
