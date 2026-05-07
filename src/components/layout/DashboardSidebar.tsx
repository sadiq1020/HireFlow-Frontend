'use client';

import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarItem {
  title: string;
  href: string;
  icon: any;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
}

export default function DashboardSidebar({ items }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <aside className="w-64 border-r border-border h-screen sticky top-0 hidden lg:flex flex-col bg-sidebar">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-lg font-bold text-foreground">
            Hire<span className="text-primary">Flow</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Sign Out at bottom */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}