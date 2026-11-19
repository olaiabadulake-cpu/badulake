#!/bin/sh
# COPIA DE PRUEBAS (Tarea 22, D-035): junta en un solo archivo, en el orden en que se ejecutaron,
# los scripts de supabase/*.sql que ya están en el repositorio, para pegarlo en el SQL Editor de
# «badulake-pruebas» (nunca en el proyecto real). Uso:  sh supabase/pruebas/juntar-esquema.sh | pbcopy
cd "$(dirname "$0")/.." || exit 1
echo "create extension if not exists pg_cron;"
# En el proyecto real Supabase creó por su cuenta rls_auto_enable (seguridad.sql la cierra); aquí no existe, se crea vacía.
echo "create or replace function public.rls_auto_enable() returns void language sql as \$\$ select 1 \$\$;"
# La función de la Tarea 2 (la usa seguridad.sql); vive en app/supabase.
echo "-- ===== hora_actual.sql ====="
cat ../app/supabase/hora_actual.sql
for f in lista_espera perfiles badulakes inscripciones seguridad privacidad denuncias contador interes cupo borrar_cuenta dia; do
  # Solo los que ya están subidos al repositorio (los de tareas en marcha se añaden cuando se suban).
  git ls-files --error-unmatch "$f.sql" >/dev/null 2>&1 || { echo "-- (falta $f.sql: todavía no está en el repositorio)" ; continue; }
  echo "-- ===== $f.sql ====="
  cat "$f.sql"
done
