-- Contact request intake schema.
-- Apply to the Cloudflare D1 database with:
--   npm run db:contact:schema

CREATE TABLE IF NOT EXISTS contact_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_requests_type_created ON contact_requests(contact_type, created_at);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status_created ON contact_requests(status, created_at);
