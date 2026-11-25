"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Edit3,
  LogOut,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import type {
  DataSourceStatus,
  Enquiry,
  EnquiryStatus,
  Property,
  PropertyImage,
  PropertyStatus,
} from "@/types/real-estate";

interface AdminDashboardClientProps {
  adminEmail: string;
  initialProperties: Property[];
  initialEnquiries: Enquiry[];
  dataSourceStatus: DataSourceStatus;
}

interface PropertyDraft {
  id?: string;
  title: string;
  slug: string;
  subtitle: string;
  locationArea: string;
  locality: string;
  state: string;
  propertyType: string;
  plotDimensions: string;
  areaSqYards: string;
  facing: string;
  roadWidth: string;
  priceInr: string;
  priceDisplay: string;
  status: PropertyStatus;
  documentationSummary: string;
  description: string;
  highlightsText: string;
  images: PropertyImage[];
  isFeatured: boolean;
  isSample: boolean;
  isPublished: boolean;
}

const EMPTY_DRAFT: PropertyDraft = {
  title: "",
  slug: "",
  subtitle: "",
  locationArea: "Janardhan, Ibrahimpatnam",
  locality: "Ibrahimpatnam, Janardhan",
  state: "Telangana",
  propertyType: "Residential Open Plot",
  plotDimensions: "",
  areaSqYards: "",
  facing: "East",
  roadWidth: "30 ft",
  priceInr: "",
  priceDisplay: "",
  status: "Available",
  documentationSummary: "Verified documentation details shared upon direct enquiry.",
  description: "",
  highlightsText: "",
  images: [],
  isFeatured: false,
  isSample: false,
  isPublished: true,
};

function propertyToDraft(p: Property): PropertyDraft {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle,
    locationArea: p.locationArea,
    locality: p.locality,
    state: p.state,
    propertyType: p.propertyType,
    plotDimensions: p.plotDimensions,
    areaSqYards: p.areaSqYards !== null ? String(p.areaSqYards) : "",
    facing: p.facing,
    roadWidth: p.roadWidth,
    priceInr: p.priceInr !== null ? String(p.priceInr) : "",
    priceDisplay: p.priceDisplay || "",
    status: p.status,
    documentationSummary: p.documentationSummary,
    description: p.description,
    highlightsText: p.highlights.join("\n"),
    images: p.images,
    isFeatured: p.isFeatured,
    isSample: p.isSample,
    isPublished: p.isPublished,
  };
}

