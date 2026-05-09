'use client';

import Pagination from '@/components/shared/Pagination';
import { JobCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { IPaginatedResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  REVIEWED: { label: 'Reviewed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-400' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-400' },
  HIRED: { label: 'Hired', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
};

const filters = ['ALL', 'PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'];

export default function SeekerApplicationsPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (activeFilter !== 'ALL') params.set('status', activeFilter);
    params.set('page', page.toString());
    params.set('limit', '12');
    return params.toString();
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['my-applications', activeFilter, page],
    queryFn: () => api.get<IPaginatedResponse<any>>(`/applications/my?${buildQuery()}`),
  });

  const applications = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track all your job applications in one place
        </p>
      </motion.div>

      {/* Filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => {
          const config = statusConfig[filter];
          return (
            <button
              key={filter}
              onClick={() => { setActiveFilter(filter); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeFilter === filter
                  ? filter === 'ALL'
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                    : config.color
                  : 'bg-card border-border text-muted-foreground hover:border-primary/20'
              }`}
            >
              {filter !== 'ALL' && config && (
                <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              )}
              {filter === 'ALL' ? 'All' : config?.label}
            </button>
          );
        })}
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      )}

      {/* Applications list */}
      {!isLoading && (
        <>
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
              <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No applications found</h3>
              <p className="text-muted-foreground text-sm mb-6">
                {activeFilter === 'ALL' ? "You haven't applied to any jobs yet." : `No ${statusConfig[activeFilter]?.label.toLowerCase()} applications.`}
              </p>
              <Link href="/jobs" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className={`space-y-4 ${isFetching ? 'opacity-60' : ''} transition-opacity`}>
              {applications.map((app: any, i: number) => {
                const config = statusConfig[app.status];
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-card border border-border hover:border-primary/20 rounded-2xl p-5 transition-all hover:shadow-lg relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className="relative z-10 flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {app.job?.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {app.job?.company?.companyName}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${config.color}`}>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {config.label}
                            </div>
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-3">
                          {app.job?.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 text-primary/50" />
                              {app.job.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>

                        {app.coverLetter && (
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {app.coverLetter}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors group/btn"
                      >
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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
    </div>
  );
}