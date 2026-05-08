'use client';

import { useSession } from '@/lib/auth-client';
import { motion, useInView } from 'framer-motion';
import { Search, Send, Trophy, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

const steps = [
  {
    step: 'Step 1',
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up and build your professional profile in minutes. Showcase your skills and experience.',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30',
    border: 'border-violet-500/30',
    bg: 'from-violet-500/10 to-purple-600/5',
    role: 'Seeker',
  },
  {
    step: 'Step 2',
    icon: Search,
    title: 'Discover Opportunities',
    description: 'Browse thousands of curated job listings. Use AI-powered search to find positions.',
    color: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/30',
    border: 'border-blue-500/30',
    bg: 'from-blue-500/10 to-indigo-600/5',
    role: 'AI Match',
  },
  {
    step: 'Step 3',
    icon: Send,
    title: 'Apply with AI Help',
    description: 'Generate tailored cover letters and resumes with our AI assistant effortlessly.',
    color: 'from-fuchsia-500 to-pink-600',
    glow: 'shadow-fuchsia-500/30',
    border: 'border-fuchsia-500/30',
    bg: 'from-fuchsia-500/10 to-pink-600/5',
    role: 'AI Powered',
  },
  {
    step: 'Step 4',
    icon: Trophy,
    title: 'Land Your Dream Job',
    description: 'Track your applications, receive updates, and celebrate your success in your role.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/30',
    border: 'border-emerald-500/30',
    bg: 'from-emerald-500/10 to-teal-600/5',
    role: 'Success',
  },
];

export default function HowItWorks() {
  const { data: session } = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">The Process</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How{' '}
            <span className="bg-gradient-to-r from-primary via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              HireFlow
            </span>{' '}
            Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Our streamlined, AI-powered workflow gets you hired faster by focusing on what matters.
          </p>
        </motion.div>

        {/* Steps Container */}
        <div ref={ref} className="relative">
          {/* Animated Curved Connecting Line (Desktop Only) */}
          <svg
            className="hidden lg:block absolute top-12 left-0 w-full h-32 pointer-events-none z-0"
            viewBox="0 0 1200 100"
            fill="none"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 150 50 C 300 50, 300 10, 450 10 C 600 10, 600 90, 750 90 C 900 90, 900 50, 1050 50"
              stroke="url(#line-gradient)"
              strokeWidth="2"
              strokeDasharray="8 12"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M 150 50 C 300 50, 300 10, 450 10 C 600 10, 600 90, 750 90 C 900 90, 900 50, 1050 50"
              stroke="url(#line-gradient)"
              strokeWidth="2"
              strokeDasharray="8 12"
              initial={{ pathOffset: 0, opacity: 0 }}
              animate={isInView ? { pathOffset: -1, opacity: 0.6 } : {}}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="33%" stopColor="#3b82f6" />
                <stop offset="66%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Grid of Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="relative group"
                >
                  <div className={`h-full bg-card/40 backdrop-blur-sm border ${step.border} rounded-2xl p-7 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl ${step.glow} group-hover:bg-card/60`}>
                    
                    {/* Header: Icon + Step Number */}
                    <div className="flex items-start justify-between mb-8">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-black text-primary uppercase tracking-[0.15em] mt-1.5 opacity-90">
                        {step.step}
                      </span>
                    </div>

                    {/* Role Badge */}
                    <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${step.bg} border ${step.border} text-[10px] font-bold uppercase tracking-wider mb-4 group-hover:scale-105 transition-transform`}>
                      <span className={`bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                        {step.role}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Subtle Hover Decoration */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.color} w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link
            href={session?.user ? (session.user.role === 'COMPANY' ? '/company/dashboard' : '/seeker/dashboard') : "/register"}
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background font-bold rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
              Start Your Journey
              <Trophy className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}