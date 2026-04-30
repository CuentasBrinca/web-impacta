import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Términos de uso · Impacta IA",
  description: "Términos y condiciones del sitio impactaia.cl y del evento Impacta IA Chile.",
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  return (
    <LegalShell eyebrow="Legal" title="Términos de uso">
      <p>
        Estos términos regulan el uso del sitio impactaia.cl y la participación en el evento Impacta IA Chile,
        organizado por Brinca Spa.
      </p>

      <h2>1. Aceptación</h2>
      <p>
        Al usar el sitio o pre-registrarte, aceptas estos términos. Si no estás de acuerdo, abstente de utilizar
        el sitio.
      </p>

      <h2>2. Pre-registro</h2>
      <p>
        El pre-registro no constituye una garantía de inscripción al evento. Los cupos son limitados (400) y la
        confirmación final depende de un proceso de curaduría basado en seniority y mezcla de industrias.
      </p>

      <h2>3. Pre-venta y reembolsos</h2>
      <p>
        Las condiciones de pre-venta, precios, descuentos early bird y política de reembolso se publicarán en
        esta misma URL antes de la apertura de la pre-venta. [PLACEHOLDER — completar antes de pre-venta.]
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        El contenido del sitio (textos, imágenes, marcas, código) es propiedad de Brinca Spa o de sus respectivos
        titulares y está protegido por la legislación chilena e internacional. No se permite su reproducción sin
        autorización escrita.
      </p>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        El sitio se entrega &ldquo;tal cual&rdquo;. Brinca no garantiza disponibilidad ininterrumpida ni se hace
        responsable de daños derivados del uso del sitio o de la imposibilidad de uso, en la máxima medida
        permitida por la ley.
      </p>

      <h2>6. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por la ley chilena. Cualquier controversia será sometida a los tribunales
        ordinarios de Santiago.
      </p>

      <p>
        <strong>Última actualización:</strong> [PLACEHOLDER — fecha de publicación].
      </p>
    </LegalShell>
  );
}
