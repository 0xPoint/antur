ALTER TABLE bookings ADD COLUMN refund_note text;
ALTER TABLE bookings ADD COLUMN refund_reviewed_at timestamptz;
