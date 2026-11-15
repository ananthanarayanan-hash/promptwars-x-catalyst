import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getDb } from "../db/init.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM profiles ORDER BY name").all();
  res.json(rows);
});

router.get("/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM profiles WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Profile not found." });
  res.json(row);
});

router.post("/", (req, res) => {
  const db = getDb();
  const { name, dob, phone, emergency_contact, notes } = req.body;
  if (!name) return res.status(400).json({ error: "name is required." });
  const id = uuid();
  db.prepare(
    `INSERT INTO profiles (id, name, dob, phone, emergency_contact, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, dob || null, phone || null, emergency_contact || null, notes || null, new Date().toISOString());
  res.status(201).json(db.prepare("SELECT * FROM profiles WHERE id = ?").get(id));
});

router.put("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM profiles WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Profile not found." });
  const { name, dob, phone, emergency_contact, notes } = req.body;
  db.prepare(
    `UPDATE profiles SET name=?, dob=?, phone=?, emergency_contact=?, notes=? WHERE id=?`
  ).run(
    name ?? existing.name,
    dob ?? existing.dob,
    phone ?? existing.phone,
    emergency_contact ?? existing.emergency_contact,
    notes ?? existing.notes,
    req.params.id
  );
  res.json(db.prepare("SELECT * FROM profiles WHERE id = ?").get(req.params.id));
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM profiles WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Profile not found." });
  db.prepare("DELETE FROM profiles WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

export default router;