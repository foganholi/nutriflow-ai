begin;

drop policy if exists food_admin_all on public.food_database;
create policy food_admin_insert on public.food_database
  for insert to authenticated with check ((select private.is_admin()));
create policy food_admin_update on public.food_database
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy food_admin_delete on public.food_database
  for delete to authenticated using ((select private.is_admin()));

drop policy if exists sources_admin_all on public.scientific_sources;
create policy sources_admin_insert on public.scientific_sources
  for insert to authenticated with check ((select private.is_admin()));
create policy sources_admin_update on public.scientific_sources
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy sources_admin_delete on public.scientific_sources
  for delete to authenticated using ((select private.is_admin()));

create index if not exists meal_items_user_idx on public.meal_items(user_id);
create index if not exists meal_items_plan_idx on public.meal_items(meal_plan_id);
create index if not exists shopping_lists_user_idx on public.shopping_lists(user_id);
create index if not exists shopping_lists_plan_idx on public.shopping_lists(meal_plan_id);
create index if not exists shopping_list_items_user_idx on public.shopping_list_items(user_id);
create index if not exists shopping_list_items_list_idx on public.shopping_list_items(shopping_list_id);
create index if not exists habits_user_idx on public.habits(user_id);
create index if not exists audit_logs_user_idx on public.audit_logs(user_id);

commit;
