-- Impacta IA · Teléfono opcional en la inscripción
--
-- Campo opcional con formato chileno canónico "+56 9 1234 5678".
-- Aditiva y retrocompatible: register_attendee se recrea con p_telefono
-- AL FINAL y con DEFAULT null — el código desplegado (que no lo envía)
-- sigue funcionando. Aplicar antes de desplegar el código nuevo.

alter table public.pre_registrations
  add column if not exists telefono text
    check (telefono is null or length(telefono) between 8 and 20);

comment on column public.pre_registrations.telefono is
  'Teléfono de contacto opcional, formato canónico "+56 9 1234 5678".';

-- create or replace con firma distinta crearía una sobrecarga y PostgREST
-- fallaría por ambigüedad — hay que dropear la firma anterior (16 params).
drop function if exists public.register_attendee(text,text,text,text,text,text,text,boolean,text,text,text,boolean,boolean,boolean,boolean,boolean);

create function public.register_attendee(
  p_nombre           text,
  p_email            text,
  p_empresa          text,
  p_cargo            text,
  p_area             text,
  p_motivacion       text,
  p_interes          text,
  p_consent          boolean,
  p_source           text,
  p_user_agent       text,
  p_ip_hash          text,
  p_dia2             boolean,
  p_dia3             boolean,
  p_auto_confirm     boolean,
  p_is_test          boolean,
  p_consent_sponsors boolean default false,
  p_telefono         text default null
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
     dia_sep2, dia_sep3, is_test, status, consent_sponsors, telefono)
  values
    (p_nombre, p_email, p_empresa, p_cargo, p_area, p_motivacion, p_interes, p_consent, p_source, p_user_agent, p_ip_hash,
     v_dia2, v_dia3, p_is_test, v_status, p_consent_sponsors, p_telefono)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'id', v_id, 'dia_sep2', v_dia2, 'dia_sep3', v_dia3, 'status', v_status);
exception
  when unique_violation then
    return jsonb_build_object('ok', false, 'error', 'duplicate');
end;
$$;

do $$
begin
  revoke execute on function public.register_attendee(text,text,text,text,text,text,text,boolean,text,text,text,boolean,boolean,boolean,boolean,boolean,text) from public;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke execute on function public.register_attendee(text,text,text,text,text,text,text,boolean,text,text,text,boolean,boolean,boolean,boolean,boolean,text) from anon, authenticated;
  end if;
end $$;
