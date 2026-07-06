-- Impacta IA · Renombrar interés "Asistir" → "Asistente"
--
-- El pill del formulario pasó de "Asistir" a "Asistente". El valor se almacena
-- tal cual en la columna `interes`, cuyo CHECK enumera los valores permitidos.
-- Migramos las filas existentes y reemplazamos la restricción.
--
-- IMPORTANTE — orden: primero se elimina el CHECK viejo, luego se actualizan
-- las filas. Al revés, el UPDATE a 'Asistente' viola la restricción vieja
-- (que sólo permite 'Asistir') y falla con error 23514.

alter table public.pre_registrations drop constraint if exists pre_registrations_interes_check;

update public.pre_registrations set interes = 'Asistente' where interes = 'Asistir';

alter table public.pre_registrations
  add constraint pre_registrations_interes_check
  check (interes in ('Asistente', 'Speaker', 'Sponsor', 'Media'));
