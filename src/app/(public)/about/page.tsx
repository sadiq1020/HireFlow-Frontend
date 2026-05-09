'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useSession } from '@/lib/auth-client';
import {
    ArrowRight,
    Award,
    Bot,
    Briefcase,
    Building2,
    Heart,
    Lightbulb,
    Rocket,
    Shield,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: '12,500+', label: 'Active Jobs', icon: Briefcase,  color: 'from-violet-500 to-purple-600',  glow: 'shadow-violet-500/20' },
  { value: '85,000+', label: 'Job Seekers', icon: Users,      color: 'from-blue-500 to-indigo-600',    glow: 'shadow-blue-500/20' },
  { value: '3,200+',  label: 'Companies',   icon: Building2,  color: 'from-emerald-500 to-teal-600',   glow: 'shadow-emerald-500/20' },
  { value: '94%',     label: 'Success Rate',icon: TrendingUp, color: 'from-orange-500 to-amber-600',   glow: 'shadow-orange-500/20' },
];

const values = [
  {
    icon: Heart,
    title: 'People First',
    desc: 'Every feature we build starts with a simple question: does this genuinely help someone find a better career? People, not metrics, drive every decision we make.',
    color: 'from-rose-500/15 to-pink-600/8',
    border: 'border-rose-500/20 hover:border-rose-400/40',
    accent: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
  },
  {
    icon: Bot,
    title: 'AI for Good',
    desc: 'We believe AI should amplify human potential, not replace it. Our AI features are tools that empower — cover letter help, smart job matching, career guidance.',
    color: 'from-violet-500/15 to-purple-600/8',
    border: 'border-violet-500/20 hover:border-violet-400/40',
    accent: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    desc: 'We vet every company on our platform. No ghost listings, no misleading job descriptions. Real opportunities from real companies who are genuinely hiring.',
    color: 'from-emerald-500/15 to-teal-600/8',
    border: 'border-emerald-500/20 hover:border-emerald-400/40',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    icon: Lightbulb,
    title: 'Continuous Innovation',
    desc: 'The job market evolves fast. We evolve faster. Our team ships new features weekly based on real user feedback to stay ahead of what professionals actually need.',
    color: 'from-orange-500/15 to-amber-600/8',
    border: 'border-orange-500/20 hover:border-orange-400/40',
    accent: 'text-orange-400',
    iconBg: 'bg-orange-500/10',
  },
];

const team = [
  {
    name: 'Aria Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former Google recruiter who placed 2,000+ engineers. Frustrated by broken hiring processes, she built the platform she wished existed.',
    emoji: '👩‍💼',
    color: 'from-violet-500/20 to-purple-600/10',
    border: 'border-violet-500/25',
    accent: 'text-violet-400',
  },
  {
    name: 'Marcus Rivera',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Meta AI engineer who led recommendation systems serving 3B users. Now he points that same intelligence at helping people find careers they love.',
    emoji: '👨‍💻',
    color: 'from-blue-500/20 to-indigo-600/10',
    border: 'border-blue-500/25',
    accent: 'text-blue-400',
  },
  {
    name: 'Priya Mehta',
    role: 'Head of Product',
    bio: 'Product lead at LinkedIn for 6 years, obsessed with the intersection of UX and career psychology. She\'s the reason HireFlow actually feels good to use.',
    emoji: '👩‍🎨',
    color: 'from-emerald-500/20 to-teal-600/10',
    border: 'border-emerald-500/25',
    accent: 'text-emerald-400',
  },
  {
    name: 'David Park',
    role: 'Head of Growth',
    bio: 'Previously scaled three SaaS companies from zero to Series B. Believes the best growth strategy is a product people genuinely love and tell others about.',
    emoji: '👨‍📈',
    color: 'from-orange-500/20 to-amber-600/10',
    border: 'border-orange-500/25',
    accent: 'text-orange-400',
  },
];

