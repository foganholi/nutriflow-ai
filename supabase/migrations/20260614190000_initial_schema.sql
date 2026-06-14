begin;

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.app_role as enum ('user', 'admin');
create type public.subscription_plan as enum ('free', 'premium', 'professional');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (char_length(full_name) between 2 and 100),
  birth_date date,
  age int check (age between 14 and 120),
  sex text check (sex in ('female','male','not_informed')),
  height_cm numeric(5,2) check (height_cm between 120 and 230),
  current_weight_kg numeric(6,2) check (current_weight_kg between 30 and 350),
  target_weight_kg numeric(6,2) check (target_weight_kg between 30 and 350),
  goal text,
  activity_level text,
  role public.app_role not null default 'user',
  consent_lgpd boolean not null default false,
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.nutrition_preferences (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,
  allergies text[] not null default '{}', restrictions text[] not null default '{}',
  disliked_foods text[] not null default '{}', preferred_foods text[] not null default '{}',
  budget_level text check (budget_level in ('low','medium','high')),
  cooking_time text check (cooking_time in ('little','medium','plenty')),
  meals_per_day int check (meals_per_day between 3 and 6), country_region text,
  brazilian_food_mode boolean not null default true, special_condition boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.meal_plans (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, objective text, total_calories numeric check (total_calories between 1200 and 6000),
  protein_g numeric check (protein_g >= 0), carbs_g numeric check (carbs_g >= 0), fat_g numeric check (fat_g >= 0),
  safety_notes text, source_notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.meal_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  meal_plan_id uuid not null references public.meal_plans(id) on delete cascade, meal_name text not null,
  food_name text not null, quantity text not null, calories numeric check (calories >= 0),
  protein_g numeric check (protein_g >= 0), carbs_g numeric check (carbs_g >= 0), fat_g numeric check (fat_g >= 0),
  notes text, created_at timestamptz not null default now()
);
create table public.shopping_lists (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  meal_plan_id uuid references public.meal_plans(id) on delete cascade, title text not null,
  budget_mode text check (budget_mode in ('economic','balanced','premium')), created_at timestamptz not null default now()
);
create table public.shopping_list_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  shopping_list_id uuid not null references public.shopping_lists(id) on delete cascade, category text not null,
  item_name text not null, quantity text, estimated_price numeric check (estimated_price >= 0), created_at timestamptz not null default now()
);
create table public.progress_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric(6,2) check (weight_kg between 30 and 350), waist_cm numeric(6,2) check (waist_cm between 30 and 250),
  energy_level int check (energy_level between 1 and 5), mood text, hunger_level int check (hunger_level between 1 and 5),
  notes text check (char_length(notes) <= 1000), created_at timestamptz not null default now()
);
create table public.habits (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 100), description text check (char_length(description) <= 500),
  frequency text not null default 'daily', active boolean not null default true, created_at timestamptz not null default now()
);
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade, completed boolean not null default false,
  log_date date not null default current_date, created_at timestamptz not null default now(), unique(habit_id, log_date)
);
create table public.favorite_foods (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  food_name text not null, notes text check (char_length(notes) <= 500), created_at timestamptz not null default now(),
  unique(user_id, food_name)
);
create table public.food_database (
  id uuid primary key default gen_random_uuid(), name text not null unique, category text not null,
  calories numeric check (calories >= 0), protein_g numeric check (protein_g >= 0), carbs_g numeric check (carbs_g >= 0),
  fat_g numeric check (fat_g >= 0), fiber_g numeric check (fiber_g >= 0), source text not null, created_at timestamptz not null default now()
);
create table public.scientific_sources (
  id uuid primary key default gen_random_uuid(), title text not null, organization text not null, url text not null,
  summary text not null, usage_notes text, active boolean not null default true, created_at timestamptz not null default now()
);
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,
  plan public.subscription_plan not null default 'free', status text not null default 'active',
  provider_customer_id text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  action text not null, entity text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now(),
  constraint audit_metadata_size check (octet_length(metadata::text) <= 2048)
);

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'admin') $$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end $$;

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles(id, full_name) values(new.id, left(coalesce(new.raw_user_meta_data->>'full_name','Usuario'),100));
  insert into public.subscriptions(user_id) values(new.id);
  return new;
end $$;
revoke all on function private.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure private.handle_new_user();

create or replace function private.enforce_parent_owner()
returns trigger language plpgsql set search_path = ''
as $$
declare owner_id uuid;
begin
  if tg_table_name = 'meal_items' then select user_id into owner_id from public.meal_plans where id = new.meal_plan_id;
  elsif tg_table_name = 'shopping_list_items' then select user_id into owner_id from public.shopping_lists where id = new.shopping_list_id;
  elsif tg_table_name = 'habit_logs' then select user_id into owner_id from public.habits where id = new.habit_id;
  end if;
  if owner_id is null or owner_id <> new.user_id then raise exception 'invalid owner relation' using errcode='42501'; end if;
  return new;
