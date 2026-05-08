'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle,
    ChevronDown,
    ChevronUp,
    ClipboardCopy,
    Lightbulb,
    Loader2,
    RefreshCw,
    Sparkles,
    Wand2,
} from 'lucide-react';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GeneratedContent {
  description: string;
  requirements: string;
}

interface AIJobDescriptionPanelProps {
  // Current form values the panel reads from
  jobTitle: string;
  jobType: string;
  jobLocation?: string;
  categoryName?: string;
  // Callbacks to inject into the form
  onApply: (description: string, requirements: string) => void;
}

// ─── Seniority options ────────────────────────────────────────────────────────
const SENIORITY_LEVELS = [
  { id: 'junior',    label: 'Junior',    emoji: '🌱' },
  { id: 'mid',       label: 'Mid-Level', emoji: '⚡' },
  { id: 'senior',    label: 'Senior',    emoji: '🏆' },
  { id: 'lead',      label: 'Lead',      emoji: '🎯' },
] as const;

type Seniority = (typeof SENIORITY_LEVELS)[number]['id'];

// ─── Writing style options ─────────────────────────────────────────────────────
const STYLES = [
  { id: 'corporate',   label: 'Corporate',   emoji: '🏢' },
  { id: 'startup',     label: 'Startup',     emoji: '🚀' },
  { id: 'friendly',    label: 'Friendly',    emoji: '😊' },
  { id: 'technical',   label: 'Technical',   emoji: '⚙️' },
] as const;

type Style = (typeof STYLES)[number]['id'];

// ─── Sub-components ───────────────────────────────────────────────────────────
function OptionButton({
  active,
  onClick,
  emoji,
  label,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
      style={{
        background: active ? 'oklch(50% 0.25 285 / 0.2)' : 'oklch(18% 0.03 285)',
        border: active
          ? '1px solid oklch(55% 0.25 285 / 0.5)'
          : '1px solid oklch(28% 0.04 285)',
        color: active ? 'oklch(80% 0.15 285)' : 'oklch(55% 0.05 285)',
      }}
    >
      <span className="text-base">{emoji}</span>
      <span>{label}</span>
    </motion.button>
  );
}

