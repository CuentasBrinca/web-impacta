import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Política de privacidad · Impacta IA",
  description: "Cómo tratamos tus datos personales conforme a la Ley 21.719 (Chile).",
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <LegalShell eyebrow="Legal" title="Política de privacidad">
      <p>
        Esta política describe cómo Brinca Spa (en adelante, &ldquo;Brinca&rdquo;) trata los datos personales
        que recolectamos a través del sitio impactaia.cl, conforme a la Ley 21.719 sobre protección de datos
        personales de Chile.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        Brinca Spa, RUT [PLACEHOLDER], domicilio en [PLACEHOLDER], Santiago, Chile. Contacto:{" "}
        <a href="mailto:hola@impactaia.cl">hola@impactaia.cl</a>.
      </p>

      <h2>2. Datos que recolectamos</h2>
      <p>Cuando completas el formulario de pre-registro, recolectamos:</p>
      <ul>
        <li>Nombre completo</li>
        <li>Email corporativo</li>
        <li>Empresa y cargo</li>
        <li>Tipo de interés (asistir, speaker, sponsor, media)</li>
        <li>Dirección IP en formato cifrado y user-agent del navegador (con fines de seguridad y prevención de fraude)</li>
      </ul>

      <h2>3. Finalidad del tratamiento</h2>
      <ul>
        <li>Enviarte información sobre el evento Impacta IA (programa, speakers, pre-venta)</li>
        <li>Curar el listado de asistentes según seniority e industria</li>
        <li>Comunicarnos contigo si solicitaste ser speaker, sponsor o media</li>
        <li>Cumplir obligaciones legales</li>
      </ul>

      <h2>4. Base de licitud</h2>
      <p>
        El tratamiento se basa en tu consentimiento expreso, otorgado al marcar la casilla de aceptación en el
        formulario de pre-registro. Puedes retirar este consentimiento en cualquier momento.
      </p>

      <h2>5. Conservación</h2>
      <p>
        Conservaremos tus datos hasta 12 meses después de la realización del evento (septiembre 2027), salvo que
        nos solicites su eliminación antes.
      </p>

      <h2>6. Compartición con terceros</h2>
      <p>
        Tus datos se almacenan en Supabase (Postgres en São Paulo, Brasil) y los emails transaccionales son
        procesados por Resend. No vendemos ni compartimos tus datos con sponsors o terceros con fines comerciales
        sin tu autorización explícita.
      </p>

      <h2>7. Tus derechos</h2>
      <p>
        Conforme a la Ley 21.719, tienes derecho a acceder, rectificar, eliminar y portar tus datos, así como a
        oponerte al tratamiento. Para ejercerlos, escríbenos a{" "}
        <a href="mailto:hola@impactaia.cl">hola@impactaia.cl</a>.
      </p>

      <h2>8. Actualizaciones</h2>
      <p>
        Podemos actualizar esta política. La versión vigente se publica en esta misma URL con su fecha de última
        modificación.
      </p>

      <p>
        <strong>Última actualización:</strong> [PLACEHOLDER — fecha de publicación].
      </p>
    </LegalShell>
  );
}
