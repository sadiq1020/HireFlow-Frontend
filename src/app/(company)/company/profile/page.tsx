'use client';

import { ImageUploader } from '@/components/shared/ImageUploader';
import { ProfileSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Briefcase,
    Building2,
    CheckCircle,
    Clock,
    Globe,
    Loader2,
    MapPin,
    Save,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  // Track logo URL locally until form is saved
  const [pendingLogoUrl, setPendingLogoUrl] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['company-profile'],
    queryFn: () => api.get<any>('/company/profile'),
  });

  const profile = (data as any)?.data;
  const approval =
    approvalConfig[profile?.approvalStatus as keyof typeof approvalConfig] ||
    approvalConfig.PENDING;
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
    mutationFn: (payload: ProfileForm & { logo?: string }) =>
      api.put('/company/profile', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      setPendingLogoUrl(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfile({
      ...data,
      ...(pendingLogoUrl !== null ? { logo: pendingLogoUrl } : {}),
    });
  };

  // Called by ImageUploader after a successful Cloudinary upload
  const handleLogoUpload = (url: string) => {
    setPendingLogoUrl(url);
  };

  if (isLoading) return <ProfileSkeleton />;

  const displayLogo = pendingLogoUrl ?? profile?.logo;

  const inputClass =
    'w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm';
  const labelClass = 'block text-sm font-semibold text-foreground mb-1.5';

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
        <h3 className="text-sm font-bold text-foreground mb-5">Company Logo</h3>
        <ImageUploader
          currentImage={displayLogo}
          fallback={<Building2 className="w-9 h-9 text-primary" />}
          onUploadSuccess={handleLogoUpload}
          shape="rounded"
          size={80}
          folder="hireflow/logos"
          label="Your logo appears on job listings and the company directory"
        />

        {/* Company name + meta below the uploader */}
        <div className="mt-5 pt-5 border-t border-border">
          <h2 className="text-base font-bold text-foreground">{profile?.companyName}</h2>
          {profile?.industry && (
            <p className="text-sm text-muted-foreground">{profile.industry}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-2">
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
      </motion.div>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-base font-bold text-foreground mb-5">Company Information</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={labelClass}>Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                {...register('companyName')}
                className={`${inputClass} pl-10`}
                placeholder="Your company name"
              />
            </div>
            {errors.companyName && (
              <p className="mt-1 text-xs text-destructive">{errors.companyName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Industry</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  {...register('industry')}
                  className={`${inputClass} pl-10`}
                  placeholder="e.g. Technology"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  {...register('location')}
                  className={`${inputClass} pl-10`}
                  placeholder="e.g. New York, NY"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                {...register('website')}
                className={`${inputClass} pl-10`}
                placeholder="https://yourcompany.com"
              />
            </div>
            {errors.website && (
              <p className="mt-1 text-xs text-destructive">{errors.website.message}</p>
            )}
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

          {/* Unsaved logo notice */}
          {pendingLogoUrl !== null && (
            <p className="text-xs text-amber-400 font-medium">
              ⚠ New logo uploaded — click Save Changes to apply it.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm cursor-pointer"
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
            {
              label: 'Member since',
              value: profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : '—',
            },
            { label: 'Approval status', value: profile?.approvalStatus },
            { label: 'Company ID', value: profile?.id?.substring(0, 8) + '...' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}