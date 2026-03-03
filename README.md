# 🌿 EcoWaste

**Fixing India's broken waste accountability loop — one GPS-verified pickup at a time.**

India generates 62 million tonnes of waste per year. Only 11.9 million tonnes gets processed correctly. The problem isn't awareness — it's accountability. Citizens report, nothing happens, they stop. Kabadiwallas have no reliable income or routing. Municipalities have no real-time data.

EcoWaste closes this loop with a **dual-GPS verification system**: citizens request pickups, kabadiwallas confirm quality on-site, and both GPS signals are cross-referenced automatically. No human review layer. Correct segregation earns cashback. Fraud is statistically detectable.

---

## 📑 Table of Contents

- [How It Works](#-how-it-works)
- [Project Status](#-project-status)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup Guide](#-setup-guide)
  - [Backend](#1-backend)
  - [Mobile App](#2-mobile-app-expo)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Key Features](#-key-features)
- [App Screens](#-app-screens)
- [Trust Engine](#-trust-engine)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔄 How It Works

```
Citizen photographs waste → AI classifies type → Citizen requests pickup
       ↓                                                    ↓
GPS point A recorded                          Kabadiwalla accepts & arrives
       ↓                                                    ↓
       └──────────── Both GPS verified ────────────────────┘
                            ↓
              Cross-reference: distance < 50m? ✓
              Dwell time > 3 min? ✓
              Quality rating submitted? ✓
                            ↓
                  Composite trust score calculated
                            ↓
              Cashback released to citizen wallet
              Payment released to kabadiwalla
```

---

## 🚧 Project Status

Currently, the frontend MVP is structurally complete, and the core backend is built. Some backend integration is still pending.

**Frontend (Mobile App)**: Fully built and functional
- UI and navigation built for all 4 roles (Citizen, Kabadiwalla, Municipality, Admin)
- Native device integration completed (Camera, Location, Push Notifications)
- AI Waste Classification fully integrated in the Citizen reporting flow
- Dual-GPS Verification engine built (Calculates composite Trust Score based on distance, dwell time, and ratings)
- Offline support and syncing logic implemented

**Backend (API)**: Core built, pickup routes pending
- **Auth, Reports, Facilities, Rewards**: Fully functional with MongoDB and JWT
- **AI Classification**: Integrated with Google Gemini API
- **Pickup Verification**: Pending. The frontend has the Trust Engine logic ready, but the backend requires new CRUD routes (`/api/pickups/*`) to handle pickup requests, confirmations, and the cross-referencing for the final Trust Score validation.
- **Media Hosting**: The app expects **Cloudinary** for hosting the Citizen segregation training videos and waste report image uploads (currently the backend uses local memory/disk storage).
- **Maps**: Missing Google Maps API Key integration in the map views.

---

## 🛠 Tech Stack

### Mobile App (Frontend)

| Technology | Purpose |
|---|---|
| **Expo SDK 54** | React Native framework with managed workflow |
| **Expo Router v6** | File-based routing with typed navigation |
| **React 19** | UI rendering |
| **TypeScript 5.9** | Type safety |
| **NativeWind 4** | Tailwind CSS for React Native |
| **Zustand 5** | Lightweight state management |
| **React Hook Form + Zod** | Form validation |
| **Axios** | HTTP client with JWT interceptor |
| **expo-camera** | Waste photography for AI classification |
| **expo-location** | GPS capture for verification |
| **expo-notifications** | Push notification handling |
| **expo-secure-store** | Secure JWT & token persistence |
| **react-native-maps** | Map display for pickup routing |
| **@shopify/flash-list** | Performant scrollable lists |
| **Cloudinary** | Hosting for segregation training videos & tutorial guides |

### Backend

| Technology | Purpose |
|---|---|
| **Express 5** | REST API framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT + bcryptjs** | Authentication & password hashing |
| **Google Generative AI** | Waste type classification via Gemini |
| **Multer** | Image upload handling |
| **TypeScript** | Type safety |

---

## 📁 Project Structure

```
EcoWaste/
│
├── app/                          # Expo Router — all screens
│   ├── _layout.tsx               # Root layout (auth hydration, toast, push)
│   ├── index.tsx                 # Smart redirect by role
│   ├── +not-found.tsx            # 404 screen
│   │
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx             # Email/password login
│   │   ├── register.tsx          # Registration with role picker
│   │   └── onboarding.tsx        # 3-slide intro (segregation training)
│   │
│   ├── (citizen)/                # Citizen experience
│   │   ├── index.tsx             # Dashboard (EcoScore, streak, wallet)
│   │   ├── report.tsx            # Camera → AI classify → submit
│   │   ├── pickup.tsx            # Find & request nearby kabadiwallas
│   │   ├── pickup/[id].tsx       # Track pickup status + rate
│   │   ├── profile.tsx           # Profile, stats, logout
│   │   ├── training.tsx          # 5-module segregation training
│   │   └── facilities.tsx        # Nearby recycling facilities
│   │
│   ├── (kabadiwalla)/            # Kabadiwalla experience
│   │   ├── index.tsx             # Today's route + incoming requests
│   │   ├── confirm/[id].tsx      # Confirm pickup (quality + GPS)
│   │   ├── earnings.tsx          # Earnings dashboard
│   │   └── onboarding.tsx        # Service area + UPI setup
│   │
│   ├── (municipality)/           # Municipality ward dashboard
│   │   ├── index.tsx             # Metrics, alerts, navigation
│   │   ├── reports.tsx           # Verified reports table + CSV export
│   │   └── analytics.tsx         # Charts & street compliance
│   │
│   └── (admin)/                  # Admin panel
│       ├── index.tsx             # Navigation hub
│       ├── flags.tsx             # Anomaly flags (fraud detection)
│       └── kabadiwallas.tsx      # Kabadiwalla directory
│
├── src/                          # Frontend business logic
│   ├── components/
│   │   ├── shared/               # EcoScoreCard, Toast, PickupCard, etc.
│   │   ├── forms/                # LoginForm, RegisterForm, ReportForm, ConfirmPickupForm
│   │   ├── native/               # CameraCapture, LocationCapture, MapPickupView
│   │   └── web/                  # DataTable, ComplianceChart, ExportButton
│   │
│   ├── constants/                # colors, config, wasteTypes, routes, qualityThresholds
│   ├── hooks/                    # useAuth, usePickup, useLocation, useCamera, useOfflineQueue
│   ├── services/                 # api.ts, auth, report, pickup, facility, user, municipality
│   ├── stores/                   # Zustand: authStore, pickupStore, locationStore, uiStore
│   ├── types/                    # user, report, pickup, api, navigation type definitions
│   └── utils/                    # formatters, gpsUtils, scoreUtils, permissions, storage
│
├── Backend/                      # Express REST API
│   ├── server.ts                 # Entry point
│   └── src/
│       ├── app.ts                # Express app setup (cors, routes)
│       ├── controller/           # auth, wasteType (AI), rewards
│       ├── db/                   # MongoDB connection
│       ├── middleware/           # JWT auth middleware
│       ├── models/               # User, Report, Facilities (Mongoose schemas)
│       ├── routes/               # auth, report, facilities, rewards
│       └── service/              # AI service (Gemini integration)
│
├── assets/                       # Images, icons, splash screens
├── app.json                      # Expo config (permissions, plugins)
├── tailwind.config.js            # NativeWind theme (colors, fonts)
├── tsconfig.json                 # TypeScript config (@ → ./src/)
├── metro.config.js               # Metro bundler + NativeWind
└── package.json                  # Dependencies & scripts
```

---

## ✅ Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- **Expo Go** app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- **Google AI API Key** for waste classification ([Get one here](https://aistudio.google.com/apikey))

---

## 🚀 Setup Guide

### 1. Backend

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Google AI API key

# Start development server
npm run dev
```

The backend starts at `http://localhost:4000`.

### 2. Mobile App (Expo)

```bash
# From project root
cd ..    # back to EcoWaste/

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env — set EXPO_PUBLIC_API_URL to your backend URL

# Start Expo dev server
npx expo start
```

Then:
- **Phone**: Scan the QR code with Expo Go
- **Android Emulator**: Press `a`
- **iOS Simulator**: Press `i`
- **Web**: Press `w`

---

## 🔐 Environment Variables

### Mobile App (`/.env`)

| Variable | Description | Example |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `http://192.168.1.5:4000` |
| `EXPO_PUBLIC_GOOGLE_MAPS_KEY` | Google Maps API key | `AIza...` |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (image hosting) | `your-cloud` |

### Backend (`/Backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `4000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing JWTs | `random-secure-string` |
| `GOOGLE_AI_API_KEY` | Gemini API key for waste classification | `AIza...` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

---

## 📜 Available Scripts

### Mobile App

| Script | Command | Description |
|---|---|---|
| Start | `npx expo start` | Launch Expo dev server |
| Android | `npm run android` | Open on Android emulator |
| iOS | `npm run ios` | Open on iOS simulator |
| Web | `npm run web` | Open in browser |
| Lint | `npm run lint` | Run ESLint |

### Backend

| Script | Command | Description |
|---|---|---|
| Dev | `npm run dev` | Start with nodemon (auto-reload) |
| Start | `npm start` | Start with ts-node |
| Build | `npm run build` | Compile TypeScript |

---

## ⭐ Key Features

### For Citizens
- 📸 **AI Waste Classification** — Photograph waste, AI identifies the type automatically
- 🚲 **One-Tap Pickup Request** — Find nearby kabadiwallas on a map, request with one tap
- 💰 **Cashback Rewards** — Earn real money for correct segregation (withdraw via UPI)
- 📊 **EcoScore Dashboard** — Track your segregation score, streaks, and impact
- 🎓 **Segregation Training** — 5-module training before first pickup (wet / dry / hazardous)
- 📍 **GPS-Verified Pickups** — Your location is captured automatically for trust verification

### For Kabadiwallas
- 🗺️ **Smart Routing** — Optimized daily pickup route
- ✅ **One-Tap Confirmation** — Rate segregation quality (Good / Acceptable / Poor)
- 💵 **Transparent Earnings** — Daily, weekly, monthly earnings dashboard
- 📈 **Trust Score** — Higher score = more pickup requests

### For Municipalities
- 📊 **Ward-Level Dashboard** — Verified pickups, quality scores, compliance rates
- 📋 **Reports Table** — Filterable, exportable (CSV) report data
- 📈 **Analytics** — Weekly trends, quality distribution, top/bottom streets
- 🚨 **Compliance Alerts** — Automatic alerts for low-performing areas

### For Admins
- 🚩 **Anomaly Detection** — 6 fraud types flagged automatically (GPS spoof, collusion, etc.)
- 👤 **Kabadiwalla Directory** — Verification status, accuracy, on-time metrics

---

## 📱 App Screens

| Role | Screens |
|---|---|
| **Auth** | Login, Register (with Citizen/Kabadiwalla role picker), Onboarding |
| **Citizen** | Home Dashboard, Report Waste, Request Pickup, Pickup Tracking, Profile, Training, Facilities |
| **Kabadiwalla** | Today's Route, Confirm Pickup, Earnings, Onboarding |
| **Municipality** | Ward Dashboard, Verified Reports, Analytics |
| **Admin** | Panel Home, Anomaly Flags, Kabadiwalla Directory |

---

## 🛡 Trust Engine

The core innovation. Every confirmed pickup generates a **composite trust score** from 4 independent signals:

| Signal | Weight | What It Measures |
|---|---|---|
| GPS Proximity | 30% | Were citizen and kabadiwalla within 50m? |
| Dwell Time | 20% | Did kabadiwalla stay ≥ 3 minutes? |
| Quality Rating | 25% | Segregation quality (Good/Acceptable/Poor) |
| Cross-Rating | 25% | Do citizen and kabadiwalla ratings agree? |

**Fraud becomes statistically detectable** — GPS spoofing, rating inflation, and collusion all create anomalies the system flags automatically.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create account |
| POST | `/login` | Login (returns JWT) |
| GET | `/verify` | Verify JWT token |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| POST | `/report/image` | Submit waste report with image |
| GET | `/report/list` | Get user's reports |

### Facilities
| Method | Endpoint | Description |
|---|---|---|
| GET | `/facilities` | List all facilities |
| GET | `/facilities/search` | Search by state/rating |

### Rewards
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leaderboard` | Get leaderboard |
| GET | `/api/user` | Get user dashboard |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
