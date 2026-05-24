-- Mall Operations tables for Supabase (Postgres)

-- Zones
create table if not exists mall_zones (
  id serial primary key,
  name text not null,
  type text not null check (type in ('toilets','common_area','fnb_zone','retail_zone','parking','lobby','office','other')),
  floor text,
  area_sqm numeric(10,2),
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Staff
create table if not exists mall_staff (
  id serial primary key,
  name text not null,
  employee_id text not null unique,
  role text not null check (role in ('cleaner','supervisor','technician','manager')),
  phone text,
  email text,
  status text not null default 'active' check (status in ('active','inactive','on_leave')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Schedules
create table if not exists mall_schedules (
  id serial primary key,
  staff_id integer not null references mall_staff(id) on delete cascade,
  zone_id integer not null references mall_zones(id) on delete cascade,
  shift_type text not null check (shift_type in ('day','night','event')),
  task_type text not null check (task_type in ('routine','deep_cleaning','event_prep','emergency')),
  date timestamptz not null,
  start_time text not null,
  end_time text not null,
  status text not null default 'scheduled' check (status in ('scheduled','in_progress','completed','cancelled')),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Vendors
create table if not exists mall_vendors (
  id serial primary key,
  name text not null,
  contact_person text,
  phone text,
  email text,
  category text not null check (category in ('chemicals','tools','consumables','equipment','services','other')),
  rating integer,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Inventory
create table if not exists mall_inventory (
  id serial primary key,
  name text not null,
  category text not null check (category in ('chemicals','tools','consumables','equipment','other')),
  unit text not null,
  current_stock numeric(10,2) not null default 0,
  min_stock numeric(10,2) not null default 0,
  unit_price numeric(10,2) not null default 0,
  vendor_id integer references mall_vendors(id) on delete set null,
  surface_compatibility text,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Purchase Orders
create table if not exists mall_purchase_orders (
  id serial primary key,
  vendor_id integer not null references mall_vendors(id) on delete cascade,
  order_number text not null,
  status text not null default 'draft' check (status in ('draft','submitted','approved','delivered','cancelled')),
  total_amount numeric(12,2) not null default 0,
  notes text,
  ordered_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Purchase Order Items
create table if not exists mall_purchase_order_items (
  id serial primary key,
  order_id integer not null references mall_purchase_orders(id) on delete cascade,
  inventory_id integer not null references mall_inventory(id) on delete cascade,
  quantity numeric(10,2) not null,
  unit_price numeric(10,2) not null,
  total_price numeric(12,2) not null
);

-- Inspections
create table if not exists mall_inspections (
  id serial primary key,
  zone_id integer not null references mall_zones(id) on delete cascade,
  inspector_id integer references mall_staff(id) on delete set null,
  template_type text not null default 'general' check (template_type in ('washroom','high_touch','tenant_zone','general')),
  location text not null,
  surface_type text not null check (surface_type in ('stone','glass','metal','timber','tile','concrete','carpet','other')),
  issue_type text not null check (issue_type in ('crack','stain','wear','water_damage','mold','discoloration','scratch','other')),
  description text,
  photo_url text,
  severity_score integer check (severity_score between 1 and 10),
  recommended_action text check (recommended_action in ('clean','repair','replace','monitor','none')),
  risk_level text check (risk_level in ('low','medium','high','critical')),
  status text not null default 'open' check (status in ('open','in_progress','resolved','deferred')),
  resolved_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Chat Messages
create table if not exists mall_chat_messages (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz default now() not null
);

-- Auto-update updated_at trigger
create or replace function mall_update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to all tables with updated_at
do $$
declare
  t text;
begin
  for t in select unnest(array['mall_zones','mall_staff','mall_schedules','mall_vendors','mall_inventory','mall_purchase_orders','mall_inspections'])
  loop
    execute format('
      drop trigger if exists trg_updated_at on %I;
      create trigger trg_updated_at before update on %I
        for each row execute function mall_update_updated_at();
    ', t, t);
  end loop;
end;
$$;

-- RLS: enable on all tables, allow authenticated users
do $$
declare
  t text;
begin
  for t in select unnest(array['mall_zones','mall_staff','mall_schedules','mall_vendors','mall_inventory','mall_purchase_orders','mall_purchase_order_items','mall_inspections','mall_chat_messages'])
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('
      create policy "Authenticated users can do everything" on %I
        for all using (auth.role() = ''authenticated'')
        with check (auth.role() = ''authenticated'');
    ', t);
  end loop;
end;
$$;
