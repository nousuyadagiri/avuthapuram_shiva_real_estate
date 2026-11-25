import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PropertiesExplorer } from "@/components/PropertiesExplorer";
import { getPublishedProperties } from "@/lib/data/store";

export const metadata: Metadata = {
  title: "Open Plots & Residential Land Properties",
  description:
    "Browse AVUTHAPURAM SHIVA Properties in Ibrahimpatnam, Janaharsha Dream City, and Telangana. Filter residential open plots by location, dimensions, and availability status.",
  alternates: {
    canonical: "/properties",
  },
};

async function PropertiesContent() {
  const { properties, mode } = await getPublishedProperties();
  return <PropertiesExplorer properties={properties} mode={mode} />;
}

export default function PropertiesPage() {
  return (
    <>
      <section className="bg-[#111111] py-16 text-[#FFFFFF] sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Breadcrumbs
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/properties" },
            ]}
          />
          <p className="text-xs font-semibold tracking-[0.24em] text-[#C6A46C] uppercase">
            Avuthapuram Shiva Properties
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium leading-tight sm:text-5xl">
            Open Plots in Ibrahimpatnam &amp; Telangana
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#D4CFC5]">
            Explore residential land parcels curated for long-term ownership.
            Filter by locality, plot size, and current availability status.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
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
          <PropertiesContent />
        </Suspense>
      </section>
    </>
  );
}
