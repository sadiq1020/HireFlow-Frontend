"use client";

import { useSession } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
    BookOpen,
    Bot,
    BriefcaseBusiness,
    Building2,
    Loader2,
    RefreshCw,
    Send,
    Sparkles,
    TrendingUp,
    X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "user" | "model";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are HireAI, an intelligent career assistant for HireFlow — a premium AI-powered job board that connects top talent with great companies.

Your personality: professional yet approachable, concise, data-aware, and genuinely helpful. You occasionally use relevant emojis but sparingly.

You can help with:
- Job search advice (resume tips, interview preparation, salary negotiation)
- How to use HireFlow (browse jobs → apply → track applications → get hired)
- Career guidance (switching industries, skill gaps, career progression)
- Understanding job listings (what skills matter, what companies look for)
- Application status explanations (Pending → Reviewed → Shortlisted → Rejected/Accepted)
- Company research tips and how to evaluate job offers
- AI features on HireFlow: AI Job Recommendations, AI Cover Letter Assistant

Platform context:
- Three user roles: Job Seeker, Company (employer), Admin
- Seekers can save jobs, apply with cover letters, track application status
- Companies post jobs, review applications, update candidate status
- Job categories include: Engineering, Design, Marketing, Finance, Healthcare, Education, and more
- Applications go through: Pending → Reviewed → Shortlisted → Rejected or Accepted

