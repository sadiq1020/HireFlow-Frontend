'use client';

import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Loader2, Send, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const applySchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').optional().or(z.literal('')),
  resumeUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ApplyForm = z.infer<typeof applySchema>;

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

export default function ApplyModal({ open, onClose, jobId, jobTitle }: ApplyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ApplyForm>({
    resolver: zodResolver(applySchema),
  });

  const coverLetter = watch('coverLetter');

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle }),
      });
      const data = await response.json();
      if (data.coverLetter) {
        setValue('coverLetter', data.coverLetter);
      }
    } catch {
      setError('Failed to generate cover letter. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: ApplyForm) => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/applications', {
        jobId,
        coverLetter: data.coverLetter || undefined,
        resumeUrl: data.resumeUrl || undefined,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">Apply for Position</h2>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{jobTitle}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success state */}
            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Application Submitted!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Your application has been sent successfully. Good luck!
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                {/* Error */}
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Cover letter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-foreground">
                      Cover Letter
                      <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                    </label>
                    <button
                      type="button"
                      onClick={generateCoverLetter}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {isGenerating
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Sparkles className="w-3 h-3" />
                      }
                      {isGenerating ? 'Generating...' : 'AI Generate'}
                    </button>
                  </div>
                  <textarea
                    {...register('coverLetter')}
                    rows={6}
                    placeholder="Tell the employer why you're the perfect fit for this role..."
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm resize-none"
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.coverLetter && (
                      <p className="text-xs text-destructive">{errors.coverLetter.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {coverLetter?.length || 0} chars
                    </p>
                  </div>
                </div>

                {/* Resume URL */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Resume URL
                    <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    {...register('resumeUrl')}
                    type="url"
                    placeholder="https://your-resume.com/resume.pdf"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
                  />
                  {errors.resumeUrl && (
                    <p className="mt-1 text-xs text-destructive">{errors.resumeUrl.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
                  ) : (
                    <><Send className="w-4 h-4" />Submit Application</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}