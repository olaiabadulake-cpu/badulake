-- Lista de interés «VIP» y «BaduCoins» (Tarea 17, D-030). Solo se mide el interés: no hay cobros
-- ni nada que funcione (D-012). Cada persona solo ve, crea y borra lo suyo; el equipo ve agregados.

create table public.interes (
  persona uuid not null default auth.uid() references auth.users(id) on delete cascade,
  opcion text not null check (opcion in ('vip', 'baducoins')),
  fecha timestamptz not null default now(),
  primary key (persona, opcion)
);

alter table public.interes enable row level security;

create policy "interes: ver lo propio" on public.interes
  for select to authenticated using (persona = auth.uid());
create policy "interes: crear lo propio" on public.interes
  for insert to authenticated with check (persona = auth.uid());
create policy "interes: borrar lo propio" on public.interes
  for delete to authenticated using (persona = auth.uid());

revoke all on public.interes from anon;

-- Recuento por opción para el panel del equipo: solo números.
create function public.equipo_interes()
returns table (opcion text, personas int)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.soy_equipo() then
    raise exception 'Badulake: solo el equipo' using errcode = 'insufficient_privilege';
  end if;
  return query
    select o.opcion, (select count(*)::int from public.interes i where i.opcion = o.opcion)
    from (values ('vip'), ('baducoins')) as o(opcion);
end $$;

revoke execute on function public.equipo_interes() from public, anon;
grant execute on function public.equipo_interes() to authenticated;