export function AdminDashboardClient({
  adminEmail,
  initialProperties,
  initialEnquiries,
  dataSourceStatus,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"properties" | "enquiries">("properties");
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);

  const [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState<PropertyDraft>(EMPTY_DRAFT);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [enquiryFilter, setEnquiryFilter] = useState<string>("all");

  const canPersist = dataSourceStatus.supabaseConfigured;

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const openNewPropertyEditor = () => {
    setDraft(EMPTY_DRAFT);
    setShowEditor(true);
    setFeedback(null);
  };

  const openEditPropertyEditor = (property: Property) => {
    setDraft(propertyToDraft(property));
    setShowEditor(true);
    setFeedback(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setFeedback({ ok: false, text: data.error || "Image upload failed." });
        return;
      }

      setDraft((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url: data.url!,
            alt: draft.title
              ? `${draft.title} in ${draft.locationArea}`
              : "Open plot photograph",
          },
        ],
      }));
      setFeedback({ ok: true, text: "Image uploaded to Supabase Storage." });
    } catch {
      setFeedback({ ok: false, text: "Network error during image upload." });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const addImageByUrl = () => {
    if (!newImageUrl.trim()) return;
    setDraft((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: newImageUrl.trim(),
          alt:
            newImageAlt.trim() ||
            `${prev.title || "Residential open plot"} in ${prev.locationArea}`,
        },
      ],
    }));
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const handleSaveProperty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canPersist) return;

    setBusy(true);
    setFeedback(null);

    const payload = {
      title: draft.title.trim(),
      slug: draft.slug.trim(),
      subtitle: draft.subtitle.trim(),
      locationArea: draft.locationArea.trim(),
      locality: draft.locality.trim(),
      state: draft.state.trim(),
      propertyType: draft.propertyType.trim(),
      plotDimensions: draft.plotDimensions.trim(),
      areaSqYards: draft.areaSqYards ? Number(draft.areaSqYards) : null,
      facing: draft.facing.trim(),
      roadWidth: draft.roadWidth.trim(),
      priceInr: draft.priceInr ? Number(draft.priceInr) : null,
      priceDisplay: draft.priceDisplay.trim() || null,
      status: draft.status,
      documentationSummary: draft.documentationSummary.trim(),
      description: draft.description.trim(),
      highlights: draft.highlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      images: draft.images,
      isFeatured: draft.isFeatured,
      isSample: draft.isSample,
      isPublished: draft.isPublished,
    };

    try {
      const isEdit = Boolean(draft.id);
      const url = isEdit
        ? `/api/admin/properties/${draft.id}`
        : "/api/admin/properties";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        property?: Property;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.property) {
        setFeedback({ ok: false, text: data.error || "Unable to save property." });
        return;
      }

      if (isEdit) {
        setProperties((prev) =>
          prev.map((item) => (item.id === data.property!.id ? data.property! : item)),
        );
      } else {
        setProperties((prev) => [data.property!, ...prev]);
      }

      setShowEditor(false);
      setFeedback({
        ok: true,
        text: isEdit ? "Property updated successfully." : "Property created successfully.",
      });
    } catch {
      setFeedback({ ok: false, text: "Network error while saving property." });
    } finally {
      setBusy(false);
    }
  };

  const handleQuickStatusChange = async (id: string, status: PropertyStatus) => {
    if (!canPersist) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { ok?: boolean; property?: Property; error?: string };
      if (res.ok && data.ok && data.property) {
        setProperties((prev) =>
          prev.map((item) => (item.id === id ? data.property! : item)),
        );
        setFeedback({ ok: true, text: `Availability updated to "${status}".` });
      } else {
        setFeedback({ ok: false, text: data.error || "Status update failed." });
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    if (!canPersist) return;
    if (!window.confirm(`Delete "${property.title}" permanently?`)) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/properties/${property.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProperties((prev) => prev.filter((item) => item.id !== property.id));
        setFeedback({ ok: true, text: "Property deleted." });
      } else {
        const data = (await res.json()) as { error?: string };
        setFeedback({ ok: false, text: data.error || "Delete failed." });
      }
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateEnquiry = async (
    id: string,
    patch: { status?: EnquiryStatus; internalNotes?: string },
  ) => {
    if (!canPersist) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { ok?: boolean; enquiry?: Enquiry; error?: string };
      if (res.ok && data.ok && data.enquiry) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? data.enquiry! : item)),
        );
        setFeedback({ ok: true, text: "Enquiry updated." });
      } else {
        setFeedback({ ok: false, text: data.error || "Enquiry update failed." });
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!canPersist) return;
    if (!window.confirm("Delete this enquiry record?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        setFeedback({ ok: true, text: "Enquiry deleted." });
      }
    } finally {
      setBusy(false);
    }
  };

  const visibleEnquiries =
    enquiryFilter === "all"
      ? enquiries
      : enquiries.filter((e) => e.status === enquiryFilter);

  return (
    <div className="space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col justify-between gap-4 border border-[#E3DED4] bg-[#111111] p-6 text-[#FFFFFF] sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C6A46C] uppercase">
            AVUTHAPURAM SHIVA REAL ESTATE &bull; Admin Console
          </p>
          <h1 className="mt-1 font-serif text-3xl font-medium">
            Inventory &amp; Enquiry Management
          </h1>
          <p className="mt-1 text-xs text-[#D4CFC5]">Signed in as {adminEmail}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-medium ${
              canPersist
                ? "border-[#166534] bg-[#14532D]/40 text-[#BBF7D0]"
                : "border-[#C6A46C] bg-[#292929] text-[#C6A46C]"
            }`}
          >
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{canPersist ? "Supabase Connected" : "Preview Mode (No DB)"}</span>
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#FFFFFF]/30 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[#FFFFFF] uppercase hover:border-[#C6A46C] hover:text-[#C6A46C]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Honest Database Connection Notice */}
      {!canPersist && (
        <div
          role="alert"
          className="flex items-start gap-3 border border-[#8A672E] bg-[#FDF9F0] p-5 text-sm text-[#78531D]"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">
              Database Persistence Not Connected (Read-Only Sample Mode)
            </p>
            <p className="mt-1 text-xs leading-relaxed">
              Supabase environment variables (<code>SUPABASE_URL</code> and{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code>) are not configured on the server.
              Create your Supabase project, run <code>supabase/schema.sql</code>, and add the
              server environment variables in Vercel or <code>.env.local</code> to enable
              creating, editing, deleting properties, uploading images, and storing enquiries.
            </p>
          </div>
        </div>
      )}

      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-2.5 border p-4 text-sm ${
            feedback.ok
              ? "border-[#166534] bg-[#F0FDF4] text-[#14532D]"
              : "border-[#b91c1c] bg-[#FEF2F2] text-[#7F1D1D]"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Admin sections"
        className="flex border-b border-[#E3DED4]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "properties"}
          onClick={() => setActiveTab("properties")}
          className={`min-h-[48px] border-b-2 px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase transition-colors ${
            activeTab === "properties"
              ? "border-[#111111] text-[#111111]"
              : "border-transparent text-[#57534E] hover:text-[#111111]"
          }`}
        >
          Properties ({properties.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "enquiries"}
          onClick={() => setActiveTab("enquiries")}
          className={`min-h-[48px] border-b-2 px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase transition-colors ${
            activeTab === "enquiries"
              ? "border-[#111111] text-[#111111]"
              : "border-transparent text-[#57534E] hover:text-[#111111]"
          }`}
        >
          Enquiries ({enquiries.length})
        </button>
      </div>

      {/* Properties Tab */}
      {activeTab === "properties" && (
        <div role="tabpanel" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-medium text-[#111111]">
              Property Listings
            </h2>
            <button
              type="button"
              onClick={openNewPropertyEditor}
              disabled={!canPersist}
              className="inline-flex min-h-[44px] items-center gap-2 bg-[#111111] px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-[#FFFFFF] uppercase disabled:opacity-40"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Property</span>
            </button>
          </div>

          {showEditor && (
            <form
              onSubmit={handleSaveProperty}
              className="space-y-6 border border-[#C6A46C] bg-[#FFFFFF] p-6 sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-[#E3DED4] pb-4">
                <h3 className="font-serif text-2xl font-medium text-[#111111]">
                  {draft.id ? "Edit Property" : "Add New Property"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="text-xs font-semibold tracking-[0.14em] text-[#57534E] uppercase hover:text-[#111111]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated-from-title"
                    value={draft.slug}
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Location Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={draft.locationArea}
                    onChange={(e) => setDraft({ ...draft, locationArea: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Plot Dimensions *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 40 ft x 60 ft"
                    value={draft.plotDimensions}
                    onChange={(e) => setDraft({ ...draft, plotDimensions: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Area (Sq. Yards)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={draft.areaSqYards}
                    onChange={(e) => setDraft({ ...draft, areaSqYards: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Availability Status
                  </label>
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      setDraft({ ...draft, status: e.target.value as PropertyStatus })
                    }
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited Availability">Limited Availability</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Price in INR (Optional — leave blank if undisclosed)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={draft.priceInr}
                    onChange={(e) => setDraft({ ...draft, priceInr: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Custom Price Label (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INR 24,500 / Sq. Yard"
                    value={draft.priceDisplay}
                    onChange={(e) => setDraft({ ...draft, priceDisplay: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Facing
                  </label>
                  <input
                    type="text"
                    value={draft.facing}
                    onChange={(e) => setDraft({ ...draft, facing: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                    Approach Road Width
                  </label>
                  <input
                    type="text"
                    value={draft.roadWidth}
                    onChange={(e) => setDraft({ ...draft, roadWidth: e.target.value })}
                    className="form-field-control w-full border border-[#CFC8BC] px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="w-full border border-[#CFC8BC] p-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                  Documentation Summary
                </label>
                <textarea
                  rows={2}
                  value={draft.documentationSummary}
                  onChange={(e) =>
                    setDraft({ ...draft, documentationSummary: e.target.value })
                  }
                  className="w-full border border-[#CFC8BC] p-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold tracking-[0.12em] uppercase">
                  Highlights (one per line)
                </label>
                <textarea
                  rows={3}
                  value={draft.highlightsText}
                  onChange={(e) => setDraft({ ...draft, highlightsText: e.target.value })}
                  className="w-full border border-[#CFC8BC] p-3 text-sm"
                />
              </div>

              {/* Property Image Uploader */}
              <div className="space-y-4 border-t border-[#E3DED4] pt-5">
                <p className="text-xs font-semibold tracking-[0.14em] uppercase">
                  Property Photographs
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-[#111111] px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#F8F7F4]">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span>{uploading ? "Uploading..." : "Upload Image to Storage"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={handleImageUpload}
                      disabled={uploading || !canPersist}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-12">
                  <input
                    type="text"
                    placeholder="Or paste image URL (/images/plot-enclave.jpg)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="form-field-control border border-[#CFC8BC] px-3 py-2 text-sm sm:col-span-5"
                  />
                  <input
                    type="text"
                    placeholder="Image alt text"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    className="form-field-control border border-[#CFC8BC] px-3 py-2 text-sm sm:col-span-5"
                  />
                  <button
                    type="button"
                    onClick={addImageByUrl}
                    className="min-h-[48px] border border-[#111111] px-4 text-xs font-semibold uppercase sm:col-span-2"
                  >
                    Add URL
                  </button>
                </div>

                {draft.images.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {draft.images.map((img, idx) => (
                      <div
                        key={`${img.url}-${idx}`}
                        className="flex items-center justify-between gap-2 border border-[#E3DED4] p-2 text-xs"
                      >
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-[#111111]">
                          <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <span className="truncate text-[#57534E]">{img.alt}</span>
                        <button
                          type="button"
                          aria-label={`Remove image ${idx + 1}`}
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }))
                          }
                          className="p-2 text-[#b91c1c]"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-6 border-t border-[#E3DED4] pt-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft.isPublished}
                    onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })}
                    className="h-4 w-4 accent-[#111111]"
                  />
                  <span>Published on Website</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft.isFeatured}
                    onChange={(e) => setDraft({ ...draft, isFeatured: e.target.checked })}
                    className="h-4 w-4 accent-[#111111]"
                  />
                  <span>Featured on Home Page</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft.isSample}
                    onChange={(e) => setDraft({ ...draft, isSample: e.target.checked })}
                    className="h-4 w-4 accent-[#111111]"
                  />
                  <span>Mark as Sample Listing</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={busy || !canPersist}
                className="inline-flex min-h-[48px] items-center bg-[#111111] px-8 py-3 text-xs font-semibold tracking-[0.16em] text-[#FFFFFF] uppercase disabled:opacity-40"
              >
                {busy ? "Saving..." : draft.id ? "Save Property Changes" : "Create Property"}
              </button>
            </form>
          )}

          {/* Properties Table */}
          <div className="overflow-x-auto border border-[#E3DED4] bg-[#FFFFFF]">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="visually-hidden">Managed Properties</caption>
              <thead className="border-b border-[#E3DED4] bg-[#F8F7F4] text-xs tracking-[0.14em] text-[#57534E] uppercase">
                <tr>
                  <th scope="col" className="px-5 py-4">Property</th>
                  <th scope="col" className="px-5 py-4">Location</th>
                  <th scope="col" className="px-5 py-4">Dimensions</th>
                  <th scope="col" className="px-5 py-4">Price</th>
                  <th scope="col" className="px-5 py-4">Status</th>
                  <th scope="col" className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED4]">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#111111]">{property.title}</p>
                      <p className="mt-0.5 text-xs text-[#57534E]">
                        {property.isSample ? "Sample" : "Verified"} &bull;{" "}
                        {property.isPublished ? "Published" : "Draft"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[#292929]">{property.locationArea}</td>
                    <td className="px-5 py-4 text-[#292929]">{property.plotDimensions}</td>
                    <td className="px-5 py-4 text-[#292929]">
                      {property.priceDisplay ||
                        (property.priceInr !== null
                          ? `INR ${property.priceInr.toLocaleString("en-IN")}`
                          : "Undisclosed")}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        aria-label={`Availability status for ${property.title}`}
                        value={property.status}
                        disabled={!canPersist || busy}
                        onChange={(e) =>
                          handleQuickStatusChange(
                            property.id,
                            e.target.value as PropertyStatus,
                          )
                        }
                        className="border border-[#CFC8BC] bg-[#FFFFFF] px-2.5 py-1.5 text-xs disabled:opacity-60"
                      >
                        <option value="Available">Available</option>
                        <option value="Limited Availability">Limited Availability</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditPropertyEditor(property)}
                          disabled={!canPersist}
                          aria-label={`Edit ${property.title}`}
                          className="inline-flex min-h-[38px] items-center gap-1 border border-[#E3DED4] px-3 py-1.5 text-xs font-medium hover:border-[#111111] disabled:opacity-40"
                        >
                          <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(property)}
                          disabled={!canPersist || busy}
                          aria-label={`Delete ${property.title}`}
                          className="inline-flex min-h-[38px] items-center gap-1 border border-[#E3DED4] px-3 py-1.5 text-xs font-medium text-[#b91c1c] hover:border-[#b91c1c] disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiries Tab */}
      {activeTab === "enquiries" && (
        <div role="tabpanel" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-medium text-[#111111]">
              Client Enquiries
            </h2>
            <select
              aria-label="Filter enquiries by status"
              value={enquiryFilter}
              onChange={(e) => setEnquiryFilter(e.target.value)}
              className="border border-[#CFC8BC] bg-[#FFFFFF] px-3.5 py-2 text-xs font-medium uppercase"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Contacted">Contacted</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {visibleEnquiries.length === 0 ? (
            <div className="border border-[#E3DED4] bg-[#FFFFFF] p-10 text-center text-sm text-[#57534E]">
              {canPersist
                ? "No enquiries match the selected filter."
                : "Enquiries will appear here once Supabase is connected."}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleEnquiries.map((enquiry) => (
                <article
                  key={enquiry.id}
                  className="border border-[#E3DED4] bg-[#FFFFFF] p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#8A672E] uppercase">
                        {enquiry.enquiryType}
                        {enquiry.propertyTitle ? ` • ${enquiry.propertyTitle}` : ""}
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-medium text-[#111111]">
                        {enquiry.fullName}
                      </h3>
                      <p className="mt-1 text-xs text-[#57534E]">
                        {enquiry.phone}
                        {enquiry.email ? ` • ${enquiry.email}` : ""} &bull; Preferred:{" "}
                        {enquiry.preferredContact}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        aria-label={`Status for enquiry from ${enquiry.fullName}`}
                        value={enquiry.status}
                        disabled={!canPersist || busy}
                        onChange={(e) =>
                          handleUpdateEnquiry(enquiry.id, {
                            status: e.target.value as EnquiryStatus,
                          })
                        }
                        className="border border-[#CFC8BC] bg-[#FFFFFF] px-3 py-2 text-xs"
                      >
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Archived">Archived</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteEnquiry(enquiry.id)}
                        disabled={!canPersist || busy}
                        aria-label={`Delete enquiry from ${enquiry.fullName}`}
                        className="inline-flex min-h-[38px] items-center border border-[#E3DED4] px-3 py-1.5 text-xs text-[#b91c1c] hover:border-[#b91c1c]"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-[#E3DED4] pt-4 text-sm text-[#292929]">
                    {enquiry.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