end $$;
revoke all on function private.enforce_parent_owner() from public, anon, authenticated;
create trigger meal_items_owner before insert or update on public.meal_items for each row execute procedure private.enforce_parent_owner();
create trigger shopping_items_owner before insert or update on public.shopping_list_items for each row execute procedure private.enforce_parent_owner();
create trigger habit_logs_owner before insert or update on public.habit_logs for each row execute procedure private.enforce_parent_owner();

do $$ declare t text; begin
  foreach t in array array['profiles','nutrition_preferences','meal_plans','meal_items','shopping_lists','shopping_list_items','progress_logs','habits','habit_logs','favorite_foods','food_database','scientific_sources','subscriptions','audit_logs']
  loop execute format('alter table public.%I enable row level security', t); execute format('alter table public.%I force row level security', t); end loop;
end $$;

create policy profiles_select on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create or replace function private.protect_profile_role()
returns trigger language plpgsql set search_path = ''
as $$ begin
  if new.role <> old.role then raise exception 'role cannot be changed by client' using errcode='42501'; end if;
  new.id = old.id;
  return new;
end $$;
revoke all on function private.protect_profile_role() from public, anon, authenticated;
create trigger protect_profile_role before update on public.profiles for each row execute procedure private.protect_profile_role();

do $$ declare t text; begin
  foreach t in array array['nutrition_preferences','meal_plans','meal_items','shopping_lists','shopping_list_items','progress_logs','habits','habit_logs','favorite_foods']
  loop
    execute format('create policy %I_select on public.%I for select to authenticated using (user_id = (select auth.uid()))', t, t);
    execute format('create policy %I_insert on public.%I for insert to authenticated with check (user_id = (select auth.uid()))', t, t);
    execute format('create policy %I_update on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t, t);
    execute format('create policy %I_delete on public.%I for delete to authenticated using (user_id = (select auth.uid()))', t, t);
  end loop;
end $$;

create policy subscriptions_select on public.subscriptions for select to authenticated using (user_id = (select auth.uid()));
create policy food_read on public.food_database for select to anon, authenticated using (true);
create policy food_admin_insert on public.food_database for insert to authenticated with check ((select private.is_admin()));
create policy food_admin_update on public.food_database for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy food_admin_delete on public.food_database for delete to authenticated using ((select private.is_admin()));
create policy sources_public_read on public.scientific_sources for select to anon using (active);
create policy sources_authenticated_read on public.scientific_sources for select to authenticated using (active or (select private.is_admin()));
create policy sources_admin_insert on public.scientific_sources for insert to authenticated with check ((select private.is_admin()));
create policy sources_admin_update on public.scientific_sources for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy sources_admin_delete on public.scientific_sources for delete to authenticated using ((select private.is_admin()));
create policy audit_admin_read on public.audit_logs for select to authenticated using ((select private.is_admin()));

revoke all on all tables in schema public from anon, authenticated;
grant select on public.food_database, public.scientific_sources to anon;
grant select, insert, update, delete on public.profiles, public.nutrition_preferences, public.meal_plans, public.meal_items,
 public.shopping_lists, public.shopping_list_items, public.progress_logs, public.habits, public.habit_logs, public.favorite_foods to authenticated;
grant select on public.food_database, public.scientific_sources, public.subscriptions to authenticated;

create trigger profiles_updated before update on public.profiles for each row execute procedure private.set_updated_at();
create trigger preferences_updated before update on public.nutrition_preferences for each row execute procedure private.set_updated_at();
create trigger meal_plans_updated before update on public.meal_plans for each row execute procedure private.set_updated_at();
create trigger subscriptions_updated before update on public.subscriptions for each row execute procedure private.set_updated_at();

create index meal_plans_user_idx on public.meal_plans(user_id, created_at desc);
create index meal_items_user_idx on public.meal_items(user_id);
create index meal_items_plan_idx on public.meal_items(meal_plan_id);
create index shopping_lists_user_idx on public.shopping_lists(user_id);
create index shopping_lists_plan_idx on public.shopping_lists(meal_plan_id);
create index shopping_list_items_user_idx on public.shopping_list_items(user_id);
create index shopping_list_items_list_idx on public.shopping_list_items(shopping_list_id);
create index progress_logs_user_idx on public.progress_logs(user_id, created_at desc);
create index habits_user_idx on public.habits(user_id);
create index habit_logs_user_date_idx on public.habit_logs(user_id, log_date desc);
create index audit_logs_user_idx on public.audit_logs(user_id);
create index audit_logs_created_idx on public.audit_logs(created_at desc);

commit;
