begin;

grant insert, update, delete on public.food_database to authenticated;
grant insert, update, delete on public.scientific_sources to authenticated;

commit;
