/* Impacta IA — landing page recreation.
   Composes design-system primitives from window.ImpactaIADesignSystem_4dab94.
   Sections are exported to window for index.html to assemble. */
const DS = window.ImpactaIADesignSystem_4dab94;
const { Button, Card, Tag, Eyebrow, Stat, Input, Select, Checkbox } = DS;

const A = "../../assets"; // asset base (relative to index.html)

/* ---------------- Shared layout bits ---------------- */
const impactaStyles = {
  container: { width: "100%", maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" },
  section: { padding: "var(--space-10) 0" },
};
const Container = ({ children, style }) => (
  <div style={{ ...impactaStyles.container, ...style }}>{children}</div>
);
const SectionTitle = ({ children, style }) => (
  <h2 style={{
    fontFamily: "var(--font-display)", fontWeight: 500,
    fontSize: "clamp(2rem, 4.2vw, 3rem)", lineHeight: 1.05,
    letterSpacing: "var(--tracking-tight)", color: "var(--white)",
    margin: "16px 0 0", maxWidth: "18ch", ...style,
  }}>{children}</h2>
);

/* ---------------- Nav ---------------- */
function Nav() {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(14px)", background: "#0e0e10cc",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <img src={`${A}/logo-horizontal-white.png`} alt="Impacta IA" style={{ height: 30 }} />
        <Button as="a" href="#form" variant="primary" size="sm" arrow>Participar</Button>
      </Container>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const facts = [
    { big: "02 y 03", small: "Septiembre" },
    { big: "Fundación Chile", small: "Vitacura, Santiago" },
    { big: "2 días", small: "Presencial y gratuito" },
    { big: "+400 cupos", small: "Exclusivo C-level" },
  ];
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--ink-900)" }}>
      <img src={`${A}/fondo-textura.webp`} alt="" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", opacity: 0.5,
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0e0e1099 0%,#0e0e10 92%)" }} />
      <Container style={{ position: "relative", padding: "var(--space-9) var(--gutter) var(--space-8)" }}>
        <Eyebrow>Fundación Chile · 2 y 3 septiembre 2026</Eyebrow>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 500,
          fontSize: "clamp(2.6rem, 6.5vw, 5.25rem)", lineHeight: 0.98,
          letterSpacing: "var(--tracking-tight)", color: "var(--white)",
          margin: "20px 0 0", maxWidth: "16ch",
        }}>
          La conferencia de IA para quienes <span style={{ color: "var(--pink-500)" }}>toman decisiones</span>.
        </h1>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.6vw,1.25rem)",
          lineHeight: 1.55, color: "var(--text-secondary)", maxWidth: "52ch", margin: "24px 0 0",
        }}>
          Un evento para líderes que están definiendo el futuro de sus organizaciones con
          inteligencia artificial. Dos días de inmersión en IA aplicada, casos reales y
          networking estratégico.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 32 }}>
          <Button as="a" href="#form" variant="primary" size="lg" arrow>Quiero participar</Button>
          <Button as="a" href="#form" variant="secondary" size="lg">Ser sponsor</Button>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 1, marginTop: 56, borderTop: "1px solid var(--border-subtle)",
        }}>
          {facts.map((f, i) => (
            <div key={i} style={{ padding: "22px 0", borderRight: i < 3 ? "1px solid var(--border-subtle)" : "none" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--white)" }}>{f.big}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", marginTop: 4 }}>{f.small}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Partners strip ---------------- */
function Partners() {
  const org = ["brinca.svg", "chile-global-ventures.png", "corfo.png"];
  return (
    <div style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--ink-850)" }}>
      <Container style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40, padding: "26px var(--gutter)" }}>
        <span style={{ fontFamily: "var(--font-lecturis-rounded)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--text-muted)" }}>Organizan</span>
        {org.map((p) => <img key={p} src={`${A}/partners/${p}`} alt="" style={{ height: 26, opacity: 0.85 }} />)}
        <span style={{ marginLeft: 24, fontFamily: "var(--font-lecturis-rounded)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--text-muted)" }}>Media partner</span>
        <img src={`${A}/partners/diario-financiero.png`} alt="" style={{ height: 22, opacity: 0.85 }} />
      </Container>
    </div>
  );
}

/* ---------------- Context ---------------- */
function Context() {
  return (
    <section style={impactaStyles.section}>
      <Container>
        <Eyebrow>El contexto</Eyebrow>
        <SectionTitle style={{ maxWidth: "22ch" }}>La IA está transformando todas las industrias.</SectionTitle>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", lineHeight: 1.55, maxWidth: "46ch", marginTop: 18 }}>
          Pero en Chile, la adopción empresarial apenas comienza. Impacta IA reúne a quienes están cerrando esa brecha.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 40, marginTop: 56 }}>
          <Stat value="37%" label="de empresas chilenas usa IA de forma sistemática" />
          <Stat value="1 de 5" label="proyectos de IA llega a producción" accent="teal" />
          <Stat value="84%" label="de los CEO ve la IA como prioridad estratégica" accent="blue" />
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Ejes ---------------- */
function Ejes() {
  const ejes = [
    { n: "01", icon: "icon-innovar.png", title: "Innovar", accent: "pink", tag: "Emprender con IA", body: "Startups, MVPs y la práctica del vibe-coding. Cómo construir productos nuevos sobre modelos generativos en 2026." },
    { n: "02", icon: "icon-adoptar.png", title: "Adoptar", accent: "blue", tag: "IA en la empresa", body: "Casos reales, paneles por función y mediciones concretas de ROI. Para equipos dando sus primeros pasos con IA generativa." },
    { n: "03", icon: "icon-escalar.png", title: "Escalar", accent: "teal", tag: "IA con I+D", body: "Supercómputo, Ley I+D, datasets nacionales y la infraestructura que sostiene la IA a escala industrial." },
  ];
  return (
    <section style={{ ...impactaStyles.section, background: "var(--ink-850)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }} id="ejes">
      <Container>
        <Eyebrow>Tres ejes · un objetivo</Eyebrow>
        <SectionTitle>Innova. Adopta. Escala.</SectionTitle>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "48ch", marginTop: 18 }}>
          Que la IA funcione en tu empresa. Tres tracks paralelos durante dos días — escoge tu camino o cruza entre ellos.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginTop: 48 }}>
          {ejes.map((e) => (
            <Card key={e.n} hover accent={e.accent} padding="28px">
              <img src={`${A}/${e.icon}`} alt="" style={{ height: 64, width: 64, objectFit: "contain" }} />
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 20 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--white)" }}>{e.title}</span>
                <span style={{ fontFamily: "var(--font-lecturis-rounded)", fontWeight: 700, fontSize: 11, letterSpacing: ".14em", color: `var(--eje-${e.title.toLowerCase() === "innovar" ? "innovar" : e.title.toLowerCase() === "adoptar" ? "adoptar" : "escalar"})` }}>EJE {e.n}</span>
              </div>
              <div style={{ marginTop: 12 }}><Tag tone={e.accent}>{e.tag}</Tag></div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.55, marginTop: 16 }}>{e.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

Object.assign(window, { Nav, Hero, Partners, Context, Ejes, Container, SectionTitle, impactaStyles });
