'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building2, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const stats = [
  { value: '12k+', label: 'Active Jobs', icon: Briefcase },
  { value: '85k+', label: 'Job Seekers', icon: Users },
  { value: '3.2k+', label: 'Companies', icon: Building2 },
];

export default function CTASection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/3 to-blue-500/5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124,58,237,0.8) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700" />

          {/* Animated orbs inside */}
          <motion.div
            className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Particle dots */}
          {mounted && Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 3,
                repeat: Infinity,
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest">
                Start for Free Today
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Ready to Find Your
              <br />
              <span className="text-yellow-300">Dream Job?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-base max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Join thousands of professionals who found their perfect role using HireFlow&apos;s
              AI-powered platform. Your next chapter starts here.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link
                href="/register"
                className="group flex items-center gap-2 px-10 py-4 bg-white text-violet-700 font-bold rounded-xl transition-all hover:shadow-2xl hover:-translate-y-1 text-sm"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/jobs"
                className="flex items-center gap-2 px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 hover:border-white/40 transition-all hover:-translate-y-1 text-sm"
              >
                Browse Jobs
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10 border-t border-white/10"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-black text-white">{stat.value}</div>
                      <div className="text-xs text-white/50 font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom split CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border border-emerald-500/20 rounded-2xl p-8 overflow-hidden group hover:border-emerald-500/40 transition-all"
          >
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-5 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">For Job Seekers</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Create your free profile, get AI-powered job matches, and apply to thousands of opportunities in minutes.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm hover:gap-3 transition-all"
              >
                Find your next role
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-orange-500/10 to-amber-600/5 border border-orange-500/20 rounded-2xl p-8 overflow-hidden group hover:border-orange-500/40 transition-all"
          >
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-5 shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">For Companies</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Post jobs, manage applications, and use AI tools to find and hire the best talent faster than ever before.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-orange-400 font-semibold text-sm hover:gap-3 transition-all"
              >
                Start hiring today
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}