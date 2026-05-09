'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Bot,
    Briefcase,
    Building2,
    CheckCircle,
    Clock,
    Globe,
    HeadphonesIcon,
    Loader2,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    Sparkles,
    X,
    Users,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  subject: z.enum(['general', 'technical', 'billing', 'partnership', 'press', 'feedback'], {
    message: 'Please select a subject',
  }),
  role:    z.enum(['seeker', 'company', 'other'], {
    message: 'Please select your role',
  }),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

// ─── Data ─────────────────────────────────────────────────────────────────────
const contactMethods = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'hello@hireflow.com',
    desc: 'We reply within 24 hours',
    color: 'from-violet-500/15 to-purple-600/8',
    border: 'border-violet-500/20 hover:border-violet-400/40',
    accent: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
    href: 'mailto:hello@hireflow.com',
  },
  {
    icon: X,
    label: 'Twitter / X',
    value: '@hireflow',
    desc: 'For quick questions & updates',
    color: 'from-blue-500/15 to-cyan-600/8',
    border: 'border-blue-500/20 hover:border-blue-400/40',
    accent: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    href: 'https://twitter.com/hireflow',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 000-1234',
    desc: 'Mon–Fri, 9AM–6PM EST',
    color: 'from-emerald-500/15 to-teal-600/8',
    border: 'border-emerald-500/20 hover:border-emerald-400/40',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    href: 'tel:+15550001234',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'San Francisco, CA',
    desc: '101 Market St, Suite 400',
    color: 'from-orange-500/15 to-amber-600/8',
    border: 'border-orange-500/20 hover:border-orange-400/40',
    accent: 'text-orange-400',
    iconBg: 'bg-orange-500/10',
    href: '#',
  },
];

const faqs = [
  {
    q: 'How quickly do companies respond to applications?',
    a: 'Most companies on HireFlow respond within 3–7 business days. You can track your application status in your Seeker Dashboard in real time.',
    color: 'text-violet-400',
  },
  {
    q: 'Is HireFlow free for job seekers?',
    a: 'Yes — completely free. Create an account, apply to unlimited jobs, use AI tools, and track your applications at no cost.',
    color: 'text-blue-400',
  },
  {
    q: 'How does the company approval process work?',
    a: 'After registration, our team reviews each company profile within 24–48 hours to ensure authenticity. Approved companies can immediately post jobs.',
    color: 'text-emerald-400',
  },
  {
    q: 'Can I use AI features without creating an account?',
    a: 'The AI Chatbot is available to all visitors. The Cover Letter Assistant and Job Recommendations require a free account to personalize the experience.',
    color: 'text-orange-400',
  },
];

