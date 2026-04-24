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

-- Daily Kefiw leaderboard. One row = one player's result for one game on one day.
-- Unique per (daily_date, game_id, device_hash) — resubmissions overwrite.
CREATE TABLE IF NOT EXISTS daily_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  daily_date TEXT NOT NULL,         -- ISO YYYY-MM-DD (ET 4am rollover)
  game_id TEXT NOT NULL,            -- 'hunt' | 'hive' | 'sudoku' | ...
  device_hash TEXT NOT NULL,        -- client-generated stable hash (Φ4)
  handle TEXT,                      -- display name (nullable)
  cleared INTEGER NOT NULL,         -- 0/1
  -- Generic payload fields — each game uses a subset
  guesses INTEGER,                  -- hunt
  points INTEGER,                   -- hive
  tier TEXT,                        -- hive
  time_sec INTEGER,                 -- sudoku
  integrity TEXT,                   -- HMAC from Φ7 (optional)
  submitted_at INTEGER NOT NULL,
  country TEXT,
  UNIQUE (daily_date, game_id, device_hash)
);

CREATE INDEX IF NOT EXISTS idx_daily_scores_day_game ON daily_scores(daily_date, game_id);
CREATE INDEX IF NOT EXISTS idx_daily_scores_device ON daily_scores(device_hash);

-- Daily Kefiw streak snapshot. One row = one pipeline run on one day.
CREATE TABLE IF NOT EXISTS daily_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  daily_date TEXT NOT NULL,
  pipeline_id TEXT NOT NULL,        -- 'core' | future pipelines
  device_hash TEXT NOT NULL,
  handle TEXT,
  cleared INTEGER NOT NULL,         -- 0/1 — all games in pipeline cleared
  streak_days INTEGER,              -- client-reported streak at time of submit
  submitted_at INTEGER NOT NULL,
  country TEXT,
  UNIQUE (daily_date, pipeline_id, device_hash)
);

CREATE INDEX IF NOT EXISTS idx_daily_runs_day_pipeline ON daily_runs(daily_date, pipeline_id);
CREATE INDEX IF NOT EXISTS idx_daily_runs_device ON daily_runs(device_hash);
