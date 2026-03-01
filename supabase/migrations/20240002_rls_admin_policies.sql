-- ============================================================
-- Admin write policies for all tables
-- + fix rates view security
--
-- Admin role is granted by setting app_metadata = {"role": "admin"}
-- on a user via the Supabase dashboard or service-role API.
-- app_metadata is server-set and cannot be spoofed by users.
-- ============================================================


-- ============================================================
-- SUPPLIERS
-- ============================================================
CREATE POLICY "admin insert suppliers"
  ON suppliers FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin update suppliers"
  ON suppliers FOR UPDATE
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin delete suppliers"
  ON suppliers FOR DELETE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ============================================================
-- PLANS
-- ============================================================
CREATE POLICY "admin insert plans"
  ON plans FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin update plans"
  ON plans FOR UPDATE
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin delete plans"
  ON plans FOR DELETE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ============================================================
-- RATE ALERTS
-- Drop the open anon-insert policy; admin manages these.
-- No public SELECT — alerts contain email addresses (PII).
-- ============================================================
DROP POLICY IF EXISTS "anon insert rate_alerts" ON rate_alerts;

CREATE POLICY "admin all rate_alerts"
  ON rate_alerts FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ============================================================
-- BLOG POSTS
-- Public can read published posts (existing policy).
-- Admin can read drafts + full write access.
-- ============================================================
CREATE POLICY "admin read all blog_posts"
  ON blog_posts FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin insert blog_posts"
  ON blog_posts FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin update blog_posts"
  ON blog_posts FOR UPDATE
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin delete blog_posts"
  ON blog_posts FOR DELETE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ============================================================
-- RATE HISTORY
-- ============================================================
CREATE POLICY "admin insert rate_history"
  ON rate_history FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin update rate_history"
  ON rate_history FOR UPDATE
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin delete rate_history"
  ON rate_history FOR DELETE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE POLICY "admin insert site_settings"
  ON site_settings FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin update site_settings"
  ON site_settings FOR UPDATE
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin delete site_settings"
  ON site_settings FOR DELETE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ============================================================
-- RATES VIEW — fix "unrestricted" warning
-- Recreate with security_invoker = true so the view runs
-- with the caller's permissions instead of the owner's,
-- meaning the underlying plans + suppliers RLS is enforced.
-- ============================================================
DROP VIEW IF EXISTS rates;

CREATE VIEW rates
  WITH (security_invoker = true)
AS
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
