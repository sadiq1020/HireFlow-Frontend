'use client';

import { JobCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bookmark, Briefcase, Clock, DollarSign, MapPin, Trash2 } from 'lucide-react';
import Link from 'next/link';

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

export default function SavedJobsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => api.get<any>('/saved-jobs/my'),
  });

  const { mutate: unsave } = useMutation({
    mutationFn: (jobId: string) => api.delete(`/saved-jobs/${jobId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-jobs'] }),
  });

  const savedJobs = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Saved Jobs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} bookmarked
        </p>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!isLoading && savedJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
          <Bookmark className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No saved jobs yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Save jobs you&apos;re interested in to come back to them later.
          </p>
          <Link href="/jobs" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
            Browse Jobs
          </Link>
        </div>
      )}

      {/* Grid */}
      {!isLoading && savedJobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {savedJobs.map((saved: any, i: number) => {
              const job = saved.job;
              if (!job) return null;
              const typeColor = jobTypeColors[job.type] || jobTypeColors.FULL_TIME;

              return (
                <motion.div
                  key={saved.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card border border-border hover:border-primary/30 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5"
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.7 }}
                  />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${typeColor}`}>
                          {jobTypeLabels[job.type]}
                        </span>
                        <button
                          onClick={() => unsave(job.id)}
                          className="w-7 h-7 rounded-lg bg-secondary hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center transition-colors text-muted-foreground"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mb-3">
                      {job.company?.companyName}
                    </p>

                    {/* Meta */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 text-primary/50" />
                        {job.location}
                      </div>
                      {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <DollarSign className="w-3 h-3 text-emerald-400/60" />
                          {job.salaryMin && job.salaryMax
                            ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
                            : job.salaryMin
                            ? `From $${(job.salaryMin / 1000).toFixed(0)}k`
                            : `Up to $${(job.salaryMax! / 1000).toFixed(0)}k`}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Saved {new Date(saved.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2 pt-3 border-t border-border">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg text-xs font-semibold transition-all"
                      >
                        View Job
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}