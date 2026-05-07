'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import Navbar from './Navbar';

const DASHBOARD_PREFIXES = [
  '/admin',
  '/company',
  '/seeker',
  '/login',
  '/register',
];

export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}