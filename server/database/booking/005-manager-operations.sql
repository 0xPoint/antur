ALTER TABLE bookings DROP CONSTRAINT bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('held','paid','manual_pending','manual_confirmed','expired','cancelled','payment_review'));
ALTER TABLE bookings ADD COLUMN manual_payment_kopecks integer NOT NULL DEFAULT 0 CHECK (manual_payment_kopecks >= 0);
ALTER TABLE bookings ADD COLUMN refund_review boolean NOT NULL DEFAULT false;
ALTER TABLE trips ADD COLUMN revision integer NOT NULL DEFAULT 0 CHECK (revision >= 0);
