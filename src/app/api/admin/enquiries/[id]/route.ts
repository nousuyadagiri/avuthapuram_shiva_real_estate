import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { deleteEnquiryAdmin, updateEnquiryAdmin } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { EnquiryStatus } from "@/types/real-estate";

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
    const body = (await request.json()) as {
      status?: EnquiryStatus;
      internalNotes?: string;
    };

    const updated = await updateEnquiryAdmin(id, body);
    return NextResponse.json({ ok: true, enquiry: updated });
  } catch (error) {
    console.error("PATCH /api/admin/enquiries/[id] error:", error);
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
    await deleteEnquiryAdmin(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/enquiries/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}

