import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { createPropertyAdmin, getAllPropertiesAdmin } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { PropertyImage, PropertyStatus } from "@/types/real-estate";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const data = await getAllPropertiesAdmin();
  return NextResponse.json({ ok: true, ...data });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Supabase is not configured. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to persist new properties.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const locationArea =
      typeof body.locationArea === "string" ? body.locationArea.trim() : "";
    const plotDimensions =
      typeof body.plotDimensions === "string" ? body.plotDimensions.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    if (!title || !locationArea || !plotDimensions || !description) {
      return NextResponse.json(
        {
          ok: false,
          error: "Title, location area, plot dimensions, and description are required.",
        },
        { status: 400 },
      );
    }

    const baseSlug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug)
        : slugify(title);

    const status = (
      ["Available", "Limited Availability", "Reserved", "Sold"].includes(
        String(body.status),
      )
        ? body.status
        : "Available"
    ) as PropertyStatus;

    const areaSqYards =
      body.areaSqYards !== null && body.areaSqYards !== "" && body.areaSqYards !== undefined
        ? Number(body.areaSqYards)
        : null;

    const priceInr =
      body.priceInr !== null && body.priceInr !== "" && body.priceInr !== undefined
        ? Number(body.priceInr)
        : null;

    const highlights = Array.isArray(body.highlights)
      ? body.highlights.filter((x): x is string => typeof x === "string" && x.trim() !== "")
      : [];

    const images = Array.isArray(body.images)
      ? (body.images as PropertyImage[]).filter((img) => img && typeof img.url === "string" && img.url.trim() !== "")
      : [];

    const created = await createPropertyAdmin({
      slug: baseSlug || `plot-${Date.now()}`,
      title,
      subtitle: typeof body.subtitle === "string" ? body.subtitle.trim() : "",
      locationArea,
      locality:
        typeof body.locality === "string" && body.locality.trim()
          ? body.locality.trim()
          : "Ibrahimpatnam, Janardhan",
      state:
        typeof body.state === "string" && body.state.trim()
          ? body.state.trim()
          : "Telangana",
      propertyType:
        typeof body.propertyType === "string" && body.propertyType.trim()
          ? body.propertyType.trim()
          : "Residential Open Plot",
      plotDimensions,
      areaSqYards: Number.isFinite(areaSqYards) ? areaSqYards : null,
      facing:
        typeof body.facing === "string" && body.facing.trim()
          ? body.facing.trim()
          : "To be confirmed",
      roadWidth:
        typeof body.roadWidth === "string" && body.roadWidth.trim()
          ? body.roadWidth.trim()
          : "To be confirmed",
      priceInr: Number.isFinite(priceInr) ? priceInr : null,
      priceDisplay:
        typeof body.priceDisplay === "string" && body.priceDisplay.trim()
          ? body.priceDisplay.trim()
          : null,
      status,
      documentationSummary:
        typeof body.documentationSummary === "string" && body.documentationSummary.trim()
          ? body.documentationSummary.trim()
          : "Documentation details shared upon verified enquiry.",
      description,
      highlights,
      images,
      isFeatured: Boolean(body.isFeatured),
      isSample: Boolean(body.isSample),
      isPublished: body.isPublished !== false,
    });

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath(`/properties/${created.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, property: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/properties error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Create failed" },
      { status: 500 },
    );
  }
}

