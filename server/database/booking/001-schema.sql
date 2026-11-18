-- Apply to a dedicated PostgreSQL database, never to an existing production database.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE boats (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  capacity integer NOT NULL CHECK (capacity BETWEEN 1 AND 11)
);

CREATE TABLE booking_days (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  boat_id bigint NOT NULL REFERENCES boats(id),
  day date NOT NULL,
  is_open boolean NOT NULL DEFAULT false,
  UNIQUE (boat_id, day),
  UNIQUE (id, boat_id)
);

CREATE TABLE trips (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  day_id bigint NOT NULL,
  boat_id bigint NOT NULL REFERENCES boats(id),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL CHECK (ends_at > starts_at),
  route text CHECK (route IN ('russkaya', 'starichkov', 'fishing')),
  kind text NOT NULL DEFAULT 'shared' CHECK (kind IN ('shared', 'private')),
  confirmation text NOT NULL DEFAULT 'pending' CHECK (confirmation IN ('pending', 'confirmed', 'cancelled')),
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (day_id, boat_id) REFERENCES booking_days(id, boat_id),
  EXCLUDE USING gist (boat_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
    WHERE (confirmation <> 'cancelled')
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY,
  trip_id bigint NOT NULL REFERENCES trips(id),
  guests integer NOT NULL CHECK (guests BETWEEN 1 AND 11),
  route text NOT NULL CHECK (route IN ('russkaya', 'starichkov', 'fishing')),
  name text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL CHECK (status IN ('held', 'paid', 'manual_confirmed', 'expired', 'cancelled', 'payment_review')),
  hold_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status <> 'held' OR hold_expires_at IS NOT NULL)
);

CREATE TABLE payments (
  id uuid PRIMARY KEY,
  booking_id uuid NOT NULL REFERENCES bookings(id),
  provider text NOT NULL,
  provider_payment_id text UNIQUE,
  amount_kopecks integer NOT NULL CHECK (amount_kopecks > 0),
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE booking_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX bookings_trip_status ON bookings(trip_id, status);
