// 'use client';

// import { api } from '@/lib/api';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { AnimatePresence, motion } from 'framer-motion';
// import { CheckCircle, Loader2, Send, Sparkles, X } from 'lucide-react';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';

// const applySchema = z.object({
//   coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').optional().or(z.literal('')),
//   resumeUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
// });

// type ApplyForm = z.infer<typeof applySchema>;

// interface ApplyModalProps {
//   open: boolean;
//   onClose: () => void;
//   jobId: string;
//   jobTitle: string;
// }

// export default function ApplyModal({ open, onClose, jobId, jobTitle }: ApplyModalProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);

//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ApplyForm>({
//     resolver: zodResolver(applySchema),
//   });

//   const coverLetter = watch('coverLetter');

//   const generateCoverLetter = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await fetch('/api/ai/cover-letter', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ jobTitle }),
//       });
//       const data = await response.json();
//       if (data.coverLetter) {
//         setValue('coverLetter', data.coverLetter);
//       }
//     } catch {
//       setError('Failed to generate cover letter. Try again.');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const onSubmit = async (data: ApplyForm) => {
//     setIsLoading(true);
//     setError('');
//     try {
//       await api.post('/applications', {
//         jobId,
//         coverLetter: data.coverLetter || undefined,
//         resumeUrl: data.resumeUrl || undefined,
//       });
//       setIsSuccess(true);
//     } catch (err: any) {
//       setError(err.message || 'Failed to submit application');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setIsSuccess(false);
//     setError('');
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={handleClose}
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             transition={{ duration: 0.2 }}
//             className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-border">
//               <div>
//                 <h2 className="text-lg font-bold text-foreground">Apply for Position</h2>
//                 <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{jobTitle}</p>
//               </div>
//               <button
//                 onClick={handleClose}
//                 className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Success state */}
//             {isSuccess ? (
//               <div className="p-8 text-center">
//                 <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
//                   <CheckCircle className="w-8 h-8 text-emerald-400" />
//                 </div>
//                 <h3 className="text-lg font-bold text-foreground mb-2">Application Submitted!</h3>
//                 <p className="text-sm text-muted-foreground mb-6">
//                   Your application has been sent successfully. Good luck!
//                 </p>
//                 <button
//                   onClick={handleClose}
//                   className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
//                 >
//                   Done
//                 </button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
//                 {/* Error */}
//                 {error && (
//                   <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
//                     {error}
//                   </div>
//                 )}

//                 {/* Cover letter */}
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="text-sm font-semibold text-foreground">
//                       Cover Letter
//                       <span className="text-muted-foreground font-normal ml-1">(optional)</span>
//                     </label>
//                     <button
//                       type="button"
//                       onClick={generateCoverLetter}
//                       disabled={isGenerating}
//                       className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors disabled:opacity-50"
//                     >
//                       {isGenerating
//                         ? <Loader2 className="w-3 h-3 animate-spin" />
//                         : <Sparkles className="w-3 h-3" />
//                       }
//                       {isGenerating ? 'Generating...' : 'AI Generate'}
//                     </button>
//                   </div>
//                   <textarea
//                     {...register('coverLetter')}
//                     rows={6}
//                     placeholder="Tell the employer why you're the perfect fit for this role..."
//                     className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm resize-none"
//                   />
//                   <div className="flex items-center justify-between mt-1">
//                     {errors.coverLetter && (
//                       <p className="text-xs text-destructive">{errors.coverLetter.message}</p>
//                     )}
//                     <p className="text-xs text-muted-foreground ml-auto">
//                       {coverLetter?.length || 0} chars
//                     </p>
//                   </div>
//                 </div>

//                 {/* Resume URL */}
//                 <div>
//                   <label className="block text-sm font-semibold text-foreground mb-2">
//                     Resume URL
//                     <span className="text-muted-foreground font-normal ml-1">(optional)</span>
//                   </label>
//                   <input
//                     {...register('resumeUrl')}
//                     type="url"
//                     placeholder="https://your-resume.com/resume.pdf"
//                     className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
//                   />
//                   {errors.resumeUrl && (
//                     <p className="mt-1 text-xs text-destructive">{errors.resumeUrl.message}</p>
//                   )}
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
//                 >
//                   {isLoading ? (
//                     <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
//                   ) : (
//                     <><Send className="w-4 h-4" />Submit Application</>
//                   )}
//                 </button>
//               </form>
//             )}
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// }

