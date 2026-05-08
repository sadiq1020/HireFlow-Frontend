'use client';

import { motion, useInView } from 'framer-motion';
import { Briefcase, Building2, TrendingUp, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const stats = [
  {
    icon: Briefcase,
    value: 12500,
    suffix: '+',
    label: 'Active Jobs',
    description: 'New positions added daily',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Users,
    value: 85000,
    suffix: '+',
    label: 'Job Seekers',
    description: 'Professionals trust HireFlow',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    icon: Building2,
    value: 3200,
    suffix: '+',
    label: 'Companies',
    description: 'Hiring on our platform',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    icon: TrendingUp,
    value: 94,
    suffix: '%',
    label: 'Success Rate',
    description: 'Candidates get hired within 30 days',
    color: 'from-violet-600 to-fuchsia-600',
  },
];

function CountUp({ target, suffix, isInView }: { target: number; suffix: string; isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">By the numbers</span>
          <h2 className="text-4xl font-bold text-foreground mt-2">
            Trusted by thousands worldwide
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative bg-card border border-border rounded-2xl p-8 overflow-hidden cursor-default"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Glowing border on hover */}
                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-all duration-300" />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Number */}
                <div className="text-4xl font-bold text-foreground mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} isInView={isInView} />
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{stat.description}</p>

                {/* Decorative corner element */}
                <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}