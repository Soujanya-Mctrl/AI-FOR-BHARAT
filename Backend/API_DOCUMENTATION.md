# 🌿 EcoWaste Management System — API Documentation

**Base URL:** `http://localhost:5000/api/v1`

**Authentication:** JWT Bearer token via `Authorization: Bearer <token>` header or `token` HTTP-only cookie.

**Standard Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": 401,
    "message": "Unauthorized"
  }
}
```

---

## System Overview

> EcoWaste is a two-sided marketplace connecting citizens to kabadiwallas. Citizens segregate waste correctly, photograph it, and schedule a pickup. Kabadiwallas confirm the pickup on-site with GPS auto-captured. The cross-reference engine compares both GPS streams, checks dwell time, and validates rating patterns to generate a trust score automatically. Above 70 — payment releases. Below 70 — flagged for the anomaly agent. Four Gemini agents handle coaching, fraud investigation, route optimisation, and municipality briefings. Municipalities get a compliance dashboard with verified ward-level data. The only human touchpoint is an admin reviewing high-confidence suspension cases. Everything else is automated.

### The Four Actors

| Actor | Role | Earns |
|-------|------|-------|
| **Citizen** | Generates waste, photographs it, schedules pickup | Cashback |
| **Kabadiwalla** | Collects waste, confirms on-site | UPI payment |
| **Municipality** | Views verified compliance data | — |
| **Admin** | Reviews suspension edge cases only | — |

---

## 📋 Table of Contents

| # | Group | Base Path | Auth |
|---|-------|-----------|------|
| 1 | [Auth](#1-auth) | `/auth` | ❌ Public (rate-limited) |
| 2 | [Users](#2-users) | `/users` | ✅ Any |
| 3 | [Reports](#3-reports) | `/reports` | ✅ Any |
| 4 | [Pickups](#4-pickups) | `/pickups` | ✅ Role-based |
| 5 | [Verification](#5-verification) | `/verification` | ✅ Any |
| 6 | [Trust](#6-trust) | `/trust` | ✅ Any / Admin |
| 7 | [Kabadiwalla](#7-kabadiwalla) | `/kabadiwalla` | ✅ Kabadiwalla |
| 8 | [Municipality](#8-municipality) | `/municipality` | ✅ Municipality / Admin |
| 9 | [Notifications](#9-notifications) | `/notifications` | ✅ Admin |
| 10 | [Admin](#10-admin) | `/admin` | ✅ Admin |

---

## 1. Auth

> Rate limited: 5 requests / 15 minutes

### `POST /auth/register`

Register a new user account.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "ecowarrior",
  "role": "citizen"
}
```

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `email` | string | ✅ | Valid email |
| `password` | string | ✅ | Min 8 chars |
| `username` | string | ✅ | Display name |
| `role` | string | ✅ | `citizen`, `kabadiwalla`, `municipality`, `admin` |

**Response (201):**
```json
{
  "data": {
    "user": { "_id": "...", "email": "...", "role": "citizen" },
    "token": "jwt.token.here"
  },
  "message": "Registration successful"
}
```

**Notes:** Password is hashed with bcrypt (10 rounds). JWT is also set as `httpOnly` cookie.

---

### `POST /auth/login`

Authenticate with existing credentials.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):** Same shape as register.

---

### `POST /auth/logout`

Clear the authentication cookie.

**Response (200):**
```json
{ "data": null, "message": "Logged out successfully" }
```

---

## 2. Users

> 🔒 All endpoints require authentication

### `GET /users/profile`

Get the authenticated user's profile.

**Response (200):**
```json
{
  "data": {
    "_id": "...",
    "email": "user@example.com",
    "username": "ecowarrior",
    "role": "citizen",
    "trustScore": 50,
    "createdAt": "2026-01-15T..."
  }
}
```

---

### `PUT /users/profile`

Update profile fields.

**Body:** Any updatable user fields (`username`, `phoneNumber`, etc.)

---

### `GET /users/pickup-history`

Get the authenticated user's pickup history.

---

## 3. Reports

> 🔒 All endpoints require authentication

### `POST /reports`

Create a new waste report with image upload. AI classifies the waste type via Gemini.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | ✅ | Waste image (jpg/png, max 5MB) |
| `description` | string | ✅ | Description of the waste |
| `location.lat` | number | ✅ | Latitude |
| `location.lng` | number | ✅ | Longitude |
| `location.address` | string | ✅ | Human-readable address |

