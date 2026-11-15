import { Router } from "express";
import { getDb } from "../db/init.js";
import { tick, status as schedulerStatus } from "../services/scheduler.js";
import { verifyConnection, sendMail } from "../services/email.js";
import { config } from "../config.js";

const router = Router();

// Trigger a manual reminder sweep (great for demos).
router.post("/run", (req, res) => {
  const result = tick();
  res.json({ ok: true, ...result });
});

router.get("/status", async (req, res) => {
  const db = getDb();
  const counts = db.prepare(
    `SELECT
       SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN status='taken' THEN 1 ELSE 0 END) as taken,
       SUM(CASE WHEN status='missed' THEN 1 ELSE 0 END) as missed,
       COUNT(*) as total
     FROM doses`
  ).get();
  const recent = db.prepare(
    "SELECT id, type, recipient, subject, status, created_at FROM email_logs ORDER BY created_at DESC LIMIT 25"
  ).all();
  const emailCheck = await verifyConnection();
  res.json({
    scheduler: schedulerStatus(),
    email: { simulationMode: config.simulationMode, ...emailCheck },
    doses: counts,
    recentEmails: recent,
  });
});

router.get("/email-logs", (req, res) => {
  const db = getDb();
  res.json(
    db.prepare("SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 100").all()
  );
});

router.post("/email/test", async (req, res) => {
  const db = getDb();
  const profile = db.prepare("SELECT * FROM profiles LIMIT 1").get();
  if (!profile) return res.status(400).json({ error: "No profile to test with." });
  const result = await sendMail({
    to: req.body.to || "test@example.com",
    subject: "Catalyst Care - test reminder",
    body: `This is a test reminder from Catalyst Care for ${profile.name}.\n\nIf you received this, your email integration is working.`,
    type: "test",
    metadata: { test: true },
  });
  res.json(result);
});

export default router;