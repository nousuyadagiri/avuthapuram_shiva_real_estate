import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Maximize2 } from "lucide-react";
import type { Property } from "@/types/real-estate";

function getStatusClasses(status: Property["status"]): string {
  switch (status) {
    case "Available":
      return "border-[#166534] bg-[#F0FDF4] text-[#14532D]";
    case "Limited Availability":
      return "border-[#8A672E] bg-[#FDF9F0] text-[#78531D]";
    case "Reserved":
      return "border-[#292929] bg-[#F5F5F4] text-[#292929]";
    case "Sold":
      return "border-[#991B1B] bg-[#FEF2F2] text-[#7F1D1D]";
    default:
      return "border-[#E3DED4] bg-[#FFFFFF] text-[#111111]";
  }
}

export function PropertyCard({ property }: { property: Property }) {
  const coverImage = property.images[0] || {
    url: "/images/plot-enclave.jpg",
    alt: `${property.title} in ${property.locationArea}`,
  };

  const formattedPrice =
    property.priceDisplay ||
    (property.priceInr !== null
      ? `INR ${property.priceInr.toLocaleString("en-IN")}`
      : null);

  return (
    <article className="group flex flex-col border border-[#E3DED4] bg-[#FFFFFF] transition-colors hover:border-[#C6A46C]">
      <Link href={`/properties/${property.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#292929]">
        <Image
          src={coverImage.url}
          alt={coverImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-2 p-4">
          <span
            className={`border px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase ${getStatusClasses(
              property.status,
            )}`}
          >
            {property.status}
          </span>
          {property.isSample && (
            <span className="border border-[#C6A46C] bg-[#111111]/90 px-2.5 py-1 text-[11px] font-medium tracking-[0.12em] text-[#C6A46C] uppercase">
              Sample Listing
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-[#8A672E] uppercase">
            {property.propertyType}
          </p>
          <h3 className="mt-2 font-serif text-2xl font-medium leading-snug text-[#111111]">
            <Link
              href={`/properties/${property.slug}`}
              className="hover:text-[#8A672E] transition-colors"
            >
              {property.title}
            </Link>
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-[#57534E]">
            <MapPin className="h-4 w-4 shrink-0 text-[#8A672E]" aria-hidden="true" />
            <span>
              {property.locationArea}, {property.state}
            </span>
          </p>
        </div>

        <div className="mt-6 border-t border-[#E3DED4] pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[11px] tracking-[0.14em] text-[#57534E] uppercase">
                Dimensions
              </p>
              <p className="mt-1 flex items-center gap-1.5 font-medium text-[#111111]">
                <Maximize2 className="h-3.5 w-3.5 text-[#8A672E]" aria-hidden="true" />
                <span>{property.plotDimensions}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.14em] text-[#57534E] uppercase">
                Pricing
              </p>
              <p className="mt-1 font-medium text-[#111111]">
                {formattedPrice ?? "On Request / Verified Supply"}
              </p>
            </div>
          </div>

          <Link
            href={`/properties/${property.slug}`}
            className="mt-5 inline-flex min-h-[44px] w-full items-center justify-between border border-[#111111] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-[#111111] uppercase transition-colors hover:bg-[#111111] hover:text-[#FFFFFF]"
          >
            <span>View Plot Details</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