**Response (201):**
```json
{
  "data": {
    "_id": "...",
    "status": "pending",
    "imageUrl": "https://...",
    "classification": {
      "wasteType": "plastic",
      "emoji": "♻️"
    }
  },
  "message": "Report created"
}
```

**How it works:**
1. Image uploaded to Cloudinary
2. Gemini AI classifies waste type from the image
3. Report saved with `pending` status
4. Cross-reference engine can later verify it

---

### `GET /reports`

Get the authenticated user's own reports.

### `GET /reports/filter/status?status=pending`

Filter reports by status: `pending` · `investigating` · `resolved` · `verified`

### `GET /reports/area/:pincode`

Get all reports in a specific area by pincode.

### `GET /reports/:id`

Get a single report by ID.

### `PATCH /reports/:id/status`
> 🔒 Roles: `admin`, `municipality`

Update report status.

**Body:**
```json
{ "status": "investigating" }
```

---

## 4. Pickups

> 🔒 All endpoints require authentication. Role-guards applied as noted.

### Citizen Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/pickups` | Create a pickup request |
| `GET` | `/pickups/nearby-kabadiwallas` | Find nearby kabadiwallas |
| `GET` | `/pickups/history/citizen` | Citizen's pickup history |
| `PATCH` | `/pickups/:id/cancel` | Cancel a pickup |
| `POST` | `/pickups/:id/rate` | Rate a completed pickup |

#### `POST /pickups` — Create Pickup

**Body:**
```json
{
  "wasteType": "plastic",
  "estimatedWeight": 5,
  "address": {
    "street": "MG Road",
    "city": "Pune",
    "pincode": "411001",
    "coordinates": { "lat": 18.52, "lng": 73.85 }
  },
  "scheduledTime": "2026-03-10T10:00:00Z"
}
```

### Kabadiwalla Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/pickups/kabadiwalla/pending` | View pending pickup requests |
| `GET` | `/pickups/history/kabadiwalla` | Kabadiwalla's pickup history |
| `GET` | `/pickups/kabadiwalla/route` | AI-optimized collection route |
| `PATCH` | `/pickups/:id/accept` | Accept a pickup |
| `PATCH` | `/pickups/:id/decline` | Decline a pickup |
| `POST` | `/pickups/:id/confirm` | Confirm completion (with proof photo) |

#### `POST /pickups/:id/confirm` — Confirm Pickup

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `image` | File | Proof photo of collected waste |

**How it works:**
1. Kabadiwalla uploads proof photo with GPS auto-captured
2. Cross-reference engine compares citizen GPS + kabadiwalla GPS + dwell time
3. Trust score updated automatically
4. Trust ≥ 70 → Payment auto-released via UPI
5. Trust < 70 → Flagged for anomaly agent investigation

