-- ============================================================
-- Georgia Gas Deals — Initial Schema
-- ============================================================


-- ============================================================
-- 1. SUPPLIERS
--    One row per certified Georgia gas provider.
-- ============================================================
CREATE TABLE suppliers (
  id            serial PRIMARY KEY,
  name          text NOT NULL UNIQUE,
  website       text,
  logo_url      text,
  affiliate_url text,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read suppliers"
  ON suppliers FOR SELECT USING (true);


-- ============================================================
-- 2. PLANS
--    Individual rate plans offered by a supplier.
-- ============================================================
CREATE TABLE plans (
  id              serial PRIMARY KEY,
  supplier_id     integer NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  plan_name       text NOT NULL,
  plan_type       text NOT NULL CHECK (plan_type IN ('fixed', 'variable')),
  rate_per_therm  numeric(6,4) NOT NULL,
  monthly_fee     numeric(6,2) NOT NULL DEFAULT 0,
  contract_months integer      NOT NULL DEFAULT 0,
  affiliate_url   text,          -- overrides supplier affiliate_url when set
  badge           text,          -- e.g. "Best Value", "Most Popular"
  active          boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active plans"
  ON plans FOR SELECT USING (active = true);


-- ============================================================
-- 3. RATES VIEW
--    Joins plans + suppliers into the flat shape that
--    getRates.ts already expects. No app-code changes needed.
-- ============================================================
CREATE VIEW rates AS
SELECT
  p.id,
  s.name                                          AS provider,
  p.plan_name,
  p.plan_type,
  p.rate_per_therm,
  p.monthly_fee,
  p.contract_months,
  COALESCE(p.affiliate_url, s.affiliate_url, '#') AS affiliate_url,
  p.badge,
  p.active
FROM plans p
JOIN suppliers s ON s.id = p.supplier_id;


-- ============================================================
-- 4. RATE ALERTS
--    Users subscribe to be notified when rates drop below a
--    threshold. No personal data is shown publicly.
-- ============================================================
CREATE TABLE rate_alerts (
  id             serial PRIMARY KEY,
  email          text NOT NULL,
  zip_code       text,
  threshold_rate numeric(6,4),
  plan_type      text CHECK (plan_type IN ('fixed', 'variable', 'any')),
  active         boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rate_alerts ENABLE ROW LEVEL SECURITY;
-- Anyone can subscribe; no one can read others' alerts.
CREATE POLICY "anon insert rate_alerts"
  ON rate_alerts FOR INSERT WITH CHECK (true);


-- ============================================================
-- 5. BLOG POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id           serial PRIMARY KEY,
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  content      text,
  excerpt      text,
  published    boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published posts"
  ON blog_posts FOR SELECT USING (published = true);


-- ============================================================
-- 6. RATE HISTORY
--    Snapshot of a plan's rate each time rates are updated.
-- ============================================================
CREATE TABLE rate_history (
  id             serial PRIMARY KEY,
  plan_id        integer NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  rate_per_therm numeric(6,4) NOT NULL,
  monthly_fee    numeric(6,2) NOT NULL DEFAULT 0,
  recorded_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rate_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read rate_history"
  ON rate_history FOR SELECT USING (true);


-- ============================================================
-- 7. SITE SETTINGS
--    Key/value store for admin-controlled site config.
-- ============================================================
CREATE TABLE site_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_settings"
  ON site_settings FOR SELECT USING (true);


-- ============================================================
-- 8. SEED: SUPPLIERS
--    Only the 9 approved providers. Rates (plans) added later.
-- ============================================================
INSERT INTO suppliers (name) VALUES
  ('Gas South'),
  ('Stream Energy'),
  ('True Natural Gas'),
  ('SCANA Energy'),
  ('Constellation'),
  ('Fuel Georgia'),
  ('XOOM Energy'),
  ('Walton EMC Natural Gas'),
  ('Town Square');
