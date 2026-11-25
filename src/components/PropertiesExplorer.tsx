"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import type { Property } from "@/types/real-estate";

interface PropertiesExplorerProps {
  properties: Property[];
  mode: "supabase" | "preview";
}

export function PropertiesExplorer({ properties, mode }: PropertiesExplorerProps) {
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minAreaFilter, setMinAreaFilter] = useState("0");

  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const prop of properties) {
      if (prop.locationArea) set.add(prop.locationArea);
    }
    return Array.from(set).sort();
  }, [properties]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minArea = Number(minAreaFilter) || 0;

    return properties.filter((item) => {
      if (q) {
        const text = [
          item.title,
          item.subtitle,
          item.locationArea,
          item.locality,
          item.plotDimensions,
          item.propertyType,
          item.description,
        ]
          .join(" ")
          .toLowerCase();
        if (!text.includes(q)) return false;
      }

      if (locationFilter !== "all" && item.locationArea !== locationFilter) {
        return false;
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      if (minArea > 0 && (!item.areaSqYards || item.areaSqYards < minArea)) {
        return false;
      }

      return true;
    });
  }, [properties, query, locationFilter, statusFilter, minAreaFilter]);

  const hasFilters =
    query !== "" ||
    locationFilter !== "all" ||
    statusFilter !== "all" ||
    minAreaFilter !== "0";

  const hasSamples = properties.some((p) => p.isSample);

  const resetFilters = () => {
    setQuery("");
    setLocationFilter("all");
    setStatusFilter("all");
    setMinAreaFilter("0");
  };

  return (
    <div className="space-y-10">
      {(mode === "preview" || hasSamples) && (
        <div
          role="note"
          className="border border-[#C6A46C] bg-[#FFFFFF] p-5 text-sm text-[#292929]"
        >
          <p className="font-semibold text-[#111111]">
            Important Notice — Sample Development Listings
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#57534E] sm:text-sm">
            Entries marked &ldquo;Sample Listing&rdquo; are illustrative placeholders used
            during development. AVUTHAPURAM SHIVA REAL ESTATE does not represent sample listings as verified
            live inventory, and prices or statutory approvals are never fabricated. Connect
            Supabase and manage verified plots via the Admin Dashboard.
          </p>
        </div>
      )}

      {/* Semantic <search> landmark for property filtering */}
      <search className="border border-[#E3DED4] bg-[#FFFFFF] p-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          aria-label="Filter open plots and residential land"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-4">
            <label
              htmlFor="prop-search"
              className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
            >
              Search Keyword
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A672E]"
                aria-hidden="true"
              />
              <input
                id="prop-search"
                name="q"
                type="search"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Ibrahimpatnam, Janardhan, corner plot..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-field-control w-full border border-[#CFC8BC] bg-[#FFFFFF] py-2.5 pr-3.5 pl-10 text-sm text-[#111111]"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label
              htmlFor="prop-location"
              className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
            >
              Location
            </label>
            <select
              id="prop-location"
              name="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="form-field-control w-full border border-[#CFC8BC] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111111]"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="prop-status"
              className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
            >
              Status
            </label>
            <select
              id="prop-status"
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-field-control w-full border border-[#CFC8BC] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111111]"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Limited Availability">Limited Availability</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="prop-area"
              className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
            >
              Min Area
            </label>
            <select
              id="prop-area"
              name="minArea"
              value={minAreaFilter}
              onChange={(e) => setMinAreaFilter(e.target.value)}
              className="form-field-control w-full border border-[#CFC8BC] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111111]"
            >
              <option value="0">Any Size</option>
              <option value="150">150+ Sq. Yards</option>
              <option value="200">200+ Sq. Yards</option>
              <option value="250">250+ Sq. Yards</option>
              <option value="300">300+ Sq. Yards</option>
            </select>
          </div>

          <div className="lg:col-span-1">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilters}
              aria-label="Reset property filters"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 border border-[#111111] px-3 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#111111] uppercase transition-colors hover:bg-[#111111] hover:text-[#FFFFFF] disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="lg:sr-only">Reset</span>
            </button>
          </div>
        </form>
      </search>

      <div className="flex items-center justify-between border-b border-[#E3DED4] pb-3 text-xs tracking-[0.14em] text-[#57534E] uppercase">
        <p role="status">
          Showing <strong className="text-[#111111]">{filtered.length}</strong> of{" "}
          {properties.length} {properties.length === 1 ? "listing" : "listings"}
        </p>
        <span>Pricing displayed only when verified &amp; supplied</span>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#E3DED4] bg-[#FFFFFF] p-12 text-center">
          <p className="font-serif text-2xl font-medium text-[#111111]">
            No matching plots found
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#57534E]">
            Try clearing one or more filters, or contact AVUTHAPURAM SHIVA REAL ESTATE directly with your
            plot dimension and locality requirements.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex min-h-[44px] items-center bg-[#111111] px-6 py-2.5 text-xs font-semibold tracking-[0.16em] text-[#FFFFFF] uppercase"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

