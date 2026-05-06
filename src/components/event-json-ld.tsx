import { event } from "@/lib/content";

/**
 * schema.org @graph — multiple typed entities cross-referenced via @id.
 * Combines Event + Organization (Brinca) + WebSite for richer AI/SEO ingestion.
 *
 * Dates and offer are placeholders — update when venue + exact dates and the
 * registration model are confirmed.
 */
export function EventJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.impactaia.cl";
  const orgId = "https://brinca.global#organization";
  const eventId = `${siteUrl}#event`;
  const siteId = `${siteUrl}#website`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "@id": eventId,
        name: `${event.name} Chile`,
        description:
          "Primera conferencia de inteligencia artificial para ejecutivos C-suite en Chile. Adoptar, escalar e innovar con IA.",
        // PLACEHOLDER — replace with confirmed dates
        startDate: "2026-09-01",
        endDate: "2026-09-02",
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
        organizer: { "@id": orgId },
        inLanguage: "es-CL",
        image: [`${siteUrl}/opengraph-image`],
        url: siteUrl,
        // Curated invitation model — pre-registration, capacity capped at 400.
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/#form`,
          availability: "https://schema.org/LimitedAvailability",
          validFrom: "2026-04-30",
          category: "Pre-registration / Curated invitation",
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            value: 400,
            unitText: "cupos",
          },
        },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "C-suite executives",
        },
        // Highlighted partners / sponsors
        sponsor: [
          { "@id": orgId },
          { "@type": "Organization", name: "CORFO", url: "https://www.corfo.cl" },
          {
            "@type": "Organization",
            name: "Chile Global Ventures",
            url: "https://www.chileglobalventures.cl",
          },
          {
            "@type": "EducationalOrganization",
            name: "Universidad Adolfo Ibáñez",
            url: "https://www.uai.cl",
          },
          { "@type": "Organization", name: "SCAI-Lab" },
          {
            "@type": "Organization",
            name: "Diario Financiero",
            url: "https://www.df.cl",
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: "Brinca",
        legalName: "Brinca SpA",
        description:
          "Consultora chilena de innovación, estrategia, gestión del cambio e inteligencia artificial.",
        url: "https://brinca.global",
        sameAs: [
          "https://www.brinca.com",
          "https://www.linkedin.com/company/brinca",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Santiago",
          addressCountry: "CL",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: event.contact.general,
            availableLanguage: ["Spanish", "English"],
          },
          {
            "@type": "ContactPoint",
            contactType: "sponsorship",
            email: event.contact.sponsors,
            availableLanguage: ["Spanish", "English"],
          },
          {
            "@type": "ContactPoint",
            contactType: "press",
            email: event.contact.press,
            availableLanguage: ["Spanish", "English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: siteUrl,
        name: "Impacta IA",
        description:
          "Sitio oficial del evento Impacta IA Chile — conferencia de IA para C-suite, Santiago, septiembre 2026.",
        inLanguage: "es-CL",
        publisher: { "@id": orgId },
        about: { "@id": eventId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
