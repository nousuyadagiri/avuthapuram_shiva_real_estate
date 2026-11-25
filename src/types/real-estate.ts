export type PropertyStatus =
  | "Available"
  | "Limited Availability"
  | "Reserved"
  | "Sold";

export type EnquiryType =
  | "General Enquiry"
  | "Property Enquiry"
  | "Buying Assistance"
  | "Selling Assistance"
  | "Site Visit";

export type EnquiryStatus = "New" | "In Review" | "Contacted" | "Archived";

export interface PropertyImage {
  url: string;
  alt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  locationArea: string;
  locality: string;
  state: string;
  propertyType: string;
  plotDimensions: string;
  areaSqYards: number | null;
  facing: string;
  roadWidth: string;
  priceInr: number | null;
  priceDisplay: string | null;
  status: PropertyStatus;
  documentationSummary: string;
  description: string;
  highlights: string[];
  images: PropertyImage[];
  isFeatured: boolean;
  isSample: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  propertyId: string | null;
  propertyTitle: string | null;
  enquiryType: EnquiryType;
  fullName: string;
  phone: string;
  email: string;
  preferredContact: string;
  message: string;
  status: EnquiryStatus;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterParams {
  query?: string;
  location?: string;
  status?: string;
  minSqYards?: number;
}

export interface DataSourceStatus {
  mode: "supabase" | "preview";
  supabaseConfigured: boolean;
  adminConfigured: boolean;
}

