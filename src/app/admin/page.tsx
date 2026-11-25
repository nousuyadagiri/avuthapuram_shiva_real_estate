import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";
import { getAdminSession } from "@/lib/auth/session";
import {
  getAllEnquiriesAdmin,
  getAllPropertiesAdmin,
  getDataSourceStatus,
} from "@/lib/data/store";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

async function AdminDashboardLoader() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [{ properties }, { enquiries }, dataSourceStatus] = await Promise.all([
    getAllPropertiesAdmin(),
    getAllEnquiriesAdmin(),
    Promise.resolve(getDataSourceStatus()),
  ]);

  return (
    <AdminDashboardClient
      adminEmail={session.email}
      initialProperties={properties}
      initialEnquiries={enquiries}
      dataSourceStatus={dataSourceStatus}
    />
  );
}

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <Suspense
        fallback={
          <div className="h-96 animate-pulse border border-[#E3DED4] bg-[#FFFFFF]" />
        }
      >
        <AdminDashboardLoader />
      </Suspense>
    </section>
  );
}

