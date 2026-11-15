import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getDb } from "../db/init.js";
import { config } from "../config.js";
import { requirePasscode } from "../middleware/auth.js";

const router = Router();

// Public: verify a passcode is valid.
router.post("/verify", (req, res) => {
  const { passcode } = req.body;
  const ok = !!passcode && passcode === config.caregiverPasscode;
  res.json({ ok });
});

router.use(requirePasscode);

router.get("/", (req, res) => {
  const db = getDb();
  res.json(
    db.prepare("SELECT id, name, email, role, active, created_at FROM caregivers ORDER BY name").all()
  );
});

router.post("/", (req, res) => {
  const db = getDb();
  const { name, email, role, passcode } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email are required." });
  const id = uuid();
  db.prepare(
    `INSERT INTO caregivers (id, name, email, role, passcode, active, created_at)
     VALUES (?, ?, ?, ?, ?, 1, ?)`
  ).run(id, name, email, role || "family", passcode || config.caregiverPasscode, new Date().toISOString());
  res.status(201).json(db.prepare("SELECT id, name, email, role, active, created_at FROM caregivers WHERE id = ?").get(id));
});

router.put("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM caregivers WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Caregiver not found." });
  const { name, email, role, active, passcode } = req.body;
  db.prepare(
    `UPDATE caregivers SET name=?, email=?, role=?, active=?, passcode=? WHERE id=?`
  ).run(
    name ?? existing.name,
    email ?? existing.email,
    role ?? existing.role,
    active !== undefined ? (active ? 1 : 0) : existing.active,
    passcode ?? existing.passcode,
    req.params.id
  );
  res.json(db.prepare("SELECT id, name, email, role, active, created_at FROM caregivers WHERE id = ?").get(req.params.id));
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM caregivers WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Caregiver not found." });
  db.prepare("UPDATE caregivers SET active=0 WHERE id=?").run(req.params.id);
  res.status(204).end();
});

export default router;