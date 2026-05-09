import CompanyDetailsClient from '@/components/companies/CompanyDetailsClient';
import { Metadata } from 'next';
import Link from 'next/link';

// Fetch company data from the backend
async function getCompany(id: string) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    // Using fetch directly since we are on the server
    const res = await fetch(`${backendUrl}/api/v1/company/public/${id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) {
      return null;
    }
    
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching company on server:', error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const company = await getCompany(params.id);

  if (!company) {
    return {
      title: 'Company Not Found | HireFlow',
      description: 'The requested company profile could not be found.',
    };
  }

  return {
    title: `${company.companyName} Careers & Culture | HireFlow`,
    description: company.description?.slice(0, 160) || `Explore open positions and learn more about ${company.companyName} on HireFlow.`,
    openGraph: {
      title: `${company.companyName} Careers & Culture | HireFlow`,
      description: company.description?.slice(0, 160),
      type: 'website',
      images: company.logo ? [company.logo] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company.companyName} Careers & Culture | HireFlow`,
      description: company.description?.slice(0, 160),
      images: company.logo ? [company.logo] : [],
    },
  };
}

// Server Component
export default async function CompanyDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const company = await getCompany(params.id);

  if (!company) {
    return (
      <div className="min-h-screen bg-background pt-20 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Company not found</p>
        <Link href="/companies" className="text-primary hover:underline text-sm">
          ← Back to companies
        </Link>
      </div>
    );
  }

  return <CompanyDetailsClient company={company} jobs={company.jobs || []} />;
}