Important rules:
- Keep responses SHORT and punchy — max 3-4 sentences unless a list is clearly better
- Never fabricate specific salary numbers or company data you don't have
- For account/login issues, direct them to Settings or support
- If asked something unrelated to careers/jobs/HireFlow, politely redirect
- End recommendations with a follow-up question to keep the conversation helpful`;

// ─── Quick prompts ────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { icon: BriefcaseBusiness, label: "Find jobs for me", text: "Help me find the right job based on my background" },
  { icon: BookOpen, label: "Resume tips", text: "Give me tips to improve my resume and stand out" },
  { icon: Building2, label: "Evaluate an offer", text: "How do I evaluate a job offer and negotiate salary?" },
  { icon: TrendingUp, label: "Career switch", text: "I want to switch careers. Where do I start?" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ─── Animated gradient orbs (background decoration) ──────────────────────────
function ChatOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {/* Top-left violet orb */}
      <motion.div
        className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, oklch(55% 0.25 285), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom-right accent orb */}
      <motion.div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, oklch(65% 0.22 310), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.28, 0.15],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
          isUser
            ? "bg-[oklch(50%_0.25_285)] border-[oklch(55%_0.25_285/0.5)] text-white"
            : "bg-[oklch(14%_0.025_285)] border-[oklch(25%_0.04_285)]"
        }`}
      >
        {isUser ? (
          <span className="text-[9px] font-bold tracking-tight">YOU</span>
        ) : (
          <Bot className="w-3.5 h-3.5 text-[oklch(65%_0.20_285)]" />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-[oklch(50%_0.25_285)] text-white rounded-2xl rounded-tr-sm shadow-lg shadow-[oklch(50%_0.25_285/0.25)]"
              : "bg-[oklch(16%_0.03_285)] text-[oklch(92%_0.01_285)] border border-[oklch(25%_0.04_285/0.8)] rounded-2xl rounded-tl-sm"
          }`}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-[oklch(45%_0.05_285)] px-1">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex gap-2.5"
    >
      <div className="w-7 h-7 rounded-xl bg-[oklch(14%_0.025_285)] border border-[oklch(25%_0.04_285)] flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-[oklch(65%_0.20_285)]" />
      </div>
      <div className="bg-[oklch(16%_0.03_285)] border border-[oklch(25%_0.04_285/0.8)] rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[oklch(55%_0.25_285)]"
              animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.8,
                delay: i * 0.18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── FAB pulse ring ───────────────────────────────────────────────────────────
function PulseRings() {
  return (
    <>
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-2xl border border-[oklch(55%_0.25_285/0.4)]"
          animate={{
            scale: [1, 1.3 + i * 0.15],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AIChatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastRequestRef = useRef<number>(0);
  const COOLDOWN_MS = 2000;

  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] ?? "there";

  // Handle mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial greeting
  useEffect(() => {
    if (mounted && isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "model",
          content: `Hey ${userName}! 👋 I'm HireAI, your career assistant on HireFlow. I can help you find the right jobs, polish your resume, prepare for interviews, or navigate your career path. What can I help you with today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [mounted, isOpen, userName]); // Added back userName but ensured it stays constant during render

  // Auto-scroll
  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, mounted]);

  // Focus input on open
  useEffect(() => {
    if (mounted && isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
      setHasUnread(false);
    }
  }, [mounted, isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const now = Date.now();
    if (now - lastRequestRef.current < COOLDOWN_MS) return;
    lastRequestRef.current = now;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history (exclude welcome messages)
      const history = messages
        .filter((m) => !m.id.startsWith("welcome"))
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

      const contents = [
        ...history,
        { role: "user", parts: [{ text: trimmed }] },
      ];

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`${response.status}:${errData?.error?.message ?? response.statusText}`);
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "model",
          content: reply || "Sorry, I couldn't generate a response. Please try again.",
          timestamp: new Date(),
        },
      ]);

      if (!isOpen) setHasUnread(true);
    } catch (err) {
      const errStr = String(err);
      const isRateLimit =
        errStr.includes("429") ||
        errStr.toLowerCase().includes("quota") ||
        errStr.toLowerCase().includes("too many");

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "model",
          content: isRateLimit
            ? "I'm receiving too many requests right now — please wait a few seconds and try again! ⏳"
            : "I'm having trouble connecting at the moment. Please try again shortly! 🙏",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setTimeout(() => {
      setMessages([
        {
          id: `welcome-reset-${Date.now()}`,
          role: "model",
          content: `Fresh start! ✨ What career challenge can I help you tackle today, ${userName}?`,
          timestamp: new Date(),
        },
      ]);
    }, 80);
  };

  const showQuickPrompts = messages.length <= 1 && !isLoading;

  // Don't render anything until mounted
  if (!mounted) return null;

  return (
    <>
      {/* ── Chat Panel ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] flex flex-col overflow-hidden"
            style={{
              height: "min(560px, calc(100vh - 148px))",
              borderRadius: "20px",
              background: "oklch(11% 0.02 285)",
              border: "1px solid oklch(22% 0.035 285)",
              boxShadow: `
                0 0 0 1px oklch(55% 0.25 285 / 0.08),
                0 8px 32px oklch(0% 0 0 / 0.6),
                0 2px 8px oklch(0% 0 0 / 0.4),
                inset 0 1px 0 oklch(100% 0 0 / 0.04)
              `,
            }}
          >
            {/* Ambient background orbs */}
            <ChatOrbs />

            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-4 py-3.5 shrink-0 relative"
              style={{
                background: "linear-gradient(180deg, oklch(15% 0.03 285) 0%, oklch(12% 0.025 285) 100%)",
                borderBottom: "1px solid oklch(22% 0.035 285)",
              }}
            >
              {/* Gradient line at very top */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, oklch(55% 0.25 285 / 0.6), oklch(65% 0.2 310 / 0.4), transparent)",
                }}
              />

              <div className="flex items-center gap-3">
                {/* Bot avatar with glow */}
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, oklch(50% 0.25 285 / 0.2), oklch(60% 0.2 310 / 0.15))",
                      border: "1px solid oklch(55% 0.25 285 / 0.35)",
                      boxShadow: "0 0 16px oklch(55% 0.25 285 / 0.2)",
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-[oklch(70%_0.2_285)]" />
                  </div>
                  {/* Online indicator */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{
                      background: "oklch(65% 0.25 145)",
                      borderColor: "oklch(15% 0.03 285)",
                    }}
                  >
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ background: "oklch(65% 0.25 145)" }}
                      animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-[oklch(95%_0.01_285)] leading-none">
                      HireAI
                    </span>
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full tracking-wide uppercase"
                      style={{
                        background: "oklch(55% 0.25 285 / 0.15)",
                        color: "oklch(70% 0.2 285)",
                        border: "1px solid oklch(55% 0.25 285 / 0.25)",
                      }}
                    >
                      Beta
                    </span>
                  </div>
                  <p className="text-[10px] text-[oklch(55%_0.08_285)] mt-0.5">
                    Career Assistant · Always online
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetChat}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  style={{ color: "oklch(50% 0.05 285)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "oklch(75% 0.05 285)";
                    e.currentTarget.style.background = "oklch(20% 0.03 285)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "oklch(50% 0.05 285)";
                    e.currentTarget.style.background = "transparent";
                  }}
                  title="New conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  style={{ color: "oklch(50% 0.05 285)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "oklch(75% 0.05 285)";
                    e.currentTarget.style.background = "oklch(20% 0.03 285)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "oklch(50% 0.05 285)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative">
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {isLoading && <TypingIndicator />}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick prompts ── */}
            <AnimatePresence>
              {showQuickPrompts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-3 shrink-0"
                >
                  <p className="text-[10px] text-[oklch(45%_0.05_285)] mb-2 font-medium tracking-wide uppercase">
                    Suggested
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_PROMPTS.map(({ icon: Icon, label, text }) => (
                      <motion.button
                        key={label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => sendMessage(text)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all cursor-pointer"
                        style={{
                          background: "oklch(15% 0.025 285)",
                          border: "1px solid oklch(22% 0.035 285)",
                          color: "oklch(70% 0.05 285)",
                          fontSize: "11px",
                          fontWeight: 500,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "oklch(50% 0.25 285 / 0.4)";
                          e.currentTarget.style.color = "oklch(80% 0.08 285)";
                          e.currentTarget.style.background = "oklch(17% 0.03 285)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "oklch(22% 0.035 285)";
                          e.currentTarget.style.color = "oklch(70% 0.05 285)";
                          e.currentTarget.style.background = "oklch(15% 0.025 285)";
                        }}
                      >
                        <Icon
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: "oklch(60% 0.2 285)" }}
                        />
                        <span className="truncate">{label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input ── */}
            <div
              className="px-3 pb-3 pt-2.5 shrink-0"
              style={{ borderTop: "1px solid oklch(18% 0.03 285)" }}
            >
              <motion.div
                animate={{
                  boxShadow: inputFocused
                    ? "0 0 0 1px oklch(50% 0.25 285 / 0.5), 0 0 16px oklch(50% 0.25 285 / 0.1)"
                    : "none",
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{
                  background: "oklch(14% 0.025 285)",
                  border: "1px solid oklch(22% 0.035 285)",
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Ask about jobs, interviews, career…"
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
                  style={{
                    color: "oklch(92% 0.01 285)",
                    caretColor: "oklch(60% 0.25 285)",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:cursor-not-allowed"
                  style={{
                    background:
                      input.trim() && !isLoading
                        ? "linear-gradient(135deg, oklch(52% 0.26 285), oklch(58% 0.22 300))"
                        : "oklch(20% 0.03 285)",
                    boxShadow:
                      input.trim() && !isLoading
                        ? "0 2px 8px oklch(50% 0.25 285 / 0.35)"
                        : "none",
                    opacity: isLoading || !input.trim() ? 0.45 : 1,
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-white" />
                  )}
                </motion.button>
              </motion.div>

              <p className="text-[9px] text-center mt-2" style={{ color: "oklch(35% 0.04 285)" }}>
                Powered by Gemini · HireFlow Career Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-4 sm:right-6 z-[60] w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer shadow-2xl"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          background: isOpen
            ? "linear-gradient(135deg, #7c3aed, #9333ea)"
            : "linear-gradient(135deg, #8b5cf6, #a855f7)",
        }}
        aria-label={isOpen ? "Close HireAI" : "Open HireAI"}
      >
        {/* Pulse rings — only when closed */}
        {!isOpen && <PulseRings />}

        {/* Icon swap */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2"
              style={{
                background: "oklch(60% 0.25 25)",
                borderColor: "oklch(12% 0.02 285)",
              }}
            >
              <span className="text-[9px] text-white font-bold">1</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}