'use client';

import { DashboardStatSkeleton } from '@/components/shared/SkeletonCard';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { api } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Bookmark, Briefcase, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b',
  REVIEWED: '#3b82f6',
  SHORTLISTED: '#8b5cf6',
  REJECTED: '#ef4444',
  HIRED: '#10b981',
};

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  REVIEWED: { label: 'Reviewed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  HIRED: { label: 'Hired', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

export default function SeekerDashboard() {
  const { data: session } = useSession();

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => api.get<any>('/applications/my'),
  });

  const { data: savedJobsData } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => api.get<any>('/saved-jobs/my'),
  });

  const applications = applicationsData?.data || [];
  const savedJobs = savedJobsData?.data || [];

  // Stats
  const totalApplications = applications.length;
  const hired = applications.filter((a: any) => a.status === 'HIRED').length;
  const shortlisted = applications.filter((a: any) => a.status === 'SHORTLISTED').length;
  const pending = applications.filter((a: any) => a.status === 'PENDING').length;

  // Pie chart data
  const statusGroups = Object.entries(
    applications.reduce((acc: any, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count, fill: statusColors[status] }));

  // Bar chart — applications by month
  const monthlyData = applications.reduce((acc: any, app: any) => {
    const month = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));

  const chartConfig = {
    count: { label: 'Applications', color: '#8b5cf6' },
  };

  const stats = [
    {
      label: 'Total Applications',
      value: totalApplications,
      icon: Briefcase,
      gradient: 'from-violet-500 to-purple-600',
      bg: 'from-violet-500/10 to-purple-600/5',
      border: 'border-violet-500/20',
      change: '+12%',
    },
    {
      label: 'Pending Review',
      value: pending,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      bg: 'from-amber-500/10 to-orange-600/5',
      border: 'border-amber-500/20',
      change: 'Awaiting response',
    },
    {
      label: 'Shortlisted',
      value: shortlisted,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-500/10 to-indigo-600/5',
      border: 'border-blue-500/20',
      change: 'Keep going!',
    },
    {
      label: 'Hired',
      value: hired,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-500/10 to-teal-600/5',
      border: 'border-emerald-500/20',
      change: '🎉 Congratulations',
    },
    {
      label: 'Saved Jobs',
      value: savedJobs.length,
      icon: Bookmark,
      gradient: 'from-fuchsia-500 to-pink-600',
      bg: 'from-fuchsia-500/10 to-pink-600/5',
      border: 'border-fuchsia-500/20',
      change: 'Jobs bookmarked',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {session?.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s a summary of your job search progress.
        </p>
      </motion.div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <DashboardStatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-5 relative overflow-hidden group`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.7 }}
                />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.change}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Charts row */}
      {!isLoading && applications.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-foreground mb-1">Applications Over Time</h3>
            <p className="text-xs text-muted-foreground mb-6">Monthly application activity</p>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][i % 6]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          {/* Pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-foreground mb-1">Application Status</h3>
            <p className="text-xs text-muted-foreground mb-6">Breakdown by current status</p>
            <div className="flex items-center gap-6">
              <ChartContainer config={chartConfig} className="h-48 w-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusGroups} dataKey="count" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                      {statusGroups.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex-1 space-y-2">
                {statusGroups.map((item) => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-muted-foreground text-xs">{statusConfig[item.status as keyof typeof statusConfig]?.label}</span>
                    </div>
                    <span className="font-bold text-foreground text-xs">{item.count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Recent applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Recent Applications</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Your latest job applications</p>
          </div>
          <Link
            href="/seeker/applications"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Briefcase className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No applications yet</p>
            <Link href="/jobs" className="mt-3 text-xs text-primary hover:underline font-semibold">
              Browse jobs →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app: any, i: number) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{app.job?.title}</p>
                  <p className="text-xs text-muted-foreground">{app.job?.company?.companyName}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${statusConfig[app.status as keyof typeof statusConfig]?.color}`}>
                  {statusConfig[app.status as keyof typeof statusConfig]?.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Browse Jobs', href: '/jobs', icon: Briefcase, gradient: 'from-violet-500 to-purple-600', desc: 'Find new opportunities' },
          { label: 'My Applications', href: '/seeker/applications', icon: Clock, gradient: 'from-blue-500 to-indigo-600', desc: 'Track your progress' },
          { label: 'Saved Jobs', href: '/seeker/saved-jobs', icon: Bookmark, gradient: 'from-fuchsia-500 to-pink-600', desc: 'Jobs you bookmarked' },
        ].map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <Link href={link.href}>
                <div className="group bg-card border border-border hover:border-primary/30 rounded-2xl p-5 transition-all hover:shadow-lg">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{link.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}