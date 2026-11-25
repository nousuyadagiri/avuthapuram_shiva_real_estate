import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getAllEnquiriesAdmin } from "@/lib/data/store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const data = await getAllEnquiriesAdmin();
  return NextResponse.json({ ok: true, ...data });
}

