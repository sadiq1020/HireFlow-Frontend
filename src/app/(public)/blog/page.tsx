'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    Clock,
    Search,
    Sparkles,
    Tag,
    TrendingUp,
} from 'lucide-react';
import { useRef, useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories = [
  { label: 'All',            color: 'violet',  active: true },
  { label: 'AI & Career',    color: 'violet'  },
  { label: 'Career Tips',    color: 'blue'    },
  { label: 'Remote Work',    color: 'emerald' },
  { label: 'Salary & Growth',color: 'orange'  },
  { label: 'Interview Prep', color: 'fuchsia' },
  { label: 'Tech Industry',  color: 'cyan'    },
];

const categoryColors: Record<string, { tag: string; accent: string; border: string; gradient: string; glow: string }> = {
  violet:  { tag: 'bg-violet-500/10 text-violet-400 border-violet-500/20',  accent: 'text-violet-400',  border: 'border-violet-500/20 hover:border-violet-400/50',  gradient: 'from-violet-500/15 to-purple-600/8',   glow: 'hover:shadow-violet-500/10' },
  blue:    { tag: 'bg-blue-500/10 text-blue-400 border-blue-500/20',        accent: 'text-blue-400',    border: 'border-blue-500/20 hover:border-blue-400/50',        gradient: 'from-blue-500/15 to-indigo-600/8',     glow: 'hover:shadow-blue-500/10' },
  emerald: { tag: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', accent: 'text-emerald-400', border: 'border-emerald-500/20 hover:border-emerald-400/50', gradient: 'from-emerald-500/15 to-teal-600/8',    glow: 'hover:shadow-emerald-500/10' },
  orange:  { tag: 'bg-orange-500/10 text-orange-400 border-orange-500/20',  accent: 'text-orange-400',  border: 'border-orange-500/20 hover:border-orange-400/50',    gradient: 'from-orange-500/15 to-amber-600/8',    glow: 'hover:shadow-orange-500/10' },
  fuchsia: { tag: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20', accent: 'text-fuchsia-400', border: 'border-fuchsia-500/20 hover:border-fuchsia-400/50', gradient: 'from-fuchsia-500/15 to-pink-600/8',    glow: 'hover:shadow-fuchsia-500/10' },
  cyan:    { tag: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',        accent: 'text-cyan-400',    border: 'border-cyan-500/20 hover:border-cyan-400/50',        gradient: 'from-cyan-500/15 to-sky-600/8',        glow: 'hover:shadow-cyan-500/10' },
};

const posts = [
  {
    id: 1,
    title: '10 AI Tools That Will Transform Your Job Search in 2025',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way professionals find and land their dream jobs. From resume builders to interview coaches, AI is your new career ally.',
    category: 'AI & Career',
    color: 'violet',
    readTime: '5 min read',
    date: 'May 2, 2025',
    emoji: '🤖',
    featured: true,
    author: 'Sarah Chen',
    authorRole: 'AI Career Specialist',
    tags: ['AI', 'Job Search', 'Tools'],
  },
  {
    id: 2,
    title: 'How to Write a Cover Letter That Gets You Hired Every Time',
    excerpt: 'A data-driven guide to crafting compelling cover letters that hiring managers actually read. Includes templates and real examples from successful applicants.',
    category: 'Career Tips',
    color: 'blue',
    readTime: '7 min read',
    date: 'Apr 28, 2025',
    emoji: '✍️',
    featured: false,
    author: 'Marcus Johnson',
    authorRole: 'Senior Recruiter',
    tags: ['Cover Letter', 'Writing', 'Tips'],
  },
  {
    id: 3,
    title: 'Remote Work in 2025: The Complete Guide for Job Seekers',
    excerpt: 'Everything you need to know about landing and thriving in remote positions. From finding opportunities to acing virtual interviews and building your ideal home office.',
    category: 'Remote Work',
    color: 'emerald',
    readTime: '8 min read',
    date: 'Apr 20, 2025',
    emoji: '🏠',
    featured: false,
    author: 'Priya Mehta',
    authorRole: 'Remote Work Consultant',
    tags: ['Remote', 'WFH', 'Productivity'],
  },
  {
    id: 4,
    title: 'Salary Negotiation Secrets: Get Paid What You\'re Worth',
    excerpt: 'Expert negotiation strategies that helped thousands of professionals increase their salary by an average of 20%. Don\'t leave money on the table — ever again.',
    category: 'Salary & Growth',
    color: 'orange',
    readTime: '6 min read',
    date: 'Apr 15, 2025',
    emoji: '💰',
    featured: false,
    author: 'David Park',
    authorRole: 'Career Coach',
    tags: ['Salary', 'Negotiation', 'Growth'],
  },
  {
    id: 5,
    title: '50 Interview Questions You Must Prepare For in 2025',
    excerpt: 'From behavioral to technical questions, this comprehensive guide covers the most common interview questions and how to answer them with confidence.',
    category: 'Interview Prep',
    color: 'fuchsia',
    readTime: '12 min read',
    date: 'Apr 10, 2025',
    emoji: '🎯',
    featured: false,
    author: 'Emily Torres',
    authorRole: 'Interview Coach',
    tags: ['Interview', 'Preparation', 'Confidence'],
  },
  {
    id: 6,
    title: 'The Tech Industry Hiring Boom: What It Means for You',
    excerpt: 'Breaking down the latest hiring trends in tech, which companies are expanding, and how to position yourself for opportunities in software, data science, and AI roles.',
    category: 'Tech Industry',
    color: 'cyan',
    readTime: '5 min read',
    date: 'Apr 5, 2025',
    emoji: '🚀',
    featured: false,
    author: 'Alex Kim',
    authorRole: 'Tech Industry Analyst',
    tags: ['Tech', 'Hiring', 'Trends'],
  },
  {
    id: 7,
    title: 'LinkedIn Profile Optimization: The Ultimate 2025 Playbook',
    excerpt: 'Transform your LinkedIn profile from invisible to irresistible. Learn the exact strategies that recruiters use to find top candidates and make sure you\'re one of them.',
    category: 'Career Tips',
    color: 'blue',
    readTime: '9 min read',
    date: 'Mar 30, 2025',
    emoji: '💼',
    featured: false,
    author: 'Sarah Chen',
    authorRole: 'AI Career Specialist',
    tags: ['LinkedIn', 'Personal Brand', 'Profile'],
  },
  {
    id: 8,
    title: 'From Burnout to Breakthrough: Changing Careers at 30+',
    excerpt: 'Real stories and actionable strategies from professionals who successfully pivoted careers. It\'s never too late to pursue work that genuinely excites you.',
    category: 'Career Tips',
    color: 'blue',
    readTime: '10 min read',
    date: 'Mar 25, 2025',
    emoji: '🔄',
    featured: false,
    author: 'Marcus Johnson',
    authorRole: 'Senior Recruiter',
    tags: ['Career Change', 'Burnout', 'Growth'],
  },
];

const trendingTopics = [
  { label: 'AI Jobs', count: '2.4k articles' },
  { label: 'Remote Work', count: '1.8k articles' },
  { label: 'Salary Guide', count: '956 articles' },
  { label: 'Interview Tips', count: '1.2k articles' },
  { label: 'Career Change', count: '743 articles' },
  { label: 'Tech Layoffs', count: '621 articles' },
];

// ─── Components ───────────────────────────────────────────────────────────────
function FeaturedPost({ post }: { post: typeof posts[0] }) {
  const c = categoryColors[post.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="mb-6"
    >
      <div className={`group relative bg-gradient-to-br ${c.gradient} border ${c.border} rounded-2xl p-8 md:p-12 overflow-hidden transition-all duration-300 hover:shadow-2xl ${c.glow} cursor-pointer`}>
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.9 }}
        />
        {/* Decorative emoji */}
        <div className="absolute top-8 right-8 text-7xl opacity-15 select-none">{post.emoji}</div>
        {/* Orb */}
        <div className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${c.gradient}`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${c.tag}`}>⭐ Featured</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.tag}`}>{post.category}</span>
              {post.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full text-xs text-muted-foreground bg-secondary border border-border">{t}</span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.gradient} border ${c.border} flex items-center justify-center text-xs font-bold ${c.accent}`}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
            </div>
          </div>
          <div className={`flex-shrink-0 flex items-center gap-2 ${c.accent} font-semibold text-sm px-5 py-3 rounded-xl border ${c.border} bg-background/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all`}>
            Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PostCard({ post, index }: { post: typeof posts[0]; index: number }) {
  const c = categoryColors[post.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group h-full"
    >
      <div className={`h-full bg-gradient-to-br ${c.gradient} border ${c.border} rounded-2xl p-6 overflow-hidden relative transition-all duration-300 hover:shadow-xl ${c.glow} cursor-pointer flex flex-col`}>
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.7 }}
        />
        {/* Emoji */}
        <div className="text-4xl mb-4 select-none">{post.emoji}</div>
        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <Tag className={`w-3 h-3 ${c.accent}`} />
          <span className={`text-xs font-bold ${c.accent}`}>{post.category}</span>
        </div>
        {/* Title */}
        <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2 relative z-10 flex-1">
          {post.title}
        </h3>
        {/* Excerpt */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3 relative z-10">
          {post.excerpt}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
          {post.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-background/40 text-muted-foreground border border-border/50">{t}</span>
          ))}
        </div>
        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground relative z-10 pt-3 border-t border-border/30 mt-auto">
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-[9px] font-bold ${c.accent}`}>
              {post.author.charAt(0)}
            </div>
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts[0];
  const gridPosts = filteredPosts.filter((p) => !p.featured || activeCategory !== 'All' || search);
  const showFeatured = activeCategory === 'All' && !search;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative py-28 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div style={{ y }} className="absolute inset-0">
            <motion.div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-500/6 rounded-full blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity }} />
            <motion.div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-3xl"
              animate={{ x: [0, -25, 0], y: [0, 25, 0] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} />
            <motion.div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-fuchsia-500/4 rounded-full blur-3xl"
              animate={{ x: [0, 20, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} />
          </motion.div>
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,58,237,0.8) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            {/* Label */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-8">
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Career Knowledge Hub</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-none">
              Career{' '}
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                Insights
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-medium">
                That Actually Move the Needle
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Expert advice, industry trends, AI tools, and actionable strategies written by recruiters, hiring managers, and career coaches who've been in the trenches.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-12">
              {[
                { value: '120+', label: 'Articles', icon: BookOpen },
                { value: '50k+', label: 'Monthly Readers', icon: TrendingUp },
                { value: '15', label: 'Expert Authors', icon: Sparkles },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center">
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, topics, or categories…"
                className="w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* ── Category filters ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeCategory === cat.label
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* ── Featured post ── */}
        {showFeatured && <FeaturedPost post={featuredPost} />}

        {/* ── Grid ── */}
        {gridPosts.length > 0 ? (
          <>
            {showFeatured && (
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">More Articles</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gridPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-foreground mb-2">No articles found</p>
            <p className="text-muted-foreground text-sm">Try a different search term or category</p>
          </motion.div>
        )}

        {/* ── Trending topics ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-20 bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Trending Topics</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingTopics.map((t, i) => (
              <motion.button
                key={t.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearch(t.label)}
                className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-primary/10 border border-border hover:border-primary/30 rounded-xl transition-all cursor-pointer group"
              >
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.count}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Newsletter CTA ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-8 relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700" />
          <motion.div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"
            animate={{ x: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} />
          <div className="relative z-10 p-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Weekly Newsletter</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Get Career Insights in Your Inbox</h3>
            <p className="text-white/70 mb-7 max-w-md mx-auto text-sm">Join 50,000+ professionals who get our weekly roundup of the best career advice, AI tools, and job market insights.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 text-sm"
              />
              <button className="px-6 py-3 bg-white text-violet-700 font-bold rounded-xl hover:bg-white/90 transition-colors text-sm flex items-center gap-2 justify-center whitespace-nowrap">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}