function PreviewSection({
  label,
  content,
  fieldKey,
  onCopy,
  copied,
}: {
  label: string;
  content: string;
  fieldKey: 'description' | 'requirements';
  onCopy: (key: 'description' | 'requirements') => void;
  copied: string | null;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid oklch(50% 0.25 285 / 0.18)' }}
    >
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{
          background: 'oklch(50% 0.25 285 / 0.08)',
          borderBottom: '1px solid oklch(50% 0.25 285 / 0.12)',
        }}
      >
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <button
          type="button"
          onClick={() => onCopy(fieldKey)}
          className="flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer"
          style={{
            color:
              copied === fieldKey
                ? 'oklch(65% 0.25 145)'
                : 'oklch(60% 0.15 285)',
          }}
        >
          <ClipboardCopy className="w-3 h-3" />
          {copied === fieldKey ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div
        className="px-3 py-2.5 max-h-40 overflow-y-auto"
        style={{ background: 'oklch(16% 0.025 285)' }}
      >
        <p
          className="text-xs leading-relaxed whitespace-pre-wrap"
          style={{ color: 'oklch(80% 0.05 285)' }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function AIJobDescriptionPanel({
  jobTitle,
  jobType,
  jobLocation,
  categoryName,
  onApply,
}: AIJobDescriptionPanelProps) {
  const [isOpen, setIsOpen]                       = useState(false);
  const [seniority, setSeniority]                 = useState<Seniority>('mid');
  const [style, setStyle]                         = useState<Style>('corporate');
  const [extraContext, setExtraContext]            = useState('');
  const [isGenerating, setIsGenerating]           = useState(false);
  const [generated, setGenerated]                 = useState<GeneratedContent | null>(null);
  const [error, setError]                         = useState('');
  const [copied, setCopied]                       = useState<string | null>(null);
  const [applied, setApplied]                     = useState(false);

  const canGenerate = !!jobTitle.trim();

  const generate = async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setError('');
    setGenerated(null);
    setApplied(false);

    try {
      const res = await fetch('/api/ai/generate-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          jobType,
          jobLocation,
          categoryName,
          seniority,
          style,
          extraContext: extraContext.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();

      if (data.description && data.requirements) {
        setGenerated({ description: data.description, requirements: data.requirements });
      } else {
        throw new Error('Incomplete response');
      }
    } catch {
      setError('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!generated) return;
    onApply(generated.description, generated.requirements);
    setApplied(true);
    setIsOpen(false);
  };

  const handleCopy = async (key: 'description' | 'requirements') => {
    if (!generated) return;
    await navigator.clipboard.writeText(generated[key]);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      {/* ── Toggle button ── */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        style={{
          background: isOpen
            ? 'oklch(50% 0.25 285 / 0.15)'
            : 'oklch(50% 0.25 285 / 0.08)',
          color: 'oklch(65% 0.2 285)',
          border: '1px solid oklch(50% 0.25 285 / 0.25)',
        }}
      >
        {applied ? (
          <>
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span style={{ color: 'oklch(65% 0.25 145)' }}>Applied to form</span>
          </>
        ) : (
          <>
            <Wand2 className="w-3 h-3" />
            AI Generate
            {isOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </>
        )}
      </motion.button>

      {/* ── Sliding panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="mt-4 rounded-2xl overflow-hidden"
              style={{
                background: 'oklch(13% 0.022 285 / 0.7)',
                border: '1px solid oklch(50% 0.25 285 / 0.2)',
              }}
            >
              {/* Panel header */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: '1px solid oklch(50% 0.25 285 / 0.15)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'oklch(50% 0.25 285 / 0.15)',
                      border: '1px solid oklch(50% 0.25 285 / 0.3)',
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground leading-none">
                      AI Job Description Generator
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                        style={{
                          background: 'oklch(50% 0.25 285 / 0.15)',
                          color: 'oklch(70% 0.2 285)',
                          border: '1px solid oklch(50% 0.25 285 / 0.2)',
                        }}
                      >
                        Powered by Claude
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* No title warning */}
                <AnimatePresence>
                  {!canGenerate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                      style={{
                        background: 'oklch(55% 0.2 50 / 0.1)',
                        border: '1px solid oklch(55% 0.2 50 / 0.25)',
                      }}
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <p className="text-xs text-amber-400/80">
                        Enter a <span className="font-semibold">Job Title</span> above first — the AI will use it to write a targeted description.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Context display */}
                {canGenerate && (
                  <div
                    className="flex flex-wrap gap-2 px-3 py-2.5 rounded-lg"
                    style={{
                      background: 'oklch(50% 0.25 285 / 0.06)',
                      border: '1px solid oklch(50% 0.25 285 / 0.12)',
                    }}
                  >
                    <span className="text-[10px] text-muted-foreground">Generating for:</span>
                    <span className="text-[10px] font-semibold text-foreground">{jobTitle}</span>
                    {jobType && (
                      <span
                        className="text-[10px] font-semibold px-1.5 rounded-full"
                        style={{
                          background: 'oklch(50% 0.25 285 / 0.15)',
                          color: 'oklch(70% 0.2 285)',
                        }}
                      >
                        {jobType.replace('_', ' ')}
                      </span>
                    )}
                    {jobLocation && (
                      <span className="text-[10px] text-muted-foreground">· {jobLocation}</span>
                    )}
                    {categoryName && (
                      <span className="text-[10px] text-muted-foreground">· {categoryName}</span>
                    )}
                  </div>
                )}

                {/* Seniority */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wide">
                    Seniority Level
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {SENIORITY_LEVELS.map((s) => (
                      <OptionButton
                        key={s.id}
                        active={seniority === s.id}
                        onClick={() => setSeniority(s.id)}
                        emoji={s.emoji}
                        label={s.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Writing style */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wide">
                    Company Tone
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {STYLES.map((s) => (
                      <OptionButton
                        key={s.id}
                        active={style === s.id}
                        onClick={() => setStyle(s.id)}
                        emoji={s.emoji}
                        label={s.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Extra context */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Additional Context{' '}
                    <span className="normal-case font-normal">(optional)</span>
                  </p>
                  <textarea
                    value={extraContext}
                    onChange={(e) => setExtraContext(e.target.value)}
                    rows={2}
                    placeholder="e.g. Must have 5+ yrs React, we use a microservices stack, team of 8 engineers, series B startup…"
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
                  whileHover={{ scale: canGenerate ? 1.02 : 1 }}
                  whileTap={{ scale: canGenerate ? 0.97 : 1 }}
                  onClick={generate}
                  disabled={isGenerating || !canGenerate}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(52% 0.26 285), oklch(58% 0.22 305))',
                    color: 'white',
                    boxShadow: canGenerate
                      ? '0 2px 16px oklch(50% 0.25 285 / 0.3)'
                      : 'none',
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Writing your job description…
                    </>
                  ) : generated ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate Description & Requirements
                    </>
                  )}
                </motion.button>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-destructive text-center"
                    >
                      {error}
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
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
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
                            transition={{ duration: 0.7, delay: i * 0.18, repeat: Infinity }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: 'oklch(65% 0.15 285)' }}>
                        Writing a{' '}
                        <span className="font-semibold">{seniority}</span>{' '}
                        <span className="font-semibold">{style}</span> JD for{' '}
                        <span className="font-semibold">{jobTitle}</span>…
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generated preview */}
                <AnimatePresence>
                  {generated && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {/* Section label */}
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-semibold text-foreground">
                          Content generated — preview below
                        </span>
                      </div>

                      <PreviewSection
                        label="Job Description"
                        content={generated.description}
                        fieldKey="description"
                        onCopy={handleCopy}
                        copied={copied}
                      />

                      <PreviewSection
                        label="Requirements"
                        content={generated.requirements}
                        fieldKey="requirements"
                        onCopy={handleCopy}
                        copied={copied}
                      />

                      {/* Apply to form button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleApply}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, oklch(52% 0.26 285), oklch(58% 0.22 305))',
                          color: 'white',
                          boxShadow: '0 2px 16px oklch(50% 0.25 285 / 0.3)',
                        }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Apply to Form
                      </motion.button>

                      <p className="text-[10px] text-center text-muted-foreground">
                        This will fill the Description and Requirements fields below. You can edit them freely after.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}