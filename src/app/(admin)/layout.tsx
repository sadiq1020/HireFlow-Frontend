"use client"

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Briefcase, Building2, Layers, LayoutDashboard, Users } from "lucide-react";

const adminNavItems = [
  { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Companies", href: "/admin/companies", icon: Building2 },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { title: "Categories", href: "/admin/categories", icon: Layers },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar items={adminNavItems} />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}
