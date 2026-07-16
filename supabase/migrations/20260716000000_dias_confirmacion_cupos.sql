-- Impacta IA · Confirmación automática por día, cupos y registros de prueba
--
-- El formulario ahora pide día(s) de asistencia (2-sep / 3-sep) y los niveles
-- ejecutivos se auto-confirman mientras haya cupo (configurable por día).
-- Cambios 100% aditivos y retrocompatibles: el código en producción sigue
-- funcionando con esta migración aplicada. Aplicar ANTES de desplegar el
-- código nuevo.
--
-- Piezas:
--   1. `event_days`: cupo configurable por día (editable desde el admin).
--   2. Columnas nuevas en `pre_registrations`:
--        dia_sep2 / dia_sep3  → estado por día (la confirmación es POR DÍA)
--        is_test              → filas de prueba del equipo (@brinca.*)
--        email_type/status/…  → auditoría del último correo transaccional
--   3. Email único pasa a índice parcial: los registros de prueba pueden
--      repetirse; el público conserva la protección anti-duplicados.
--   4. RPCs atómicas (el chequeo de cupo y la escritura ocurren en la misma
--      transacción, con lock sobre `event_days` — dos inscripciones
--      simultáneas no pueden confirmar ambas el cupo 200):
--        register_attendee   → inscripción desde el formulario
--        admin_confirm_days  → confirmación manual / promoción de waitlist
--        admin_cancel_day    → cancelación por día (libera cupo, conserva historial)

-- ----------------------------------------------------------------------------
-- 1. Cupos por día
-- ----------------------------------------------------------------------------
create table public.event_days (
  day   date primary key,
  cupo  int  not null check (cupo >= 0)
);

insert into public.event_days (day, cupo) values
  ('2026-09-02', 200),
  ('2026-09-03', 200);

comment on table public.event_days is
  'Cupo máximo de confirmados por día del evento. Editable desde el panel admin; el cambio rige de inmediato.';

alter table public.event_days enable row level security;
-- Sin policies → solo service_role (server actions) puede leer/escribir.

-- ----------------------------------------------------------------------------
-- 2. Columnas nuevas en pre_registrations
-- ----------------------------------------------------------------------------
alter table public.pre_registrations
  add column if not exists dia_sep2 text
    check (dia_sep2 is null or dia_sep2 in ('selected', 'confirmed', 'waitlisted', 'cancelled')),
  add column if not exists dia_sep3 text
    check (dia_sep3 is null or dia_sep3 in ('selected', 'confirmed', 'waitlisted', 'cancelled')),
  add column if not exists is_test boolean not null default false,
  add column if not exists email_type    text,
  add column if not exists email_status  text check (email_status is null or email_status in ('sent', 'failed')),
  add column if not exists email_error   text,
  add column if not exists email_sent_at timestamptz;

comment on column public.pre_registrations.dia_sep2 is
  'Estado para el 2-sep. null = no marcó ese día. selected = lo marcó sin auto-confirmación (no ejecutivo). confirmed/waitlisted/cancelled = ciclo de confirmación.';
comment on column public.pre_registrations.dia_sep3 is
  'Estado para el 3-sep (ver dia_sep2).';
comment on column public.pre_registrations.is_test is
  'Registro de prueba del equipo (dominios TEST_EMAIL_DOMAINS). No cuenta cupo, se excluye del export, purgable.';
comment on column public.pre_registrations.email_type is
  'Último correo transaccional enviado: confirmed_full | confirmed_partial | waitlisted | generic.';

-- Estados nuevos del ciclo de vida: waitlisted (en lista de espera) y
-- cancelled (canceló su asistencia; el detalle por día queda en dia_sep*).
alter table public.pre_registrations drop constraint if exists pre_registrations_status_check;
alter table public.pre_registrations
  add constraint pre_registrations_status_check
  check (status in ('new', 'contacted', 'confirmed', 'waitlisted', 'cancelled', 'rejected', 'spam'));

-- Índices para el conteo de cupo (la consulta caliente del sistema).
create index pre_registrations_dia_sep2_idx on public.pre_registrations (dia_sep2) where not is_test;
create index pre_registrations_dia_sep3_idx on public.pre_registrations (dia_sep3) where not is_test;

