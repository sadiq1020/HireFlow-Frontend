'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Frontend Developer',
    company: 'Hired at TechCorp',
    avatar: 'SC',
    content: 'HireFlow\'s AI cover letter generator saved me hours of writing. I got 3 interviews in my first week and landed my dream job within a month. The AI recommendations were incredibly accurate.',
    rating: 5,
    color: 'from-violet-500 to-purple-600',
    bg: 'from-violet-500/10 to-purple-600/5',
    border: 'border-violet-500/20',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Hired at StartupXYZ',
    avatar: 'MJ',
    content: 'The AI chatbot helped me prep for every interview with tailored questions. I went from feeling unprepared to confident. HireFlow is truly the future of job searching.',
    rating: 5,
    color: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-500/10 to-indigo-600/5',
    border: 'border-blue-500/20',
  },
  {
    name: 'Aisha Patel',
    role: 'Data Scientist',
    company: 'Hired at DataFlow Inc',
    avatar: 'AP',
    content: 'I was skeptical about AI tools at first, but HireFlow completely changed my mind. The job recommendations were spot-on for my niche skills. Found my perfect role in just 3 weeks.',
    rating: 5,
    color: 'from-emerald-500 to-teal-600',
    bg: 'from-emerald-500/10 to-teal-600/5',
    border: 'border-emerald-500/20',
  },
  {
    name: 'David Kim',
    role: 'UX Designer',
    company: 'Hired at DesignStudio',
    avatar: 'DK',
    content: 'As someone switching careers, HireFlow\'s AI guided me perfectly. The cover letter assistant highlighted my transferable skills brilliantly. Best job platform I\'ve ever used.',
    rating: 5,
    color: 'from-fuchsia-500 to-pink-600',
    bg: 'from-fuchsia-500/10 to-pink-600/5',
    border: 'border-fuchsia-500/20',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Backend Engineer',
    company: 'Hired at CloudSystems',
    avatar: 'ER',
    content: 'The platform\'s clean interface and powerful AI features made my job search feel effortless. Got 5 offers within 6 weeks. Couldn\'t recommend HireFlow more highly.',
    rating: 5,
    color: 'from-orange-500 to-amber-600',
    bg: 'from-orange-500/10 to-amber-600/5',
    border: 'border-orange-500/20',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const t = testimonials[current];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-orange-400" />
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Success Stories</span>
            <div className="h-px w-8 bg-orange-400" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            People Love{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              HireFlow
            </span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Join thousands of professionals who found their dream jobs
          </p>
        </motion.div>

        {/* Main testimonial card */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -80 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className={`relative bg-gradient-to-br ${t.bg} border ${t.border} rounded-3xl p-10 md:p-14 overflow-hidden`}
            >
              {/* Decorative quote */}
              <div className="absolute top-8 right-8 opacity-5">
                <Quote className="w-24 h-24 text-foreground" />
              </div>

              {/* Animated background orb */}
              <motion.div
                className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${t.color} opacity-10 blur-2xl`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-amber-400 text-lg"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium mb-8 max-w-3xl">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-white font-bold text-lg">{t.avatar}</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                    <div className={`text-xs font-semibold mt-0.5 bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>
                      {t.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-card border border-border hover:border-primary/40 flex items-center justify-center transition-all hover:shadow-lg hover:-translate-x-6 hover:bg-primary/5"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-card border border-border hover:border-primary/40 flex items-center justify-center transition-all hover:shadow-lg hover:translate-x-6 hover:bg-primary/5"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-2 bg-primary'
                  : 'w-2 h-2 bg-border hover:bg-primary/40'
              }`}
            />
          ))}
        </div>

        {/* Mini cards below */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-12">
          {testimonials.map((test, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-xl border transition-all duration-300 text-left ${
                i === current
                  ? `bg-gradient-to-br ${test.bg} ${test.border} shadow-lg`
                  : 'bg-card border-border hover:border-primary/20'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${test.color} flex items-center justify-center mb-2`}>
                <span className="text-white text-xs font-bold">{test.avatar}</span>
              </div>
              <div className="text-xs font-semibold text-foreground truncate">{test.name.split(' ')[0]}</div>
              <div className="text-xs text-muted-foreground truncate">{test.role.split(' ')[0]}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}