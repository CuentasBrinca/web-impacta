import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impactaia.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`,             lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/privacidad`,   lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terminos`,     lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/codigo-etica`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
