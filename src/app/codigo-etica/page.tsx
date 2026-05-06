import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Código de ética · Impacta IA",
  description: "Reglas de convivencia, conducta esperada y mecanismos de reporte para asistentes, speakers y staff.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/codigo-etica" },
};

export default function CodigoEticaPage() {
  return (
    <LegalShell eyebrow="Conducta" title="Código de ética">
      <p>
        Impacta IA es un espacio profesional de ejecutivos C-suite. Esperamos que asistentes, speakers, sponsors y
        staff se comporten con respeto, profesionalismo y apertura. Este código aplica durante el evento y en
        cualquier canal asociado (online, networking, afterparty).
      </p>

      <h2>Conducta esperada</h2>
      <ul>
        <li>Tratar a todas las personas con respeto, sin importar rol, género, orientación, raza, edad o creencias</li>
        <li>Escuchar activamente y dar espacio a perspectivas distintas</li>
        <li>Mantener la confidencialidad de los casos compartidos en mesas C-level y challenge briefs</li>
        <li>No usar el evento para vender de forma intrusiva (los sponsors tienen espacios designados)</li>
      </ul>

      <h2>Conductas no toleradas</h2>
      <ul>
        <li>Acoso, lenguaje ofensivo o intimidación de cualquier tipo</li>
        <li>Discriminación por género, orientación, raza, edad, creencias o nacionalidad</li>
        <li>Divulgación no autorizada de información compartida bajo confidencialidad en sesiones cerradas</li>
        <li>Uso indebido del nombre de Impacta IA o sus partners para fines comerciales no autorizados</li>
      </ul>

      <h2>Reportes</h2>
      <p>
        Si presencias o sufres una conducta que vulnera este código, contáctanos a{" "}
        <a href="mailto:hola@impactaia.cl">hola@impactaia.cl</a> o acércate al staff identificable durante el evento.
        Tomamos todos los reportes en serio y los tratamos con la mayor confidencialidad posible.
      </p>

      <h2>Consecuencias</h2>
      <p>
        Las violaciones a este código pueden resultar en una advertencia, expulsión del evento, y/o prohibición
        de participar en futuras ediciones. La decisión la toma el equipo organizador.
      </p>

      <p>
        <strong>Última actualización:</strong> [PLACEHOLDER — fecha de publicación].
      </p>
    </LegalShell>
  );
}