### Shared

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/pickups/:id` | Get a pickup by ID |

---

## 5. Verification

> 🔒 Requires authentication

### `POST /verification/trigger/:reportId`

Trigger automated cross-reference verification for a waste report.

**How it works:**
1. Collects signals: GPS match, dwell time, rating patterns, image similarity
2. Generates an overall confidence score
3. If anomalies detected → invokes `anomalyInvestigator` AI agent
4. May auto-create `AnomalyFlag` records
5. High-confidence fraud → auto-suspension (admin reviews)

**Response (200):**
```json
{
  "data": {
    "overallScore": 85,
    "anomalyFlags": [],
    "reportId": "..."
  },
  "message": "Verification triggered"
}
```

---

## 6. Trust

> 🔒 Requires authentication

### `GET /trust/:id`

Get a user's trust score and history.

**Response (200):**
```json
{
  "data": {
    "userId": "...",
    "currentScore": 78,
    "history": [
      { "change": +5, "reason": "Completed 10 pickups", "date": "..." }
    ]
  }
}
```

**How trust works:**
- Starts at 50 for new users
- Auto-updated after each pickup verification
- ≥ 70 = payment auto-releases
- < 70 = flagged for anomaly agent
- Only admin can manually adjust

---

### `PATCH /trust/:id`
> 🔒 Role: `admin`

Manually adjust a user's trust score.

**Body:**
```json
{
  "amount": -10,
  "reason": "Late delivery pattern detected"
}
```

---

## 7. Kabadiwalla

> 🔒 All endpoints: Role `kabadiwalla`

### `GET /kabadiwalla/earnings`

Get earnings summary (total, this week, pending UPI payout).

**Response (200):**
```json
{
  "data": {
    "totalEarnings": 15000,
    "thisWeek": 3500,
    "pendingPayout": 2000
  }
}
```

### `GET /kabadiwalla/service-areas`

Get assigned service areas and coverage zones.

### `POST /kabadiwalla/verify-documents`

Submit KYC documents (Aadhaar, UPI ID) for payout eligibility.

**Body:**
```json
{
  "aadhaar": "1234-5678-9012",
  "upiId": "kabadiwalla@upi"
}
```

---

## 8. Municipality

> 🔒 Roles: `municipality`, `admin`

### `GET /municipality/dashboard?ward=ward_01`

Get aggregated compliance dashboard for a ward.

**Response (200):**
```json
{
  "data": {
    "totalReports": 245,
    "resolvedReports": 198,
    "activePickups": 12,
    "wasteCollectedKg": 3450,
    "topWasteTypes": ["plastic", "organic"]
  }
}
```

### `GET /municipality/compliance/export`

> Rate limited: 10 requests / hour

Download a compliance report as PDF.

**Response:** Binary PDF, `Content-Type: application/pdf`

---

## 9. Notifications

> 🔒 Role: `admin`

### `POST /notifications/send`

Send a push notification to a specific user.

**Body:**
```json
{
  "userId": "target_user_id",
  "title": "Pickup Reminder",
  "body": "Your scheduled pickup is tomorrow at 10 AM"
}
```

---

## 10. Admin

> 🔒 All endpoints: Role `admin`

### `GET /admin/stats`

Get system-wide statistics.

**Response (200):**
```json
{
  "data": {
    "totalUsers": 12450,
    "totalReports": 8730,
    "totalPickups": 5200,
    "activeAnomalies": 3,
    "wasteCollectedKg": 45000
  }
}
```

### `PATCH /admin/users/:userId/suspend`

Suspend a user account (used only for high-confidence fraud cases flagged by the anomaly agent).

### `GET /admin/export/users`

> Rate limited: 10 requests / hour

Export all user data as CSV.

---

## 🤖 AI Agents (Internal — No Direct API)

These agents are triggered internally by the system, not via API calls.

| Agent | Trigger | What it does |
|-------|---------|-------------|
| **Anomaly Investigator** | Trust score drops below 70 | Investigates flagged pickups using Gemini, recommends suspension |
| **Segregation Coach** | Pickup completed | Sends personalized waste segregation coaching tips to citizen |
| **Route Optimizer** | Kabadiwalla requests route | Calculates optimal TSP-based collection route for the day |
| **Municipality Briefing** | Daily cron (8 AM) | Auto-generates ward-level compliance briefings |

---

## ⏰ Cron Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| Quality Recalculation | 3 AM daily | Re-scores citizen and kabadiwalla quality metrics |
| Weekly Payout | 9 AM Fridays | Processes kabadiwalla UPI payouts for the week |
| Anomaly Scan | Daily | Scans for system-wide anomaly patterns |
| Municipality Briefing | Daily | Auto-generates daily compliance briefings |

---

## 🔧 Middleware Pipeline

```
Body Parser (10kb limit)
  → Cookie Parser
  → CORS
  → MongoDB Injection Sanitization
  → XSS Sanitization
  → Rate Limiter
  → Route Handler
  → Global Error Handler
```

### Rate Limit Tiers

| Tier | Limit | Window | Applied To |
|------|-------|--------|------------|
| General | 100 req | 15 min | All `/api` routes |
| Auth | 5 req | 15 min | `/auth/*` |
| Export | 10 req | 60 min | CSV/PDF export endpoints |

### Special Middleware

| Middleware | Applied To | Description |
|------------|-----------|-------------|
| `verifyGPS` | Pickup confirm | Validates GPS coordinates and proximity |
| `verifyTimeWindow` | Selective | Enforces operating hours (6 AM – 10 PM) |
| `uploadImage` | Report create, Pickup confirm | Multer + Cloudinary (5MB max, jpg/png) |
