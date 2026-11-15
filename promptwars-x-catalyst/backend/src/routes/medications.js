import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getDb } from "../db/init.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM medications ORDER BY created_at DESC").all();
  res.json(rows.map(deserialize));
});

router.get("/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM medications WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Medication not found." });
  res.json(deserialize(row));
});

router.post("/", (req, res) => {
  const db = getDb();
  const { profile_id, name, dosage, unit, schedule_type, times, start_date, end_date, with_food, caution } = req.body;
  if (!profile_id || !name || !dosage) return res.status(400).json({ error: "profile_id, name and dosage are required." });
  const id = uuid();
  const payload = {
    profile_id,
    name,
    dosage,
    unit: unit || "mg",
    schedule_type: schedule_type || "daily",
    times: Array.isArray(times) ? times : [],
    start_date: start_date || new Date().toISOString().slice(0, 10),
    end_date: end_date || null,
    with_food: with_food ? 1 : 0,
    caution: caution || null,
    active: 1,
    created_at: new Date().toISOString(),
  };
  db.prepare(
    `INSERT INTO medications (id, profile_id, name, dosage, unit, schedule_type, times, start_date, end_date, with_food, caution, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, payload.profile_id, payload.name, payload.dosage, payload.unit, payload.schedule_type,
    JSON.stringify(payload.times), payload.start_date, payload.end_date, payload.with_food, payload.caution, payload.active, payload.created_at);
  res.status(201).json(deserialize(db.prepare("SELECT * FROM medications WHERE id = ?").get(id)));
});

router.put("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM medications WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Medication not found." });
  const { name, dosage, unit, schedule_type, times, start_date, end_date, with_food, caution, active } = req.body;
  db.prepare(
    `UPDATE medications SET name=?, dosage=?, unit=?, schedule_type=?, times=?, start_date=?, end_date=?, with_food=?, caution=?, active=? WHERE id=?`
  ).run(
    name ?? existing.name,
    dosage ?? existing.dosage,
    unit ?? existing.unit,
    schedule_type ?? existing.schedule_type,
    times !== undefined ? JSON.stringify(times) : existing.times,
    start_date ?? existing.start_date,
    end_date !== undefined ? end_date : existing.end_date,
    with_food !== undefined ? (with_food ? 1 : 0) : existing.with_food,
    caution !== undefined ? caution : existing.caution,
    active !== undefined ? (active ? 1 : 0) : existing.active,
    req.params.id
  );
  res.json(deserialize(db.prepare("SELECT * FROM medications WHERE id = ?").get(req.params.id)));
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM medications WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Medication not found." });
  db.prepare("DELETE FROM medications WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

// Generate the dose schedule for a medication for a given date range.
router.post("/:id/schedule", (req, res) => {
  const db = getDb();
  const med = db.prepare("SELECT * FROM medications WHERE id = ?").get(req.params.id);
  if (!med) return res.status(404).json({ error: "Medication not found." });
  const { start_date, end_date } = req.body;
  const start = start_date || med.start_date;
  const end = end_date || med.end_date || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const times = JSON.parse(med.times || "[]");
  const created = [];
  const cur = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T23:59:59");
  const upsert = db.prepare(
    `INSERT INTO doses (id, medication_id, scheduled_at, status, taken_at, note)
     VALUES (?, ?, ?, 'pending', NULL, NULL)
     ON CONFLICT(medication_id, scheduled_at) DO UPDATE SET status='pending'`
  );
  while (cur <= endDate) {
    for (const t of times) {
      const iso = `${cur.toISOString().slice(0, 10)}T${t}:00`;
      upsert.run(uuid(), med.id, iso);
      created.push(iso);
    }
    cur.setDate(cur.getDate() + 1);
  }
  res.json({ medication_id: med.id, generated: created.length, dates: created });
});

function deserialize(row) {
  if (!row) return row;
  return { ...row, times: JSON.parse(row.times || "[]"), with_food: !!row.with_food, active: !!row.active };
}

export default router;