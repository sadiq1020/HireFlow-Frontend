'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Play, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const rotatingWords = ['Dream Job', 'Next Career', 'Perfect Role', 'Future Today'];

const wordColors = [
  'from-violet-400 via-purple-400 to-fuchsia-400',
  'from-blue-400 via-cyan-400 to-indigo-400',
  'from-emerald-400 via-teal-400 to-cyan-400',
  'from-orange-400 via-amber-400 to-yellow-400',
];

const longestWord = rotatingWords.reduce((a, b) => (a.length > b.length ? a : b));

const floatingOrbs = [
  { size: 350, x: '5%', y: '15%', color: 'rgba(124, 58, 237, 0.1)', delay: 0 },
  { size: 250, x: '75%', y: '5%', color: 'rgba(139, 92, 246, 0.06)', delay: 1 },
  { size: 450, x: '55%', y: '55%', color: 'rgba(109, 40, 217, 0.04)', delay: 2 },
  { size: 180, x: '25%', y: '75%', color: 'rgba(167, 139, 250, 0.08)', delay: 0.5 },
];

// Particle data will be generated on the client to avoid hydration mismatch
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    setMounted(true);

    // Generate particles only on the client
    const data = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(data);

    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-16 pb-24"
    >
      {/* Background Elements - Only render on client to avoid hydration mismatch */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-primary/20"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [-30, 30, -30],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* Floating orbs with reduced blur for crispness */}
          {floatingOrbs.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-[80px]"
              style={{
                width: orb.size,
                height: orb.size,
                left: orb.x,
                top: orb.y,
                background: orb.color,
              }}
              animate={{
                x: [-30, 30, -30],
                y: [-20, 20, -20],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                delay: orb.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Subtle Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      )}

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Compact Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
        >
          <Sparkles className="w-3 h-3" />
          The Future of Hiring
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse ml-0.5" />
        </motion.div>

        {/* Scaled Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.15] mb-6 tracking-tight"
        >
          Find Your{' '}
          <span className="relative inline-block text-left min-h-[1.2em]">
            <span className="invisible opacity-0 pointer-events-none select-none whitespace-nowrap">
              {longestWord}
            </span>
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
  <motion.span
    key={wordIndex}
    initial={{ opacity: 0, y: 20, rotateX: -70 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    exit={{ opacity: 0, y: -20, rotateX: 70 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className={`inline-block whitespace-nowrap bg-gradient-to-r ${wordColors[wordIndex]} bg-clip-text text-transparent pb-1`}
    style={{ perspective: 1000 }}
  >
    {rotatingWords[wordIndex]}
    <motion.span
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`absolute -bottom-0.5 left-0 right-0 h-1 bg-gradient-to-r ${wordColors[wordIndex]} rounded-full`}
    />
  </motion.span>
</AnimatePresence>
            </div>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Connecting elite talent with innovative global leaders. 
          Experience a smarter, faster search with HireFlow.
        </motion.p>

        {/* Refined Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto mb-8 p-1 bg-card/40 backdrop-blur-xl border border-border rounded-2xl shadow-xl ring-1 ring-white/5"
        >
          <div className="flex-[1.2] flex items-center gap-3 px-5 py-3">
            <Search className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="Job title or keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm font-medium"
            />
          </div>
          <div className="hidden md:block w-px bg-border/50 my-3" />
          <div className="flex-1 flex items-center gap-3 px-5 py-3">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder="Anywhere"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm font-medium"
            />
          </div>
          <Link
            href={`/jobs?search=${searchQuery}&location=${location}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:brightness-110 active:scale-[0.98] text-sm"
          >
            Search
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Minimalist Trending */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em]">Trending:</span>
          {['Engineering', 'Design', 'Marketing', 'Product'].map((term) => (
            <Link
              key={term}
              href={`/jobs?search=${term}`}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              #{term}
            </Link>
          ))}
        </motion.div>

        {/* Sized CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="group px-8 py-3.5 bg-foreground text-background font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg text-sm"
          >
            <span className="flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="/jobs"
            className="px-8 py-3.5 bg-transparent text-foreground font-bold rounded-xl border border-border transition-all hover:bg-foreground/5 hover:-translate-y-0.5 text-sm"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Explore</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-primary/40 to-transparent" />
      </motion.div>
    </section>
  );
}