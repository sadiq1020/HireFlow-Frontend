'use client';

import { api } from '@/lib/api';
import { ICategory } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']),
  categoryId: z.string().min(1, 'Category is required'),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  deadline: z.string().optional(),
});

type JobForm = z.infer<typeof jobSchema>;

const jobTypes = [
  { value: 'FULL_TIME', label: 'Full Time', color: 'border-emerald-500/30 hover:border-emerald-500 text-emerald-400' },
  { value: 'PART_TIME', label: 'Part Time', color: 'border-blue-500/30 hover:border-blue-500 text-blue-400' },
  { value: 'REMOTE', label: 'Remote', color: 'border-violet-500/30 hover:border-violet-500 text-violet-400' },
  { value: 'CONTRACT', label: 'Contract', color: 'border-orange-500/30 hover:border-orange-500 text-orange-400' },
  { value: 'INTERNSHIP', label: 'Internship', color: 'border-fuchsia-500/30 hover:border-fuchsia-500 text-fuchsia-400' },
];

export default function CreateJobPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('FULL_TIME');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<any>('/categories'),
  });

  const categories: ICategory[] = categoriesData?.data || [];

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: { type: 'FULL_TIME' },
  });

  const title = watch('title');

  const { mutate: createJob, isPending } = useMutation({
    mutationFn: (data: JobForm) => api.post('/jobs', data),
    onSuccess: () => router.push('/company/jobs'),
  });

  const generateDescription = async () => {
    if (!title) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type: selectedType }),
      });
      const data = await response.json();
      if (data.description) setValue('description', data.description);
      if (data.requirements) setValue('requirements', data.requirements);
    } catch {
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: JobForm) => {
    createJob({
      ...data,
      type: selectedType as any,
      salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
    });
  };

  const inputClass = "w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-foreground mb-1.5";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to jobs
        </button>
        <h1 className="text-2xl font-bold text-foreground">Post New Job</h1>
        <p className="text-muted-foreground text-sm mt-1">Fill in the details to create your job listing</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-foreground border-b border-border pb-3">Basic Information</h2>

          <div>
            <label className={labelClass}>Job Title</label>
            <input {...register('title')} placeholder="e.g. Senior Frontend Developer" className={inputClass} />
            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Job type */}
          <div>
            <label className={labelClass}>Job Type</label>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setSelectedType(t.value); setValue('type', t.value as any); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedType === t.value
                      ? `${t.color} bg-secondary shadow-sm`
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input {...register('location')} placeholder="e.g. New York, NY or Remote" className={inputClass} />
              {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select {...register('categoryId')} className={inputClass}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground">Job Details</h2>
            <button
              type="button"
              onClick={generateDescription}
              disabled={isGenerating || !title}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors disabled:opacity-40"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </button>
          </div>

          <div>
            <label className={labelClass}>Job Description</label>
            <textarea
              {...register('description')}
              rows={6}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className={`${inputClass} resize-none`}
            />
            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Requirements
              <span className="text-muted-foreground font-normal ml-1">(optional)</span>
            </label>
            <textarea
              {...register('requirements')}
              rows={4}
              placeholder="List required skills, experience, and qualifications..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </motion.div>

        {/* Compensation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
            Compensation & Deadline
            <span className="text-muted-foreground font-normal text-sm ml-2">(optional)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Min Salary ($)</label>
              <input
                {...register('salaryMin', { valueAsNumber: true })}
                type="number"
                placeholder="50000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max Salary ($)</label>
              <input
                {...register('salaryMax', { valueAsNumber: true })}
                type="number"
                placeholder="80000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Application Deadline</label>
              <input
                {...register('deadline')}
                type="date"
                className={inputClass}
              />
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : 'Post Job'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}