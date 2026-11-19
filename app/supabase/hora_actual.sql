-- Se pega una vez en el editor SQL de Supabase.
create or replace function public.hora_actual()
returns timestamptz
language sql
stable
as $$ select now(); $$;

grant execute on function public.hora_actual() to anon;
