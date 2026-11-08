-- SETCHI Database Schema (run this in Supabase SQL Editor)

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_fa text not null,
  description text,
  description_fa text,
  category text not null,
  price integer not null,
  sizes text[] default '{}',
  colors text[] default '{}',
  images text[] default '{}',
  tags text[] default '{}',
  stock integer default 10,
  is_sold_out boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Outfits
create table if not exists outfits (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_fa text not null,
  description text,
  description_fa text,
  style text[] default '{}',
  occasion text[] default '{}',
  colors text[] default '{}',
  image text,
  estimated_price integer default 0,
  why_it_works text,
  why_it_works_fa text,
  tags text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Outfit items (relation between outfit and products)
create table if not exists outfit_items (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid references outfits(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  role text not null
);

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  style_preferences jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Favorites
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  outfit_id uuid references outfits(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, outfit_id)
);

-- Cart items
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  size text,
  color text,
  quantity integer default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id, size, color)
);

-- Enable RLS
alter table products enable row level security;
alter table outfits enable row level security;
alter table outfit_items enable row level security;
alter table profiles enable row level security;
alter table favorites enable row level security;
alter table cart_items enable row level security;

-- Public read for products & outfits
create policy "Public read products" on products for select using (is_active = true);
create policy "Public read outfits" on outfits for select using (is_active = true);
create policy "Public read outfit_items" on outfit_items for select using (true);

-- Profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Favorites
create policy "Users manage own favorites" on favorites for all using (auth.uid() = user_id);

-- Cart
create policy "Users manage own cart" on cart_items for all using (auth.uid() = user_id);

-- Admin policies (role = 'admin')
create policy "Admin full products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin full outfits" on outfits for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
