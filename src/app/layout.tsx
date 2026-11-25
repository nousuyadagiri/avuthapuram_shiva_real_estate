import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getOrganizationSchema, getRealEstateAgentSchema } from "@/lib/seo/schema";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default:
      "AVUTHAPURAM SHIVA REAL ESTATE | Open Plots in Ibrahimpatnam & Residential Land in Telangana",
    template: "%s | AVUTHAPURAM SHIVA REAL ESTATE",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.brandName,
  publisher: siteConfig.brandName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.siteUrl,
    siteName: siteConfig.brandName,
    title: "AVUTHAPURAM SHIVA REAL ESTATE | Discover Your Land. Secure Your Future.",
    description: siteConfig.description,
    images: [
      {
        url: "/images/hero-estate.jpg",
        width: 1600,
        height: 900,
        alt: "AVUTHAPURAM SHIVA REAL ESTATE open residential land estates in Ibrahimpatnam, Telangana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AVUTHAPURAM SHIVA REAL ESTATE | Open Plots in Ibrahimpatnam, Telangana",
    description: siteConfig.description,
    images: ["/images/hero-estate.jpg"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organizationSchema = getOrganizationSchema();
  const realEstateAgentSchema = getRealEstateAgentSchema();

  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F7F4] text-[#111111]">
        <a
          href="#main-content"
          className="visually-hidden focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-[#111111] focus:text-[#FFFFFF] focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:border focus:border-[#C6A46C]"
        >
          Skip to main content
        </a>

        <JsonLd data={organizationSchema} />
        <JsonLd data={realEstateAgentSchema} />

        <SiteHeader />

        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
