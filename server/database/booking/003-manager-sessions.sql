CREATE TABLE manager_sessions (
  id uuid PRIMARY KEY,
  username text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX manager_sessions_expires_at ON manager_sessions(expires_at);
