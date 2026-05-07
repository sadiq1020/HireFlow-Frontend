import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            HireFlow
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">Browse Jobs</Link>
            <Link href="/companies" className="text-sm font-medium hover:text-primary transition-colors">Companies</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
