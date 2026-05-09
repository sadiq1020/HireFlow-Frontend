import { CompanyCardSkeleton } from '@/components/shared/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header skeleton */}
      <div className="bg-gradient-to-b from-card/50 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <div className="w-40 h-3 rounded-lg bg-muted/30 animate-pulse mb-3" />
            <div className="w-52 h-8 rounded-xl bg-muted/60 animate-pulse mb-2" />
            <div className="w-56 h-4 rounded-lg bg-muted/30 animate-pulse" />
          </div>
          <div className="h-12 max-w-xl rounded-xl bg-card border border-border animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}