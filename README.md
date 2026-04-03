# 💊 TelliMeds — Smart Medicine Management

A modern web application that helps users and their families manage daily medications with smart reminders, intake tracking, and caregiver alerts.

> **Problem:** People forget or mismanage medicines, leading to missed doses and health complications.  
> **Solution:** TelliMeds provides a clean, accessible interface for scheduling medicines, logging intake, and notifying caregivers — designed for all age groups.

---

## ✨ Features

### Core
- **Medicine Management** — Add, view medicines with dosage, time, frequency, and meal instructions (before/after food)
- **Intake Tracking** — Mark doses as Taken or Skipped with one tap
- **Dashboard** — Today's schedule, stats, and adherence percentage at a glance

### Reminders & Notifications
- **Push Notifications** — Browser push via Firebase Cloud Messaging (FCM)
- **Caregiver Alerts** — Add a caregiver email to receive alerts on missed doses

### Views & Settings
- **Calendar View** — Navigate months, see activity dots per day, drill into any date
- **Prescription Upload** — Upload and store prescription images/PDFs via Supabase Storage
- **Dark Mode** — Switchable light/dark theme persisted in localStorage
- **Settings** — Notification preferences, time format, language, caregiver setup

### Auth
- **Sign Up / Sign In / Sign Out** — Powered by Supabase Auth (email + password)
- **Row Level Security** — Each user only sees their own data

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, CSS Variables (design tokens) |
| Font | Inter (via `next/font`) |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth (JWT / Row Level Security) |
| Notifications | Firebase Cloud Messaging (FCM) |
| Storage | Supabase Storage (prescriptions) |
| Deployment | Vercel (recommended) |

---

## 📁 Project Structure

```
TelliMeds/
├── public/
│   └── firebase-messaging-sw.js   # FCM service worker
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── medicines/route.ts  # Medicines API
│   │   │   └── intake/route.ts     # Dose logging API
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Dashboard (today's schedule)
│   │   │   ├── layout.tsx          # Sidebar navigation
│   │   │   ├── calendar/page.tsx   # Calendar view
│   │   │   ├── settings/page.tsx   # Settings & caregiver
│   │   │   └── prescriptions/page.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── medicine/add/page.tsx
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Design tokens
│   ├── components/
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/
│   │   └── AuthContext.tsx         # Supabase Auth state
│   └── lib/
│       ├── supabase.ts             # Supabase client
│       ├── firebase.ts             # Firebase/FCM init
│       └── utils.ts
├── .env.local                      # Environment variables (not committed)
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A [Supabase](https://supabase.com/) project (free tier works)
- A [Firebase](https://console.firebase.google.com/) project (for push notifications)

### 1. Clone & Install

```bash
git clone https://github.com/Sankalp107/TelliMeds.git
cd TelliMeds
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the database schema:

```sql
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name text, age integer, medical_notes text
);

CREATE TABLE public.medicines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL, dosage text NOT NULL, time text NOT NULL,
  frequency text DEFAULT 'daily', instructions text DEFAULT 'no-preference',
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE public.dose_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id uuid REFERENCES public.medicines ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status text NOT NULL, logged_at timestamptz DEFAULT now() NOT NULL,
  scheduled_for date NOT NULL
);
```

3. Enable **Row Level Security** and add policies (see `supabase_schema.md` for full SQL)
4. Go to **Authentication → Providers → Email** and optionally disable "Confirm email" for development

### 3. Set Up Firebase (for push notifications)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Add a **Web App** and copy the config
3. Go to **Project Settings → Cloud Messaging** → Generate a VAPID key
4. Update `public/firebase-messaging-sw.js` with your Firebase config

### 4. Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

> Screenshots coming soon — Sign up, add a medicine, and view the dashboard to see the app in action.

---

## 🗺 Roadmap

- [ ] Email reminder fallback (Supabase Edge Functions)
- [ ] Prescription OCR (extract medicine details from images)
- [ ] Multiple family profiles under one account
- [ ] Weekly/monthly adherence reports
- [ ] Mobile app (React Native / PWA)

---

## 📄 License

This project is for educational and personal use.

---

Built with ❤️ for better health management.