-- ----------------------------------------------------------------------------
-- 3. Email único solo para el público — las filas test pueden repetirse
-- ----------------------------------------------------------------------------
drop index if exists public.pre_registrations_email_key;
create unique index pre_registrations_email_key
  on public.pre_registrations (lower(email))
  where not is_test;

-- ----------------------------------------------------------------------------
-- 4. Helpers y RPCs
-- ----------------------------------------------------------------------------

-- Confirmados que ocupan cupo en un día (excluye pruebas).
create or replace function public.confirmed_count(p_day date)
returns int
language sql stable as $$
  select case p_day
    when '2026-09-02'::date then (select count(*)::int from public.pre_registrations where dia_sep2 = 'confirmed' and not is_test)
    when '2026-09-03'::date then (select count(*)::int from public.pre_registrations where dia_sep3 = 'confirmed' and not is_test)
    else 0
  end;
$$;

-- Estado de vida coherente con los estados por día.
create or replace function public.compute_reg_status(p_dia2 text, p_dia3 text)
returns text
language sql immutable as $$
  select case
    when p_dia2 = 'confirmed'  or p_dia3 = 'confirmed'  then 'confirmed'
    when p_dia2 = 'waitlisted' or p_dia3 = 'waitlisted' then 'waitlisted'
    when (p_dia2 = 'cancelled' or p_dia2 is null)
     and (p_dia3 = 'cancelled' or p_dia3 is null)
     and coalesce(p_dia2, p_dia3) is not null           then 'cancelled'
    else 'new'
  end;
$$;

-- Inscripción desde el formulario. Atómica: lockea event_days, cuenta,
-- decide confirmed/waitlisted por día e inserta — todo en una transacción.
--   p_auto_confirm = true solo para niveles ejecutivos con interés Asistente.
--   Devuelve: { ok, id, dia_sep2, dia_sep3, status } o { ok:false, error:'duplicate' }.
create or replace function public.register_attendee(
  p_nombre       text,
  p_email        text,
  p_empresa      text,
  p_cargo        text,
  p_area         text,
  p_motivacion   text,
  p_interes      text,
  p_consent      boolean,
  p_source       text,
  p_user_agent   text,
  p_ip_hash      text,
  p_dia2         boolean,
  p_dia3         boolean,
  p_auto_confirm boolean,
  p_is_test      boolean
) returns jsonb
language plpgsql as $$
declare
  v_dia2   text := null;
  v_dia3   text := null;
  v_status text;
  v_id     uuid;
begin
  -- Serializa las inscripciones concurrentes que compiten por cupo.
  if p_auto_confirm then
    perform 1 from public.event_days where day in ('2026-09-02', '2026-09-03') for update;
  end if;

  if p_dia2 then
    v_dia2 := case
      when not p_auto_confirm then 'selected'
      when public.confirmed_count('2026-09-02') < (select cupo from public.event_days where day = '2026-09-02') then 'confirmed'
      else 'waitlisted'
    end;
  end if;

  if p_dia3 then
    v_dia3 := case
      when not p_auto_confirm then 'selected'
      when public.confirmed_count('2026-09-03') < (select cupo from public.event_days where day = '2026-09-03') then 'confirmed'
      else 'waitlisted'
    end;
  end if;

  v_status := case when p_auto_confirm then public.compute_reg_status(v_dia2, v_dia3) else 'new' end;

  insert into public.pre_registrations
    (nombre, email, empresa, cargo, area, motivacion, interes, consent, source, user_agent, ip_hash,
     dia_sep2, dia_sep3, is_test, status)
  values
    (p_nombre, p_email, p_empresa, p_cargo, p_area, p_motivacion, p_interes, p_consent, p_source, p_user_agent, p_ip_hash,
     v_dia2, v_dia3, p_is_test, v_status)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'id', v_id, 'dia_sep2', v_dia2, 'dia_sep3', v_dia3, 'status', v_status);
exception
  when unique_violation then
    return jsonb_build_object('ok', false, 'error', 'duplicate');
end;
$$;

