'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bell, Database, Eye, Lock, Mail, Shield } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    color: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    dot: 'bg-violet-400',
    content: [
      { heading: 'Account Information', text: 'Name, email address, and password when you register. If you sign in with Google, we receive your public profile information.' },
      { heading: 'Profile Data', text: 'Phone number, avatar photo, resume URL, and any additional details you choose to add to your seeker or company profile.' },
      { heading: 'Usage Data', text: 'Pages visited, jobs viewed, applications submitted, and features used — collected to improve our platform and AI recommendations.' },
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Data',
    color: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    dot: 'bg-blue-400',
    content: [
      { heading: 'Platform Operation', text: 'To create your account, process job applications, and enable communication between seekers and companies.' },
      { heading: 'AI Personalization', text: 'Your application history trains our recommendation engine to surface more relevant jobs. This processing happens on our servers — we never sell this data.' },
      { heading: 'Platform Improvement', text: 'Aggregated, anonymized usage patterns help us identify bugs, improve features, and build a better product for everyone.' },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
    content: [
      { heading: 'Encryption', text: 'All data is encrypted in transit (TLS 1.3) and at rest. Passwords are hashed using bcrypt and are never stored in plain text.' },
      { heading: 'Access Controls', text: 'Only authenticated users can access their own data. Admin access to user data is logged and audited.' },
      { heading: 'Third-Party Services', text: 'We use Cloudinary (image storage), Neon/PostgreSQL (database), and Google (OAuth). Each is contractually bound to protect your data.' },
    ],
  },
  {
    icon: Bell,
    title: 'Your Rights',
    color: 'text-orange-400',
    iconBg: 'bg-orange-500/10 border-orange-500/20',
    dot: 'bg-orange-400',
    content: [
      { heading: 'Access & Export', text: 'You can view all data tied to your account at any time from your profile page. Request a full export by emailing privacy@hireflow.com.' },
      { heading: 'Deletion', text: 'Delete your account at any time from Settings. All personal data is permanently removed within 30 days of deletion.' },
      { heading: 'Correction', text: 'Update your profile information at any time. If you believe we hold inaccurate data, contact us and we\'ll correct it promptly.' },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-500/6 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity }} />
          <motion.div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"
            animate={{ x: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,58,237,0.8) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Your Privacy Matters</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-5 leading-none">
              Privacy{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed mb-6">
              We believe in plain-English privacy policies. Here's exactly what data we collect, why we collect it, and how you stay in control.
            </p>
            <p className="text-xs text-muted-foreground">Last updated: May 1, 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Intro card */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-violet-500/10 to-purple-600/5 border border-violet-500/20 rounded-2xl p-6 mb-10">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-bold text-violet-400">The short version:</span> We collect only what we need to run HireFlow. We never sell your personal data. You can delete everything at any time. If you have questions, email us at{' '}
            <a href="mailto:privacy@hireflow.com" className="text-violet-400 hover:underline">privacy@hireflow.com</a>.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div key={section.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="bg-card border border-border rounded-2xl overflow-hidden">

                {/* Section header */}
                <div className="flex items-center gap-4 p-6 border-b border-border">
                  <div className={`w-10 h-10 rounded-xl ${section.iconBg} border flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {section.content.map((item, j) => (
                    <motion.div key={item.heading}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 + j * 0.05 }}
                      className="flex gap-4 p-5">
                      <div className={`w-1.5 h-1.5 rounded-full ${section.dot} mt-2 flex-shrink-0`} />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">{item.heading}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cookies note */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-6 bg-card border border-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            🍪 Cookies
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use essential cookies only — for authentication sessions and theme preferences. We don't use advertising cookies or third-party trackers. You can clear cookies at any time from your browser settings without affecting your data on our servers.
          </p>
        </motion.div>

        {/* Changes note */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-4 bg-card border border-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-foreground mb-3">Policy Changes</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If we make material changes to this policy, we'll notify you via email and display a banner on the platform at least 14 days before the changes take effect. Continued use of HireFlow after that date constitutes acceptance of the updated policy.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground">Have privacy questions?</p>
              <p className="text-xs text-muted-foreground">We respond within 48 hours</p>
            </div>
          </div>
          <a href="mailto:privacy@hireflow.com"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/20 transition-colors text-sm whitespace-nowrap">
            privacy@hireflow.com <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Link to Terms */}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-8">
          Also read our{' '}
          <Link href="/terms" className="text-primary hover:underline font-semibold">Terms of Service</Link>
        </motion.p>
      </div>
    </div>
  );
}