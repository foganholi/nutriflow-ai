begin;

alter table public.nutrition_preferences
  add column training_frequency int check (training_frequency between 0 and 14),
  add column training_type text check (char_length(training_type) <= 150);

alter table public.shopping_list_items
  add column purchased boolean not null default false;

create table public.educational_contents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  summary text not null check (char_length(summary) between 10 and 1000),
  body text not null check (char_length(body) between 30 and 12000),
  reading_minutes int not null default 3 check (reading_minutes between 1 and 60),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.educational_contents enable row level security;
alter table public.educational_contents force row level security;

create policy educational_public_read on public.educational_contents
  for select to anon using (active);
create policy educational_authenticated_read on public.educational_contents
  for select to authenticated using (active or (select private.is_admin()));
create policy educational_admin_insert on public.educational_contents
  for insert to authenticated with check ((select private.is_admin()));
create policy educational_admin_update on public.educational_contents
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy educational_admin_delete on public.educational_contents
  for delete to authenticated using ((select private.is_admin()));

grant select on public.educational_contents to anon, authenticated;
grant insert, update, delete on public.educational_contents to authenticated;

create trigger educational_contents_updated before update on public.educational_contents
  for each row execute procedure private.set_updated_at();

create table private.action_rate_events (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  action text not null,
  created_at timestamptz not null default now()
);
revoke all on private.action_rate_events from public, anon, authenticated;
create index action_rate_events_lookup_idx
  on private.action_rate_events(user_id, action, created_at desc);

create or replace function private.enforce_write_limits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := (select auth.uid());
  event_action text;
  hourly_limit int;
  recent_count int;
  current_plan public.subscription_plan;
begin
  if caller is null then return new; end if;
  if new.user_id <> caller then
    raise exception 'invalid owner' using errcode = '42501';
  end if;

  if tg_table_name = 'meal_plans' then
    event_action := 'generate_meal_plan';
    hourly_limit := 10;
    select plan into current_plan from public.subscriptions where user_id = caller;
    if coalesce(current_plan, 'free'::public.subscription_plan) = 'free'
      and exists (
        select 1 from public.meal_plans
        where user_id = caller and created_at >= now() - interval '7 days'
      )
    then
      raise exception 'weekly plan limit reached' using errcode = 'P0001';
    end if;
  elsif tg_table_name = 'progress_logs' then
    event_action := 'create_progress_log';
    hourly_limit := 30;
  else
    return new;
  end if;

  select count(*) into recent_count
  from private.action_rate_events
  where user_id = caller and action = event_action and created_at >= now() - interval '1 hour';

  if recent_count >= hourly_limit then
    raise exception 'rate limit exceeded' using errcode = 'P0001';
  end if;

  insert into private.action_rate_events(user_id, action) values(caller, event_action);
  return new;
end $$;
revoke all on function private.enforce_write_limits() from public, anon, authenticated;

create trigger meal_plans_write_limits before insert on public.meal_plans
  for each row execute procedure private.enforce_write_limits();
create trigger progress_logs_write_limits before insert on public.progress_logs
  for each row execute procedure private.enforce_write_limits();

insert into public.educational_contents(title, slug, summary, body, reading_minutes) values
('Como montar um prato equilibrado', 'prato-equilibrado', 'Uma estrutura simples para combinar vegetais, proteínas, cereais, raízes e feijões.', 'Não existe um único prato perfeito. Uma referência prática é incluir variedade de vegetais, uma fonte de proteína, cereais ou raízes e feijões. Ajuste quantidades conforme fome, rotina, cultura, acesso e orientação profissional quando necessária.', 3),
('Calorias e qualidade alimentar', 'calorias-e-qualidade', 'Energia importa, mas fibras, saciedade, variedade e processamento também contam.', 'Calorias representam energia, mas não descrevem sozinhas a qualidade da alimentação. Alimentos com fibras, proteínas e maior variedade de nutrientes podem contribuir para saciedade e adequação. Evite transformar estimativas em regras rígidas.', 3),
('Proteínas no dia a dia', 'proteinas-no-dia-a-dia', 'Como distribuir fontes de proteína de forma prática ao longo das refeições.', 'Feijões, lentilhas, grão-de-bico, ovos, leite, carnes, peixes e alternativas vegetais podem compor a rotina. Distribuir fontes entre refeições pode facilitar a adequação, respeitando preferências, orçamento e restrições.', 3),
('Por que fibras importam', 'importancia-das-fibras', 'Frutas, hortaliças, feijões e cereais integrais apoiam saciedade e saúde intestinal.', 'Aumente fibras gradualmente e mantenha hidratação adequada. Necessidades e tolerância variam. Sintomas persistentes ou condições gastrointestinais precisam de avaliação profissional.', 3),
('Hidratação sem complicação', 'hidratacao', 'Necessidades de água variam com clima, atividade física, alimentação e saúde.', 'A estimativa do aplicativo é apenas um ponto de partida. Observe sede, rotina e condições individuais. Algumas doenças e medicamentos alteram necessidades de líquidos e exigem orientação profissional.', 3),
('Cuidado com dietas milagrosas', 'dietas-milagrosas', 'Promessas rápidas, exclusões amplas e regras rígidas merecem cautela.', 'Resultados sustentáveis costumam ser graduais. Desconfie de promessas garantidas, listas extensas de alimentos proibidos e suplementos apresentados como cura. Procure profissionais habilitados para necessidades individuais.', 4),
('Alimentação saudável com baixo orçamento', 'alimentacao-economica', 'Planejamento, alimentos da estação e preparos básicos ajudam a reduzir custos.', 'Arroz, feijão, ovos, frango, sardinha, raízes, verduras da estação e frutas locais podem compor refeições variadas. Planeje compras, aproveite integralmente os alimentos e reduza desperdícios.', 4),
('Ultraprocessados no cotidiano', 'ultraprocessados', 'Entenda como reconhecer produtos ultraprocessados e reduzir sua frequência.', 'Listas longas de ingredientes e aditivos de uso industrial podem indicar ultraprocessamento. Não é necessário buscar perfeição: priorize alimentos in natura e preparações culinárias na maior parte da rotina.', 4)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  reading_minutes = excluded.reading_minutes;

commit;
