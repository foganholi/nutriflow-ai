# Políticas RLS

As políticas são versionadas na migration inicial. Tabelas privadas usam `auth.uid()` e `WITH CHECK`.
Triggers validam que filhos (`meal_items`, `shopping_list_items`, `habit_logs`) pertencem ao mesmo usuário do registro pai.
A role administrativa vem de `profiles.role`, nunca de `raw_user_meta_data`.
