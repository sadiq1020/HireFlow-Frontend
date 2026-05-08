'use client';

import { CompanyCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, CheckCircle, Globe, MapPin, Search, X, XCircle } from 'lucide-react';
import { useState } from 'react';

const approvalConfig: Record<string, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-400' },
};

const filters = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: () => api.get<any>('/admin/companies'),
  });

  const { mutate: updateApproval, isPending } = useMutation({
    mutationFn: ({ id, status, rejectionNote }: { id: string; status: string; rejectionNote?: string }) =>
      api.patch(`/admin/companies/${id}/approval`, { status, rejectionNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setRejectModal(null);
      setRejectionNote('');
    },
  });

  const allCompanies = data?.data || [];

  const companies = allCompanies.filter((c: any) => {
    const matchesFilter = activeFilter === 'ALL' || c.approvalStatus === activeFilter;
    const matchesSearch = !search ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.user?.email.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Manage Companies</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve company applications</p>
      </motion.div>

      {/* Search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl flex-1 focus-within:border-primary/50 transition-all">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by company name, email, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => {
            const count = f === 'ALL' ? allCompanies.length : allCompanies.filter((c: any) => c.approvalStatus === f).length;
            const config = approvalConfig[f];
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  activeFilter === f
                    ? f === 'ALL' ? 'bg-primary text-primary-foreground border-primary' : config.color
                    : 'bg-card border-border text-muted-foreground hover:border-primary/20'
                }`}
              >
                {f !== 'ALL' && <div className={`w-1.5 h-1.5 rounded-full ${config?.dot}`} />}
                {f === 'ALL' ? 'All' : config?.label} ({count})
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CompanyCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!isLoading && companies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
          <Building2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your filters.</p>
        </div>
      )}

      {/* Companies grid */}
      {!isLoading && companies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {companies.map((company: any, i: number) => {
              const config = approvalConfig[company.approvalStatus];
              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden group hover:border-primary/20 transition-all hover:shadow-lg"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                  </div>

                  {/* Info */}
                  <h3 className="text-sm font-bold text-foreground mb-0.5">{company.companyName}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{company.user?.email}</p>

                  <div className="space-y-1 mb-4 text-xs text-muted-foreground">
                    {company.industry && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-primary/50" />
                        {company.industry}
                      </div>
                    )}
                    {company.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary/50" />
                        {company.location}
                      </div>
                    )}
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                        <Globe className="w-3 h-3" />
                        {company.website.replace('https://', '')}
                      </a>
                    )}
                  </div>

                  {company.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {company.description}
                    </p>
                  )}

                  {/* Actions */}
                  {company.approvalStatus === 'PENDING' && (
                    <div className="flex gap-2 pt-3 border-t border-border">
                      <button
                        onClick={() => updateApproval({ id: company.id, status: 'APPROVED' })}
                        disabled={isPending}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-emerald-500/20 hover:border-emerald-500"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectModal({ id: company.id, name: company.companyName })}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-500/20 hover:border-red-500"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  )}

                  {company.approvalStatus === 'APPROVED' && (
                    <div className="pt-3 border-t border-border">
                      <button
                        onClick={() => setRejectModal({ id: company.id, name: company.companyName })}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-500/20"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Revoke Approval
                      </button>
                    </div>
                  )}

                  {company.approvalStatus === 'REJECTED' && (
                    <div className="pt-3 border-t border-border">
                      <button
                        onClick={() => updateApproval({ id: company.id, status: 'APPROVED' })}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold transition-all border border-emerald-500/20"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Re-approve
                      </button>
                      {company.rejectionNote && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Reason: {company.rejectionNote}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Reject modal */}
      <AnimatePresence>
        {rejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-foreground mb-1">Reject Company</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Rejecting <span className="font-semibold text-foreground">{rejectModal.name}</span>. Optionally add a reason.
              </p>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Reason for rejection (optional)..."
                rows={3}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 bg-secondary text-foreground font-semibold rounded-xl text-sm">Cancel</button>
                <button
                  onClick={() => updateApproval({ id: rejectModal.id, status: 'REJECTED', rejectionNote })}
                  disabled={isPending}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {isPending ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}