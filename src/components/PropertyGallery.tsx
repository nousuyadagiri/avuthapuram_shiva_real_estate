"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyImage } from "@/types/real-estate";

export function PropertyGallery({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const safeImages: PropertyImage[] =
    images.length > 0
      ? images
      : [
          {
            url: "/images/plot-enclave.jpg",
            alt: `${title} residential open plot view`,
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const current = safeImages[activeIndex] || safeImages[0];

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden border border-[#E3DED4] bg-[#111111]">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous property photograph"
              className="absolute top-1/2 left-4 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center border border-[#FFFFFF]/40 bg-[#111111]/80 text-[#FFFFFF] transition-colors hover:border-[#C6A46C] hover:text-[#C6A46C]"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next property photograph"
              className="absolute top-1/2 right-4 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center border border-[#FFFFFF]/40 bg-[#111111]/80 text-[#FFFFFF] transition-colors hover:border-[#C6A46C] hover:text-[#C6A46C]"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="absolute right-4 bottom-4 bg-[#111111]/85 px-3 py-1 text-xs font-medium tracking-[0.14em] text-[#FFFFFF]">
              {activeIndex + 1} / {safeImages.length}
            </span>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
          role="group"
          aria-label="Property photograph thumbnails"
        >
          {safeImages.map((img, idx) => {
            const selected = idx === activeIndex;
            return (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View photograph ${idx + 1}: ${img.alt}`}
                aria-pressed={selected}
                className={`relative aspect-[4/3] overflow-hidden border-2 transition-colors ${
                  selected ? "border-[#C6A46C]" : "border-[#E3DED4] opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="160px"
                  loading="lazy"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

