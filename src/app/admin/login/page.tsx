import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminLoginClient } from "@/components/AdminLoginClient";
import { getAdminSession, isAdminConfigured } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: {
    index: false,
    follow: false,
  },
};

async function AdminLoginGate() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }
  return <AdminLoginClient adminConfigured={isAdminConfigured()} />;
}

export default function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
      <Suspense
        fallback={
          <div className="mx-auto h-96 max-w-md animate-pulse border border-[#E3DED4] bg-[#FFFFFF]" />
        }
      >
        <AdminLoginGate />
      </Suspense>
    </section>
  );
}

