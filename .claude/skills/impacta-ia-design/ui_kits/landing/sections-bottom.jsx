/* Impacta IA — bottom sections. Depends on sections-top.jsx globals. */
const DSb = window.ImpactaIADesignSystem_4dab94;
const { Button: Btn, Card: Cd, Tag: Tg, Eyebrow: Eb, Input: In, Select: Sel, Checkbox: Cb } = DSb;
const Ct = window.Container, STitle = window.SectionTitle, IStyles = window.impactaStyles;
const AA = "../../assets";

/* ---------------- Audience ---------------- */
function Audience() {
  const roles = [
    { n: "01", role: "CEO / Gerente General", tag: "Estrategia", body: "Cuándo, cuánto y cómo invertir en IA. Casos de empresas chilenas que ya miden retorno." },
    { n: "02", role: "CTO / CIO / CDO", tag: "Implementación", body: "Arquitecturas, equipos y operación. Del piloto a producción sin morir en el intento." },
    { n: "03", role: "Founder / Emprendedor", tag: "Construir con IA", body: "Vibe-coding, MVPs en semanas y la mecánica de escalar startups nativas IA en 2026." },
    { n: "04", role: "Gerente de Personas", tag: "Cultura y adopción", body: "Reskilling, change management y el rol de RRHH como motor de la transformación." },
    { n: "05", role: "Director de Innovación", tag: "Adopción a escala", body: "Gobernanza, portafolio y la conversación honesta con áreas de negocio." },
  ];
  return (
    <section style={IStyles.section} id="para-quien">
      <Ct>
        <Eb>Para quién</Eb>
        <STitle>Diseñado para quienes lideran la transformación.</STitle>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "48ch", marginTop: 18 }}>
          400 cupos curados — un piso de seniority y una mezcla intencional de industrias. Networking entre pares reales.
        </p>
        <div style={{ marginTop: 44, borderTop: "1px solid var(--border-subtle)" }}>
          {roles.map((r) => (
            <div key={r.n} style={{
              display: "grid", gridTemplateColumns: "56px 1.2fr 1fr", gap: 24, alignItems: "start",
              padding: "26px 0", borderBottom: "1px solid var(--border-subtle)",
            }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--text-muted)" }}>{r.n}</span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "var(--white)" }}>{r.role}</div>
                <div style={{ marginTop: 10 }}><Tg tone="pink">{r.tag}</Tg></div>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.55, margin: 0 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </Ct>
    </section>
  );
}

/* ---------------- Speakers ---------------- */
function Speakers() {
  const [day, setDay] = React.useState(1);
  const speakers = [
    { img: "speaker-1.webp", name: "Stefano Puntoni", bio: "Codirector del programa de IA humana de Wharton.", flag: "it", country: "Italia", track: "Innovación", tone: "pink" },
    { img: "speaker-2.webp", name: "Daniel Strode", bio: "Autor de “La ventaja del innovador”. Experto en el futuro del trabajo.", flag: "gb", country: "Reino Unido", track: "Innovación", tone: "pink" },
    { img: "speaker-3.webp", name: "Jeannette Escudero", bio: "Directora Ejecutiva de Talento Digital para Chile.", flag: "cl", country: "Chile", track: "Escalamiento", tone: "teal" },
    { img: "speaker-4.webp", name: "Nicolás Rivas", bio: "Gerente de Soluciones IA en Brinca.", flag: "cl", country: "Chile", track: "Adopción", tone: "blue" },
  ];
  return (
    <section style={{ ...IStyles.section, background: "var(--ink-850)", borderTop: "1px solid var(--border-subtle)" }} id="speakers">
      <Ct>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
          <div>
            <Eb>Conversaciones reales</Eb>
            <STitle>Speakers.</STitle>
          </div>
          <div style={{ display: "flex", gap: 8, background: "var(--w-06)", padding: 5, borderRadius: "var(--radius-pill)", border: "1px solid var(--border-subtle)" }}>
            {[1, 2].map((d) => (
              <button key={d} onClick={() => setDay(d)} style={{
                fontFamily: "var(--font-lecturis-rounded)", fontWeight: 700, fontSize: 13,
                padding: "8px 18px", borderRadius: "var(--radius-pill)", cursor: "pointer",
                border: "none", transition: "all .2s",
                background: day === d ? "var(--accent)" : "transparent",
                color: day === d ? "#fff" : "var(--text-secondary)",
              }}>Día {d}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 20, marginTop: 44 }}>
          {speakers.map((s) => (
            <Cd key={s.name} hover padding="0" style={{ overflow: "hidden" }}>
              <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "var(--ink-800)" }}>
                <img src={`${AA}/speakers/${s.img}`} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--white)" }}>{s.name}</div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, margin: "8px 0 14px" }}>{s.bio}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={`${AA}/flags/${s.flag}.svg`} alt="" style={{ width: 20, height: 14, borderRadius: 2, objectFit: "cover" }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{s.country}</span>
                  <span style={{ marginLeft: "auto" }}><Tg tone={s.tone}>{s.track}</Tg></span>
                </div>
              </div>
            </Cd>
          ))}
        </div>
      </Ct>
    </section>
  );
}

