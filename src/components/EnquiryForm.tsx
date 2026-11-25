"use client";

import { useId, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { getWhatsAppHref } from "@/config/site";
import type { EnquiryType } from "@/types/real-estate";

interface EnquiryFormProps {
  defaultEnquiryType?: EnquiryType;
  propertyId?: string | null;
  propertyTitle?: string | null;
  heading?: string;
}

interface FieldErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  message?: string;
}

export function EnquiryForm({
  defaultEnquiryType = "General Enquiry",
  propertyId = null,
  propertyTitle = null,
  heading = "Submit an Enquiry",
}: EnquiryFormProps) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [enquiryType, setEnquiryType] = useState<EnquiryType>(defaultEnquiryType);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredContact, setPreferredContact] = useState("Phone / WhatsApp");
  const [message, setMessage] = useState(
    propertyTitle
      ? `I would like verified details and site visit availability regarding "${propertyTitle}".`
      : "",
  );
  const [honeypot, setHoneypot] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [submitResult, setSubmitResult] = useState<{
    ok: boolean;
    persisted?: boolean;
    message: string;
  } | null>(null);

  const validateField = (name: keyof FieldErrors, value: string): string | undefined => {
    const trimmed = value.trim();
    if (name === "fullName") {
      if (trimmed.length < 2) return "Enter your full name (at least 2 characters).";
    }
    if (name === "phone") {
      const digits = trimmed.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15) {
        return "Enter a valid 10 to 15 digit phone or WhatsApp number.";
      }
    }
    if (name === "email") {
      if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "Enter an email address in the format you@example.com.";
      }
    }
    if (name === "message") {
      if (trimmed.length < 10) {
        return "Please share at least 10 characters about your land or plot requirement.";
      }
    }
    return undefined;
  };

  const handleBlur = (name: keyof FieldErrors, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
    if (err) {
      setAnnouncement(err);
    }
  };

  const handleInput = (name: keyof FieldErrors, value: string) => {
    if (errors[name]) {
      const nextErr = validateField(name, value);
      if (!nextErr) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitResult(null);

    const nextErrors: FieldErrors = {
      fullName: validateField("fullName", fullName),
      phone: validateField("phone", phone),
      email: validateField("email", email),
      message: validateField("message", message),
    };

    setTouched({ fullName: true, phone: true, email: true, message: true });
    setErrors(nextErrors);

    const firstInvalidKey = (["fullName", "phone", "email", "message"] as const).find(
      (k) => Boolean(nextErrors[k]),
    );

    if (firstInvalidKey) {
      const fieldEl = document.getElementById(`${formId}-${firstInvalidKey}`);
      fieldEl?.focus();
      setAnnouncement(nextErrors[firstInvalidKey] || "Please review the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          propertyTitle,
          enquiryType,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          preferredContact,
          message: message.trim(),
          companyWebsite: honeypot,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        persisted?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        const errMsg =
          data.error || "Unable to submit enquiry right now. Please try WhatsApp or phone.";
        setSubmitResult({ ok: false, message: errMsg });
        setAnnouncement(errMsg);
        return;
      }

      const successMsg =
        data.message ||
        "Your enquiry has been received by AVUTHAPURAM SHIVA REAL ESTATE.";
      setSubmitResult({
        ok: true,
        persisted: data.persisted,
        message: successMsg,
      });
      setAnnouncement(successMsg);

      if (data.persisted) {
        setFullName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setTouched({});
        setErrors({});
      }
    } catch {
      const errMsg = "Network error while sending enquiry. Please use WhatsApp or click-to-call.";
      setSubmitResult({ ok: false, message: errMsg });
      setAnnouncement(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappPreviewText = `Hello AVUTHAPURAM SHIVA REAL ESTATE, my name is ${
    fullName.trim() || "a prospective client"
  }. Enquiry Type: ${enquiryType}.${
    propertyTitle ? ` Regarding: ${propertyTitle}.` : ""
  } ${message.trim() || "Please share verified open plot details."}`;

  return (
    <div className="border border-[#E3DED4] bg-[#FFFFFF] p-6 sm:p-8">
      <div className="mb-6 border-b border-[#E3DED4] pb-4">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8A672E] uppercase">
          Direct Advisory
        </p>
        <h2 className="mt-1 font-serif text-2xl font-medium text-[#111111] sm:text-3xl">
          {heading}
        </h2>
      </div>

      {/* Single polite live region for screen-reader error and status announcements */}
      <div aria-live="polite" className="visually-hidden">
        {announcement}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-label={heading}
        className="space-y-5"
      >
        {/* Honeypot anti-spam field hidden from users and assistive tech */}
        <div className="visually-hidden" aria-hidden="true">
          <label htmlFor={`${formId}-hp`}>Company Website</label>
          <input
            id={`${formId}-hp`}
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {!propertyTitle && (
          <div>
            <label
              htmlFor={`${formId}-type`}
              className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
            >
              Enquiry Topic
            </label>
            <select
              id={`${formId}-type`}
              name="enquiryType"
              value={enquiryType}
              onChange={(e) => setEnquiryType(e.target.value as EnquiryType)}
              className="form-field-control w-full border border-[#CFC8BC] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111111]"
            >
              <option value="General Enquiry">General Enquiry</option>
              <option value="Buying Assistance">Open Plot Buying Assistance</option>
              <option value="Selling Assistance">Open Plot Selling Assistance</option>
              <option value="Site Visit">Site Visit Coordination</option>
              <option value="Property Enquiry">Property Information</option>
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor={`${formId}-fullName`}
            className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
          >
            Full Name <span aria-hidden="true" className="text-[#8A672E]">*</span>
          </label>
          <input
            id={`${formId}-fullName`}
            name="fullName"
            type="text"
            required
            autoComplete="name"
            enterKeyHint="next"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              handleInput("fullName", e.target.value);
            }}
            onBlur={(e) => handleBlur("fullName", e.target.value)}
            aria-invalid={Boolean(touched.fullName && errors.fullName)}
            aria-describedby={errors.fullName ? `${formId}-fullName-err` : undefined}
            className={`form-field-control w-full border px-3.5 py-2.5 text-sm text-[#111111] ${
              touched.fullName && errors.fullName
                ? "user-invalid-fallback border-[#b91c1c] bg-[#fef2f2]"
                : "border-[#CFC8BC] bg-[#FFFFFF]"
            }`}
          />
          <p
            id={`${formId}-fullName-err`}
            data-visible={Boolean(touched.fullName && errors.fullName)}
            className="field-error-message mt-1.5 items-center gap-1.5 text-xs text-[#b91c1c]"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{errors.fullName}</span>
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`${formId}-phone`}
              className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
            >
              Phone / WhatsApp <span aria-hidden="true" className="text-[#8A672E]">*</span>
            </label>
            <span id={`${formId}-phone-hint`} className="mb-1 block text-xs text-[#57534E]">
              Include country code or 10-digit Indian mobile number
            </span>
            <input
              id={`${formId}-phone`}
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              enterKeyHint="next"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                handleInput("phone", e.target.value);
              }}
              onBlur={(e) => handleBlur("phone", e.target.value)}
              aria-invalid={Boolean(touched.phone && errors.phone)}
              aria-describedby={
                errors.phone
                  ? `${formId}-phone-hint ${formId}-phone-err`
                  : `${formId}-phone-hint`
              }
              className={`form-field-control w-full border px-3.5 py-2.5 text-sm text-[#111111] ${
                touched.phone && errors.phone
                  ? "user-invalid-fallback border-[#b91c1c] bg-[#fef2f2]"
                  : "border-[#CFC8BC] bg-[#FFFFFF]"
              }`}
            />
            <p
              id={`${formId}-phone-err`}
              data-visible={Boolean(touched.phone && errors.phone)}
              className="field-error-message mt-1.5 items-center gap-1.5 text-xs text-[#b91c1c]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.phone}</span>
            </p>
          </div>

          <div>
            <label
              htmlFor={`${formId}-email`}
              className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
            >
              Email Address (Optional)
            </label>
            <span id={`${formId}-email-hint`} className="mb-1 block text-xs text-[#57534E]">
              Format: you@example.com
            </span>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="next"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInput("email", e.target.value);
              }}
              onBlur={(e) => handleBlur("email", e.target.value)}
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={
                errors.email
                  ? `${formId}-email-hint ${formId}-email-err`
                  : `${formId}-email-hint`
              }
              className={`form-field-control w-full border px-3.5 py-2.5 text-sm text-[#111111] ${
                touched.email && errors.email
                  ? "user-invalid-fallback border-[#b91c1c] bg-[#fef2f2]"
                  : "border-[#CFC8BC] bg-[#FFFFFF]"
              }`}
            />
            <p
              id={`${formId}-email-err`}
              data-visible={Boolean(touched.email && errors.email)}
              className="field-error-message mt-1.5 items-center gap-1.5 text-xs text-[#b91c1c]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.email}</span>
            </p>
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase">
            Preferred Response Channel
          </legend>
          <div className="flex flex-wrap gap-5">
            {["Phone / WhatsApp", "Phone Call", "Email"].map((option) => (
              <label
                key={option}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-[#292929]"
              >
                <input
                  type="radio"
                  name="preferredContact"
                  value={option}
                  checked={preferredContact === option}
                  onChange={(e) => setPreferredContact(e.target.value)}
                  className="h-4 w-4 accent-[#111111]"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor={`${formId}-message`}
            className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
          >
            Requirement Details <span aria-hidden="true" className="text-[#8A672E]">*</span>
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={4}
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleInput("message", e.target.value);
            }}
            onBlur={(e) => handleBlur("message", e.target.value)}
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={errors.message ? `${formId}-message-err` : undefined}
            className={`form-field-control w-full border px-3.5 py-2.5 text-sm text-[#111111] ${
              touched.message && errors.message
                ? "user-invalid-fallback border-[#b91c1c] bg-[#fef2f2]"
                : "border-[#CFC8BC] bg-[#FFFFFF]"
            }`}
          />
          <p
            id={`${formId}-message-err`}
            data-visible={Boolean(touched.message && errors.message)}
            className="field-error-message mt-1.5 items-center gap-1.5 text-xs text-[#b91c1c]"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{errors.message}</span>
          </p>
        </div>

        {submitResult && (
          <div
            role="status"
            className={`flex items-start gap-3 border p-4 text-sm ${
              submitResult.ok
                ? "border-[#166534] bg-[#F0FDF4] text-[#14532D]"
                : "border-[#b91c1c] bg-[#FEF2F2] text-[#7F1D1D]"
            }`}
          >
            {submitResult.ok ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <div>
              <p className="font-medium">{submitResult.message}</p>
              {submitResult.ok && submitResult.persisted === false && (
                <p className="mt-1 text-xs">
                  Preview environment note: Connect Supabase (`SUPABASE_URL` &amp;
                  `SUPABASE_SERVICE_ROLE_KEY`) to store submissions in your database, or send
                  directly via WhatsApp below.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center bg-[#111111] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#FFFFFF] uppercase transition-colors hover:bg-[#292929] disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Send Enquiry"}
          </button>

          <a
            href={getWhatsAppHref(whatsappPreviewText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-[#111111] px-5 py-3 text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase transition-colors hover:bg-[#F8F7F4]"
          >
            <MessageCircle className="h-4 w-4 text-[#8A672E]" aria-hidden="true" />
            <span>Send via WhatsApp</span>
          </a>
        </div>
      </form>
    </div>
  );
}

