import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG sources we host ourselves (partner logos in /public).
    // We never accept user-uploaded SVGs, so the XSS surface is bounded.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
