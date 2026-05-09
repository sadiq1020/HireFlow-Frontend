import { DashboardStatSkeleton, JobCardSkeleton } from '@/components/shared/SkeletonCard';

export default function Loading() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page title skeleton */}
      <div>
        <div className="w-48 h-7 rounded-xl bg-muted/60 animate-pulse mb-2" />
        <div className="w-64 h-4 rounded-lg bg-muted/30 animate-pulse" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <DashboardStatSkeleton key={i} />
        ))}
      </div>

      {/* AI Recommendations placeholder */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="w-48 h-5 rounded-lg bg-muted/60 animate-pulse" />
          <div className="w-20 h-4 rounded-lg bg-muted/30 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Recent applications placeholder */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="w-44 h-5 rounded-lg bg-muted/60 animate-pulse mb-5" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted/20 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}