import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { getDb } from "./db/init.js";
import { startScheduler, stopScheduler } from "./services/scheduler.js";

import profilesRoutes from "./routes/profiles.js";
import medicationsRoutes from "./routes/medications.js";
import dosesRoutes from "./routes/doses.js";
import appointmentsRoutes from "./routes/appointments.js";
import caregiversRoutes from "./routes/caregivers.js";
import remindersRoutes from "./routes/reminders.js";

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check (no auth).
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "catalyst-care", env: config.nodeEnv, simulationMode: config.simulationMode });
});

// Public auth probe.
app.use("/api/caregivers", caregiversRoutes);

// Protected routes.
app.use("/api/profiles", profilesRoutes);
app.use("/api/medications", medicationsRoutes);
app.use("/api/doses", dosesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/reminders", remindersRoutes);

// 404 + error handler.
app.use((req, res) => res.status(404).json({ error: "Not found." }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error." });
});

// Boot.
const db = getDb();
const server = app.listen(config.port, () => {
  console.log(`[catalyst] listening on http://localhost:${config.port} (simMode=${config.simulationMode})`);
  startScheduler();
});

// Graceful shutdown.
const shutdown = () => {
  console.log("[catalyst] shutting down...");
  stopScheduler();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;