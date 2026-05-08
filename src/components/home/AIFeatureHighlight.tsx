'use client';

import { useSession } from '@/lib/auth-client';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Brain, FileText, MessageSquare, Sparkles, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

const features = [
  {
    icon: Brain,
    title: 'AI Job Recommendations',
    description: 'Our AI analyzes your profile, skills, and preferences to surface the most relevant opportunities — before you even search.',
    tag: 'Smart Matching',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    bg: 'from-violet-500/8 to-purple-600/4',
    tagColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
  {
    icon: FileText,
    title: 'Cover Letter Generator',
    description: 'Generate compelling, personalized cover letters in seconds. Our AI tailors every letter to the specific job and company.',
    tag: 'AI Writing',
    color: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/20',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    bg: 'from-blue-500/8 to-indigo-600/4',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    icon: MessageSquare,
    title: 'Career Chatbot',
    description: 'Get instant answers to career questions, interview prep tips, and job search strategies from our intelligent AI assistant.',
    tag: 'Always On',
    color: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    bg: 'from-emerald-500/8 to-teal-600/4',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    icon: Target,
    title: 'Job Description AI',
    description: 'Companies can auto-generate compelling, inclusive job descriptions that attract the right candidates and reduce bias.',
    tag: 'For Companies',
    color: 'from-orange-500 to-amber-600',
    glow: 'shadow-orange-500/20',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    bg: 'from-orange-500/8 to-amber-600/4',
    tagColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
];

export default function AIFeatureHighlight() {
  const { data: session } = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-violet-500/3 via-transparent to-blue-500/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 0.8) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/4 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* AI badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Powered by Gemini AI
            </span>
            <Zap className="w-3 h-3 text-blue-400" />
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            The Future of{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                Job Searching
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
            {' '}is Here
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
            HireFlow integrates cutting-edge AI into every step of your career journey.
            From discovery to application — we&apos;ve got you covered.
          </p>
        </motion.div>

        {/* Features grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className={`relative h-full bg-gradient-to-br ${feature.bg} border ${feature.border} rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl ${feature.glow}`}>
                  {/* Animated corner decoration */}
                  <motion.div
                    className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${feature.color} opacity-5`}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 8 + i, repeat: Infinity }}
                  />

                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.8 }}
                  />

                  <div className="relative z-10">
                    {/* Tag + icon row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${feature.tagColor}`}>
                        {feature.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Learn more */}
                    <div className="flex items-center gap-2 mt-6 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      Try it now
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-blue-600" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-blue-600 opacity-50"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          {/* Floating orbs inside banner */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-white/70" />
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest">AI-First Platform</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Experience AI-powered hiring today
              </h3>
              <p className="text-white/60 text-sm max-w-md">
                Join thousands of professionals who are already using HireFlow&apos;s AI tools to accelerate their careers.
              </p>
            </div>
            <Link
              href={session?.user ? ((session.user as any).role === 'COMPANY' ? '/company/dashboard' : '/seeker/dashboard') : "/register"}
              className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-white text-violet-600 font-bold rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5 text-sm whitespace-nowrap"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}