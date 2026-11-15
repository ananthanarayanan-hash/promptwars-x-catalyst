# Elder Care Form

Elder Care Form is a responsive React, Vite, and Tailwind CSS demonstration for elderly medication routines, family adherence updates, and staff care coordination.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; preview it with `npm run preview`. Vite writes the deployable site to `dist/`. Deploy this directory to Netlify. `public/_redirects` includes the SPA fallback.

## Features

- Separate elderly, family, and medical staff name-and-email entry flows; no passwords or PINs.
- Staff-only manual patient registration.
- One-click judge mode with rotating sample clinical cases and role-view switching.
- Medication schedule, adherence status, appointments, diagnosis-aware routine insights, and an email alert outbox.
- Local demo data saved in browser `localStorage`; each fresh browser session opens at login.

## Demo data and email notice

Judge-mode names, medications, email addresses, and clinical conditions are fictional sample data. The email outbox is a local demonstration queue; this frontend does not deliver email. Connect a secured server-side email service before using alerts in production. Do not enter real patient health information in this demo: browser storage is not a secure medical record system, and the sample insights are not medical advice.

## Deployment

Use the project directory as the Netlify base directory when this repository contains other projects. Build command: `npm run build`. Publish directory: `dist`.
