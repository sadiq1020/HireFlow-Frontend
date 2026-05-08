'use client';

import { JobCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { IJob } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Clock, DollarSign, MapPin, Zap } from 'lucide-react';
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

function JobCard({ job, index }: { job: IJob; index: number }) {
  const typeColor = jobTypeColors[job.type] || jobTypeColors.FULL_TIME;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link href={`/jobs/${job.id}`}>
        <div className="relative h-full bg-card border border-border rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.7 }}
          />

          {/* Header */}
          <div className="flex items-start justify-between mb-4 relative z-10">
            {/* Company logo placeholder */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>

            {/* Job type badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${typeColor}`}>
              {jobTypeLabels[job.type]}
            </span>
          </div>

          {/* Job title */}
          <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1 relative z-10">
            {job.title}
          </h3>

          {/* Company name */}
          <p className="text-sm text-muted-foreground mb-4 font-medium relative z-10">
            {job.company?.companyName}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 mb-5 relative z-10">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary/60" />
              {job.location}
            </div>
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400/60" />
                {job.salaryMin && job.salaryMax
                  ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`
                  : job.salaryMin
                  ? `From $${(job.salaryMin / 1000).toFixed(0)}k`
                  : `Up to $${(job.salaryMax! / 1000).toFixed(0)}k`}
              </div>
            )}
            {job.category && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{job.category.icon}</span>
                {job.category.name}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border relative z-10">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Apply now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedJobs() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => api.get<any>('/jobs?limit=8&sortBy=createdAt&sortOrder=desc'),
  });

  const jobs: IJob[] = (data as any)?.data || [];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
        <motion.div
          className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
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
              <div className="h-px w-8 bg-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Live Listings</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Featured{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-relaxed">
              Hand-picked positions from top companies actively looking for talent like you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group px-4 py-2 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20"
            >
              View all jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Loading */}
       {isLoading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {Array.from({ length: 8 }).map((_, i) => (
      <JobCardSkeleton key={i} />
    ))}
  </div>
)}

        {/* Jobs Grid */}
        {!isLoading && jobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No jobs available yet. Check back soon!</p>
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoading && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              Explore All Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}