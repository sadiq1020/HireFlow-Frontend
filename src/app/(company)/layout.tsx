'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Briefcase, Building2, LayoutDashboard, Users } from 'lucide-react';

const companyNavItems = [
  { title: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
  { title: 'My Jobs', href: '/company/jobs', icon: Briefcase },
  { title: 'Applications', href: '/company/applications', icon: Users },
  { title: 'Profile', href: '/company/profile', icon: Building2 },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <DashboardSidebar items={companyNavItems} />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}