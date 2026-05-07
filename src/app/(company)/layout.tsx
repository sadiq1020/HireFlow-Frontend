"use client"
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Briefcase, FileText, LayoutDashboard, User } from "lucide-react";

const companyNavItems = [
  { title: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { title: "Manage Jobs", href: "/company/jobs", icon: Briefcase },
  { title: "Applications", href: "/company/applications", icon: FileText },
  { title: "Company Profile", href: "/company/profile", icon: User },
];

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar items={companyNavItems} />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}
