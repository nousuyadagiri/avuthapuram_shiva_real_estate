import { siteConfig } from "@/config/site";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/images/hero-estate.jpg`,
    founder: {
      "@type": "Person",
      name: siteConfig.founder,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ibrahimpatnam, Janardhan",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    ...(siteConfig.socials.length > 0
      ? { sameAs: siteConfig.socials.map((s) => s.href) }
      : {}),
  };
}

export function getRealEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/images/hero-estate.jpg`,
    description: siteConfig.description,
    areaServed: [
      {
        "@type": "Place",
        name: "Ibrahimpatnam, Telangana, India",
      },
      {
        "@type": "Place",
        name: "Janardhan, Ibrahimpatnam, Telangana, India",
      },
      {
        "@type": "Place",
        name: "Hyderabad Region, Telangana, India",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ibrahimpatnam, Janardhan",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    ...(siteConfig.contact.phoneConfigured
      ? { telephone: siteConfig.contact.phoneDisplay }
      : {}),
    ...(siteConfig.contact.emailConfigured
      ? { email: siteConfig.contact.email }
      : {}),
    founder: {
      "@type": "Person",
      name: siteConfig.founder,
    },
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${siteConfig.siteUrl}${item.href}`,
    })),
  };
}