const timeline = [
  { year: '2022', title: 'The Idea', desc: 'Aria spent 8 years watching talented people get rejected due to broken, biased hiring systems. She started sketching a better way.', color: 'text-violet-400', dot: 'bg-violet-400' },
  { year: '2023', title: 'Building in Stealth', desc: 'Marcus joined, and the two of them built the first version in 4 months. 200 beta testers helped shape everything from the ground up.', color: 'text-blue-400', dot: 'bg-blue-400' },
  { year: 'Q1 2024', title: 'Public Launch', desc: 'HireFlow launched publicly with 50 companies and 1,200 job seekers. Within 90 days, the first 100 successful hires happened through the platform.', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { year: 'Q3 2024', title: 'AI Features Ship', desc: 'We introduced AI Job Recommendations, the Cover Letter Assistant, and the AI Chatbot — making HireFlow the first AI-native job platform.', color: 'text-fuchsia-400', dot: 'bg-fuchsia-400' },
  { year: '2025', title: 'Scale & Impact', desc: '85,000 job seekers. 3,200 companies. 12,500 active jobs. And we\'re just getting started on making career fulfillment accessible to everyone.', color: 'text-orange-400', dot: 'bg-orange-400' },
];

const aiFeatures = [
  { icon: Sparkles, label: 'AI Job Recommendations', desc: 'Personalized job matches based on your application history and preferences' },
  { icon: Bot, label: 'AI Chatbot',             desc: 'Context-aware career assistant available 24/7 to guide your job search' },
  { icon: Zap, label: 'Cover Letter Assistant', desc: 'Generate tailored, compelling cover letters in seconds with 4 tone options' },
  { icon: Target, label: 'JD Generator',        desc: 'Help companies write accurate, inclusive job descriptions that attract top talent' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const { data: session } = useSession();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: heroRef as any, 
    offset: ['start start', 'end start'] 
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div style={{ y }}>
            <motion.div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl"
              animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity }} />
            <motion.div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-3xl"
              animate={{ x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, delay: 2 }} />
          </motion.div>
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,58,237,0.8) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
                <Rocket className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Our Story</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-none mb-6">
                We're on a{' '}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                  mission
                </span>
                <br />
                to fix hiring.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                The hiring process is broken. Talented people get rejected by automated systems that can't see their potential. Companies miss great candidates because the signal is buried in noise. We built HireFlow to fix both sides of that equation — with AI that actually helps.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 text-sm">
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={session?.user ? ((session.user as any).role === 'COMPANY' ? '/company/dashboard' : '/seeker/dashboard') : "/register"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border text-foreground font-semibold rounded-xl hover:border-primary/30 transition-all text-sm">
                  {session?.user ? 'Go to Dashboard' : 'Join HireFlow'}
                </Link>
              </div>
            </motion.div>

            {/* Right — floating cards */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block">
              <div className="relative h-80">
                {/* Rotating award badge */}
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}
                  className="absolute top-0 right-8 w-48 bg-card border border-violet-500/25 rounded-2xl p-5 shadow-xl">
                  <Award className="w-6 h-6 text-violet-400 mb-2" />
                  <p className="text-sm font-bold text-foreground">#1 AI Job Platform</p>
                  <p className="text-xs text-muted-foreground">ProductHunt 2024</p>
                </motion.div>
                {/* Floating stat card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-24 left-0 w-52 bg-card border border-emerald-500/25 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-semibold">Live right now</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">247</p>
                  <p className="text-xs text-muted-foreground">companies actively hiring</p>
                </motion.div>
                {/* Floating success card */}
                <motion.div
                  animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-0 right-0 w-52 bg-card border border-orange-500/25 rounded-2xl p-5 shadow-xl">
                  <p className="text-3xl mb-1">🎉</p>
                  <p className="text-sm font-bold text-foreground">12,400 hires made</p>
                  <p className="text-xs text-muted-foreground">through HireFlow this year</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} variants={itemVariants}
                  className={`bg-card border border-border rounded-2xl p-6 text-center hover:shadow-xl ${s.glow} transition-all duration-300 group`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Timeline */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-primary" />
                <span className="text-primary text-xs font-bold uppercase tracking-widest">How We Got Here</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-10">
                Built from{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">frustration</span>,<br />
                driven by <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">purpose</span>
              </h2>

              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-violet-400 via-blue-400 to-orange-400" />
                <div className="space-y-8">
                  {timeline.map((t, i) => (
                    <motion.div key={t.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="flex gap-6 pl-10 relative">
                      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full ${t.dot} flex items-center justify-center`}>
                        <div className="w-2 h-2 rounded-full bg-background" />
                      </div>
                      <div>
                        <span className={`text-xs font-bold ${t.color} uppercase tracking-widest`}>{t.year}</span>
                        <p className="text-sm font-bold text-foreground mt-0.5 mb-1">{t.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI features */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-fuchsia-400" />
                <span className="text-fuchsia-400 text-xs font-bold uppercase tracking-widest">AI-Powered Platform</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                The first truly{' '}
                <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">AI-native</span>
                {' '}job platform
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We didn't bolt AI on as an afterthought. It's woven into every core workflow — helping seekers stand out and helping companies find signal in the noise.
              </p>
              <div className="space-y-4">
                {aiFeatures.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div key={f.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{f.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-rose-400" />
              <span className="text-rose-400 text-xs font-bold uppercase tracking-widest">What Drives Us</span>
              <div className="h-px w-8 bg-rose-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Our{' '}
              <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">values</span>
            </h2>
          </motion.div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br ${v.color} border ${v.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden group`}>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12 pointer-events-none"
                    initial={{ x: '-100%' }} whileHover={{ x: '200%' }} transition={{ duration: 0.7 }} />
                  <div className={`w-10 h-10 rounded-xl ${v.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${v.accent}`} />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-3">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">The People</span>
              <div className="h-px w-8 bg-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Meet the{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">team</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Former recruiters, AI engineers, product designers, and growth operators — united by a conviction that hiring can be fundamentally better.</p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member) => (
              <motion.div key={member.name} variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`bg-gradient-to-br ${member.color} border ${member.border} rounded-2xl p-6 text-center relative overflow-hidden group transition-all duration-300 hover:shadow-xl`}>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12 pointer-events-none"
                  initial={{ x: '-100%' }} whileHover={{ x: '200%' }} transition={{ duration: 0.7 }} />
                <div className="text-5xl mb-4 select-none">{member.emoji}</div>
                <h3 className="text-base font-bold text-foreground mb-1">{member.name}</h3>
                <p className={`text-xs font-semibold ${member.accent} mb-4`}>{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700" />
            <motion.div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
              animate={{ x: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity }} />
            <motion.div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"
              animate={{ x: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} />
            <div className="relative z-10 p-12 md:p-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Join the Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to find your next great opportunity?</h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">Join 85,000 professionals already using HireFlow's AI-powered platform to land their dream jobs.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={session?.user ? ((session.user as any).role === 'COMPANY' ? '/company/dashboard' : '/seeker/dashboard') : "/register"}
                  className="px-8 py-3.5 bg-white text-violet-700 font-bold rounded-xl hover:bg-white/90 transition-all hover:shadow-xl text-sm flex items-center gap-2 justify-center">
                  {session?.user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/jobs"
                  className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 transition-all text-sm">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}