import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="lg:flex">
      <AdminSidebar name={session.name} />
      <div className="flex-1 min-w-0">
        <div className="container-x py-8">{children}</div>
      </div>
    </div>
  );
}
