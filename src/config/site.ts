export const siteConfig = {
  brandName: "AVUTHAPURAM SHIVA REAL ESTATE",
  shortName: "AVUTHAPURAM SHIVA",
  founder: "Avuthapuram Shiva",
  tagline: "Discover Your Land. Secure Your Future.",
  description:
    "AVUTHAPURAM SHIVA REAL ESTATE is a dedicated land advisory firm founded by Avuthapuram Shiva in Ibrahimpatnam, Janardhan, Telangana, specializing in open plot buying, open plot selling, and residential land properties.",
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.avuthapuramshivarealestate.com"
  ).replace(/\/$/, ""),
  location: {
    locality: "Ibrahimpatnam",
    area: "Janardhan",
    state: "Telangana",
    country: "India",
    displayLine: "Ibrahimpatnam, Janardhan, Telangana, India",
    addressNote:
      process.env.NEXT_PUBLIC_OFFICE_ADDRESS ||
      "Ibrahimpatnam, Janardhan, Telangana, India (Exact office address pending final verification)",
  },
  contact: {
    phoneDisplay: process.env.NEXT_PUBLIC_PHONE || "+91 00000 00000",
    phoneConfigured: Boolean(
      process.env.NEXT_PUBLIC_PHONE && !process.env.NEXT_PUBLIC_PHONE.includes("00000"),
    ),
    whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP || "910000000000").replace(/\D/g, ""),
    whatsappConfigured: Boolean(
      process.env.NEXT_PUBLIC_WHATSAPP && !process.env.NEXT_PUBLIC_WHATSAPP.includes("000000"),
    ),
    email: process.env.NEXT_PUBLIC_EMAIL || "contact@avuthapuramshivarealestate.example",
    emailConfigured: Boolean(
      process.env.NEXT_PUBLIC_EMAIL && !process.env.NEXT_PUBLIC_EMAIL.endsWith(".example"),
    ),
  },
  socials: [
    { label: "Instagram", href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "" },
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "" },
    { label: "Facebook", href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "" },
    { label: "YouTube", href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "" },
  ].filter((item) => Boolean(item.href)),
  keywords: [
    "AVUTHAPURAM SHIVA REAL ESTATE",
    "AVUTHAPURAM SHIVA Properties",
    "AVUTHAPURAM SHIVA Real Estate Ibrahimpatnam",
    "Open Plots in Ibrahimpatnam",
    "Open Plots in Hyderabad",
    "Residential Plots in Telangana",
    "Open Plot Buying and Selling Telangana",
    "Avuthapuram Shiva Real Estate",
  ],
} as const;

export function getTelHref(phone: string = siteConfig.contact.phoneDisplay): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned || "+910000000000"}`;
}

export function getWhatsAppHref(message: string): string {
  const num = siteConfig.contact.whatsappNumber || "910000000000";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${num}?text=${encoded}`;
}
