begin;

drop policy if exists sources_read on public.scientific_sources;
create policy sources_public_read on public.scientific_sources
  for select to anon using (active);
create policy sources_authenticated_read on public.scientific_sources
  for select to authenticated using (active or (select private.is_admin()));

commit;
