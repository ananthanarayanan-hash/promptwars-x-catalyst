import { Router } from "express";
import { getDb } from "../db/init.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const { medication_id, status, from, to } = req.query;
  let sql = `SELECT d.*, m.name as med_name, m.dosage, m.unit, m.profile_id
             FROM doses d JOIN medications m ON m.id = d.medication_id`;
  const clauses = [];
  const params = [];
  if (medication_id) { clauses.push("d.medication_id = ?"); params.push(medication_id); }
  if (status) { clauses.push("d.status = ?"); params.push(status); }
  if (from) { clauses.push("d.scheduled_at >= ?"); params.push(from); }
  if (to) { clauses.push("d.scheduled_at <= ?"); params.push(to); }
  if (clauses.length) sql += " WHERE " + clauses.join(" AND ");
  sql += " ORDER BY d.scheduled_at DESC";
  res.json(db.prepare(sql).all(...params));
});

router.patch("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM doses WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Dose not found." });
  const { status, note } = req.body;
  const taken_at = status === "taken" ? new Date().toISOString() : existing.taken_at;
  db.prepare("UPDATE doses SET status=?, taken_at=?, note=? WHERE id=?").run(
    status ?? existing.status,
    taken_at,
    note !== undefined ? note : existing.note,
    req.params.id
  );
  res.json(db.prepare("SELECT * FROM doses WHERE id = ?").get(req.params.id));
});

// Bulk mark a medication's pending doses as taken (e.g. "I took my morning meds").
router.post("/bulk-take", (req, res) => {
  const db = getDb();
  const { medication_id, ids, before } = req.body;
  const now = new Date().toISOString();
  let count = 0;
  if (ids && ids.length) {
    const placeholders = ids.map(() => "?").join(",");
    const r = db.prepare(
      `UPDATE doses SET status='taken', taken_at=? WHERE id IN (${placeholders}) AND status='pending'`
    ).run(now, ...ids);
    count = r.changes;
  } else if (medication_id) {
    const r = db.prepare(
      `UPDATE doses SET status='taken', taken_at=? WHERE medication_id=? AND status='pending'`
    ).run(now, medication_id);
    count = r.changes;
  }
  res.json({ updated: count });
});

export default router;