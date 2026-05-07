"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  User, 
  Settings, 
  Users, 
  Building2, 
  Layers
} from "lucide-react"

interface SidebarItem {
  title: string
  href: string
  icon: any
}

interface DashboardSidebarProps {
  items: SidebarItem[]
}

export default function DashboardSidebar({ items }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r h-screen sticky top-0 hidden lg:block bg-muted/20">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold tracking-tighter">HireFlow</Link>
      </div>
      <nav className="px-4 py-2 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname === item.href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
