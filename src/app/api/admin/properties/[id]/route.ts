import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { deletePropertyAdmin, updatePropertyAdmin } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured on the server." },
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const updated = await updatePropertyAdmin(id, body);

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath(`/properties/${updated.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, property: updated });
  } catch (error) {
    console.error("PATCH /api/admin/properties/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured on the server." },
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;
    await deletePropertyAdmin(id);

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/properties/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}

