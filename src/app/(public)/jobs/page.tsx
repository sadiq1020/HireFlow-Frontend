'use client';

import JobCard from '@/components/jobs/JobCard';
import Pagination from '@/components/shared/Pagination';
import { JobCardSkeleton } from '@/components/shared/SkeletonCard';
import { useDebounce } from '@/hooks/useDebounce'; // ← added
import { api } from '@/lib/api';
import { ICategory, IJob, IPaginatedResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Latest' },
  { value: 'salaryMin', label: 'Salary' },
  { value: 'title', label: 'Title A-Z' },
];

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // ← added: debounced values — API only fires 400ms after the user stops typing
  const debouncedSearch = useDebounce(search, 400);
  const debouncedLocation = useDebounce(location, 400);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);       // ← changed
    if (debouncedLocation) params.set('location', debouncedLocation); // ← changed
    if (type) params.set('type', type);
    if (categoryId) params.set('categoryId', categoryId);
    params.set('sortBy', sortBy);
    params.set('sortOrder', 'desc');
    params.set('page', page.toString());
    params.set('limit', '12');
    return params.toString();
  };

  const { data, isLoading, isFetching } = useQuery({
    // ← changed: queryKey uses debounced values so query only re-runs after debounce settles
    queryKey: ['jobs', debouncedSearch, debouncedLocation, type, categoryId, sortBy, page],
    queryFn: () => api.get<IPaginatedResponse<IJob>>(`/jobs?${buildQuery()}`),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<any>('/categories'),
  });

  const jobs: IJob[] = (data as any)?.data || [];
  const meta = (data as any)?.meta;
  const categories: ICategory[] = (categoriesData as any)?.data || [];

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setType('');
    setCategoryId('');
    setSortBy('createdAt');
    setPage(1);
  };

  const hasFilters = search || location || type || categoryId;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero search bar */}
      <div className="bg-gradient-to-b from-card/50 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Browse <span className="text-primary">Jobs</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              {meta?.total ? `${meta.total.toLocaleString()} opportunities available` : 'Find your perfect role'}
            </p>
          </motion.div>

          {/* Search inputs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title or keywords..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl focus-within:border-primary/50 transition-all sm:w-56">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
                showFilters || hasFilters
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && (
                <span className="w-4 h-4 rounded-full bg-primary-foreground/20 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-card border border-border rounded-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Job type */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Job Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => { setType(t.value); setPage(1); }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          type === t.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground outline-none focus:border-primary/50"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground outline-none focus:border-primary/50"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-xs text-destructive hover:underline font-medium flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && (
          <>
            {jobs.length > 0 ? (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ${isFetching ? 'opacity-60' : ''} transition-opacity`}>
                  {jobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </div>

                {meta && meta.totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={page}
                      totalPages={meta.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Try adjusting your search or filters to find more results.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-32 px-4 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-card rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-card rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}