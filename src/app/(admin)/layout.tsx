'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Briefcase, Building2, LayoutDashboard, Tag, Users } from 'lucide-react';

const adminNavItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Companies', href: '/admin/companies', icon: Building2 },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { title: 'Categories', href: '/admin/categories', icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <DashboardSidebar items={adminNavItems} />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}