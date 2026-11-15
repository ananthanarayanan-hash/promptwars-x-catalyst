import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getDb } from "../db/init.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const { profile_id } = req.query;
  let sql = `SELECT a.*, p.name as profile_name FROM appointments a JOIN profiles p ON p.id = a.profile_id`;
  const params = [];
  if (profile_id) { sql += " WHERE a.profile_id = ?"; params.push(profile_id); }
  sql += " ORDER BY a.datetime";
  res.json(db.prepare(sql).all(...params));
});

router.post("/", (req, res) => {
  const db = getDb();
  const { profile_id, title, doctor, location, datetime, notes } = req.body;
  if (!profile_id || !title || !datetime) return res.status(400).json({ error: "profile_id, title and datetime are required." });
  const id = uuid();
  db.prepare(
    `INSERT INTO appointments (id, profile_id, title, doctor, location, datetime, notes, reminder_sent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`
  ).run(id, profile_id, title, doctor || null, location || null, datetime, notes || null, new Date().toISOString());
  res.status(201).json(db.prepare("SELECT * FROM appointments WHERE id = ?").get(id));
});

router.put("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM appointments WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Appointment not found." });
  const { title, doctor, location, datetime, notes } = req.body;
  db.prepare(
    `UPDATE appointments SET title=?, doctor=?, location=?, datetime=?, notes=? WHERE id=?`
  ).run(
    title ?? existing.title,
    doctor ?? existing.doctor,
    location ?? existing.location,
    datetime ?? existing.datetime,
    notes ?? existing.notes,
    req.params.id
  );
  res.json(db.prepare("SELECT * FROM appointments WHERE id = ?").get(req.params.id));
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM appointments WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Appointment not found." });
  db.prepare("DELETE FROM appointments WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

export default router;