-- kefiw telemetry schema — apply with:
--   pnpm wrangler d1 execute kefiw-telemetry --file=schema.sql --remote

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  tool_id TEXT,
  cluster_id TEXT,
  risk_tier TEXT,
  zone_id TEXT,
  event_type TEXT NOT NULL,
  ts INTEGER NOT NULL,
  viewport_w INTEGER,
  country TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_cluster_type ON events(cluster_id, event_type);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts);

CREATE TABLE IF NOT EXISTS consent (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  action TEXT NOT NULL,
  tcf_string TEXT,
  gpp_string TEXT,
  ts INTEGER NOT NULL,
  country TEXT
);

CREATE INDEX IF NOT EXISTS idx_consent_session ON consent(session_id);
CREATE INDEX IF NOT EXISTS idx_consent_ts ON consent(ts);
