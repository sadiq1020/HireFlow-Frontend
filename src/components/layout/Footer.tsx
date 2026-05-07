import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold">HireFlow</h3>
          <p className="text-sm text-muted-foreground">The ultimate platform for finding your next career move.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/jobs">Browse Jobs</Link></li>
            <li><Link href="/companies">Companies</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} HireFlow Inc. All rights reserved.
      </div>
    </footer>
  );
}
