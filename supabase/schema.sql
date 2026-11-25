-- ==============================================================================
-- AVUTHAPURAM SHIVA REAL ESTATE — Supabase PostgreSQL Schema & Storage Setup
-- Run this script in your Supabase SQL Editor to enable persistent properties,
-- enquiries, and image uploads.
-- ==============================================================================

create extension if not exists "pgcrypto";

-- 1. Properties Table
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  location_area text not null,
  locality text not null default 'Ibrahimpatnam, Janaharsha Dream City',
  state text not null default 'Telangana',
  property_type text not null default 'Residential Open Plot',
  plot_dimensions text not null,
  area_sq_yards numeric(10, 2),
  facing text not null default 'To be confirmed',
  road_width text not null default 'To be confirmed',
  price_inr numeric(14, 2),
  price_display text,
  status text not null default 'Available'
    check (status in ('Available', 'Limited Availability', 'Reserved', 'Sold')),
  documentation_summary text not null default 'Documentation details shared upon verified enquiry.',
  description text not null,
  highlights jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_sample boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_published_featured
  on public.properties (is_published, is_featured, created_at desc);

create index if not exists idx_properties_status
  on public.properties (status);

-- 2. Enquiries Table
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  property_title text,
  enquiry_type text not null default 'General Enquiry'
    check (enquiry_type in ('General Enquiry', 'Property Enquiry', 'Buying Assistance', 'Selling Assistance', 'Site Visit')),
  full_name text not null,
  phone text not null,
  email text not null default '',
  preferred_contact text not null default 'Phone / WhatsApp',
  message text not null,
  status text not null default 'New'
    check (status in ('New', 'In Review', 'Contacted', 'Archived')),
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_enquiries_status_created
  on public.enquiries (status, created_at desc);

-- 3. Updated-at Trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated_at on public.properties;
create trigger trg_properties_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

drop trigger if exists trg_enquiries_updated_at on public.enquiries;
create trigger trg_enquiries_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

-- 4. Row Level Security (RLS)
alter table public.properties enable row level security;
alter table public.enquiries enable row level security;

-- Public read access only for published properties
drop policy if exists "Public can view published properties" on public.properties;
create policy "Public can view published properties"
  on public.properties for select
  using (is_published = true);

-- Note: Admin writes & Enquiry reads/writes are executed server-side via Next.js API
-- routes using SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS safely on the server.
-- Public anonymous inserts to enquiries can also be permitted if needed, though
-- Next.js /api/enquiries validates and inserts server-side.

-- 5. Storage Bucket for Property Images
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read property images" on storage.objects;
create policy "Public read property images"
  on storage.objects for select
  using (bucket_id = 'property-images');

