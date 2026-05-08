'use client';

import { JobCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Briefcase, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AdminJobsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['all-jobs'],
    queryFn: () => api.get<any>('/jobs?limit=50&sortBy=createdAt&sortOrder=desc'),
  });

  const jobs = data?.data || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">All Jobs</h1>
        <p className="text-muted-foreground text-sm mt-1">{jobs.length} active job listings on the platform</p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job: any, i: number) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/jobs/${job.id}`}>
                <div className="group bg-card border border-border hover:border-primary/30 rounded-2xl p-5 transition-all hover:shadow-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Building2 className="w-3 h-3" />
                        {job.company?.companyName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary/50" />
                      {job.location}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${job.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-secondary text-muted-foreground'}`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}