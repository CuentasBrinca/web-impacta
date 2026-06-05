import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Publica source maps en producción: así DevTools muestra el código fuente
  // original y legible en el sitio en vivo, no el bundle minificado.
  // Nota: deja el código de cliente legible para cualquiera, no solo el equipo.
  productionBrowserSourceMaps: true,
  images: {
    // Allow SVG sources we host ourselves (partner logos in /public).
    // We never accept user-uploaded SVGs, so the XSS surface is bounded.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
