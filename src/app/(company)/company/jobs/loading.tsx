import { JobCardSkeleton } from '@/components/shared/SkeletonCard';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="w-32 h-7 rounded-xl bg-muted/60 animate-pulse mb-2" />
          <div className="w-48 h-4 rounded-lg bg-muted/30 animate-pulse" />
        </div>
        <div className="w-32 h-10 rounded-xl bg-muted/40 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}