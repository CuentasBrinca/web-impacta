-- Impacta IA · Form refresh — área y motivación
--
-- El formulario de pre-registro reemplazó el campo libre "Cargo" por dos
-- dropdowns: "Nivel de responsabilidad" (se sigue guardando en la columna
-- legacy `cargo`) y "Área a la que pertenece" (nueva columna `area`), más un
-- campo de texto opcional "Motivación para asistir" (nueva columna `motivacion`).
--
-- Aplicar antes de desplegar el nuevo formulario: el server action escribe
-- estas columnas y el insert fallaría si no existen.

alter table public.pre_registrations
  add column if not exists area       text check (area is null or length(area) between 1 and 200),
  add column if not exists motivacion text check (motivacion is null or length(motivacion) <= 1000);

comment on column public.pre_registrations.cargo      is 'Nivel de responsabilidad del lead (dropdown del formulario).';
comment on column public.pre_registrations.area       is 'Área / función a la que pertenece el lead (dropdown del formulario).';
comment on column public.pre_registrations.motivacion is 'Texto libre opcional: motivación para asistir.';
