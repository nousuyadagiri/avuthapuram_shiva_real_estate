import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Compass,
  FileCheck2,
  Handshake,
  Landmark,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { getTelHref, getWhatsAppHref, siteConfig } from "@/config/site";
import { getPublishedProperties } from "@/lib/data/store";
import { PropertyCard } from "@/components/PropertyCard";

export const metadata: Metadata = {
  title:
    "AVUTHAPURAM SHIVA REAL ESTATE | Open Plots in Ibrahimpatnam & Residential Land in Telangana",
  description:
    "AVUTHAPURAM SHIVA REAL ESTATE, founded by Avuthapuram Shiva in Ibrahimpatnam, Janaharsha Dream City, Telangana, specializes in open plot buying, open plot selling, and residential land advisory.",
  alternates: {
    canonical: "/",
  },
};

async function FeaturedPropertiesGrid() {
  const { properties, mode } = await getPublishedProperties();
  const featured = properties.filter((p) => p.isFeatured).slice(0, 3);
  const displayList = featured.length > 0 ? featured : properties.slice(0, 3);
  const hasSample = displayList.some((p) => p.isSample);

  return (
    <div className="space-y-8">
      {(mode === "preview" || hasSample) && (
        <div
          role="note"
          className="border border-[#C6A46C] bg-[#FFFFFF] px-5 py-4 text-sm text-[#292929]"
        >
          <p className="font-medium text-[#111111]">
            Sample Development Preview Mode
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#57534E]">
            The listings displayed below are clearly marked sample entries for
            layout and presentation demonstration. They are not live inventory,
            verified approvals, or quoted offers. Live listings are published
            through the Admin Dashboard.
          </p>
        </div>
      )}

      {displayList.length === 0 ? (
        <div className="border border-[#E3DED4] bg-[#FFFFFF] p-10 text-center">
          <p className="font-serif text-2xl text-[#111111]">
            Verified Inventory Currently Updating
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#57534E]">
            Contact AVUTHAPURAM SHIVA REAL ESTATE directly for current
            residential open plot opportunities in Ibrahimpatnam and Janaharsha
            Dream City, Telangana.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-[44px] items-center bg-[#111111] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#FFFFFF] uppercase"
          >
            Request Current Availability
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayList.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Cinematic Hero Section */}
      <section className="relative overflow-hidden bg-[#111111] text-[#FFFFFF]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-estate.jpg"
            alt="Aerial view of demarcated open residential land parcels in Telangana at golden hour"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div
            className="absolute inset-0 bg-[#111111]/55"
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.26em] text-[#C6A46C] uppercase">
              AVUTHAPURAM SHIVA REAL ESTATE &bull; Ibrahimpatnam, Janaharsha
              Dream City, Telangana
            </p>
            <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-[#FFFFFF] sm:text-6xl lg:text-7xl">
              Discover Your Land. Secure Your Future.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#E7E3DA] sm:text-lg">
              Founded by {siteConfig.founder}, AVUTHAPURAM SHIVA REAL ESTATE
              delivers disciplined, transparent guidance for open plot buying,
              open plot selling, and residential land properties across
              Ibrahimpatnam, Janaharsha Dream City, and the broader Hyderabad
              growth corridor in Telangana.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/properties"
                className="inline-flex min-h-[52px] items-center justify-center gap-3 bg-[#C6A46C] px-8 py-3.5 text-xs font-semibold tracking-[0.18em] text-[#111111] uppercase transition-colors hover:bg-[#D5B784]"
              >
                <span>Explore Properties</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center border border-[#FFFFFF]/60 bg-[#111111]/50 px-8 py-3.5 text-xs font-semibold tracking-[0.18em] text-[#FFFFFF] uppercase transition-colors hover:border-[#C6A46C] hover:text-[#C6A46C]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Specialization Strip */}
      <section className="border-b border-[#E3DED4] bg-[#FFFFFF]">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#E3DED4] px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
          <div className="py-8 md:pr-8">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8A672E] uppercase">
              01 &bull; Specialization
            </p>
            <h2 className="mt-2 font-serif text-2xl font-medium text-[#111111]">
              Open Plot Buying
            </h2>
            <p className="mt-2 text-sm text-[#57534E]">
              Dedicated parcel identification, boundary orientation review, and
              guided site inspections for residential plot buyers.
            </p>
          </div>
          <div className="py-8 md:px-8">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8A672E] uppercase">
              02 &bull; Specialization
            </p>
            <h2 className="mt-2 font-serif text-2xl font-medium text-[#111111]">
              Open Plot Selling
            </h2>
            <p className="mt-2 text-sm text-[#57534E]">
              Structured representation for landowners seeking qualified buyers
              and clear, documented land transactions.
            </p>
          </div>
          <div className="py-8 md:pl-8">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8A672E] uppercase">
              03 &bull; Specialization
            </p>
            <h2 className="mt-2 font-serif text-2xl font-medium text-[#111111]">
              Residential Land Properties
            </h2>
            <p className="mt-2 text-sm text-[#57534E]">
              Focused advisory across Ibrahimpatnam, Janaharsha Dream City, and
              neighboring Telangana residential land markets.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Properties Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-[#E3DED4] pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#8A672E] uppercase">
              Avuthapuram Shiva Properties
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium text-[#111111] sm:text-4xl">
              Featured Open Plots &amp; Land Listings
            </h2>
          </div>
          <Link
            href="/properties"
            className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase hover:text-[#8A672E]"
          >
            <span>View All Properties</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="h-96 animate-pulse border border-[#E3DED4] bg-[#FFFFFF]"
                />
              ))}
            </div>
          }
        >
          <FeaturedPropertiesGrid />
        </Suspense>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="border-y border-[#E3DED4] bg-[#FFFFFF] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#8A672E] uppercase">
              Why Choose Us
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium text-[#111111] sm:text-4xl">
              Principled Real Estate Advisory Built on Accuracy
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#57534E] sm:text-base">
              Buying or selling open residential land requires clarity, physical
              verification, and local ground knowledge—never exaggerated claims.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-[#E3DED4] bg-[#F8F7F4] p-6">
              <Landmark className="h-6 w-6 text-[#8A672E]" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-xl font-medium text-[#111111]">
                Singular Land Focus
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#57534E]">
                Dedicated exclusively to open plots and residential land
                properties rather than diluted brokerage categories.
              </p>
            </div>

            <div className="border border-[#E3DED4] bg-[#F8F7F4] p-6">
              <FileCheck2
                className="h-6 w-6 text-[#8A672E]"
                aria-hidden="true"
              />
              <h3 className="mt-5 font-serif text-xl font-medium text-[#111111]">
                Fact-First Presentation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#57534E]">
                Pricing, dimensions, and documentation notes are communicated
                only when verified and supplied for the parcel.
              </p>
            </div>

            <div className="border border-[#E3DED4] bg-[#F8F7F4] p-6">
              <Compass className="h-6 w-6 text-[#8A672E]" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-xl font-medium text-[#111111]">
                Local Micro-Market Depth
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#57534E]">
                On-the-ground familiarity with Ibrahimpatnam, Janaharsha Dream
                City, and emerging residential pockets across Telangana.
              </p>
            </div>

            <div className="border border-[#E3DED4] bg-[#F8F7F4] p-6">
              <ShieldCheck
                className="h-6 w-6 text-[#8A672E]"
                aria-hidden="true"
              />
              <h3 className="mt-5 font-serif text-xl font-medium text-[#111111]">
                Founder Accountability
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#57534E]">
                Direct stewardship under founder {siteConfig.founder},
                prioritizing long-term client trust and disciplined site
                coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Services Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-[#E3DED4] pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#8A672E] uppercase">
              Our Services
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium text-[#111111] sm:text-4xl">
              End-to-End Open Plot Representation
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase hover:text-[#8A672E]"
          >
            <span>Explore All Services</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              id: "buying",
              title: "Open Plot Buying Assistance",
              desc: "Requirement mapping, shortlisted open plots in Ibrahimpatnam and Hyderabad surroundings, dimension comparison, and acquisition coordination.",
            },
            {
              id: "selling",
              title: "Open Plot Selling Assistance",
              desc: "Structured property presentation, buyer qualification, and transparent communication for residential landowners looking to sell.",
            },
            {
              id: "information",
              title: "Property Information",
              desc: "Clear parcel briefs covering plot dimensions, approach road orientation, locality context, and available documentation status.",
            },
            {
              id: "site-visits",
              title: "Site Visit Coordination",
              desc: "Scheduled, accompanied on-site walkthroughs in Janaharsha Dream City and Ibrahimpatnam so buyers can inspect boundaries and surroundings firsthand.",
            },
          ].map((service) => (
            <article
              key={service.id}
              className="flex flex-col justify-between border border-[#E3DED4] bg-[#FFFFFF] p-8"
            >
              <div>
                <Handshake
                  className="h-5 w-5 text-[#8A672E]"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-serif text-2xl font-medium text-[#111111]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#57534E]">
                  {service.desc}
                </p>
              </div>
              <Link
                href={`/services#${service.id}`}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase hover:text-[#8A672E]"
              >
                <span>Learn More</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Location Highlights Section */}
      <section className="bg-[#111111] py-20 text-[#F8F7F4]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#C6A46C] uppercase">
              Location Highlights
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[#FFFFFF] sm:text-4xl">
              Ibrahimpatnam &amp; Janaharsha Dream City, Telangana
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#D4CFC5] sm:text-base">
              Positioned along the southeastern residential corridor of
              Hyderabad in Telangana, Ibrahimpatnam and the Janaharsha Dream
              City area attract homebuilders and long-term land buyers seeking
              open residential plots away from dense urban congestion.
            </p>

            <ul className="mt-8 space-y-4 border-t border-[#292929] pt-6 text-sm text-[#D4CFC5]">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#C6A46C]"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-medium text-[#FFFFFF]">
                    AVUTHAPURAM SHIVA Real Estate Ibrahimpatnam:
                  </strong>{" "}
                  Local presence rooted in Janaharsha Dream City and
                  Ibrahimpatnam, Telangana.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#C6A46C]"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-medium text-[#FFFFFF]">
                    Open Plots in Ibrahimpatnam &amp; Hyderabad Region:
                  </strong>{" "}
                  Convenient regional road access toward greater Hyderabad
                  residential and educational zones.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#C6A46C]"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-medium text-[#FFFFFF]">
                    Residential Plots in Telangana:
                  </strong>{" "}
                  Focused on clear-title residential land parcels suitable for
                  future home construction or long-term land holding.
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={getTelHref()}
                className="inline-flex min-h-[48px] items-center gap-2 border border-[#C6A46C] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#C6A46C] uppercase transition-colors hover:bg-[#C6A46C] hover:text-[#111111]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Schedule a Consultation</span>
              </a>
              <a
                href={getWhatsAppHref(
                  "Hello AVUTHAPURAM SHIVA REAL ESTATE, I would like to learn about residential plots in Ibrahimpatnam & Janaharsha Dream City.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center bg-[#FFFFFF] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase transition-colors hover:bg-[#F8F7F4]"
              >
                WhatsApp Advisory
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden border border-[#292929]">
              <Image
                src="/images/plot-corridor.jpg"
                alt="Residential open land parcels and approach road in the Ibrahimpatnam, Telangana region"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
