'use client';

import { CompanyCardSkeleton } from '@/components/shared/SkeletonCard';
import { useDebounce } from '@/hooks/useDebounce'; // ← added
import { api } from '@/lib/api';
import { ICompany } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Briefcase, Building2, MapPin, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const industryColors: Record<string, string> = {
  Technology: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Design: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  Marketing: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Finance: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Healthcare: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Education: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  default: 'bg-primary/10 text-primary border-primary/20',
};

function CompanyCard({ company, index }: { company: ICompany; index: number }) {
  const industryColor = industryColors[company.industry || ''] || industryColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link href={`/companies/${company.id}`}>
        <div className="group h-full bg-card border border-border hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.7 }}
          />

          <div className="relative z-10">
            {/* Logo + Industry */}
            <div className="flex items-start justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                {company.logo ? (
                  <img src={company.logo} alt={company.companyName} className="w-10 h-10 object-contain rounded-xl" />
                ) : (
                  <Building2 className="w-6 h-6 text-primary" />
                )}
              </div>
              {company.industry && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${industryColor}`}>
                  {company.industry}
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {company.companyName}
            </h3>

            {/* Description */}
            {company.description && (
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                {company.description}
              </p>
            )}

            {/* Meta */}
            <div className="space-y-1.5 mb-4">
              {company.location && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 text-primary/50" />
                  {company.location}
                </div>
              )}
              {company._count && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Briefcase className="w-3 h-3 text-primary/50" />
                  {company._count.jobs} open positions
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold">Verified</span>
              </div>
              <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                View profile →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CompaniesPage() {
  const [search, setSearch] = useState('');

  // ← added: debounced value — filter only runs 400ms after user stops typing
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['public-companies'],
    queryFn: () => api.get<any>('/company/public'),
  });

  const allCompanies: ICompany[] = (data as any)?.data || [];

  // ← changed: uses debouncedSearch instead of search
  const companies = allCompanies.filter((c) =>
    c.companyName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    c.industry?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    c.location?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="bg-gradient-to-b from-card/50 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Top Employers</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Browse{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Companies
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">
              {allCompanies.length} verified companies actively hiring
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl max-w-xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all"
          >
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by company name, industry, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && companies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {companies.map((company, i) => (
              <CompanyCard key={company.id} company={company} index={i} />
            ))}
          </div>
        )}

        {!isLoading && companies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try a different search term.
            </p>
            <button
              onClick={() => setSearch('')}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}