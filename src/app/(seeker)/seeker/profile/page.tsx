'use client';

import { ProfileSkeleton } from '@/components/shared/SkeletonCard';
import { api } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, Loader2, Mail, Phone, Save, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function SeekerProfilePage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => api.get<any>('/users/profile'),
  });

  const profile = data?.data;

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name || '',
      phone: profile?.phone || '',
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: ProfileForm) => api.put('/users/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal information
        </p>
      </motion.div>

      {/* Avatar card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary/20 flex items-center justify-center">
              {profile?.image ? (
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {profile?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
              <Camera className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{profile?.name}</h2>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {profile?.role}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                profile?.isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {profile?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-base font-bold text-foreground mb-5">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit((data) => updateProfile(data))} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                {...register('name')}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                placeholder="Your full name"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email (read only) */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Email Address
              <span className="text-muted-foreground font-normal ml-1">(cannot be changed)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={profile?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed opacity-60"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Phone Number
              <span className="text-muted-foreground font-normal ml-1">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                {...register('phone')}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Submit */}
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

      {/* Account info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-base font-bold text-foreground mb-4">Account Details</h3>
        <div className="space-y-3">
          {[
            { label: 'Member since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
            { label: 'Account status', value: profile?.isActive ? 'Active' : 'Inactive' },
            { label: 'Role', value: profile?.role },
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