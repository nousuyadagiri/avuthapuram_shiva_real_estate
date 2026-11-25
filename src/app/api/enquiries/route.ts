import { NextResponse } from "next/server";
import { createEnquiryRecord } from "@/lib/data/store";
import type { EnquiryType } from "@/types/real-estate";

const ALLOWED_TYPES: EnquiryType[] = [
  "General Enquiry",
  "Property Enquiry",
  "Buying Assistance",
  "Selling Assistance",
  "Site Visit",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Silently discard spam trapped in honeypot
    if (typeof body.companyWebsite === "string" && body.companyWebsite.trim() !== "") {
      return NextResponse.json({
        ok: true,
        persisted: false,
        message: "Thank you for contacting AVUTHAPURAM SHIVA REAL ESTATE.",
      });
    }

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const preferredContact =
      typeof body.preferredContact === "string" && body.preferredContact.trim()
        ? body.preferredContact.trim()
        : "Phone / WhatsApp";
    const enquiryType = ALLOWED_TYPES.includes(body.enquiryType as EnquiryType)
      ? (body.enquiryType as EnquiryType)
      : "General Enquiry";
    const propertyId = typeof body.propertyId === "string" ? body.propertyId : null;
    const propertyTitle = typeof body.propertyTitle === "string" ? body.propertyTitle : null;

    if (fullName.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please enter your full name." },
        { status: 400 },
      );
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid 10 to 15 digit phone number." },
        { status: 400 },
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Please enter at least 10 characters in your message." },
        { status: 400 },
      );
    }

    const result = await createEnquiryRecord({
      propertyId,
      propertyTitle,
      enquiryType,
      fullName,
      phone,
      email,
      preferredContact,
      message,
    });

    return NextResponse.json(
      {
        ok: true,
        persisted: result.persisted,
        enquiryId: result.enquiryId,
        message: result.persisted
          ? "Your enquiry has been recorded. Our advisory desk will reach out shortly."
          : "Your enquiry passed validation, but database storage (Supabase) is not yet configured in this preview environment.",
      },
      { status: result.persisted ? 201 : 200 },
    );
  } catch (error) {
    console.error("POST /api/enquiries failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to process enquiry at this moment." },
      { status: 500 },
    );
  }
}

