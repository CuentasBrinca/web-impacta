-- Impacta IA · Opt-in para compartir datos de contacto con sponsors
--
-- Checkbox OPCIONAL bajo el consentimiento de tratamiento de datos (solo
-- inscripción de Asistente): "Acepto que Brinca comparta mis datos de
-- contacto (nombre y correo) con los sponsors oficiales del evento…".
--
-- Aditiva y retrocompatible. La función register_attendee se DROPea y
-- recrea con el parámetro nuevo AL FINAL y con DEFAULT false: el código en
-- producción (que llama con 15 argumentos nombrados) sigue resolviendo a
-- esta única función sin ambigüedad. Aplicar antes de desplegar el código.

alter table public.pre_registrations
  add column if not exists consent_sponsors boolean not null default false;

comment on column public.pre_registrations.consent_sponsors is
  'Opt-in EXPLÍCITO a compartir nombre y correo con sponsors oficiales (Ley 21.719). Default false.';

-- create or replace con firma distinta crearía una SEGUNDA función
-- (sobrecarga) y PostgREST fallaría por ambigüedad — hay que dropear.
drop function if exists public.register_attendee(text,text,text,text,text,text,text,boolean,text,text,text,boolean,boolean,boolean,boolean);

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
  p_consent_sponsors boolean default false
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
     dia_sep2, dia_sep3, is_test, status, consent_sponsors)
  values
    (p_nombre, p_email, p_empresa, p_cargo, p_area, p_motivacion, p_interes, p_consent, p_source, p_user_agent, p_ip_hash,
     v_dia2, v_dia3, p_is_test, v_status, p_consent_sponsors)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'id', v_id, 'dia_sep2', v_dia2, 'dia_sep3', v_dia3, 'status', v_status);
exception
  when unique_violation then
    return jsonb_build_object('ok', false, 'error', 'duplicate');
end;
$$;

do $$
begin
  revoke execute on function public.register_attendee(text,text,text,text,text,text,text,boolean,text,text,text,boolean,boolean,boolean,boolean,boolean) from public;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke execute on function public.register_attendee(text,text,text,text,text,text,text,boolean,text,text,text,boolean,boolean,boolean,boolean,boolean) from anon, authenticated;
  end if;
end $$;
