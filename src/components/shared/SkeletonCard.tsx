'use client';

import { motion } from 'framer-motion';

function Shimmer() {
  return (
    <motion.div
      className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="h-[280px] bg-card/40 border border-border rounded-2xl p-5 relative overflow-hidden">
      <Shimmer />
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-muted/60" />
        <div className="w-20 h-6 rounded-full bg-muted/60" />
      </div>
      <div className="w-4/5 h-5 rounded-lg bg-muted/60 mb-3" />
      <div className="w-1/2 h-4 rounded-lg bg-muted/40 mb-6" />
      <div className="space-y-3 mb-6">
        <div className="w-2/3 h-3 rounded-lg bg-muted/30" />
        <div className="w-1/2 h-3 rounded-lg bg-muted/30" />
      </div>
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="w-24 h-3 rounded-lg bg-muted/30" />
        <div className="w-12 h-4 rounded-lg bg-muted/30" />
      </div>
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="h-[280px] bg-card/40 border border-border rounded-2xl p-6 relative overflow-hidden">
      <Shimmer />
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-muted/60" />
        <div className="w-20 h-6 rounded-full bg-muted/60" />
      </div>
      <div className="w-3/4 h-5 rounded-lg bg-muted/60 mb-3" />
      <div className="w-full h-3 rounded-lg bg-muted/30 mb-2" />
      <div className="w-2/3 h-3 rounded-lg bg-muted/30 mb-6" />
      <div className="space-y-2 mb-6">
        <div className="w-1/2 h-3 rounded-lg bg-muted/30" />
        <div className="w-1/3 h-3 rounded-lg bg-muted/30" />
      </div>
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="w-20 h-3 rounded-lg bg-muted/30" />
        <div className="w-16 h-3 rounded-lg bg-muted/30" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="min-h-[160px] bg-card/40 border border-border rounded-2xl p-7 flex flex-col items-center justify-center relative overflow-hidden">
      <Shimmer />
      <div className="w-12 h-12 rounded-xl bg-muted/60 mb-4" />
      <div className="w-28 h-5 rounded-lg bg-muted/60 mb-2" />
      <div className="w-20 h-3 rounded-lg bg-muted/30" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
      <Shimmer />
      <div className="w-12 h-12 rounded-xl bg-secondary mb-6" />
      <div className="w-24 h-8 rounded-lg bg-secondary mb-2" />
      <div className="w-20 h-4 rounded-lg bg-secondary mb-1" />
      <div className="w-32 h-3 rounded-lg bg-secondary" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded-lg bg-secondary relative overflow-hidden">
            <Shimmer />
          </div>
        </td>
      ))}
    </tr>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
      <Shimmer />
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-muted/60 flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="w-1/3 h-5 rounded-lg bg-muted/60" />
          <div className="w-1/4 h-4 rounded-lg bg-muted/40" />
          <div className="w-1/2 h-3 rounded-lg bg-muted/30" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="w-full h-4 rounded-lg bg-muted/30" />
        <div className="w-5/6 h-4 rounded-lg bg-muted/30" />
        <div className="w-4/6 h-4 rounded-lg bg-muted/30" />
      </div>
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-card/40 border border-border rounded-2xl p-5 relative overflow-hidden">
      <Shimmer />
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-muted/60" />
        <div className="w-16 h-6 rounded-full bg-muted/40" />
      </div>
      <div className="w-20 h-8 rounded-lg bg-muted/60 mb-1" />
      <div className="w-24 h-3 rounded-lg bg-muted/30" />
    </div>
  );
}

export function JobDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="w-32 h-4 rounded-lg bg-muted/40 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
            <Shimmer />
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-muted/60 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="w-3/4 h-8 rounded-xl bg-muted/60" />
                <div className="w-1/3 h-5 rounded-lg bg-muted/40" />
              </div>
              <div className="w-24 h-8 rounded-full bg-muted/60" />
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-32 h-10 rounded-xl bg-muted/30" />
              ))}
            </div>
            <div className="flex gap-4">
              <div className="flex-1 h-12 rounded-xl bg-muted/60" />
              <div className="w-32 h-12 rounded-xl bg-muted/40" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4 relative overflow-hidden">
            <Shimmer />
            <div className="w-40 h-6 rounded-lg bg-muted/60 mb-6" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-4 rounded-lg bg-muted/30 ${i % 2 === 0 ? 'w-full' : 'w-4/5'}`} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
            <Shimmer />
            <div className="w-32 h-5 rounded-lg bg-muted/60 mb-6" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-muted/60" />
              <div className="space-y-2">
                <div className="w-32 h-4 rounded-lg bg-muted/60" />
                <div className="w-24 h-3 rounded-lg bg-muted/30" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-4 rounded-lg bg-muted/30" />
              <div className="w-full h-4 rounded-lg bg-muted/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="w-32 h-4 rounded-lg bg-muted/40 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
            <Shimmer />
            <div className="flex items-start gap-8 mb-8">
              <div className="w-24 h-24 rounded-2xl bg-muted/60 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="w-1/2 h-9 rounded-xl bg-muted/60" />
                <div className="w-1/4 h-5 rounded-lg bg-muted/40" />
                <div className="flex gap-4">
                  <div className="w-32 h-5 rounded-lg bg-muted/30" />
                  <div className="w-32 h-5 rounded-lg bg-muted/30" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-2xl">
              <div className="h-12 bg-muted/30 rounded-xl" />
              <div className="h-12 bg-muted/30 rounded-xl" />
              <div className="h-12 bg-muted/30 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
            <Shimmer />
            <div className="w-32 h-5 rounded-lg bg-muted/60 mb-6" />
            <div className="space-y-4">
              <div className="h-12 bg-muted/30 rounded-xl" />
              <div className="h-12 bg-muted/30 rounded-xl" />
              <div className="h-40 bg-muted/30 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}