'use client';

import { api } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Copy,
    FileText,
    Loader2,
    RefreshCw,
    Send,
    Sparkles,
    Wand2,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────
const applySchema = z.object({
  coverLetter: z
    .string()
    .min(50, 'Cover letter must be at least 50 characters')
    .optional()
    .or(z.literal('')),
  resumeUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ApplyForm = z.infer<typeof applySchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  // Optional — pass these from the job detail page for a better AI letter
  jobDescription?: string;
  companyName?: string;
  jobType?: string;
  jobLocation?: string;
}

// ─── Tone options ─────────────────────────────────────────────────────────────
const TONES = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'confident',    label: 'Confident',    emoji: '🚀' },
  { id: 'enthusiastic', label: 'Enthusiastic', emoji: '✨' },
  { id: 'concise',      label: 'Concise',      emoji: '⚡' },
] as const;

type Tone = (typeof TONES)[number]['id'];

// ─── Typing animation word-by-word ───────────────────────────────────────────
function useTypewriter(text: string, active: boolean) {
  // We don't animate character-by-character (too slow for long text).
  // Instead we just return the full text immediately once done streaming.
  return text;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ApplyModal({
  open,
  onClose,
  jobId,
  jobTitle,
  jobDescription,
  companyName,
  jobType,
  jobLocation,
}: ApplyModalProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [submitError, setSubmitError]   = useState('');

  // AI assistant state
  const [aiOpen, setAiOpen]             = useState(false);
  const [tone, setTone]                 = useState<Tone>('professional');
  const [extraContext, setExtraContext]  = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [aiError, setAiError]           = useState('');
  const [copied, setCopied]             = useState(false);
  const [usedLetter, setUsedLetter]     = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplyForm>({
    resolver: zodResolver(applySchema),
  });

  const coverLetter = watch('coverLetter') ?? '';

  // ── Generate cover letter ──────────────────────────────────────────────────
  const generateCoverLetter = async () => {
    setIsGenerating(true);
    setAiError('');
    setGeneratedLetter('');
    setUsedLetter(false);

    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          companyName,
          jobType,
          jobLocation,
          jobDescription: jobDescription?.slice(0, 800), // trim for token budget
          tone,
          extraContext: extraContext.trim() || undefined,
          userName: session?.user?.name,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();

      if (data.coverLetter) {
        setGeneratedLetter(data.coverLetter);
      } else {
        throw new Error('Empty response');
      }
    } catch {
      setAiError('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Use generated letter ───────────────────────────────────────────────────
  const useLetter = () => {
    setValue('coverLetter', generatedLetter, { shouldValidate: true });
    setUsedLetter(true);
    setAiOpen(false);
    // Scroll to textarea
    setTimeout(() => textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  };

  // ── Copy to clipboard ──────────────────────────────────────────────────────
  const copyLetter = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Submit application ─────────────────────────────────────────────────────
  const onSubmit = async (data: ApplyForm) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await api.post('/applications', {
        jobId,
        coverLetter: data.coverLetter || undefined,
        resumeUrl:   data.resumeUrl   || undefined,
      });
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSubmitError('');
    setGeneratedLetter('');
    setAiOpen(false);
    setExtraContext('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
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
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-xl bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(90vh, 780px)' }}
          >
            {/* Gradient top line */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-10"
              style={{
                background:
                  'linear-gradient(90deg, transparent, oklch(55% 0.25 285 / 0.7), oklch(65% 0.2 310 / 0.5), transparent)',
              }}
            />

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground leading-none">
                    Apply for Position
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {jobTitle}{companyName ? ` · ${companyName}` : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto">
              {/* Success state */}
              {isSuccess ? (
                <div className="p-10 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5"
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Application Submitted!</h3>
                  <p className="text-sm text-muted-foreground mb-7">
                    Your application has been sent. Good luck! 🤞
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                  {/* Submit error */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                      >
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Cover letter field ── */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-foreground">
                        Cover Letter
                        <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                      </label>

                      {/* AI Assistant toggle */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setAiOpen((v) => !v)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        style={{
                          background: aiOpen
                            ? 'oklch(50% 0.25 285 / 0.15)'
                            : 'oklch(50% 0.25 285 / 0.08)',
                          color: 'oklch(65% 0.2 285)',
                          border: '1px solid oklch(50% 0.25 285 / 0.25)',
                        }}
                      >
                        <Wand2 className="w-3 h-3" />
                        AI Write
                        {aiOpen ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </motion.button>
                    </div>

                    {/* ── AI Assistant Panel ── */}
                    <AnimatePresence>
                      {aiOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mb-3 rounded-xl overflow-hidden"
                            style={{
                              background: 'oklch(14% 0.025 285 / 0.5)',
                              border: '1px solid oklch(50% 0.25 285 / 0.2)',
                            }}
                          >
                            {/* Panel header */}
                            <div
                              className="flex items-center gap-2 px-4 py-3"
                              style={{ borderBottom: '1px solid oklch(50% 0.25 285 / 0.15)' }}
                            >
                              <div className="relative">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <motion.div
                                  className="absolute inset-0"
                                  animate={{ opacity: [1, 0.3, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Sparkles className="w-4 h-4 text-primary" />
                                </motion.div>
                              </div>
                              <span className="text-xs font-bold text-foreground">
                                AI Cover Letter Assistant
                              </span>
                              <span
                                className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                style={{
                                  background: 'oklch(50% 0.25 285 / 0.15)',
                                  color: 'oklch(70% 0.2 285)',
                                  border: '1px solid oklch(50% 0.25 285 / 0.2)',
                                }}
                              >
                                Powered by Gemini
                              </span>
                            </div>

                            <div className="p-4 space-y-4">
                              {/* Tone selector */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                                  Tone
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                  {TONES.map((t) => (
                                    <button
                                      key={t.id}
                                      type="button"
                                      onClick={() => setTone(t.id)}
                                      className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
                                      style={{
                                        background:
                                          tone === t.id
                                            ? 'oklch(50% 0.25 285 / 0.2)'
                                            : 'oklch(18% 0.03 285)',
                                        border:
                                          tone === t.id
                                            ? '1px solid oklch(55% 0.25 285 / 0.5)'
                                            : '1px solid oklch(28% 0.04 285)',
                                        color:
                                          tone === t.id
                                            ? 'oklch(80% 0.15 285)'
                                            : 'oklch(55% 0.05 285)',
                                      }}
                                    >
                                      <span className="text-base">{t.emoji}</span>
                                      <span>{t.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Extra context */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                                  Your background{' '}
                                  <span className="normal-case font-normal">(optional)</span>
                                </p>
                                <textarea
                                  value={extraContext}
                                  onChange={(e) => setExtraContext(e.target.value)}
                                  rows={2}
                                  placeholder="e.g. 3 years React experience, led a team of 5, built e-commerce platforms…"
                                  className="w-full px-3 py-2 rounded-lg text-xs resize-none outline-none transition-all"
                                  style={{
                                    background: 'oklch(18% 0.03 285)',
                                    border: '1px solid oklch(28% 0.04 285)',
                                    color: 'oklch(88% 0.01 285)',
                                    caretColor: 'oklch(60% 0.25 285)',
                                  }}
                                  onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'oklch(50% 0.25 285 / 0.5)';
                                  }}
                                  onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'oklch(28% 0.04 285)';
                                  }}
                                />
                              </div>

                              {/* Generate button */}
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={generateCoverLetter}
                                disabled={isGenerating}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                style={{
                                  background:
                                    'linear-gradient(135deg, oklch(52% 0.26 285), oklch(58% 0.22 305))',
                                  color: 'white',
                                  boxShadow: '0 2px 12px oklch(50% 0.25 285 / 0.3)',
                                }}
                              >
                                {isGenerating ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Writing your letter…
                                  </>
                                ) : generatedLetter ? (
                                  <>
                                    <RefreshCw className="w-4 h-4" />
                                    Regenerate
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="w-4 h-4" />
                                    Generate Cover Letter
                                  </>
                                )}
                              </motion.button>

                              {/* AI error */}
                              <AnimatePresence>
                                {aiError && (
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs text-destructive text-center"
                                  >
                                    {aiError}
                                  </motion.p>
                                )}
                              </AnimatePresence>

                              {/* Generating pulse */}
                              <AnimatePresence>
                                {isGenerating && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                    style={{
                                      background: 'oklch(50% 0.25 285 / 0.06)',
                                      border: '1px solid oklch(50% 0.25 285 / 0.15)',
                                    }}
                                  >
                                    <div className="flex gap-1">
                                      {[0, 1, 2].map((i) => (
                                        <motion.div
                                          key={i}
                                          className="w-1.5 h-1.5 rounded-full"
                                          style={{ background: 'oklch(60% 0.25 285)' }}
                                          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                                          transition={{
                                            duration: 0.7,
                                            delay: i * 0.18,
                                            repeat: Infinity,
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <p className="text-xs" style={{ color: 'oklch(65% 0.15 285)' }}>
                                      Crafting a{' '}
                                      <span className="font-semibold">{tone}</span> letter for{' '}
                                      <span className="font-semibold">{jobTitle}</span>…
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Generated result */}
                              <AnimatePresence>
                                {generatedLetter && !isGenerating && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="rounded-xl overflow-hidden"
                                    style={{ border: '1px solid oklch(50% 0.25 285 / 0.2)' }}
                                  >
                                    {/* Result header */}
                                    <div
                                      className="flex items-center justify-between px-3 py-2"
                                      style={{
                                        background: 'oklch(50% 0.25 285 / 0.1)',
                                        borderBottom: '1px solid oklch(50% 0.25 285 / 0.15)',
                                      }}
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-xs font-semibold text-foreground">
                                          Letter generated
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={copyLetter}
                                        className="flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer"
                                        style={{ color: copied ? 'oklch(65% 0.25 145)' : 'oklch(60% 0.15 285)' }}
                                      >
                                        <Copy className="w-3 h-3" />
                                        {copied ? 'Copied!' : 'Copy'}
                                      </button>
                                    </div>

                                    {/* Preview (truncated) */}
                                    <div
                                      className="px-3 py-2.5 max-h-36 overflow-y-auto"
                                      style={{ background: 'oklch(16% 0.025 285)' }}
                                    >
                                      <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'oklch(80% 0.05 285)' }}>
                                        {generatedLetter}
                                      </p>
                                    </div>

                                    {/* Use button */}
                                    <div
                                      className="px-3 py-2.5 flex items-center justify-between"
                                      style={{ background: 'oklch(14% 0.02 285)' }}
                                    >
                                      <span className="text-[10px] text-muted-foreground">
                                        {generatedLetter.length} chars · {tone} tone
                                      </span>
                                      <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={useLetter}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                        style={{
                                          background: usedLetter
                                            ? 'oklch(65% 0.25 145 / 0.15)'
                                            : 'oklch(52% 0.26 285)',
                                          color: usedLetter ? 'oklch(65% 0.25 145)' : 'white',
                                          boxShadow: usedLetter
                                            ? 'none'
                                            : '0 2px 8px oklch(50% 0.25 285 / 0.3)',
                                        }}
                                      >
                                        {usedLetter ? (
                                          <>
                                            <CheckCircle className="w-3 h-3" />
                                            Applied to form
                                          </>
                                        ) : (
                                          <>
                                            <Send className="w-3 h-3" />
                                            Use this letter
                                          </>
                                        )}
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Cover letter textarea */}
                    <div className="relative">
                      <textarea
                        {...register('coverLetter')}
                        ref={(e) => {
                          // Merge refs: react-hook-form ref + our local ref
                          (register('coverLetter') as any).ref(e);
                          (textareaRef as any).current = e;
                        }}
                        rows={6}
                        placeholder="Tell the employer why you're the perfect fit for this role…"
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm resize-none"
                      />
                      {/* AI-generated badge */}
                      <AnimatePresence>
                        {usedLetter && coverLetter && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold"
                            style={{
                              background: 'oklch(50% 0.25 285 / 0.12)',
                              color: 'oklch(68% 0.2 285)',
                              border: '1px solid oklch(50% 0.25 285 / 0.25)',
                            }}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Generated
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                      {errors.coverLetter ? (
                        <p className="text-xs text-destructive">{errors.coverLetter.message}</p>
                      ) : (
                        <span />
                      )}
                      <p className="text-xs text-muted-foreground">
                        {coverLetter.length} chars
                      </p>
                    </div>
                  </div>

                  {/* ── Resume URL ── */}
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

                  {/* ── Submit ── */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}