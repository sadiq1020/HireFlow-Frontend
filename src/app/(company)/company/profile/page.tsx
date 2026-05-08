'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import {
  Building2, Globe, MapPin, Briefcase,
  Save, Loader2, CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { ProfileSkeleton } from '@/components/shared/SkeletonCard';

const profileSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const approvalConfig = {
  PENDING: {
    icon: Clock,
    color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    label: 'Pending Approval',
    desc: 'Your company is awaiting admin review. You cannot post jobs until approved.',
  },
  APPROVED: {
    icon: CheckCircle,
    color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    label: 'Approved',
    desc: 'Your company is verified and active. You can post jobs.',
  },
  REJECTED: {
    icon: AlertCircle,
    color: 'bg-red-500/10 border-red-500/20 text-red-400',
    label: 'Rejected',
    desc: 'Your application was rejected. Contact support for more info.',
  },
};

export default function CompanyProfilePage() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['company-profile'],
    queryFn: () => api.get<any>('/company/profile'),
  });

  const profile = data?.data;
  const approval = approvalConfig[profile?.approvalStatus as keyof typeof approvalConfig] || approvalConfig.PENDING;
  const ApprovalIcon = approval.icon;

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      companyName: profile?.companyName || '',
      website: profile?.website || '',
      location: profile?.location || '',
      industry: profile?.industry || '',
      description: profile?.description || '',
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: ProfileForm) => api.put('/company/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading) return <ProfileSkeleton />;

  const inputClass = "w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-foreground mb-1.5";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Company Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your company information and settings
        </p>
      </motion.div>

      {/* Approval status banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`flex items-start gap-3 p-4 rounded-xl border ${approval.color}`}
      >
        <ApprovalIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold">{approval.label}</p>
          <p className="text-xs opacity-70 mt-0.5">{approval.desc}</p>
          {profile?.rejectionNote && (
            <p className="text-xs mt-1 font-semibold opacity-80">
              Reason: {profile.rejectionNote}
            </p>
          )}
        </div>
      </motion.div>

      {/* Company logo card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
            {profile?.logo ? (
              <img src={profile.logo} alt={profile.companyName} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Building2 className="w-9 h-9 text-primary" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{profile?.companyName}</h2>
            {profile?.industry && (
              <p className="text-sm text-muted-foreground">{profile.industry}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {profile?.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 text-primary/50" />
                  {profile.location}
                </div>
              )}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Globe className="w-3 h-3" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-base font-bold text-foreground mb-5">Company Information</h3>

        <form onSubmit={handleSubmit((data) => updateProfile(data))} className="space-y-4">
          <div>
            <label className={labelClass}>Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input {...register('companyName')} className={`${inputClass} pl-10`} placeholder="Your company name" />
            </div>
            {errors.companyName && <p className="mt-1 text-xs text-destructive">{errors.companyName.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Industry</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input {...register('industry')} className={`${inputClass} pl-10`} placeholder="e.g. Technology" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input {...register('location')} className={`${inputClass} pl-10`} placeholder="e.g. New York, NY" />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input {...register('website')} className={`${inputClass} pl-10`} placeholder="https://yourcompany.com" />
            </div>
            {errors.website && <p className="mt-1 text-xs text-destructive">{errors.website.message}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Description
              <span className="text-muted-foreground font-normal ml-1">(optional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Tell candidates about your company culture, mission, and values..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" />Saved!</>
            ) : (
              <><Save className="w-4 h-4" />Save Changes</>
            )}
          </button>
        </form>
      </motion.div>

      {/* Account stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-base font-bold text-foreground mb-4">Account Details</h3>
        <div className="space-y-3">
          {[
            { label: 'Member since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
            { label: 'Approval status', value: profile?.approvalStatus },
            { label: 'Company ID', value: profile?.id?.substring(0, 8) + '...' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}