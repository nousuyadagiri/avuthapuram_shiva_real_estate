import "server-only";
import { SAMPLE_PROPERTIES } from "@/lib/data/sample-properties";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdminConfigured } from "@/lib/auth/session";
import type {
  DataSourceStatus,
  Enquiry,
  EnquiryStatus,
  EnquiryType,
  Property,
  PropertyFilterParams,
  PropertyImage,
  PropertyStatus,
} from "@/types/real-estate";

interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  location_area: string;
  locality: string;
  state: string;
  property_type: string;
  plot_dimensions: string;
  area_sq_yards: number | null;
  facing: string;
  road_width: string;
  price_inr: number | null;
  price_display: string | null;
  status: PropertyStatus;
  documentation_summary: string;
  description: string;
  highlights: string[] | null;
  images: PropertyImage[] | null;
  is_featured: boolean;
  is_sample: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface EnquiryRow {
  id: string;
  property_id: string | null;
  property_title: string | null;
  enquiry_type: EnquiryType;
  full_name: string;
  phone: string;
  email: string;
  preferred_contact: string;
  message: string;
  status: EnquiryStatus;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || "",
    locationArea: row.location_area,
    locality: row.locality || "Ibrahimpatnam, Janardhan",
    state: row.state || "Telangana",
    propertyType: row.property_type || "Residential Open Plot",
    plotDimensions: row.plot_dimensions,
    areaSqYards: row.area_sq_yards !== null ? Number(row.area_sq_yards) : null,
    facing: row.facing || "To be confirmed",
    roadWidth: row.road_width || "To be confirmed",
    priceInr: row.price_inr !== null ? Number(row.price_inr) : null,
    priceDisplay: row.price_display || null,
    status: row.status,
    documentationSummary: row.documentation_summary,
    description: row.description,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    images: Array.isArray(row.images) ? row.images : [],
    isFeatured: Boolean(row.is_featured),
    isSample: Boolean(row.is_sample),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEnquiryRow(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    propertyId: row.property_id,
    propertyTitle: row.property_title,
    enquiryType: row.enquiry_type,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email || "",
    preferredContact: row.preferred_contact || "Phone / WhatsApp",
    message: row.message,
    status: row.status,
    internalNotes: row.internal_notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getDataSourceStatus(): DataSourceStatus {
  const supabaseConfigured = isSupabaseConfigured();
  return {
    mode: supabaseConfigured ? "supabase" : "preview",
    supabaseConfigured,
    adminConfigured: isAdminConfigured(),
  };
}

export function filterPropertiesList(
  items: Property[],
  filters: PropertyFilterParams = {},
): Property[] {
  const query = (filters.query || "").trim().toLowerCase();
  const location = (filters.location || "").trim().toLowerCase();
  const status = (filters.status || "").trim();
  const minSqYards = filters.minSqYards || 0;

  return items.filter((item) => {
    if (query) {
      const haystack = [
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
      if (!haystack.includes(query)) return false;
    }

    if (location && location !== "all") {
      const locHaystack = `${item.locationArea} ${item.locality}`.toLowerCase();
      if (!locHaystack.includes(location)) return false;
    }

    if (status && status !== "all") {
      if (item.status !== status) return false;
    }

    if (minSqYards > 0) {
      if (!item.areaSqYards || item.areaSqYards < minSqYards) return false;
    }

    return true;
  });
}

export async function getPublishedProperties(
  filters: PropertyFilterParams = {},
): Promise<{ properties: Property[]; mode: "supabase" | "preview" }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      properties: filterPropertiesList(SAMPLE_PROPERTIES, filters),
      mode: "preview",
    };
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch published properties from Supabase:", error?.message);
    return {
      properties: filterPropertiesList(SAMPLE_PROPERTIES, filters),
      mode: "preview",
    };
  }

  const mapped = (data as PropertyRow[]).map(mapPropertyRow);
  return {
    properties: filterPropertiesList(mapped, filters),
    mode: "supabase",
  };
}

export async function getPropertyBySlug(
  slug: string,
): Promise<{ property: Property | null; mode: "supabase" | "preview" }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      property: SAMPLE_PROPERTIES.find((p) => p.slug === slug && p.isPublished) || null,
      mode: "preview",
    };
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch property by slug:", error.message);
    return { property: null, mode: "supabase" };
  }

  return {
    property: data ? mapPropertyRow(data as PropertyRow) : null,
    mode: "supabase",
  };
}

export async function getAllPropertiesAdmin(): Promise<{
  properties: Property[];
  mode: "supabase" | "preview";
}> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { properties: SAMPLE_PROPERTIES, mode: "preview" };
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw new Error(error?.message || "Failed to load admin properties");
  }

  return {
    properties: (data as PropertyRow[]).map(mapPropertyRow),
    mode: "supabase",
  };
}

