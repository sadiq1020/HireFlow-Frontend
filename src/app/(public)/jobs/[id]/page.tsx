'use client';

import ApplyModal from '@/components/jobs/ApplyModal';
import { JobDetailSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { IJob } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookmarkPlus,
  Briefcase, Building2,
  Calendar,
  CheckCircle,
  Clock, DollarSign,
  Globe,
  MapPin,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const jobTypeColors: Record<string, string> = {
  FULL_TIME: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PART_TIME: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  REMOTE: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  CONTRACT: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  INTERNSHIP: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
};

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  REMOTE: 'Remote',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [applyOpen, setApplyOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get<any>(`/jobs/${id}`),
  });

  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => api.get<any>('/applications/my'),
    enabled: !!session?.user,
  });

  const job: IJob = (data as any)?.data;
  const hasApplied = applicationsData?.data?.some((app: any) => app.jobId === id);
  const isLoading = jobLoading || (appsLoading && !!session?.user);

  const handleSave = async () => {
    if (!session?.user) { router.push('/login'); return; }
    try {
      await api.post('/saved-jobs', { jobId: id });
      setSaved(true);
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <JobDetailSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background pt-20 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Job not found</p>
        <Link href="/jobs" className="text-primary hover:underline text-sm">← Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to jobs
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job header card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground mb-1 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-muted-foreground font-medium">
                    {job.company?.companyName}
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 ${jobTypeColors[job.type]}`}>
                  {jobTypeLabels[job.type]}
                </span>
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary/60" />
                  {job.location}
                </div>
                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400/60" />
                    {job.salaryMin && job.salaryMax
                      ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
                      : job.salaryMin ? `From $${(job.salaryMin / 1000).toFixed(0)}k`
                      : `Up to $${(job.salaryMax! / 1000).toFixed(0)}k`}
                  </div>
                )}
                {job.category && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground">
                    <span>{job.category.icon}</span>
                    {job.category.name}
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-orange-400/60" />
                    Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  disabled={hasApplied}
                  onClick={() => {
                    if (!session?.user) { router.push('/login'); return; }
                    setApplyOpen(true);
                  }}
                  className={`flex-1 py-3 font-semibold rounded-xl transition-all text-sm ${
                    hasApplied
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/25'
                  }`}
                >
                  {hasApplied ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Applied
                    </span>
                  ) : (
                    'Apply Now'
                  )}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-sm transition-all ${
                    saved
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-secondary border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {saved ? <CheckCircle className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </motion.div>

            {/* Requirements */}
            {job.requirements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <h2 className="text-lg font-bold text-foreground mb-4">Requirements</h2>
                <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Company card */}
            {job.company && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">About the Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{job.company.companyName}</p>
                    {(job.company as any).industry && (
                      <p className="text-xs text-muted-foreground">{(job.company as any).industry}</p>
                    )}
                  </div>
                </div>

                {(job.company as any).description && (
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                    {(job.company as any).description}
                  </p>
                )}

                <div className="space-y-2">
                  {job.company.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary/50" />
                      {job.company.location}
                    </div>
                  )}
                  {(job.company as any).website && (
                    <a
                      href={(job.company as any).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-primary hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Visit website
                    </a>
                  )}
                </div>

                <Link
                  href={`/companies/${job.companyId}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-secondary hover:bg-secondary/80 text-sm font-medium rounded-lg transition-colors text-foreground"
                >
                  <Users className="w-4 h-4" />
                  View company profile
                </Link>
              </motion.div>
            )}

            {/* Job stats card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Job Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-semibold text-foreground">{(job as any)._count?.applications ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${jobTypeColors[job.type]}`}>
                    {jobTypeLabels[job.type]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground text-xs">{job.category?.name}</span>
                </div>
                {job.deadline && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-semibold text-orange-400 text-xs">
                      {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Apply CTA card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 text-center"
            >
              <p className="text-sm font-semibold text-foreground mb-1">Ready to apply?</p>
              <p className="text-xs text-muted-foreground mb-4">
                Don&apos;t miss out — apply before the deadline.
              </p>
              <button
                disabled={hasApplied}
                onClick={() => {
                  if (!session?.user) { router.push('/login'); return; }
                  setApplyOpen(true);
                }}
                className={`w-full py-2.5 font-semibold rounded-xl transition-all text-sm ${
                  hasApplied
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/25'
                }`}
              >
                {hasApplied ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Applied
                  </span>
                ) : (
                  'Apply Now'
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.company?.companyName}
        jobType={job.type}
        jobLocation={job.location}
        jobDescription={job.description}
      />
    </div>
  );
}