'use client';

import Pagination from '@/components/shared/Pagination';
import { JobCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { IPaginatedResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Eye, EyeOff, MapPin, Pencil, Plus, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
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

export default function CompanyJobsPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['my-jobs', page],
    queryFn: () => api.get<IPaginatedResponse<any>>(`/jobs/my-jobs?page=${page}&limit=12`),
  });

  const { mutate: deleteJob } = useMutation({
    mutationFn: (id: string) => api.delete(`/jobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      setDeletingId(null);
    },
  });

  const { mutate: toggleActive } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put(`/jobs/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-jobs'] }),
  });

  const jobs = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Job Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meta?.total ? `${meta.total} job${meta.total !== 1 ? 's' : ''} posted` : 'Manage your job postings'}
          </p>
        </div>
        <Link
          href="/company/jobs/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!isLoading && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No jobs posted yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first job listing to start receiving applications.
          </p>
          <Link href="/company/jobs/create" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Post First Job
          </Link>
        </div>
      )}

      {/* Jobs grid */}
      {!isLoading && jobs.length > 0 && (
        <>
          <AnimatePresence>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isFetching ? 'opacity-60' : ''} transition-opacity`}>
              {jobs.map((job: any, i: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group bg-card border rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-lg ${
                    job.isActive ? 'border-border hover:border-primary/30' : 'border-border/50 opacity-70'
                  }`}
                >
                {/* Inactive overlay */}
                {!job.isActive && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-secondary text-xs font-bold text-muted-foreground border border-border">
                    Inactive
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-bold border ${jobTypeColors[job.type]}`}>
                      {jobTypeLabels[job.type]}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 text-primary/50" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3 h-3 text-blue-400/60" />
                    {job._count?.applications || 0} applications
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Link
                    href={`/company/jobs/${job.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-secondary hover:bg-primary/10 hover:text-primary rounded-lg text-xs font-semibold transition-colors text-muted-foreground"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleActive({ id: job.id, isActive: !job.isActive })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-secondary hover:bg-amber-500/10 hover:text-amber-400 rounded-lg text-xs font-semibold transition-colors text-muted-foreground"
                  >
                    {job.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {job.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => setDeletingId(job.id)}
                    className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-muted-foreground"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          </AnimatePresence>
          {meta && meta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Job?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This will permanently delete the job listing and all associated applications. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteJob(deletingId)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}