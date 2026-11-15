# Elder Care Form - Clinical Medication & Care Management Portal

> Built with React, Vite, Tailwind CSS, and Lucide Icons. Designed with Clinical Modern & High-Contrast principles for elderly accessibility, dynamic patient profiling, and proactive caregiver oversight.

---

## 🌟 Key Architecture & Features

### 1. Dual-Interface Architecture
- **Elderly Senior View (Default: Arthur Pendelton, 74)**:
  - Clinical Modern slate-blue (`#0F172A` / `#1E293B`) and crisp white palette.
  - Oversized typography (18px–24px body text, 32px–48px headings).
  - Extra-large touch targets (64px–80px touch buttons).
  - Single-screen daily view with zero clutter.
  - Color-coded status badges: **Emerald Green (Taken)**, **Amber Yellow (Upcoming)**, and **Crimson Red (Missed)**.
  - One-tap **"MARK AS TAKEN"** buttons with speech synthesis audio confirmation.
  - Text-to-speech audio reader (`window.speechSynthesis`) for clear directions.
  - Prominent **"NEED HELP? Alert Caretaker"** emergency SOS button.

- **Caretaker & Family Dashboard (Default: Sarah Jenkins & David Pendelton)**:
  - Enterprise clinical sidebar navigation with real-time adherence analytics and 7-day trend chart.
  - Complete Medication Schedule & Pharmacy Stock Tracker with low-stock warnings.
  - Doctor Appointments manager with clinic addresses and fasting/prep instructions.
  - Interactive **Email Alert Outbox** showing real-time automated notifications.
  - Security & 4-digit PIN management with instant reset to clinical defaults.

### 2. Dynamic, Editable Names & Diagnosed Medical Conditions
- **No Hardcoded Names**: Clean Western clinical defaults (Arthur Pendelton, Sarah Jenkins, David Pendelton) with quick inline/modal editing.
- **Interactive Diagnosed Condition(s) / Medical Profile**: Enter, add, or edit conditions (e.g., Hypertension, Type-2 Diabetes, or any custom diagnosis).
- **Linked to AI Routine Advisor**: Clinical insights dynamically adapt to the patient's entered diagnoses in real time.

### 3. Open Directly on Login Page with Judge Quick-Start Guide
- Opens first on the authoritative, Mayo Clinic / Cleveland Clinic styled Login Portal.
- Structured **"Judge & Evaluator Quick-Start Guide"** right on the login screen.
- Clickable demo passcodes with 1-click login:
  - `1111` : Senior Mode
  - `2222` : Caretaker Dashboard
  - `3333` : Family Member Monitor

### 4. Proactive Automated Email Alert System
- Interactive slide-over **Alert Outbox & Email Drawer**.
- **"Simulate Missed Dose"** button in top navbar and outbox for immediate judge evaluation.
- Real-time logging of missed doses, taken doses, upcoming due reminders, appointments, and SOS emergencies.

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

Visit the app at `http://localhost:3000`.