-- Confirmación manual desde el admin (históricos sin día y promoción de
-- lista de espera). Todo-o-nada: si algún día pedido no tiene cupo, no
-- confirma ninguno y devuelve qué día falló, para que el equipo decida.
create or replace function public.admin_confirm_days(
  p_id   uuid,
  p_dia2 boolean,
  p_dia3 boolean
) returns jsonb
language plpgsql as $$
declare
  v_row public.pre_registrations%rowtype;
  v_full text[] := '{}';
begin
  if not (p_dia2 or p_dia3) then
    return jsonb_build_object('ok', false, 'error', 'no_days');
  end if;

  perform 1 from public.event_days where day in ('2026-09-02', '2026-09-03') for update;

  select * into v_row from public.pre_registrations where id = p_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  -- El cupo solo se chequea para días donde la persona aún no está confirmada
  -- (re-confirmar un día ya confirmado no consume cupo extra). Las filas test
  -- no ocupan cupo, así que se confirman sin chequeo.
  if not v_row.is_test then
    if p_dia2 and coalesce(v_row.dia_sep2, '') <> 'confirmed'
       and public.confirmed_count('2026-09-02') >= (select cupo from public.event_days where day = '2026-09-02') then
      v_full := array_append(v_full, '2026-09-02');
    end if;
    if p_dia3 and coalesce(v_row.dia_sep3, '') <> 'confirmed'
       and public.confirmed_count('2026-09-03') >= (select cupo from public.event_days where day = '2026-09-03') then
      v_full := array_append(v_full, '2026-09-03');
    end if;
    if array_length(v_full, 1) > 0 then
      return jsonb_build_object('ok', false, 'error', 'capacity', 'full_days', to_jsonb(v_full));
    end if;
  end if;

  update public.pre_registrations set
    dia_sep2 = case when p_dia2 then 'confirmed' else dia_sep2 end,
    dia_sep3 = case when p_dia3 then 'confirmed' else dia_sep3 end,
    status   = 'confirmed'
  where id = p_id
  returning * into v_row;

  return jsonb_build_object('ok', true, 'dia_sep2', v_row.dia_sep2, 'dia_sep3', v_row.dia_sep3);
end;
$$;

-- Cancelación por día. Libera el cupo de inmediato (el conteo se deriva de
-- los estados) y conserva el historial en la fila. Devuelve cuánta gente
-- espera ese día, para que el admin muestre "hay N en lista de espera".
create or replace function public.admin_cancel_day(
  p_id  uuid,
  p_day date
) returns jsonb
language plpgsql as $$
declare
  v_row public.pre_registrations%rowtype;
  v_waiting int;
begin
  update public.pre_registrations set
    dia_sep2 = case when p_day = '2026-09-02' then 'cancelled' else dia_sep2 end,
    dia_sep3 = case when p_day = '2026-09-03' then 'cancelled' else dia_sep3 end
  where id = p_id
  returning * into v_row;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  update public.pre_registrations
    set status = public.compute_reg_status(v_row.dia_sep2, v_row.dia_sep3)
    where id = p_id and status in ('confirmed', 'waitlisted', 'cancelled', 'new');

  select count(*)::int into v_waiting from public.pre_registrations
    where not is_test
      and ((p_day = '2026-09-02' and dia_sep2 = 'waitlisted')
        or (p_day = '2026-09-03' and dia_sep3 = 'waitlisted'));

  return jsonb_build_object('ok', true, 'waitlisted_count', v_waiting);
end;
$$;

-- Estas funciones son de uso exclusivo del backend (service_role). Los roles
-- anon/authenticated solo existen en Supabase (guard para Postgres local).
do $$
begin
  revoke execute on function public.register_attendee(text,text,text,text,text,text,text,boolean,text,text,text,boolean,boolean,boolean,boolean) from public;
  revoke execute on function public.admin_confirm_days(uuid,boolean,boolean) from public;
  revoke execute on function public.admin_cancel_day(uuid,date) from public;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke execute on function public.register_attendee(text,text,text,text,text,text,text,boolean,text,text,text,boolean,boolean,boolean,boolean) from anon, authenticated;
    revoke execute on function public.admin_confirm_days(uuid,boolean,boolean) from anon, authenticated;
    revoke execute on function public.admin_cancel_day(uuid,date) from anon, authenticated;
  end if;
end $$;
