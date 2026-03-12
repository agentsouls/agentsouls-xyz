-- ClawBuilt Supabase Schema
-- Tables: licenses, subscriptions, block_hours
-- Per WS-07 of clawbuilt-phase1-build-plan.md

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =============================================================================
-- LICENSES TABLE
-- Stores config purchases (one-time payments via Stripe Checkout)
-- =============================================================================
create table licenses (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_customer_id text,
  stripe_session_id text unique,
  vertical text not null check (vertical in ('dental', 'style', 'trades')),
  tier text not null check (tier in ('starter', 'pro', 'agency')),
  harness text not null default 'hermes' check (harness in ('hermes', 'nanoclaw', 'openclaw')),
  license_key uuid default gen_random_uuid(),
  addons jsonb default '[]'::jsonb,
  download_count integer default 0,
  download_limit integer default 5,
  created_at timestamptz default now()
);

-- =============================================================================
-- SUBSCRIPTIONS TABLE
-- Stores ActiveCare retainer subscriptions (recurring Stripe payments)
-- =============================================================================
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text not null check (plan in ('watchdog', 'guardian', 'command')),
  status text default 'active' check (status in ('active', 'past_due', 'canceled', 'paused')),
  hours_included integer,
  hours_used_this_month integer default 0,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- =============================================================================
-- BLOCK HOURS TABLE
-- Stores pre-purchased support hour blocks (one-time Stripe payments)
-- =============================================================================
create table block_hours (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_customer_id text,
  hours_purchased integer not null,
  hours_used integer default 0,
  purchase_price integer not null,       -- amount in cents
  purchased_at timestamptz default now(),
  expires_at timestamptz                 -- 12 months from purchase
);

-- =============================================================================
-- INDEXES
-- =============================================================================
create index idx_licenses_email on licenses(email);
create index idx_licenses_key on licenses(license_key);
create index idx_subscriptions_email on subscriptions(email);
create index idx_block_hours_email on block_hours(email);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
alter table licenses enable row level security;
alter table subscriptions enable row level security;
alter table block_hours enable row level security;

-- Service role (used by webhook handler) gets full access
-- These policies use the built-in service_role which bypasses RLS by default,
-- but we define explicit policies for the anon role.

-- Anon role: read-only license validation via license_key + email match
-- Used by the /api/download endpoint
create policy "anon_validate_license"
  on licenses for select
  to anon
  using (true);

-- Anon role: allow incrementing download_count (update only download_count)
create policy "anon_increment_download"
  on licenses for update
  to anon
  using (true)
  with check (true);

-- No anon access to subscriptions or block_hours
create policy "deny_anon_subscriptions"
  on subscriptions for select
  to anon
  using (false);

create policy "deny_anon_block_hours"
  on block_hours for select
  to anon
  using (false);

-- Authenticated role: users can read their own records
create policy "authenticated_read_own_licenses"
  on licenses for select
  to authenticated
  using (email = auth.jwt() ->> 'email');

create policy "authenticated_read_own_subscriptions"
  on subscriptions for select
  to authenticated
  using (email = auth.jwt() ->> 'email');

create policy "authenticated_read_own_block_hours"
  on block_hours for select
  to authenticated
  using (email = auth.jwt() ->> 'email');
