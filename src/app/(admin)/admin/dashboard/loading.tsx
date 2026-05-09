import { DashboardStatSkeleton } from '@/components/shared/SkeletonCard';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="w-48 h-7 rounded-xl bg-muted/60 animate-pulse mb-2" />
        <div className="w-64 h-4 rounded-lg bg-muted/30 animate-pulse" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <DashboardStatSkeleton key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6">
            <div className="w-40 h-5 rounded-lg bg-muted/60 animate-pulse mb-5" />
            <div className="h-48 rounded-xl bg-muted/20 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6">
            <div className="w-36 h-5 rounded-lg bg-muted/60 animate-pulse mb-5" />
            <div className="h-48 rounded-xl bg-muted/20 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}