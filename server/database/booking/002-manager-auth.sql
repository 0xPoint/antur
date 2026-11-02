CREATE TABLE manager_login_guard (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  failures integer NOT NULL DEFAULT 0 CHECK (failures >= 0),
  locked_until timestamptz
);
INSERT INTO manager_login_guard(id) VALUES(true);
