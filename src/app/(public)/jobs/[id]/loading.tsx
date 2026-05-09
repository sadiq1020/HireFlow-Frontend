import { JobDetailSkeleton } from '@/components/shared/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <JobDetailSkeleton />
    </div>
  );
}