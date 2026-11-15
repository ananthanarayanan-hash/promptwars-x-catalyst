# AarogyaCare - Elderly Care & Medication Management Platform

> Built with React, Vite, Tailwind CSS, and Lucide Icons. Designed with Clinical Modern & High-Contrast principles for elderly accessibility and proactive caregiver oversight.

---

## 🌟 Key Architecture & Features

### 1. Dual-Interface Architecture
- **Elderly Senior Mode (Ramesh Iyer, 74)**:
  - Clinical Modern slate-blue (`#0F172A` / `#1E293B`) and crisp white palette.
  - Oversized typography (18px–24px body text, 32px–48px headings).
  - Huge touch targets (64px–80px touch buttons).
  - Single-screen daily view with zero clutter.
  - Color-coded status badges: **Emerald Green (Taken)**, **Amber Yellow (Upcoming)**, and **Crimson Red (Missed)**.
  - One-tap **"MARK AS TAKEN"** buttons with speech synthesis audio confirmation.
  - Text-to-speech audio reader (`window.speechSynthesis`) for plain-language directions.
  - Prominent **"NEED HELP? Alert Caretaker Priya"** emergency SOS button.

- **Caretaker & Family Dashboard (Priya & Rahul Iyer)**:
  - Clinical sidebar navigation with real-time adherence analytics and 7-day trend chart.
  - Complete Medication Schedule & Pharmacy Stock Tracker with low-stock warnings.
  - Doctor Appointments manager with clinic addresses and fasting/prep instructions.
  - Interactive **Email Alert Outbox** showing real-time automated notifications.
  - Security & 4-digit PIN management with instant reset to Indian senior dataset.

### 2. Passcode-Based Role Access (PINs)
- **Demo Passcodes on Login Screen**:
  - `1111` : Senior Mode (Ramesh Iyer)
  - `2222` : Primary Caretaker (Priya Iyer)
  - `3333` : Family Member Monitor (Rahul Iyer)
- Tactile numeric keypad with shake feedback on incorrect PIN, plus 1-tap "Quick Access" buttons for judges.
- Customizable PINs in Settings.

### 3. Proactive Automated Email Alert System
- Interactive slide-over **Alert Outbox & Email Drawer**.
- Dispatches automated notifications for:
  - Missed doses
  - Taken doses logged on schedule
  - Upcoming doses due in 30 minutes
  - Doctor appointments
  - Critical emergency SOS triggers
- **"Simulate Missed Dose"** button available in the top navbar and outbox for immediate judge evaluation.

### 4. Smart Innovation: AI Care Insights & Drug Interaction Advisor
- **Pattern Recognition**: Analyzes real adherence data to detect delays (e.g. evening Rosuvas 10 delay due to late dinner) and suggests shifting routine to 8:45 PM.
- **Polypharmacy Drug-Drug Interaction Safety Engine**: Checks multi-drug combinations (Telmisartan + Spironolactone, Aspirin + Ibuprofen, Metformin + Linagliptin, etc.) with clinical mechanisms and plain-language guidance.
- **Senior Plain-Language Guidance**: Contextualized South Indian dietary advice (e.g. taking post-idli, avoiding bedtime curd with statins).

### 5. Zero-Database Offline Resilience
- Pre-populated with realistic Indian elderly patient data (**Ramesh Iyer, 74, Bengaluru**) stored in `localStorage`.
- Ready to run immediately on load.

---

## 🚀 Running the Project

```bash
# Navigate to the platform directory
cd elderly-care-platform

# Install dependencies
npm install

# Run Vite development server
npm run dev
```

Visit the app at `http://localhost:3000` (or the URL output by Vite).
