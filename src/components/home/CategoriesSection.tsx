'use client';

import { CategoryCardSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { ICategory } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const categoryStyles = [
  { gradient: 'from-violet-500/20 to-purple-600/20', border: 'border-violet-500/20 hover:border-violet-400/50', glow: 'group-hover:shadow-violet-500/20', dot: 'bg-violet-400' },
  { gradient: 'from-blue-500/20 to-indigo-600/20', border: 'border-blue-500/20 hover:border-blue-400/50', glow: 'group-hover:shadow-blue-500/20', dot: 'bg-blue-400' },
  { gradient: 'from-fuchsia-500/20 to-pink-600/20', border: 'border-fuchsia-500/20 hover:border-fuchsia-400/50', glow: 'group-hover:shadow-fuchsia-500/20', dot: 'bg-fuchsia-400' },
  { gradient: 'from-emerald-500/20 to-teal-600/20', border: 'border-emerald-500/20 hover:border-emerald-400/50', glow: 'group-hover:shadow-emerald-500/20', dot: 'bg-emerald-400' },
  { gradient: 'from-orange-500/20 to-amber-600/20', border: 'border-orange-500/20 hover:border-orange-400/50', glow: 'group-hover:shadow-orange-500/20', dot: 'bg-orange-400' },
  { gradient: 'from-cyan-500/20 to-sky-600/20', border: 'border-cyan-500/20 hover:border-cyan-400/50', glow: 'group-hover:shadow-cyan-500/20', dot: 'bg-cyan-400' },
  { gradient: 'from-rose-500/20 to-red-600/20', border: 'border-rose-500/20 hover:border-rose-400/50', glow: 'group-hover:shadow-rose-500/20', dot: 'bg-rose-400' },
  { gradient: 'from-indigo-500/20 to-violet-600/20', border: 'border-indigo-500/20 hover:border-indigo-400/50', glow: 'group-hover:shadow-indigo-500/20', dot: 'bg-indigo-400' },
];

export default function CategoriesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<{ data: ICategory[] }>('/categories'),
  });

  const categories = (data as any)?.data || [];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/3 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Explore</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Browse by{' '}
              <span className="bg-gradient-to-r from-primary via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-relaxed">
              Discover opportunities across industries. Find the perfect role that matches your expertise and passion.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group px-4 py-2 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20"
            >
              View all jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Loading */}
        {isLoading && (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <CategoryCardSkeleton key={i} />
    ))}
  </div>
)}

        {/* Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category: ICategory, i: number) => {
              const style = categoryStyles[i % categoryStyles.length];
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <Link
                    href={`/jobs?categoryId=${category.id}`}
                    className={`group flex flex-col items-center justify-center p-7 rounded-2xl bg-gradient-to-br ${style.gradient} border ${style.border} transition-all duration-300 min-h-[160px] relative overflow-hidden shadow-lg ${style.glow} hover:shadow-xl`}
                  >
                    {/* Animated background shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Top dot indicator */}
                    <div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${style.dot} opacity-60`} />

                    {/* Icon */}
                    <motion.span
                      className="text-4xl mb-3 relative z-10 block"
                      whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      {category.icon || '💼'}
                    </motion.span>

                    {/* Name */}
                    <span className="text-sm font-bold text-foreground text-center relative z-10 leading-tight">
                      {category.name}
                    </span>

                    {/* Job count */}
                    {category._count && (
                      <span className={`text-xs font-semibold mt-2 relative z-10 ${style.dot.replace('bg-', 'text-')}`}>
                        {category._count.jobs} open roles
                      </span>
                    )}

                    {/* Arrow on hover */}
                    <motion.div
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="w-3 h-3 text-foreground/50" />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}