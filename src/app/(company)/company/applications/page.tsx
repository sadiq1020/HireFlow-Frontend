'use client';

import { JobCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, FileText, Loader2, MapPin, Users } from 'lucide-react';
import { useState } from 'react';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  REVIEWED: { label: 'Reviewed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-400' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-400' },
  HIRED: { label: 'Hired', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
};

const statusActions = [
  { value: 'PENDING', label: 'Mark Pending', color: 'hover:bg-amber-500/10 hover:text-amber-400' },
  { value: 'REVIEWED', label: 'Mark Reviewed', color: 'hover:bg-blue-500/10 hover:text-blue-400' },
  { value: 'SHORTLISTED', label: 'Shortlist', color: 'hover:bg-violet-500/10 hover:text-violet-400' },
  { value: 'REJECTED', label: 'Reject', color: 'hover:bg-red-500/10 hover:text-red-400' },
  { value: 'HIRED', label: 'Mark Hired', color: 'hover:bg-emerald-500/10 hover:text-emerald-400' },
];

const filters = ['ALL', 'PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'];

export default function CompanyApplicationsPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['company-applications'],
    queryFn: () => api.get<any>('/company/applications'),
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
      api.put(`/company/applications/${applicationId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      setOpenDropdown(null);
    },
  });

  const allApplications = data?.data || [];
  const applications = activeFilter === 'ALL'
    ? allApplications
    : allApplications.filter((a: any) => a.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and manage candidates applying to your jobs
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
          const count = filter === 'ALL' ? allApplications.length : allApplications.filter((a: any) => a.status === filter).length;
          const config = statusConfig[filter];
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeFilter === filter
                  ? filter === 'ALL' ? 'bg-primary text-primary-foreground border-primary' : config.color
                  : 'bg-card border-border text-muted-foreground hover:border-primary/20'
              }`}
            >
              {filter !== 'ALL' && <div className={`w-1.5 h-1.5 rounded-full ${config?.dot}`} />}
              {filter === 'ALL' ? 'All' : config?.label}
              <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!isLoading && applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
          <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No applications found</h3>
          <p className="text-muted-foreground text-sm">
            {activeFilter === 'ALL' ? 'No candidates have applied yet.' : `No ${statusConfig[activeFilter]?.label.toLowerCase()} applications.`}
          </p>
        </div>
      )}

      {/* Applications list */}
      {!isLoading && applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((app: any, i: number) => {
            const config = statusConfig[app.status];
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-card border border-border hover:border-primary/20 rounded-2xl p-5 transition-all hover:shadow-lg relative group ${
                  openDropdown === app.id ? 'z-30 overflow-visible' : 'z-0 overflow-hidden'
                }`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.7 }}
                />
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {app.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{app.user?.name}</h3>
                          <p className="text-xs text-muted-foreground">{app.user?.email}</p>
                        </div>

                        {/* Status + update dropdown */}
                        <div className="relative flex-shrink-0">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === app.id ? null : app.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all hover:opacity-80 ${config.color}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                            {config.label}
                            <span className="text-xs opacity-50">▾</span>
                          </button>

                          {openDropdown === app.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                              {statusActions.map((action) => (
                                <button
                                  key={action.value}
                                  onClick={() => updateStatus({ applicationId: app.id, status: action.value })}
                                  disabled={isUpdating || app.status === action.value}
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-muted-foreground ${action.color} transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                                >
                                  {isUpdating && app.status === action.value ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[action.value]?.dot}`} />
                                  )}
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Job info */}
                      <div className="mt-3 flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
                          <span className="font-semibold text-foreground">{app.job?.title}</span>
                        </div>
                        {app.job?.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 text-primary/50" />
                            {app.job.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      {/* Cover letter preview */}
                      {app.coverLetter && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                          &ldquo;{app.coverLetter}&rdquo;
                        </p>
                      )}

                      {/* Resume + contact */}
                      <div className="mt-3 flex items-center gap-3">
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                          >
                            <FileText className="w-3 h-3" />
                            View Resume
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {app.user?.phone && (
                          <span className="text-xs text-muted-foreground">{app.user.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Close dropdown on outside click */}
      {openDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
      )}
    </div>
  );
}