# HireFlow — Frontend

> An AI-powered job board platform built with Next.js 15 App Router. HireFlow connects job seekers with top companies through intelligent matching, AI-assisted applications, and a premium modern UI.

**Live URL:** [hire-flow-frontend-five.vercel.app](https://hire-flow-frontend-five.vercel.app)  
**Backend Repo:** [HireFlow Backend](https://github.com/sadiq1020/HireFlow-Backend)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [AI Features](#ai-features)
- [Pages & Routes](#pages--routes)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Demo Credentials](#demo-credentials)

---

## Project Overview

HireFlow is a full-stack, production-ready job platform that solves the broken hiring experience for both sides of the market:

- **Job Seekers** — browse thousands of curated jobs, apply with AI-generated cover letters, track application status, and get personalized job recommendations based on their history
- **Companies** — post and manage job listings with AI-generated descriptions, review applications, update candidate status, and manage their company profile
- **Admins** — oversee the entire platform: approve/reject companies, manage users, categories, and monitor platform activity through data-driven dashboards

The platform is built mobile-first, supports light/dark mode, and is deployed on Vercel with a separate Express backend on Render.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Animations** | Framer Motion + GSAP + Lenis (smooth scroll) |
| **State Management** | Zustand |
| **Server State** | TanStack Query v5 |
| **Forms** | React Hook Form + Zod |
| **Auth Client** | Better Auth |
| **AI Integration** | Google Gemini 2.5 Flash API |
| **Image Uploads** | Cloudinary (signed browser uploads) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## AI Features

HireFlow implements 4 fully functional AI features powered by **Google Gemini 2.5 Flash** via Next.js API routes. All features include loading states, error handling, and structured outputs.

### 1. 🤖 AI Chatbot — Floating Widget

A context-aware career assistant available on every page via a floating button.

- **Location:** `src/components/ai/ChatBot.tsx`
- **API Route:** `src/app/api/ai/chat/route.ts`
- **How it works:** Maintains full conversation history across turns. Sends the system prompt (HireAI persona), conversation history, and the new user message to Gemini. Returns plain-text responses streamed back to the UI.
- **Features:** 4 quick-prompt shortcuts, typing indicator, conversation reset, unread badge, `Powered by Gemini` attribution

### 2. ✨ AI Job Recommendations — Seeker Dashboard

Personalized job recommendations based on the seeker's application history.

- **Location:** `src/components/ai/JobRecommendations.tsx`
- **API Route:** `src/app/api/ai/recommend/route.ts`
- **How it works:** Fetches the seeker's past applications and a pool of available jobs. Sends both to Gemini with a strict JSON-only prompt. The model returns 3–6 job IDs with a `matchScore` (0–100) and a 12-word `matchReason` for each. Results are cached for 10 minutes via TanStack Query `staleTime`.
- **Output format:** `{ profileSummary: string, recommendations: [{ id, matchScore, matchReason }] }`

### 3. 📝 AI Cover Letter Assistant — Apply Modal

Generates tailored cover letters inside the job application modal.

- **Location:** `src/components/jobs/ApplyModal.tsx`
- **API Route:** `src/app/api/ai/cover-letter/route.ts`
- **How it works:** Accepts job title, company name, job type, location, job description excerpt, tone selection, and optional applicant background. Sends to Gemini with a strict persona prompt that enforces 3-paragraph, 200–250 word output with no salutation or sign-off. The generated letter injects directly into the cover letter textarea.
- **Tone options:** Professional, Confident, Enthusiastic, Concise

### 4. ⚡ AI Job Description Generator — Company Job Form

Generates professional job descriptions and requirements for company job postings.

- **Location:** `src/components/ai/AIJobDescriptionPanel.tsx`
- **API Route:** `src/app/api/ai/generate-jd/route.ts`
- **How it works:** Reads live form values (title, type, location, category) from the parent form. Company selects seniority level and writing style. Gemini returns a strict JSON object with `description` (250–350 word prose) and `requirements` (6–9 bullet points). Clicking "Apply to Form" injects both fields at once.
- **Seniority options:** Junior, Mid-Level, Senior, Lead
- **Style options:** Corporate, Startup, Friendly, Technical

---

## Pages & Routes

### Public Pages
| Route | Description |
|---|---|
| `/` | Home page — 10+ animated sections |
| `/jobs` | Browse jobs with debounced search, filters, sort, pagination |
| `/jobs/[id]` | Job detail with apply modal, save/unsave toggle |
| `/companies` | Browse verified companies with debounced search |
| `/companies/[id]` | Company detail with active job listings |
| `/about` | Company story, team, values, timeline |
| `/blog` | Career insights articles with category filters |
| `/contact` | Contact form with FAQ accordion |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Auth Pages
| Route | Description |
|---|---|
| `/login` | Email login + Google OAuth + demo buttons |
| `/register` | Registration with role selection (Seeker / Company) |

### Seeker Dashboard (`/seeker/*`)
| Route | Description |
|---|---|
| `/seeker/dashboard` | Stats overview + AI Job Recommendations |
| `/seeker/applications` | Application history with status tracking |
| `/seeker/saved-jobs` | Bookmarked jobs with save/unsave toggle |
| `/seeker/profile` | Edit profile + avatar upload |

### Company Dashboard (`/company/*`)
| Route | Description |
|---|---|
| `/company/dashboard` | Stats + charts (applications, job trends) |
| `/company/jobs` | Manage job listings (create, edit, delete) |
| `/company/jobs/create` | Post new job with AI Description Generator |
| `/company/jobs/[id]/edit` | Edit existing job |
| `/company/applications` | Review applications + update status |
| `/company/profile` | Edit company info + logo upload |

### Admin Dashboard (`/admin/*`)
| Route | Description |
|---|---|
| `/admin/dashboard` | Platform overview + 4 charts |
| `/admin/companies` | Approve / reject company accounts |
| `/admin/users` | Activate / deactivate user accounts |
| `/admin/jobs` | View and manage all platform jobs |
| `/admin/categories` | Create and manage job categories |

---

## Architecture

```
src/
├── app/
│   ├── (public)/          # Public routes — no auth required
│   ├── (auth)/            # Login & register pages
│   ├── (seeker)/          # Seeker dashboard routes
│   ├── (company)/         # Company dashboard routes
│   ├── (admin)/           # Admin dashboard routes
│   └── api/               # Next.js API routes (AI + Cloudinary)
│       ├── ai/
│       │   ├── chat/
│       │   ├── recommend/
│       │   ├── cover-letter/
│       │   └── generate-jd/
│       └── cloudinary/sign/
├── components/
│   ├── ai/                # AI feature components
│   ├── home/              # Landing page sections
│   ├── jobs/              # Job card, apply modal
│   ├── layout/            # Navbar, footer, sidebar
│   ├── seeker/            # Seeker-specific components
│   ├── company/           # Company-specific components
│   ├── admin/             # Admin-specific components
│   └── shared/            # Skeleton loaders, pagination
├── hooks/
│   └── useDebounce.ts     # Debounce hook for search inputs
├── lib/
│   ├── api.ts             # Fetch wrapper (proxied to backend)
│   └── auth-client.ts     # Better Auth client
├── providers/             # TanStack Query, theme providers
├── store/                 # Zustand auth store
└── types/                 # Shared TypeScript interfaces
```

**API Proxy:** All `/api/v1/*` requests are proxied to the backend via `next.config.ts` rewrites. Auth routes (`/api/auth/*`) are also proxied via Better Auth's `oAuthProxy` plugin.

**Optimistic UI:** The save/unsave job toggle uses TanStack Query's `onMutate` → optimistic cache update → `onError` rollback pattern for instant feedback.

**Suspense / Streaming:** Every major route has a `loading.tsx` file that shows skeleton UIs while the page loads, enabling Next.js streaming.

**Debounced Search:** Search inputs on `/jobs` and `/companies` use a 400ms `useDebounce` hook to avoid firing API requests on every keystroke.

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend running locally or on Render (see backend README)

### 1. Clone the repository

```bash
git clone https://github.com/sadiq1020/HireFlow-Frontend.git
cd HireFlow-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# Backend URL (proxied via next.config.ts rewrites)
BACKEND_URL=http://localhost:5000

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_SECRET=your_secret_here

# AI — Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm run start
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BACKEND_URL` | ✅ | Express backend URL (used in next.config.ts rewrites) |
| `NEXT_PUBLIC_FRONTEND_URL` | ✅ | Frontend URL (used by Better Auth) |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL (used in client components) |
| `BETTER_AUTH_SECRET` | ✅ | Must match backend BETTER_AUTH_SECRET |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for AI features |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret (server-side only) |

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@hireflow.com` | `admin1234` |

> Company and Seeker demo accounts can be created via the registration page.

---

## Key Implementation Notes

- **No Axios** — all API calls use the native `fetch` API wrapped in `src/lib/api.ts`
- **No nodemon** — backend uses `tsx watch` for development
- **TypeScript strict** — enforced across all files
- **Dark mode** — implemented via `next-themes` with `class` strategy, full contrast compliance
- **Image uploads** — browser uploads directly to Cloudinary using server-signed requests; images never pass through the backend
- **Google OAuth** — handled entirely by Better Auth on the backend via `oAuthProxy`; frontend only calls `signIn.social({ provider: 'google' })`
