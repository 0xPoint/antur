CREATE TABLE booking_month_versions (
  boat_id bigint NOT NULL REFERENCES boats(id),
  month date NOT NULL CHECK (extract(day FROM month) = 1),
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  PRIMARY KEY (boat_id, month)
);
