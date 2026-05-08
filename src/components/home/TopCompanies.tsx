'use client';

import { CompanyCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { ICompany } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building2, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

const companyAccents = [
  { border: 'hover:border-violet-500/40', glow: 'hover:shadow-violet-500/10', badge: 'bg-violet-500/10 text-violet-400' },
  { border: 'hover:border-blue-500/40', glow: 'hover:shadow-blue-500/10', badge: 'bg-blue-500/10 text-blue-400' },
  { border: 'hover:border-emerald-500/40', glow: 'hover:shadow-emerald-500/10', badge: 'bg-emerald-500/10 text-emerald-400' },
  { border: 'hover:border-fuchsia-500/40', glow: 'hover:shadow-fuchsia-500/10', badge: 'bg-fuchsia-500/10 text-fuchsia-400' },
  { border: 'hover:border-orange-500/40', glow: 'hover:shadow-orange-500/10', badge: 'bg-orange-500/10 text-orange-400' },
  { border: 'hover:border-cyan-500/40', glow: 'hover:shadow-cyan-500/10', badge: 'bg-cyan-500/10 text-cyan-400' },
  { border: 'hover:border-rose-500/40', glow: 'hover:shadow-rose-500/10', badge: 'bg-rose-500/10 text-rose-400' },
  { border: 'hover:border-indigo-500/40', glow: 'hover:shadow-indigo-500/10', badge: 'bg-indigo-500/10 text-indigo-400' },
];

export default function TopCompanies() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-companies'],
    queryFn: () => api.get<any>('/company/public'),
  });

  const companies: ICompany[] = (data as any)?.data?.slice(0, 8) || [];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/4 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/4 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Top Employers</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Leading{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Companies
              </span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-relaxed">
              Join world-class organizations that are shaping the future. Apply to top verified employers today.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/companies"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group px-4 py-2 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20"
            >
              All companies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Loading */}
       {isLoading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {Array.from({ length: 8 }).map((_, i) => (
      <CompanyCardSkeleton key={i} />
    ))}
  </div>
)}

        {/* Grid */}
        {!isLoading && companies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {companies.map((company, i) => {
              const accent = companyAccents[i % companyAccents.length];
              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link href={`/companies/${company.id}`}>
                    <div className={`group h-full bg-card border border-border ${accent.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${accent.glow} relative overflow-hidden`}>
                      {/* Shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.7 }}
                      />

                      {/* Verified badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${accent.badge}`}>
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Verified
                        </div>
                      </div>

                      {/* Logo */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        {company.logo ? (
                          <img src={company.logo} alt={company.companyName} className="w-10 h-10 object-contain rounded-xl" />
                        ) : (
                          <Building2 className="w-6 h-6 text-primary" />
                        )}
                      </div>

                      {/* Company name */}
                      <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {company.companyName}
                      </h3>

                      {/* Industry */}
                      {company.industry && (
                        <p className="text-xs text-muted-foreground font-medium mb-3">
                          {company.industry}
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

                      {/* View jobs */}
                      <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-border">
                        View jobs
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && companies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No companies yet. Be the first to join!</p>
            <Link href="/register" className="mt-4 text-sm text-primary hover:underline font-medium">
              Register your company →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}