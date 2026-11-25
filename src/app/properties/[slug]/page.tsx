import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, FileCheck2, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PropertyGallery } from "@/components/PropertyGallery";
import { getTelHref, getWhatsAppHref } from "@/config/site";
import { SAMPLE_PROPERTIES } from "@/lib/data/sample-properties";
import { getPropertyBySlug } from "@/lib/data/store";

export async function generateStaticParams() {
  return SAMPLE_PROPERTIES.map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { property } = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found",
      description: "The requested open plot listing could not be found.",
    };
  }

  return {
    title: `${property.title} | ${property.locationArea}`,
    description: `${property.title} in ${property.locationArea}, ${property.state}. Dimensions: ${property.plotDimensions}. Status: ${property.status}.`,
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
    openGraph: {
      title: `${property.title} | AVUTHAPURAM SHIVA REAL ESTATE`,
      description: property.subtitle || property.description.slice(0, 155),
      images: property.images[0]
        ? [{ url: property.images[0].url, alt: property.images[0].alt }]
        : undefined,
    },
  };
}

async function PropertyDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const { property } = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const formattedPrice =
    property.priceDisplay ||
    (property.priceInr !== null
      ? `INR ${property.priceInr.toLocaleString("en-IN")}`
      : "Shared upon verified enquiry");

  const whatsappMessage = `Hello AVUTHAPURAM SHIVA REAL ESTATE, I am enquiring about "${property.title}" (${property.locationArea}, ${property.plotDimensions}). Please share verified details.`;

  return (
    <>
      <section className="bg-[#111111] py-14 text-[#FFFFFF]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Breadcrumbs
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/properties" },
              { label: property.title, href: `/properties/${property.slug}` },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-[#C6A46C] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#C6A46C] uppercase">
              {property.status}
            </span>
            {property.isSample && (
              <span className="bg-[#FFFFFF] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase">
                Sample Development Listing
              </span>
            )}
          </div>

          <h1 className="mt-4 max-w-4xl font-serif text-3xl font-medium leading-tight sm:text-5xl">
            {property.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-[#D4CFC5] sm:text-base">
            <MapPin className="h-4 w-4 shrink-0 text-[#C6A46C]" aria-hidden="true" />
            <span>
              {property.locationArea}, {property.locality}, {property.state}
            </span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8">
          <Link
            href="/properties"
            className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase hover:text-[#8A672E]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to All Properties</span>
          </Link>
        </div>

        {property.isSample && (
          <div
            role="note"
            className="mb-8 border border-[#C6A46C] bg-[#FFFFFF] p-5 text-sm text-[#292929]"
          >
            <p className="font-semibold text-[#111111]">
              Sample Listing Disclosure
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#57534E] sm:text-sm">
              This is an illustrative sample property for presentation during website setup. It
              does not represent a live commercial offer, verified title record, or RERA
              registration.
            </p>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <PropertyGallery images={property.images} title={property.title} />

            <div className="border border-[#E3DED4] bg-[#FFFFFF] p-7">
              <h2 className="font-serif text-2xl font-medium text-[#111111]">
                Property Overview
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#292929] sm:text-base">
                {property.description}
              </p>

              {property.highlights.length > 0 && (
                <div className="mt-6 border-t border-[#E3DED4] pt-6">
                  <h3 className="text-xs font-semibold tracking-[0.18em] text-[#8A672E] uppercase">
                    Key Highlights
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {property.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#292929]">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#C6A46C]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Semantic Specification Table */}
            <div className="border border-[#E3DED4] bg-[#FFFFFF] p-7">
              <h2 className="font-serif text-2xl font-medium text-[#111111]">
                Plot Specifications
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="visually-hidden">
                    Specifications for {property.title}
                  </caption>
                  <tbody className="divide-y divide-[#E3DED4]">
                    <tr>
                      <th scope="row" className="py-3.5 pr-4 font-medium text-[#57534E]">
                        Property Type
                      </th>
                      <td className="py-3.5 font-medium text-[#111111]">
                        {property.propertyType}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 pr-4 font-medium text-[#57534E]">
                        Location
                      </th>
                      <td className="py-3.5 font-medium text-[#111111]">
                        {property.locationArea}, {property.state}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 pr-4 font-medium text-[#57534E]">
                        Plot Dimensions
                      </th>
                      <td className="py-3.5 font-medium text-[#111111]">
                        {property.plotDimensions}
                      </td>
                    </tr>
                    {property.areaSqYards !== null && (
                      <tr>
                        <th scope="row" className="py-3.5 pr-4 font-medium text-[#57534E]">
                          Plot Area
                        </th>
                        <td className="py-3.5 font-medium text-[#111111]">
                          {property.areaSqYards} Sq. Yards
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th scope="row" className="py-3.5 pr-4 font-medium text-[#57534E]">
                        Facing
                      </th>
                      <td className="py-3.5 font-medium text-[#111111]">{property.facing}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 pr-4 font-medium text-[#57534E]">
                        Approach Road
                      </th>
                      <td className="py-3.5 font-medium text-[#111111]">{property.roadWidth}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 pr-4 font-medium text-[#57534E]">
                        Availability Status
                      </th>
                      <td className="py-3.5 font-medium text-[#111111]">{property.status}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 pr-4 font-medium text-[#57534E]">
                        Pricing
                      </th>
                      <td className="py-3.5 font-medium text-[#111111]">{formattedPrice}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Available Documentation Information */}
            <div className="border border-[#E3DED4] bg-[#FFFFFF] p-7">
              <div className="flex items-center gap-3">
                <FileCheck2 className="h-5 w-5 text-[#8A672E]" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-medium text-[#111111]">
                  Available Documentation Information
                </h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#292929]">
                {property.documentationSummary}
              </p>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="border border-[#E3DED4] bg-[#111111] p-7 text-[#FFFFFF]">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#C6A46C] uppercase">
                Immediate Assistance
              </p>
              <h2 className="mt-2 font-serif text-2xl font-medium">
                Discuss This Plot Directly
              </h2>
              <p className="mt-2 text-sm text-[#D4CFC5]">
                Speak with AVUTHAPURAM SHIVA REAL ESTATE to verify availability, documentation status, and
                schedule an accompanied site visit.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={getWhatsAppHref(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#C6A46C] px-5 py-3 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase hover:bg-[#D5B784]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>WhatsApp Property Enquiry</span>
                </a>
                <a
                  href={getTelHref()}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-[#C6A46C] px-5 py-3 text-xs font-semibold tracking-[0.16em] text-[#C6A46C] uppercase hover:bg-[#C6A46C] hover:text-[#111111]"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Click to Call Advisory</span>
                </a>
              </div>
            </div>

            <EnquiryForm
              defaultEnquiryType="Property Enquiry"
              propertyId={property.id}
              propertyTitle={property.title}
              heading="Enquire About This Property"
            />
          </aside>
        </div>
      </section>
    </>
  );
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="h-96 animate-pulse border border-[#E3DED4] bg-[#FFFFFF]" />
        </div>
      }
    >
      <PropertyDetailContent paramsPromise={params} />
    </Suspense>
  );
}

