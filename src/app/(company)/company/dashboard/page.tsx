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
import {
    AlertCircle,
    ArrowRight,
    Briefcase,
    Clock,
    Plus,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import {
    Bar,
    BarChart,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis, YAxis
} from 'recharts';

const statusColors: Record<string, string> = {
  PENDING: '#f59e0b',
  REVIEWED: '#3b82f6',
  SHORTLISTED: '#8b5cf6',
  REJECTED: '#ef4444',
  HIRED: '#10b981',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  REVIEWED: { label: 'Reviewed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  HIRED: { label: 'Hired', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

const chartConfig = { count: { label: 'Count', color: '#8b5cf6' } };

export default function CompanyDashboard() {
  const { data: session } = useSession();

  const { data: profileData } = useQuery({
    queryKey: ['company-profile'],
    queryFn: () => api.get<any>('/company/profile'),
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => api.get<any>('/jobs/my-jobs?limit=100'),
  });

  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['company-applications'],
    queryFn: () => api.get<any>('/company/applications'),
  });

  const profile = profileData?.data;
  const jobs = jobsData?.data || [];
  const applications = applicationsData?.data || [];

  const isLoading = jobsLoading || appsLoading;

  // Stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j: any) => j.isActive).length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a: any) => a.status === 'PENDING').length;
  const hiredCount = applications.filter((a: any) => a.status === 'HIRED').length;

  // Applications by status for pie chart
  const statusGroups = Object.entries(
    applications.reduce((acc: any, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count, fill: statusColors[status] }));

  // Applications per job for bar chart
  const jobAppData = jobs.slice(0, 6).map((job: any) => ({
    name: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
    count: applications.filter((a: any) => a.jobId === job.id).length,
  }));

  // Applications over time for line chart
  const monthlyApps = applications.reduce((acc: any, app: any) => {
    const month = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const lineData = Object.entries(monthlyApps).map(([month, count]) => ({ month, count }));

  const stats = [
    { label: 'Total Jobs', value: totalJobs, icon: Briefcase, gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-500/10 to-purple-600/5', border: 'border-violet-500/20' },
    { label: 'Active Jobs', value: activeJobs, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-500/10 to-teal-600/5', border: 'border-emerald-500/20' },
    { label: 'Total Applications', value: totalApplications, icon: Users, gradient: 'from-blue-500 to-indigo-600', bg: 'from-blue-500/10 to-indigo-600/5', border: 'border-blue-500/20' },
    { label: 'Pending Review', value: pendingApplications, icon: Clock, gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-500/10 to-orange-600/5', border: 'border-amber-500/20' },
    { label: 'Hired', value: hiredCount, icon: Users, gradient: 'from-fuchsia-500 to-pink-600', bg: 'from-fuchsia-500/10 to-pink-600/5', border: 'border-fuchsia-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Company Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile?.companyName || session?.user?.name} — Overview
          </p>
        </div>
        <Link
          href="/company/jobs/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </motion.div>

      {/* Approval warning */}
      {profile && profile.approvalStatus !== 'APPROVED' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            profile.approvalStatus === 'PENDING'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">
              {profile.approvalStatus === 'PENDING'
                ? 'Your company is pending approval'
                : 'Your company application was rejected'}
            </p>
            <p className="text-xs opacity-70 mt-0.5">
              {profile.approvalStatus === 'PENDING'
                ? 'You cannot post jobs until approved by an admin.'
                : profile.rejectionNote || 'Please contact support for more information.'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
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
                <div className="text-xs font-semibold text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Charts */}
      {!isLoading && applications.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart — apps per job */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-foreground mb-1">Applications per Job</h3>
            <p className="text-xs text-muted-foreground mb-6">Top 6 job listings by applications</p>
            <ChartContainer config={chartConfig} className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobAppData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {jobAppData.map((_: any, i: number) => (
                      <Cell key={i} fill={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][i % 6]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          {/* Pie chart — application status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-foreground mb-1">Application Status</h3>
            <p className="text-xs text-muted-foreground mb-4">Current status breakdown</p>
            <ChartContainer config={chartConfig} className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusGroups} dataKey="count" cx="50%" cy="50%" innerRadius={30} outerRadius={55}>
                    {statusGroups.map((entry: any, i: number) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="space-y-1.5 mt-3">
              {statusGroups.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground">{statusConfig[item.status]?.label}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Line chart — applications trend */}
      {!isLoading && lineData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="text-base font-bold text-foreground mb-1">Application Trend</h3>
          <p className="text-xs text-muted-foreground mb-6">Monthly incoming applications</p>
          <ChartContainer config={chartConfig} className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>
      )}

      {/* Recent applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Recent Applications</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest candidates applying to your jobs</p>
          </div>
          <Link href="/company/applications" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No applications yet</p>
            <p className="text-xs text-muted-foreground mt-1">Post jobs to start receiving applications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app: any, i: number) => (
              <div key={app.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {app.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{app.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{app.job?.title}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${statusConfig[app.status]?.color}`}>
                  {statusConfig[app.status]?.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Post New Job', href: '/company/jobs/create', icon: Plus, gradient: 'from-violet-500 to-purple-600', desc: 'Create a job listing' },
          { label: 'Manage Jobs', href: '/company/jobs', icon: Briefcase, gradient: 'from-blue-500 to-indigo-600', desc: 'Edit your listings' },
          { label: 'Applications', href: '/company/applications', icon: Users, gradient: 'from-emerald-500 to-teal-600', desc: 'Review candidates' },
        ].map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
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