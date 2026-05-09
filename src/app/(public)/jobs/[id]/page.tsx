import JobDetailsClient from '@/components/jobs/JobDetailsClient';
import { IJob } from '@/types';
import { Metadata } from 'next';
import Link from 'next/link';

// Fetch job data from the backend
async function getJob(id: string): Promise<IJob | null> {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    // Using fetch directly since we are on the server
    const res = await fetch(`${backendUrl}/api/v1/jobs/${id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) {
      return null;
    }
    
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching job on server:', error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const job = await getJob(params.id);

  if (!job) {
    return {
      title: 'Job Not Found | HireFlow',
      description: 'The requested job posting could not be found.',
    };
  }

  return {
    title: `${job.title} at ${job.company?.companyName || 'HireFlow'}`,
    description: job.description?.slice(0, 160) || `Apply for the ${job.title} position on HireFlow.`,
    openGraph: {
      title: `${job.title} at ${job.company?.companyName || 'HireFlow'}`,
      description: job.description?.slice(0, 160),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} at ${job.company?.companyName || 'HireFlow'}`,
      description: job.description?.slice(0, 160),
    },
  };
}

// Server Component
export default async function JobDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const job = await getJob(params.id);

  if (!job) {
    return (
      <div className="min-h-screen bg-background pt-20 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Job not found</p>
        <Link href="/jobs" className="text-primary hover:underline text-sm">← Back to jobs</Link>
      </div>
    );
  }

  return <JobDetailsClient initialJob={job} />;
}