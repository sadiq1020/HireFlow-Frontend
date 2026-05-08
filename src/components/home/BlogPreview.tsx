'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    title: '10 AI Tools That Will Transform Your Job Search in 2025',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way professionals find and land their dream jobs. From resume builders to interview coaches.',
    category: 'AI & Career',
    readTime: '5 min read',
    date: 'May 2, 2025',
    gradient: 'from-violet-500/20 to-purple-600/10',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    tag: 'bg-violet-500/10 text-violet-400',
    accent: 'text-violet-400',
    emoji: '🤖',
  },
  {
    title: 'How to Write a Cover Letter That Gets You Hired Every Time',
    excerpt: 'A data-driven guide to crafting compelling cover letters that hiring managers actually read. Includes templates and real examples from successful applicants.',
    category: 'Career Tips',
    readTime: '7 min read',
    date: 'Apr 28, 2025',
    gradient: 'from-blue-500/20 to-indigo-600/10',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    tag: 'bg-blue-500/10 text-blue-400',
    accent: 'text-blue-400',
    emoji: '✍️',
  },
  {
    title: 'Remote Work in 2025: The Complete Guide for Job Seekers',
    excerpt: 'Everything you need to know about landing and thriving in remote positions. From finding opportunities to acing virtual interviews and building your home setup.',
    category: 'Remote Work',
    readTime: '8 min read',
    date: 'Apr 20, 2025',
    gradient: 'from-emerald-500/20 to-teal-600/10',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    tag: 'bg-emerald-500/10 text-emerald-400',
    accent: 'text-emerald-400',
    emoji: '🏠',
  },
  {
    title: 'Salary Negotiation Secrets: Get Paid What You\'re Worth',
    excerpt: 'Expert negotiation strategies that helped thousands of professionals increase their salary by an average of 20%. Don\'t leave money on the table.',
    category: 'Salary & Growth',
    readTime: '6 min read',
    date: 'Apr 15, 2025',
    gradient: 'from-orange-500/20 to-amber-600/10',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    tag: 'bg-orange-500/10 text-orange-400',
    accent: 'text-orange-400',
    emoji: '💰',
  },
];

export default function BlogPreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-rose-500/4 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-indigo-500/4 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-rose-400" />
              <span className="text-rose-400 text-xs font-bold uppercase tracking-widest">Knowledge Hub</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Career{' '}
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                Insights
              </span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-relaxed">
              Expert advice, industry trends, and actionable tips to accelerate your career growth.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/blog"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group px-4 py-2 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20"
            >
              View all articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="mb-5"
        >
          <Link href="/blog">
            <div className={`group relative bg-gradient-to-br ${posts[0].gradient} border ${posts[0].border} rounded-2xl p-8 md:p-12 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10`}>
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8 }}
              />
              <div className="absolute top-8 right-8 text-6xl opacity-20">{posts[0].emoji}</div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${posts[0].tag} border ${posts[0].border}`}>
                      ⭐ Featured
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${posts[0].tag}`}>
                      {posts[0].category}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                    {posts[0].title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-2xl">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {posts[0].readTime}
                    </div>
                    <span>·</span>
                    <span>{posts[0].date}</span>
                  </div>
                </div>
                <div className={`flex-shrink-0 flex items-center gap-2 ${posts[0].accent} font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all`}>
                  Read article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Other posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.slice(1).map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link href="/blog">
                <div className={`group h-full bg-gradient-to-br ${post.gradient} border ${post.border} rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-xl relative`}>
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.7 }}
                  />

                  {/* Emoji */}
                  <div className="text-3xl mb-4">{post.emoji}</div>

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className={`w-3 h-3 ${post.accent}`} />
                    <span className={`text-xs font-bold ${post.accent}`}>{post.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2 relative z-10">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3 relative z-10">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground relative z-10">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {/* Bottom CTA */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="text-center mt-12"
>
  <Link
    href="/blog"
    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-rose-500/25 hover:-translate-y-0.5"
  >
    Read All Articles
    <ArrowRight className="w-4 h-4" />
  </Link>
</motion.div>
      </div>
    </section>
  );
}