const supportCategories = [
  { icon: Users,          label: 'Job Seeker Support', desc: 'Applications, profile, saved jobs', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { icon: Building2,      label: 'Company Support',    desc: 'Posting jobs, applications, approval', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  { icon: Bot,            label: 'AI Features',        desc: 'Chatbot, recommendations, cover letters', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
  { icon: HeadphonesIcon, label: 'Technical Issues',   desc: 'Bugs, errors, account problems', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [openFaq, setOpenFaq]           = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  const inputClass = 'w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm';
  const labelClass = 'block text-sm font-semibold text-foreground mb-1.5';

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-violet-500/6 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity }} />
          <motion.div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl"
            animate={{ x: [0, -25, 0] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,58,237,0.8) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Get in Touch</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-none">
              We're here to{' '}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                help
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you're a job seeker with questions, a company looking to hire, or just want to say hello — our team responds to every message. Usually within a few hours.
            </p>
          </motion.div>

          {/* Response time badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-10">
            {[
              { icon: Clock, label: '< 24h response time', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { icon: Globe, label: 'Available worldwide',  color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
              { icon: Zap,   label: 'Live chat via AI bot', color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className={`flex items-center gap-2 px-4 py-2 rounded-full ${b.bg} border text-xs font-semibold ${b.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {b.label}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ── Contact methods ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactMethods.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.a key={m.label} href={m.href} target={m.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group bg-gradient-to-br ${m.color} border ${m.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden block`}>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 pointer-events-none"
                  initial={{ x: '-100%' }} whileHover={{ x: '200%' }} transition={{ duration: 0.7 }} />
                <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center mb-4 relative z-10`}>
                  <Icon className={`w-5 h-5 ${m.accent}`} />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 relative z-10">{m.label}</p>
                <p className={`text-sm font-bold ${m.accent} mb-1 relative z-10`}>{m.value}</p>
                <p className="text-xs text-muted-foreground relative z-10">{m.desc}</p>
              </motion.a>
            );
          })}
        </motion.div>

        {/* ── Main grid: Form + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Send className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Send us a message</h2>
                  <p className="text-xs text-muted-foreground">We read and respond to every message personally</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-16">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Message sent! 🎉</h3>
                    <p className="text-muted-foreground text-sm mb-6">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                    <button onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors cursor-pointer">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5"
                    initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Full Name</label>
                        <input {...register('name')} placeholder="Your name" className={inputClass} />
                        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Email Address</label>
                        <input {...register('email')} type="email" placeholder="you@example.com" className={inputClass} />
                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>I am a…</label>
                        <select {...register('role')} className={inputClass}>
                          <option value="">Select your role</option>
                          <option value="seeker">Job Seeker</option>
                          <option value="company">Company / Recruiter</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Subject</label>
                        <select {...register('subject')} className={inputClass}>
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Issue</option>
                          <option value="billing">Billing</option>
                          <option value="partnership">Partnership</option>
                          <option value="press">Press & Media</option>
                          <option value="feedback">Feedback</option>
                        </select>
                        {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Message</label>
                      <textarea {...register('message')} rows={5} placeholder="Tell us how we can help you…" className={`${inputClass} resize-none`} />
                      {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
                    </div>

                    <motion.button type="submit" disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm cursor-pointer">
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Sending message…</>
                      ) : (
                        <><Send className="w-4 h-4" />Send Message</>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="space-y-5">

            {/* Support categories */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-base font-bold text-foreground mb-5">What can we help with?</h3>
              <div className="space-y-3">
                {supportCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.label} className={`flex items-center gap-3 p-3 rounded-xl ${cat.bg} border ${cat.border}`}>
                      <Icon className={`w-4 h-4 ${cat.color} flex-shrink-0`} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">{cat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI chatbot nudge */}
            <div className="relative bg-gradient-to-br from-violet-500/15 to-purple-600/8 border border-violet-500/20 rounded-2xl p-6 overflow-hidden">
              <motion.div className="absolute -bottom-8 -right-8 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">Need an instant answer?</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Our AI Chatbot can answer most questions about jobs, features, and your account instantly — 24/7.
                </p>
                <p className="text-xs text-violet-400 font-semibold flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  Click the chat button in the bottom right →
                </p>
              </div>
            </div>

            {/* Office hours */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Office Hours</h3>
              </div>
              <div className="space-y-2">
                {[
                  { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM EST' },
                  { day: 'Saturday',        hours: '10:00 AM – 2:00 PM EST' },
                  { day: 'Sunday',          hours: 'Closed (AI bot available)' },
                ].map((h) => (
                  <div key={h.day} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{h.day}</span>
                    <span className="text-xs font-semibold text-foreground">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── FAQ ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-orange-400" />
              <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Quick Answers</span>
              <div className="h-px w-8 bg-orange-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Frequently asked{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
                >
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                    className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-3 h-3 text-primary" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <div className={`h-px w-full bg-border mb-4`} />
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center">
          <p className="text-muted-foreground text-sm mb-6">Still have questions? Browse our resources.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 text-sm">
              <Briefcase className="w-4 h-4" /> Browse Jobs
            </Link>
            <Link href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border text-foreground font-semibold rounded-xl hover:border-primary/30 transition-all text-sm">
              <MessageSquare className="w-4 h-4" /> Read Our Blog
            </Link>
            <Link href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border text-foreground font-semibold rounded-xl hover:border-primary/30 transition-all text-sm">
              <Users className="w-4 h-4" /> About HireFlow
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}