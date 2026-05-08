'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin, Globe, Briefcase, Building2,
  ArrowLeft, Loader2, ExternalLink, Users
} from 'lucide-react';
import { CompanyDetailSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { IJob } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import Link from 'next/link';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => api.get<any>(`/company/public/${id}`),
  });

  const company = (data as any)?.data;
  const jobs: IJob[] = company?.jobs || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <CompanyDetailSkeleton />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to companies
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.companyName}
                      className="w-14 h-14 object-contain rounded-xl"
                    />
                  ) : (
                    <Building2 className="w-9 h-9 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">
                      {company.companyName}
                    </h1>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs text-emerald-400 font-bold">Verified</span>
                    </div>
                  </div>
                  {company.industry && (
                    <p className="text-muted-foreground font-medium text-sm mb-3">
                      {company.industry}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {company.location && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary/50" />
                        {company.location}
                      </div>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        {company.website.replace('https://', '').replace('http://', '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{jobs.length}</div>
                  <div className="text-xs text-muted-foreground">Open Positions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {company.industry || '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">Industry</div>
                </div>
                <div className="text-center col-span-2 sm:col-span-1">
                  <div className="text-2xl font-bold text-emerald-400">Active</div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
              </div>
            </motion.div>

            {/* About */}
            {company.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  About {company.companyName}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {company.description}
                </p>
              </motion.div>
            )}

            {/* Open Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Open Positions
                <span className="text-sm font-normal text-muted-foreground">
                  ({jobs.length})
                </span>
              </h2>

              {jobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {jobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <JobCard job={{ ...job, company: { id: company.id, companyName: company.companyName, logo: company.logo, location: company.location } }} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-card border border-border rounded-2xl">
                  <Briefcase className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No open positions at the moment.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check back later or browse other companies.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                Company Info
              </h3>
              <div className="space-y-3">
                {company.industry && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-semibold text-foreground">{company.industry}</span>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-semibold text-foreground">{company.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Open Jobs</span>
                  <span className="font-semibold text-primary">{jobs.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-emerald-400 font-semibold">Hiring</span>
                </div>
              </div>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              )}
            </motion.div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 text-center"
            >
              <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground mb-1">
                Interested in working here?
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Browse all open positions and apply directly.
              </p>
              <a
                href="#positions"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                <Briefcase className="w-4 h-4" />
                See Open Roles
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}