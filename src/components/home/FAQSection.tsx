'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { motion, useInView, type Variants } from 'framer-motion';
import { HelpCircle, MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

const FAQ_CATEGORIES = [
  {
    label: 'General',
    faqs: [
      {
        q: 'How does HireFlow\'s AI job matching work?',
        a: 'Our AI analyzes your profile, skills, experience, and preferences to find the most relevant job opportunities. It continuously learns from your interactions to improve recommendations over time.',
      },
      {
        q: 'Is HireFlow free for job seekers?',
        a: 'Yes! Job seekers can create a profile, browse jobs, apply to positions, and use our basic AI features completely free. We believe everyone deserves access to great career opportunities.',
      },
      {
        q: 'What types of jobs are available?',
        a: 'HireFlow features opportunities across all major industries including Engineering, Design, Marketing, Finance, Healthcare, Education, Sales, and more. We support full-time, part-time, remote, contract, and internship positions.',
      },
      {
        q: 'Can I apply with Google OAuth?',
        a: 'Absolutely! HireFlow supports Google OAuth for a seamless sign-in experience. Your Google profile information can be used to auto-fill parts of your profile.',
      },
    ],
  },
  {
    label: 'Companies',
    faqs: [
      {
        q: 'How do I register my company on HireFlow?',
        a: 'Create an account, select "Company" during registration, and fill in your company details. Your profile will be reviewed by our admin team — approval typically takes 24-48 hours.',
      },
      {
        q: 'How does the AI job description generator work?',
        a: 'When creating a job listing, our AI analyzes your requirements and generates a compelling, inclusive job description that attracts the right candidates and reduces unconscious bias.',
      },
      {
        q: 'How long does company approval take?',
        a: 'Most applications are reviewed within 24 to 48 hours. You can check your approval status at any time from your company dashboard.',
      },
    ],
  },
  {
    label: 'AI Features',
    faqs: [
      {
        q: 'How does the AI cover letter generator work?',
        a: 'When you apply for a job, our AI analyzes the job description and your profile to generate a personalized cover letter that highlights your most relevant skills. You can edit it before submitting.',
      },
      {
        q: 'What can the AI chatbot help me with?',
        a: 'The career chatbot can answer job search questions, help you prep for interviews, suggest skills to develop, and provide guidance on salary negotiation — available 24/7.',
      },
      {
        q: 'Are the AI recommendations accurate?',
        a: 'Our AI recommendations improve over time as it learns from your behavior. Most users report highly relevant matches within the first few days of using the platform.',
      },
    ],
  },
  {
    label: 'Applications',
    faqs: [
      {
        q: 'How do I track my applications?',
        a: 'Your seeker dashboard has a dedicated Applications page where you can see the status of every job you\'ve applied to — Pending, Reviewed, Shortlisted, Rejected, or Hired.',
      },
      {
        q: 'How long does it take to get hired?',
        a: 'Our data shows 94% of active seekers receive interview invitations within 2 weeks. The average time to hire is 30 days. Using AI features significantly improves your chances.',
      },
      {
        q: 'Can I save jobs to apply later?',
        a: 'Yes — you can bookmark any job listing and access your saved jobs from your dashboard. Saved jobs are kept until the listing expires or is removed by the company.',
      },
    ],
  },
];

const ALL_FAQS = FAQ_CATEGORIES.flatMap((c) => c.faqs);

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const categoryColors: Record<string, string> = {
  All: 'bg-primary text-primary-foreground shadow-lg shadow-primary/25',
  General: 'bg-violet-500 text-white shadow-lg shadow-violet-500/25',
  Companies: 'bg-blue-500 text-white shadow-lg shadow-blue-500/25',
  'AI Features': 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25',
  Applications: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25',
};

const inactiveClass = 'bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground';

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
        active ? categoryColors[label] || categoryColors['All'] : inactiveClass
      }`}
    >
      {label}
    </motion.button>
  );
}

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const categories = ['All', ...FAQ_CATEGORIES.map((c) => c.label)];

  const visibleFaqs =
    activeCategory === 'All'
      ? ALL_FAQS
      : FAQ_CATEGORIES.find((c) => c.label === activeCategory)?.faqs ?? [];

  return (
    <section
      ref={ref}
      className="py-24 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-5">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Got Questions?</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Everything you need to know about HireFlow. Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" className="text-primary hover:underline font-semibold">
              Contact our team
            </Link>
          </p>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </motion.div>

        {/* FAQ Grid wrapped in a single Accordion root */}
        <Accordion>
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-3"
          >
            {visibleFaqs.map((faq, i) => (
              <motion.div
                key={`${activeCategory}-${i}`}
                variants={itemVariants}
                className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/20 transition-colors duration-200"
              >
                <AccordionItem value={`faq-${activeCategory}-${i}`} className="border-none px-5">
                  <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline hover:text-primary py-5 gap-3 transition-colors duration-200 [&>svg]:hidden">
                    <span className="flex items-start gap-3 text-left">
                      <Plus className="w-4 h-4 shrink-0 mt-0.5 text-primary transition-transform duration-200 [[data-state=open]_&]:rotate-45" />
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5 pl-7">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </motion.div>
        </Accordion>

        {/* Bottom contact banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.55, ease: EASE }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Still have questions?</p>
              <p className="text-xs text-muted-foreground">Our support team usually responds within 24 hours.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </section>
  );
}