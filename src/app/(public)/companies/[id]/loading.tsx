import { CompanyDetailSkeleton } from '@/components/shared/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <CompanyDetailSkeleton />
    </div>
  );
}