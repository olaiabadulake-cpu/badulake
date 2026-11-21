-- Vista previa pública de un badulake para compartirlo (Tarea 6.3, D-042).
-- Quien recibe el enlace sin cuenta (y WhatsApp, Telegram… al pintar la vista previa) ve solo lo
-- que ya enseña el título: lugar, fecha y hora, y si está lleno o cancelado. NUNCA la dirección,
-- quién organiza ni quién va. Solo de badulakes publicados o cancelados y no ocultos.
create function public.badulake_vista(p_id uuid)
returns table (titulo text, fecha_hora timestamptz, zona text, estado text, plazas_libres int)
language sql stable security definer set search_path = '' as $$
  select b.titulo, b.fecha_hora, b.zona, b.estado,
         greatest(0, b.plazas - 1 - (select count(*)::int from public.inscripciones i where i.badulake_id = b.id))
  from public.badulakes b
  where b.id = p_id and b.estado in ('publicado', 'cancelado') and not b.oculto
    and b.fecha_hora > now() - interval '30 days';
$$;
revoke execute on function public.badulake_vista(uuid) from public;
grant execute on function public.badulake_vista(uuid) to anon, authenticated;
