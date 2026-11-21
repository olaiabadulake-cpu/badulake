-- Modo badulake en el móvil (Tarea 24.2, D-046): una vez fijada la cola de turnos («Empezar a
-- elegir»), los objetos contados ya no se pueden cambiar. La web desactiva los botones y, además,
-- la base de datos lo rechaza con 'ya_empezado' (por si un móvil sin señal manda cambios tarde).
create or replace function public.dia_fijar(p_fila uuid, p_ropa int, p_calzado int, p_accesorios int, p_otros int)
returns text
language plpgsql security definer set search_path = '' as $$
declare
  b public.badulakes;
  codigo text;
begin
  select bb.* into b from public.badulakes bb
    join public.dia_personas p on p.badulake_id = bb.id where p.id = p_fila for update of bb;
  codigo := public.dia_permitido(b);
  if codigo <> 'ok' then return codigo; end if;
  if exists (select 1 from public.dia_estado e where e.badulake_id = b.id and e.elegir_desde is not null) then
    return 'ya_empezado';
  end if;
  if least(p_ropa, p_calzado, p_accesorios, p_otros) < 0
     or greatest(p_ropa, p_calzado, p_accesorios, p_otros) > 99 then
    return 'invalido';
  end if;
  update public.dia_personas set ropa = p_ropa, calzado = p_calzado,
    accesorios = p_accesorios, otros = p_otros where id = p_fila;
  return 'ok';
end;
$$;
revoke execute on function public.dia_fijar(uuid, int, int, int, int) from public, anon;
grant execute on function public.dia_fijar(uuid, int, int, int, int) to authenticated;
