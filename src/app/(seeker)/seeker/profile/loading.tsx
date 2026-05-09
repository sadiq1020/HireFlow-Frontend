import { ProfileSkeleton } from '@/components/shared/SkeletonCard';

export default function Loading() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="w-32 h-7 rounded-xl bg-muted/60 animate-pulse mb-2" />
        <div className="w-56 h-4 rounded-lg bg-muted/30 animate-pulse" />
      </div>
      <ProfileSkeleton />
      <ProfileSkeleton />
    </div>
  );
}