/* ---------------- Format ---------------- */
function Format() {
  const items = [
    { img: "format-1.webp", title: "Keynotes con voces internacionales", body: "Speakers de referencia mundial en IA aplicada." },
    { img: "format-2.webp", title: "Paneles por función ejecutiva", body: "Mesas paralelas para CEO, CTO, CFO y Dir. de Innovación." },
    { img: "format-3.webp", title: "Challenge Briefs en equipo", body: "Grupos curados resuelven un brief real de una empresa chilena." },
    { img: "format-4.webp", title: "Talleres de IA", body: "Implementaciones que ya funcionan — código y métricas a la vista." },
    { img: "format-5.webp", title: "Matchmaking y networking", body: "Rondas de conexión dirigida entre empresas, proveedores y startups." },
    { img: "format-6.webp", title: "Afterparty: cierre exclusivo", body: "Espacio íntimo para cerrar negocios y construir alianzas." },
  ];
  return (
    <section style={IStyles.section} id="formato">
      <Ct>
        <Eb>El formato</Eb>
        <STitle>Dos días de inmersión en IA aplicada.</STitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, marginTop: 48 }}>
          {items.map((it) => (
            <Cd key={it.title} hover padding="0" style={{ overflow: "hidden" }}>
              <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "var(--ink-800)" }}>
                <img src={`${AA}/${it.img}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: 22 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--white)", lineHeight: 1.15 }}>{it.title}</div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginTop: 10 }}>{it.body}</p>
              </div>
            </Cd>
          ))}
        </div>
      </Ct>
    </section>
  );
}

/* ---------------- Organizer ---------------- */
function Organizer() {
  return (
    <section style={{ ...IStyles.section, background: "var(--ink-850)", borderTop: "1px solid var(--border-subtle)" }}>
      <Ct style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center" }}>
        <div>
          <Eb>El organizador</Eb>
          <STitle style={{ maxWidth: "20ch" }}>Detrás de Impacta IA está Brinca.</STitle>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.6, marginTop: 20, maxWidth: "50ch" }}>
            Impacta IA nace en Brinca, la consultora chilena de innovación, estrategia, gestión del
            cambio e inteligencia artificial. Desde 2010 acompañamos a grandes organizaciones a
            transformarse con IA aplicada — combinando creatividad, método y excelencia.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Tg tone="pink">Creatividad</Tg><Tg tone="blue">Método</Tg><Tg tone="teal">Excelencia</Tg>
          </div>
          <div style={{ marginTop: 30 }}>
            <Btn as="a" href="https://www.brinca.com" variant="secondary" arrow>Conoce Brinca</Btn>
          </div>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {[["+15", "años transformando grandes organizaciones"], ["+50", "empresas acompañadas en su transformación"], ["3", "frentes: estrategia, I+D e inteligencia artificial"]].map(([v, l]) => (
            <Cd key={v} padding="24px" style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--pink-500)", minWidth: 90 }}>{v}</span>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{l}</span>
            </Cd>
          ))}
        </div>
      </Ct>
    </section>
  );
}

/* ---------------- Form ---------------- */
function RegForm() {
  const [sent, setSent] = React.useState(false);
  return (
    <section style={{ ...IStyles.section, position: "relative", overflow: "hidden" }} id="form">
      <img src={`${AA}/bg-photo-5.webp`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0e0e10 0%,#0e0e10cc 100%)" }} />
      <Ct style={{ position: "relative", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56, alignItems: "start" }}>
        <div>
          <Eb>Pre-inscripción evento</Eb>
          <STitle style={{ maxWidth: "14ch" }}>Sé parte de Impacta IA.</STitle>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.6, marginTop: 18, maxWidth: "44ch" }}>
            Los cupos son limitados y cuidadosamente seleccionados. Deja tus datos y serás el
            primero en conocer el programa, los speakers y cómo asegurar tu invitación.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "grid", gap: 12 }}>
            {["Prioridad en la primera ola de invitaciones", "Programa completo y line-up en mayo", "Newsletter mensual con casos chilenos de IA"].map((t) => (
              <li key={t} style={{ display: "flex", gap: 12, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                <span style={{ color: "var(--pink-500)" }}>→</span>{t}
              </li>
            ))}
          </ul>
        </div>
        <Cd padding="32px">
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--teal-500)" }}>¡Gracias!</div>
              <p style={{ color: "var(--text-secondary)", marginTop: 12 }}>Recibirás el programa y los speakers en cuanto se anuncien.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "grid", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <In label="Nombre" required placeholder="Nombre y apellido" />
                <In label="Email corporativo" type="email" required placeholder="tu@empresa.cl" />
              </div>
              <In label="Organización" required placeholder="Empresa" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Sel label="Nivel de responsabilidad" required options={["Gerente General / CEO", "Director(a)", "Gerente", "Jefatura / Líder", "Profesional / Especialista"]} />
                <Sel label="Área" required options={["Innovación", "Tecnología (TI)", "Recursos Humanos", "Finanzas", "Operaciones", "Comercial / Ventas"]} />
              </div>
              <Cb defaultChecked>
                Acepto que Brinca trate mis datos conforme a la <a href="#" style={{ color: "var(--pink-300)" }}>política de privacidad</a> (Ley 21.719).
              </Cb>
              <Btn variant="primary" size="lg" arrow>Quiero participar</Btn>
            </form>
          )}
        </Cd>
      </Ct>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer style={{ background: "var(--ink-900)", borderTop: "1px solid var(--border-subtle)" }}>
      <Ct style={{ padding: "var(--space-8) var(--gutter) var(--space-6)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem,3.5vw,2.75rem)", color: "var(--white)", letterSpacing: "var(--tracking-tight)" }}>
          Santiago. 2 y 3 de septiembre 2026.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 30, marginTop: 48, alignItems: "flex-start" }}>
          <div style={{ maxWidth: 320 }}>
            <img src={`${AA}/logo-horizontal-white.png`} alt="Impacta IA" style={{ height: 28 }} />
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", lineHeight: 1.55, marginTop: 16 }}>
              La conferencia de IA para quienes toman decisiones. Un evento de Brinca, con el respaldo de CORFO.
            </p>
          </div>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--text-muted)", fontFamily: "var(--font-lecturis-rounded)", fontWeight: 700 }}>Contacto</div>
              <div style={{ marginTop: 14, display: "grid", gap: 8, color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                <span>hola@impactaia.cl</span><span>sponsors@impactaia.cl</span><span>prensa@impactaia.cl</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--text-muted)", fontFamily: "var(--font-lecturis-rounded)", fontWeight: 700 }}>Síguenos</div>
              <div style={{ marginTop: 14, display: "grid", gap: 8, color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                <span>LinkedIn</span><span>Instagram</span><span>Facebook</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 48, paddingTop: 22, borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
          © 2026 Impacta IA · Un evento de Brinca
        </div>
      </Ct>
    </footer>
  );
}

Object.assign(window, { Audience, Speakers, Format, Organizer, RegForm, Footer });
