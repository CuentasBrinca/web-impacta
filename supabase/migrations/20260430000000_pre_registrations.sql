-- Impacta IA · Pre-registrations table
--
-- Stores leads from the public landing page form. Writes happen via a
-- Next.js Server Action using the SERVICE_ROLE key (bypasses RLS).
-- Public anon role is denied at RLS so the table cannot be read or
-- modified from the browser.

create extension if not exists "pgcrypto";

create table public.pre_registrations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  nombre          text  not null check (length(nombre)  between 1 and 200),
  email           text  not null check (length(email)   between 3 and 320),
  empresa         text  not null check (length(empresa) between 1 and 200),
  cargo           text  not null check (length(cargo)   between 1 and 200),
  -- Mirrors content.formInteresOptions in src/lib/content.ts
  interes         text  not null check (interes in ('Asistir', 'Speaker', 'Sponsor', 'Media')),
  consent         boolean not null,
  source          text,                          -- e.g. 'landing-hero-cta', 'landing-form'
  utm             jsonb,                         -- raw UTM params at submit time
  user_agent      text,
  ip_hash         text,                          -- hashed (not the IP itself) for rate-limit & dedup signal
  -- Operational fields
  status          text  not null default 'new'
                  check (status in ('new', 'contacted', 'confirmed', 'rejected', 'spam')),
  notes           text
);

-- Email is unique-per-event (prevents accidental double-submit; allows duplicates only with status='spam' if ever needed)
create unique index pre_registrations_email_key on public.pre_registrations (lower(email));

-- Useful query indexes
create index pre_registrations_created_at_idx on public.pre_registrations (created_at desc);
create index pre_registrations_interes_idx   on public.pre_registrations (interes);
create index pre_registrations_status_idx    on public.pre_registrations (status);

comment on table  public.pre_registrations         is 'Pre-registrations submitted from the Impacta IA landing page.';
comment on column public.pre_registrations.consent is 'Explicit consent per Ley 21.719 (Chile data protection).';
comment on column public.pre_registrations.ip_hash is 'SHA-256 of (ip + secret salt). Never store raw IPs.';
comment on column public.pre_registrations.source  is 'Which CTA / surface triggered the submit.';

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.pre_registrations enable row level security;

-- No policies created → anon and authenticated roles get zero access by default.
-- The Server Action uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS entirely.

-- Optional: allow the dashboard 'authenticated' role (logged-in admins) to read.
-- Uncomment if you want the Supabase dashboard table editor to work for non-owner users.
-- create policy "authenticated_select" on public.pre_registrations
--   for select to authenticated using (true);
