import { Briefcase, Code } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'Companies', href: '/companies' },
    { label: 'Post a Job', href: '/register' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">
                Hire<span className="text-primary">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              AI-powered job platform connecting top talent with great companies worldwide.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors text-xs font-bold text-muted-foreground"
              >
                X
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors text-xs font-bold text-muted-foreground"
              >
                in
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Code className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4 text-sm">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HireFlow. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using Next.js & AI
          </p>
        </div>
      </div>
    </footer>
  );
}