export async function createPropertyAdmin(
  payload: Omit<Property, "id" | "createdAt" | "updatedAt">,
): Promise<Property> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const { data, error } = await supabase
    .from("properties")
    .insert({
      slug: payload.slug,
      title: payload.title,
      subtitle: payload.subtitle,
      location_area: payload.locationArea,
      locality: payload.locality,
      state: payload.state,
      property_type: payload.propertyType,
      plot_dimensions: payload.plotDimensions,
      area_sq_yards: payload.areaSqYards,
      facing: payload.facing,
      road_width: payload.roadWidth,
      price_inr: payload.priceInr,
      price_display: payload.priceDisplay,
      status: payload.status,
      documentation_summary: payload.documentationSummary,
      description: payload.description,
      highlights: payload.highlights,
      images: payload.images,
      is_featured: payload.isFeatured,
      is_sample: payload.isSample,
      is_published: payload.isPublished,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create property");
  }

  return mapPropertyRow(data as PropertyRow);
}

export async function updatePropertyAdmin(
  id: string,
  payload: Partial<Omit<Property, "id" | "createdAt" | "updatedAt">>,
): Promise<Property> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const patch: Record<string, unknown> = {};
  if (payload.slug !== undefined) patch.slug = payload.slug;
  if (payload.title !== undefined) patch.title = payload.title;
  if (payload.subtitle !== undefined) patch.subtitle = payload.subtitle;
  if (payload.locationArea !== undefined) patch.location_area = payload.locationArea;
  if (payload.locality !== undefined) patch.locality = payload.locality;
  if (payload.state !== undefined) patch.state = payload.state;
  if (payload.propertyType !== undefined) patch.property_type = payload.propertyType;
  if (payload.plotDimensions !== undefined) patch.plot_dimensions = payload.plotDimensions;
  if (payload.areaSqYards !== undefined) patch.area_sq_yards = payload.areaSqYards;
  if (payload.facing !== undefined) patch.facing = payload.facing;
  if (payload.roadWidth !== undefined) patch.road_width = payload.roadWidth;
  if (payload.priceInr !== undefined) patch.price_inr = payload.priceInr;
  if (payload.priceDisplay !== undefined) patch.price_display = payload.priceDisplay;
  if (payload.status !== undefined) patch.status = payload.status;
  if (payload.documentationSummary !== undefined)
    patch.documentation_summary = payload.documentationSummary;
  if (payload.description !== undefined) patch.description = payload.description;
  if (payload.highlights !== undefined) patch.highlights = payload.highlights;
  if (payload.images !== undefined) patch.images = payload.images;
  if (payload.isFeatured !== undefined) patch.is_featured = payload.isFeatured;
  if (payload.isSample !== undefined) patch.is_sample = payload.isSample;
  if (payload.isPublished !== undefined) patch.is_published = payload.isPublished;

  const { data, error } = await supabase
    .from("properties")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update property");
  }

  return mapPropertyRow(data as PropertyRow);
}

export async function deletePropertyAdmin(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function createEnquiryRecord(input: {
  propertyId?: string | null;
  propertyTitle?: string | null;
  enquiryType: EnquiryType;
  fullName: string;
  phone: string;
  email: string;
  preferredContact: string;
  message: string;
}): Promise<{ persisted: boolean; enquiryId?: string }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { persisted: false };
  }

  // Only pass property_id if it looks like a UUID (sample IDs are non-UUID strings)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const validPropertyId =
    input.propertyId && uuidRegex.test(input.propertyId) ? input.propertyId : null;

  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      property_id: validPropertyId,
      property_title: input.propertyTitle || null,
      enquiry_type: input.enquiryType,
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      preferred_contact: input.preferredContact,
      message: input.message,
      status: "New",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to save enquiry");
  }

  return { persisted: true, enquiryId: data.id as string };
}

export async function getAllEnquiriesAdmin(): Promise<{
  enquiries: Enquiry[];
  mode: "supabase" | "preview";
}> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { enquiries: [], mode: "preview" };
  }

  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw new Error(error?.message || "Failed to load enquiries");
  }

  return {
    enquiries: (data as EnquiryRow[]).map(mapEnquiryRow),
    mode: "supabase",
  };
}

export async function updateEnquiryAdmin(
  id: string,
  patch: { status?: EnquiryStatus; internalNotes?: string },
): Promise<Enquiry> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const payload: Record<string, unknown> = {};
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.internalNotes !== undefined) payload.internal_notes = patch.internalNotes;

  const { data, error } = await supabase
    .from("enquiries")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update enquiry");
  }

  return mapEnquiryRow(data as EnquiryRow);
}

export async function deleteEnquiryAdmin(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

