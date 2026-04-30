import { event } from "@/lib/content";

/**
 * schema.org Event JSON-LD. Helps Google show the event in rich results.
 * Dates are placeholders — update when venue + exact dates are confirmed.
 */
export function EventJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impactaia.cl";
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.name} Chile`,
    description:
      "Primera conferencia de inteligencia artificial para ejecutivos C-suite en Chile. Adoptar, escalar e innovar con IA.",
    startDate: "2026-09-01", // PLACEHOLDER — replace with confirmed start
    endDate: "2026-09-02",   // PLACEHOLDER — replace with confirmed end
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Santiago, Chile",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Santiago",
        addressCountry: "CL",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Brinca",
      url: "https://brinca.global",
    },
    inLanguage: "es-CL",
    image: [`${siteUrl}/opengraph-image`],
    url: siteUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
