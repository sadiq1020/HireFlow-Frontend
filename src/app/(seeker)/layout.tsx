'use client';

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Bookmark, FileText, LayoutDashboard, User } from "lucide-react";

const seekerNavItems = [
  { title: "Dashboard", href: "/seeker/dashboard", icon: LayoutDashboard },
  { title: "My Applications", href: "/seeker/applications", icon: FileText },
  { title: "Saved Jobs", href: "/seeker/saved-jobs", icon: Bookmark },
  { title: "Profile", href: "/seeker/profile", icon: User },
];

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <DashboardSidebar items={seekerNavItems} />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}