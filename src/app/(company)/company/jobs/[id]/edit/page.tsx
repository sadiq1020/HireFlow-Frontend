'use client';

import { AIJobDescriptionPanel } from '@/components/ai/AIJobDescriptionPanel'; // ← added
import { api } from '@/lib/api';
import { ICategory } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(50),
  requirements: z.string().optional(),
  location: z.string().min(2),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']),
  categoryId: z.string().min(1),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  deadline: z.string().optional(),
  isActive: z.boolean().optional(),
});

type JobForm = z.infer<typeof jobSchema>;

const jobTypes = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'];
const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time',
  REMOTE: 'Remote', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
};

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('FULL_TIME');

  const { data: jobData, isLoading } = useQuery({
    queryKey: ['job-edit', id],
    queryFn: () => api.get<any>(`/jobs/${id}`),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<any>('/categories'),
  });

  const categories: ICategory[] = (categoriesData as any)?.data || [];
  const job = (jobData as any)?.data;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<JobForm>({ // ← added watch
    resolver: zodResolver(jobSchema),
  });

  // ← added: read live values for the AI panel
  const title    = watch('title')    ?? '';
  const location = watch('location') ?? '';

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        requirements: job.requirements || '',
        location: job.location,
        type: job.type,
        categoryId: job.categoryId,
        salaryMin: job.salaryMin || undefined,
        salaryMax: job.salaryMax || undefined,
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        isActive: job.isActive,
      });
      setSelectedType(job.type);
    }
  }, [job, reset]);

  const { mutate: updateJob, isPending } = useMutation({
    mutationFn: (data: JobForm) => api.put(`/jobs/${id}`, data),
    onSuccess: () => router.push('/company/jobs'),
  });

  // ← added: called when company clicks "Apply to Form" inside the AI panel
  const handleAIApply = (description: string, requirements: string) => {
    setValue('description', description, { shouldValidate: true });
    setValue('requirements', requirements, { shouldValidate: true });
  };

  const inputClass = "w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-foreground mb-1.5";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to jobs
        </button>
        <h1 className="text-2xl font-bold text-foreground">Edit Job</h1>
        <p className="text-muted-foreground text-sm mt-1">Update your job listing details</p>
      </motion.div>

      <form onSubmit={handleSubmit((data) => updateJob({ ...data, type: selectedType as any }))} className="space-y-6">

        {/* Basic Information — unchanged */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-3">Basic Information</h2>
          <div>
            <label className={labelClass}>Job Title</label>
            <input {...register('title')} className={inputClass} />
            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Job Type</label>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((t) => (
                <button key={t} type="button" onClick={() => { setSelectedType(t); setValue('type', t as any); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedType === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                  {jobTypeLabels[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input {...register('location')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select {...register('categoryId')} className={inputClass}>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input {...register('isActive')} type="checkbox" id="isActive" className="w-4 h-4 accent-primary" />
            <label htmlFor="isActive" className="text-sm font-medium text-foreground">Active listing (visible to job seekers)</label>
          </div>
        </motion.div>

        {/* Job Details — header now has AI panel button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6 space-y-4">

          {/* ↓ only this line changed vs the original — was a plain <h2>, now a flex row with the AI panel */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground">Job Details</h2>
            <AIJobDescriptionPanel
              jobTitle={title}
              jobType={selectedType}
              jobLocation={location}
              onApply={handleAIApply}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea {...register('description')} rows={6} className={`${inputClass} resize-none`} />
            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Requirements <span className="text-muted-foreground font-normal">(optional)</span></label>
            <textarea {...register('requirements')} rows={4} className={`${inputClass} resize-none`} />
          </div>
        </motion.div>

        {/* Compensation & Deadline — unchanged */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-3">Compensation & Deadline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Min Salary ($)</label>
              <input {...register('salaryMin', { valueAsNumber: true })} type="number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max Salary ($)</label>
              <input {...register('salaryMax', { valueAsNumber: true })} type="number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Deadline</label>
              <input {...register('deadline')} type="date" className={inputClass} />
            </div>
          </div>
        </motion.div>

        {/* Submit — unchanged */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl text-sm transition-colors">Cancel</button>
          <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold rounded-xl text-sm transition-all">
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Changes</>}
          </button>
        </motion.div>

      </form>
    </div>
  );
}