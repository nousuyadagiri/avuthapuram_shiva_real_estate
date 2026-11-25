import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, FileText, Handshake, MapPinned } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getTelHref, getWhatsAppHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Services | Open Plot Buying & Selling Assistance",
  description:
    "Explore AVUTHAPURAM SHIVA REAL ESTATE services in Ibrahimpatnam, Janardhan, Telangana: open plot buying assistance, open plot selling assistance, property information, and site visit coordination.",
  alternates: {
    canonical: "/services",
  },
};

const SERVICES = [
  {
    id: "buying",
    number: "01",
    icon: Handshake,
    title: "Open Plot Buying Assistance",
    summary:
      "Structured guidance for individuals and families seeking residential open plots in Ibrahimpatnam, Janardhan, and greater Hyderabad corridors.",
    points: [
      "Requirement assessment by budget, plot dimension, and preferred facing",
      "Shortlisting of residential land options matched to your holding horizon",
      "Transparent facilitation between buyer and verified landowner",
    ],
  },
  {
    id: "selling",
    number: "02",
    icon: Compass,
    title: "Open Plot Selling Assistance",
    summary:
      "Focused representation for plot owners looking to present their residential land accurately to serious, qualified buyers.",
    points: [
      "Accurate presentation of plot dimensions, road access, and location context",
      "Qualified buyer screening to minimize unproductive enquiries",
      "Coordinated site inspections and structured negotiation support",
    ],
  },
  {
    id: "information",
    number: "03",
    icon: FileText,
    title: "Property Information",
    summary:
      "Clear, factual parcel briefs so clients can review essential land details prior to making an on-site visit or legal review.",
    points: [
      "Plot dimensions, square-yard area, facing, and approach road notes",
      "Status of available documentation shared directly without unverified claims",
      "Clear distinction between indicative sample previews and live verified parcels",
    ],
  },
  {
    id: "site-visits",
    number: "04",
    icon: MapPinned,
    title: "Site Visit Coordination",
    summary:
      "Planned, accompanied on-ground plot visits in Ibrahimpatnam and Janardhan so you can inspect boundaries and neighborhood surroundings directly.",
    points: [
      "Scheduled appointments aligned with your availability",
      "Physical walkthrough of boundary markers and approach roads",
      "Direct Q&A with AVUTHAPURAM SHIVA REAL ESTATE advisory during the visit",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-[#111111] py-16 text-[#FFFFFF] sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Breadcrumbs
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
            ]}
          />
          <p className="text-xs font-semibold tracking-[0.24em] text-[#C6A46C] uppercase">
            Advisory Scope
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium leading-tight sm:text-5xl">
            Dedicated Services for Open Plots &amp; Residential Land
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#D4CFC5]">
            Every service at AVUTHAPURAM SHIVA REAL ESTATE is built to make buying or selling residential
            plots in Telangana straightforward, documented, and grounded in local reality.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="space-y-8">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                id={service.id}
                className="scroll-mt-24 grid gap-8 border border-[#E3DED4] bg-[#FFFFFF] p-8 lg:grid-cols-12 lg:p-10"
              >
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-[0.2em] text-[#8A672E]">
                      {service.number}
                    </span>
                    <Icon className="h-5 w-5 text-[#8A672E]" aria-hidden="true" />
                  </div>
                  <h2 className="mt-3 font-serif text-3xl font-medium text-[#111111]">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#57534E] sm:text-base">
                    {service.summary}
                  </p>
                </div>

                <div className="flex flex-col justify-between border-t border-[#E3DED4] pt-6 lg:col-span-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                  <ul className="space-y-3 text-sm text-[#292929]">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#C6A46C]"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex min-h-[44px] items-center gap-2 bg-[#111111] px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-[#FFFFFF] uppercase hover:bg-[#292929]"
                    >
                      <span>Request This Service</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    <a
                      href={getWhatsAppHref(
                        `Hello AVUTHAPURAM SHIVA REAL ESTATE, I would like assistance with ${service.title}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center border border-[#111111] px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-[#111111] uppercase hover:bg-[#F8F7F4]"
                    >
                      WhatsApp Enquiry
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 border border-[#E3DED4] bg-[#111111] p-8 text-[#F8F7F4] sm:flex sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="font-serif text-2xl font-medium text-[#FFFFFF] sm:text-3xl">
              Planning a site visit in Ibrahimpatnam or Janardhan?
            </h2>
            <p className="mt-2 text-sm text-[#D4CFC5]">
              Call directly or browse our property showcase to see how parcels are structured.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 sm:mt-0">
            <a
              href={getTelHref()}
              className="inline-flex min-h-[48px] items-center border border-[#C6A46C] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#C6A46C] uppercase hover:bg-[#C6A46C] hover:text-[#111111]"
            >
              Call Advisory
            </a>
            <Link
              href="/properties"
              className="inline-flex min-h-[48px] items-center bg-[#FFFFFF] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase hover:bg-[#F8F7F4]"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

