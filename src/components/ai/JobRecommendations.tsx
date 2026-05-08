'use client';

import { api } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { IJob } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Briefcase,
    Clock,
    DollarSign,
    MapPin,
    RefreshCw,
    Sparkles,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecommendedJob extends IJob {
  matchScore: number;   // 0–100
  matchReason: string;  // short AI-generated reason
}

interface RecommendationResponse {
  recommendations: RecommendedJob[];
  profileSummary: string; // e.g. "Based on your 3 applications in Engineering…"
}

// ─── Job type config ──────────────────────────────────────────────────────────
const jobTypeColors: Record<string, string> = {
  FULL_TIME:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PART_TIME:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  REMOTE:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
  CONTRACT:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  INTERNSHIP: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
};

const jobTypeLabels: Record<string, string> = {
  FULL_TIME:  'Full Time',
  PART_TIME:  'Part Time',
  REMOTE:     'Remote',
  CONTRACT:   'Contract',
  INTERNSHIP: 'Internship',
};

// ─── Match score ring ─────────────────────────────────────────────────────────
function MatchRing({ score }: { score: number }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? '#10b981' :
    score >= 60 ? '#8b5cf6' :
    '#f59e0b';

  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
        {/* Track */}
        <circle
          cx="18" cy="18" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-border"
        />
        {/* Progress */}
        <motion.circle
          cx="18" cy="18" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[9px] font-bold text-foreground">{score}%</span>
      </div>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function RecommendationSkeleton() {
  return (
    <div className="bg-card/40 border border-border rounded-2xl p-5 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-muted/60 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="w-3/4 h-4 rounded-lg bg-muted/60" />
          <div className="w-1/2 h-3 rounded-lg bg-muted/40" />
        </div>
        <div className="w-10 h-10 rounded-full bg-muted/40 flex-shrink-0" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="w-full h-3 rounded-lg bg-muted/30" />
        <div className="w-4/5 h-3 rounded-lg bg-muted/30" />
      </div>
      <div className="flex gap-2">
        <div className="w-20 h-5 rounded-full bg-muted/30" />
        <div className="w-24 h-5 rounded-full bg-muted/30" />
      </div>
    </div>
  );
}

// ─── Single recommendation card ───────────────────────────────────────────────
function RecommendationCard({ job, index }: { job: RecommendedJob; index: number }) {
  const typeColor = jobTypeColors[job.type] || jobTypeColors.FULL_TIME;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link href={`/jobs/${job.id}`}>
        <div className="relative h-full bg-card border border-border hover:border-primary/30 rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.7 }}
          />

          {/* AI glow strip at top */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-60"
            style={{
              background: 'linear-gradient(90deg, transparent, oklch(55% 0.25 285 / 0.5), transparent)',
            }}
          />

          <div className="relative z-10">
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Company icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {job.company?.companyName}
                  </p>
                </div>
              </div>
              {/* Match ring */}
              <MatchRing score={job.matchScore} />
            </div>

            {/* AI reason chip */}
            <div className="flex items-start gap-1.5 mb-4 px-2.5 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
              <Sparkles className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {job.matchReason}
              </p>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 text-primary/50 flex-shrink-0" />
                <span className="truncate max-w-[120px]">{job.location}</span>
              </div>
              {(job.salaryMin || job.salaryMax) && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="w-3 h-3 text-emerald-400/60 flex-shrink-0" />
                  {job.salaryMin && job.salaryMax
                    ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
                    : job.salaryMin
                    ? `From $${(job.salaryMin / 1000).toFixed(0)}k`
                    : `Up to $${(job.salaryMax! / 1000).toFixed(0)}k`}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeColor}`}>
                  {jobTypeLabels[job.type]}
                </span>
                {job.category && (
                  <span className="text-xs text-muted-foreground">
                    {job.category.icon} {job.category.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Empty / no-profile state ─────────────────────────────────────────────────
function EmptyState({ hasApplications }: { hasApplications: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-14 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-primary/60" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">
        {hasApplications ? 'No strong matches right now' : 'Apply to jobs to unlock recommendations'}
      </p>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
        {hasApplications
          ? 'Our AI couldn\'t find high-confidence matches yet. Browse all jobs to find opportunities.'
          : 'The more you apply, the better our AI understands your preferences and finds your perfect role.'}
      </p>
      <Link
        href="/jobs"
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        Browse all jobs <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function JobRecommendations() {
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user's application history to pass to the AI
  const { data: applicationsData } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => api.get<any>('/applications/my'),
  });

  const applications = (applicationsData as any)?.data || [];
  const hasApplications = applications.length > 0;

  // Fetch all available jobs (pool for AI to pick from)
  const { data: jobsData } = useQuery({
    queryKey: ['jobs-pool'],
    queryFn: () => api.get<any>('/jobs?limit=50&sortBy=createdAt&sortOrder=desc'),
  });

  const allJobs: IJob[] = (jobsData as any)?.data || [];

  // Fetch AI recommendations
  const {
    data: recData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<RecommendationResponse>({
    queryKey: ['ai-recommendations', session?.user?.id, refreshKey],
    queryFn: async () => {
      if (!session?.user) throw new Error('Not authenticated');

      // Build a compact profile summary for the AI
      const appliedTitles = applications
        .slice(0, 10)
        .map((a: any) => ({
          title: a.job?.title,
          category: a.job?.category?.name,
          type: a.job?.type,
          location: a.job?.location,
        }));

      const availableJobs = allJobs
        .filter((j) => !applications.some((a: any) => a.jobId === j.id)) // exclude already applied
        .slice(0, 30)
        .map((j) => ({
          id: j.id,
          title: j.title,
          company: j.company?.companyName,
          location: j.location,
          type: j.type,
          category: j.category?.name,
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
        }));

      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: session.user.name,
          appliedJobs: appliedTitles,
          availableJobs,
        }),
      });

      if (!res.ok) throw new Error('Recommendation fetch failed');
      return res.json();
    },
    enabled: !!session?.user && allJobs.length > 0,
    staleTime: 1000 * 60 * 10, // 10 min — AI results are expensive, cache them
    retry: 1,
  });

  // Map recommendation IDs back to full IJob objects
  const recommendations: RecommendedJob[] =
    recData?.recommendations
      ?.map((rec) => {
        const fullJob = allJobs.find((j) => j.id === rec.id);
        if (!fullJob) return null;
        return { ...fullJob, matchScore: rec.matchScore, matchReason: rec.matchReason };
      })
      .filter(Boolean) as RecommendedJob[] || [];

  const isRefreshing = isFetching && !isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Animated AI icon */}
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-card"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">AI Recommendations</h3>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
                Beta
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {recData?.profileSummary || 'Personalized picks based on your activity'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setRefreshKey((k) => k + 1);
              refetch();
            }}
            disabled={isLoading || isFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            >
              <RefreshCw className="w-3 h-3" />
            </motion.div>
            Refresh
          </motion.button>

          <Link
            href="/jobs"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            All jobs <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Loading */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Animated AI thinking banner */}
              <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.7, delay: i * 0.18, repeat: Infinity }}
                    />
                  ))}
                </div>
                <p className="text-xs text-primary font-medium">
                  AI is analyzing your profile and finding the best matches…
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <RecommendationSkeleton key={i} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <p className="text-sm text-muted-foreground mb-3">
                Couldn&apos;t load recommendations right now.
              </p>
              <button
                onClick={() => refetch()}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Try again
              </button>
            </motion.div>
          )}

          {/* Results */}
          {!isLoading && !isError && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {recommendations.length === 0 ? (
                <EmptyState hasApplications={hasApplications} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((job, i) => (
                    <RecommendationCard key={job.id} job={job} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}