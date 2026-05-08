'use client';

import { DashboardStatSkeleton } from '@/components/shared/SkeletonCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Briefcase, Building2,
    Clock,
    Tag,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis, YAxis
} from 'recharts';

const chartConfig = { count: { label: 'Count', color: '#8b5cf6' } };

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get<any>('/admin/stats'),
  });

  const { data: appTrendData } = useQuery({
    queryKey: ['admin-app-trend'],
    queryFn: () => api.get<any>('/admin/charts/application-trend'),
  });

  const { data: jobTrendData } = useQuery({
    queryKey: ['admin-job-trend'],
    queryFn: () => api.get<any>('/admin/charts/job-trend'),
  });

  const { data: categoryData } = useQuery({
    queryKey: ['admin-category-dist'],
    queryFn: () => api.get<any>('/admin/charts/category-distribution'),
  });

  const { data: userRolesData } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: () => api.get<any>('/admin/charts/user-roles'),
  });

  const stats = statsData?.data;
  const appTrend = appTrendData?.data || [];
  const jobTrend = jobTrendData?.data || [];
  const categoryDist = categoryData?.data || [];
  const userRoles = userRolesData?.data || [];

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-500/10 to-purple-600/5', border: 'border-violet-500/20', href: '/admin/users' },
    { label: 'Companies', value: stats?.totalCompanies ?? 0, icon: Building2, gradient: 'from-blue-500 to-indigo-600', bg: 'from-blue-500/10 to-indigo-600/5', border: 'border-blue-500/20', href: '/admin/companies' },
    { label: 'Total Jobs', value: stats?.totalJobs ?? 0, icon: Briefcase, gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-500/10 to-teal-600/5', border: 'border-emerald-500/20', href: '/admin/jobs' },
    { label: 'Applications', value: stats?.totalApplications ?? 0, icon: TrendingUp, gradient: 'from-orange-500 to-amber-600', bg: 'from-orange-500/10 to-amber-600/5', border: 'border-orange-500/20', href: '/admin/users' },
    { label: 'Pending Companies', value: stats?.pendingCompanies ?? 0, icon: Clock, gradient: 'from-fuchsia-500 to-pink-600', bg: 'from-fuchsia-500/10 to-pink-600/5', border: 'border-fuchsia-500/20', href: '/admin/companies' },
    { label: 'Categories', value: stats?.totalCategories ?? 0, icon: Tag, gradient: 'from-cyan-500 to-sky-600', bg: 'from-cyan-500/10 to-sky-600/5', border: 'border-cyan-500/20', href: '/admin/categories' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and analytics</p>
      </motion.div>

      {/* Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <DashboardStatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Link href={stat.href}>
                  <div className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-5 relative overflow-hidden group h-full`}>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</div>
                    <div className="text-xs font-semibold text-muted-foreground">{stat.label}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-foreground">Application Trend</h3>
            <span className="text-xs text-blue-400 font-semibold px-2 py-1 bg-blue-500/10 rounded-lg">30 days</span>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Daily applications received</p>
          <ChartContainer config={chartConfig} className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appTrend}>
                <defs>
                  <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.split('-').slice(1).join('/')} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fill="url(#appGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Job trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-foreground">Job Postings Trend</h3>
            <span className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-500/10 rounded-lg">30 days</span>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Daily job listings created</p>
          <ChartContainer config={chartConfig} className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={jobTrend}>
                <defs>
                  <linearGradient id="jobGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.split('-').slice(1).join('/')} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fill="url(#jobGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-foreground">Jobs by Category</h3>
            <span className="text-xs text-orange-400 font-semibold px-2 py-1 bg-orange-500/10 rounded-lg">All time</span>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Distribution of jobs across categories</p>
          <ChartContainer config={chartConfig} className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDist} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={90} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="jobCount" radius={[0, 6, 6, 0]}>
                  {categoryDist.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* User role distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-foreground">User Distribution</h3>
            <span className="text-xs text-fuchsia-400 font-semibold px-2 py-1 bg-fuchsia-500/10 rounded-lg">By role</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Breakdown of users by role</p>
          <div className="flex items-center gap-6">
            <ChartContainer config={chartConfig} className="h-44 w-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userRoles} dataKey="count" cx="50%" cy="50%" innerRadius={35} outerRadius={65}>
                    {userRoles.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex-1 space-y-3">
              {userRoles.map((item: any, i: number) => (
                <div key={item.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-muted-foreground font-medium">{item.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min((item.count / (stats?.totalUsers || 1)) * 80, 80)}px`, backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold text-foreground w-6 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-base font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Manage Companies', href: '/admin/companies', icon: Building2, gradient: 'from-blue-500 to-indigo-600', desc: 'Approve or reject companies', badge: stats?.pendingCompanies > 0 ? stats.pendingCompanies : null },
            { label: 'Manage Users', href: '/admin/users', icon: Users, gradient: 'from-violet-500 to-purple-600', desc: 'Activate or suspend accounts' },
            { label: 'Manage Jobs', href: '/admin/jobs', icon: Briefcase, gradient: 'from-emerald-500 to-teal-600', desc: 'View all job listings' },
            { label: 'Categories', href: '/admin/categories', icon: Tag, gradient: 'from-orange-500 to-amber-600', desc: 'Manage job categories' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Link href={item.href}>
                  <div className="group bg-card border border-border hover:border-primary/30 rounded-2xl p-5 transition-all hover:shadow-lg relative">
                    {item.badge && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.badge}</span>
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}