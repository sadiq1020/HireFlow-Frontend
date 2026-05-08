'use client';

import { IJob } from '@/types';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Clock, DollarSign, MapPin } from 'lucide-react';
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

export default function JobCard({ job }: { job: IJob }) {
  const typeColor = jobTypeColors[job.type] || jobTypeColors.FULL_TIME;

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="group h-full bg-card border border-border hover:border-primary/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 relative overflow-hidden">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${typeColor}`}>
              {jobTypeLabels[job.type]}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {job.title}
          </h3>

          {/* Company */}
          <p className="text-xs text-muted-foreground font-medium mb-3">
            {job.company?.companyName}
          </p>

          {/* Meta */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary/50 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <DollarSign className="w-3 h-3 text-emerald-400/60 flex-shrink-0" />
                {job.salaryMin && job.salaryMax
                  ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
                  : job.salaryMin
                  ? `From $${(job.salaryMin / 1000).toFixed(0)}k`
                  : `Up to $${(job.salaryMax! / 1000).toFixed(0)}k`}
              </div>
            )}
            {job.category && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-xs">{job.category.icon}</span>
                <span>{job.category.name}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}