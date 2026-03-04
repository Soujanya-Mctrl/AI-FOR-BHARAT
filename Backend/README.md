# EcoWaste Backend

A smart, automated trust and safety engine for municipal waste management.

## Project Status

The project has recently undergone a major architectural upgrade to support an automated **Trust Engine**. The core scaffolding for these systems is now built and wired up, focusing on handling automated verifications and intelligent edge-case reasoning without requiring a huge human moderation team.

**Currently Implemented:**
- **Data Foundation:** Upgraded User profiles (streaks, penalty tracking, segregation scores) and detailed Pickup tracking.
- **The Core Trust Engine**: A lightweight check system (`crossReference.service`) that validates a pickup objectively against timestamps and GPS traces to either auto-release or hold kabadiwalla payouts.
- **AI Agent Layers:** 4 distinct Gemini-powered agents have been integrated:
    1. **Segregation Coach:** Personalised push notifications identifying specific waste mixing mistakes.
    2. **Anomaly Investigator:** Reasons logically over flagged accounts and queues suspensions.
    3. **Route Optimizer:** Provides daily TSP-optimized push routes for kabadiwallas.
    4. **Municipality Briefing:** Condenses raw metrics into actionable, plain-English weekly briefings for government officials.
- **Scheduled Background Jobs:** Nightly data recalculations and weekly payout batching are active via `node-cron`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables (`.env`):
   Ensure your `.env` contains:
   ```
   PORT=4000
   MONGODB_URI=your_mongo_connection_string
   CORS_ORIGIN=http://localhost:3000
   GEMINI_API_KEY=your_google_ai_key
   # other secret keys (Better Auth, Razorpay, etc)
   ```

3. Run Development Server
   ```bash
   npm run dev
   ```

## Architecture Map

- `src/models/` — MongoDB Schemas (Users, Pickups, Flags, Investigations)
- `src/service/` — Core hardcoded business logic (Trust Engine, Payouts, Notifications)
- `src/agents/` — Dynamic reasoning workflows (Gemini 2.5)
- `src/jobs/` — Scheduled system-wide actions (Cron)
- `src/controller/` & `src/routes/` — Express endpoints and routing

*Developed to operate autonomously, reserving human interaction exclusively for `SUSPEND_PENDING_REVIEW` cases.*
