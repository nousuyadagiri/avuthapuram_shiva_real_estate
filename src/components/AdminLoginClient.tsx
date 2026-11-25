"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";

export function AdminLoginClient({ adminConfigured }: { adminConfigured: boolean }) {
  const router = useRouter();
  const id = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "Sign in failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error during sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md border border-[#E3DED4] bg-[#FFFFFF] p-8 sm:p-10">
      <div className="mb-8 border-b border-[#E3DED4] pb-6">
        <div className="inline-flex h-10 w-10 items-center justify-center border border-[#C6A46C] bg-[#111111] text-[#C6A46C]">
          <Lock className="h-4 w-4" aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-serif text-3xl font-medium text-[#111111]">
          Admin Portal Sign In
        </h1>
        <p className="mt-2 text-sm text-[#57534E]">
          Server-verified access for managing AVUTHAPURAM SHIVA REAL ESTATE listings and enquiries.
        </p>
      </div>

      {!adminConfigured && (
        <div
          role="alert"
          className="mb-6 border border-[#8A672E] bg-[#FDF9F0] p-4 text-xs leading-relaxed text-[#78531D]"
        >
          <p className="font-semibold uppercase tracking-[0.1em]">
            Server Configuration Required
          </p>
          <p className="mt-1">
            Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code>, and{" "}
            <code>ADMIN_SESSION_SECRET</code> (at least 16 characters) in{" "}
            <code>.env.local</code> or Vercel Environment Variables to enable sign-in. No
            credentials are stored in client code.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor={`${id}-email`}
            className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
          >
            Admin Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="username"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-field-control w-full border border-[#CFC8BC] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111111]"
          />
        </div>

        <div>
          <label
            htmlFor={`${id}-password`}
            className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
          >
            Password
          </label>
          <div className="relative">
            <input
              id={`${id}-password`}
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-field-control w-full border border-[#CFC8BC] bg-[#FFFFFF] py-2.5 pr-12 pl-3.5 text-sm text-[#111111]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 inline-flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center text-[#57534E] hover:text-[#111111]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 border border-[#b91c1c] bg-[#FEF2F2] p-3.5 text-xs text-[#7F1D1D]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !adminConfigured}
          className="inline-flex min-h-[48px] w-full items-center justify-center bg-[#111111] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#FFFFFF] uppercase transition-colors hover:bg-[#292929] disabled:opacity-50"
        >
          {submitting ? "Verifying..." : "Sign In to Admin Dashboard"}
        </button>
      </form>
    </div>
  );
}

