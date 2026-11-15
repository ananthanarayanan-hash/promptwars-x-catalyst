import { getDb } from "./db/init.js";
import { v4 as uuid } from "uuid";

const db = getDb();

const profile = db.prepare("SELECT * FROM profiles WHERE id = 'seed-profile-1'").get();
if (!profile) {
  console.log("No seed profile found; run the server first to initialize the DB.");
  process.exit(0);
}

// Clear existing demo meds/doses/appts for this profile.
db.prepare("DELETE FROM doses WHERE medication_id IN (SELECT id FROM medications WHERE profile_id = ?)").run(profile.id);
db.prepare("DELETE FROM medications WHERE profile_id = ?").run(profile.id);
db.prepare("DELETE FROM appointments WHERE profile_id = ?").run(profile.id);

const now = new Date();
const today = now.toISOString().slice(0, 10);

function timeOnDate(dateStr, hhmm) {
  return `${dateStr}T${hhmm}:00`;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const meds = [
  {
    name: "Metformin",
    dosage: "500",
    unit: "mg",
    schedule_type: "daily",
    times: ["08:00", "20:00"],
    with_food: true,
    caution: "Take with breakfast and dinner. Do not skip meals.",
  },
  {
    name: "Lisinopril",
    dosage: "10",
    unit: "mg",
    schedule_type: "daily",
    times: ["09:00"],
    with_food: false,
    caution: "May cause dizziness. Rise slowly from sitting.",
  },
  {
    name: "Vitamin D3",
    dosage: "1000",
    unit: "IU",
    schedule_type: "daily",
    times: ["09:00"],
    with_food: false,
    caution: null,
  },
  {
    name: "Warfarin",
    dosage: "5",
    unit: "mg",
    schedule_type: "daily",
    times: ["18:00"],
    with_food: false,
    caution: "CRITICAL: Same time every day. Report any unusual bruising.",
  },
];

const medIds = [];
const insertMed = db.prepare(
  `INSERT INTO medications (id, profile_id, name, dosage, unit, schedule_type, times, start_date, end_date, with_food, caution, active, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`
);
const insertDose = db.prepare(
  `INSERT OR IGNORE INTO doses (id, medication_id, scheduled_at, status, taken_at, note)
   VALUES (?, ?, ?, ?, ?, ?)`
);

for (const m of meds) {
  const id = uuid();
  medIds.push(id);
  insertMed.run(id, profile.id, m.name, m.dosage, m.unit, m.schedule_type, JSON.stringify(m.times), addDays(today, -30), null, m.with_food ? 1 : 0, m.caution, now.toISOString());
}

// Seed doses for the last 3 days and next 7 days.
const allMeds = db.prepare("SELECT * FROM medications WHERE profile_id = ?").all(profile.id);
for (const med of allMeds) {
  const times = JSON.parse(med.times);
  for (let d = -3; d <= 7; d++) {
    const dateStr = addDays(today, d);
    for (const t of times) {
      const iso = timeOnDate(dateStr, t);
      // Past doses before 3 hours ago are "taken"; very old ones "missed"; future "pending".
      const hoursAgo = (now.getTime() - new Date(iso).getTime()) / 3600000;
      let status = "pending";
      let takenAt = null;
      if (hoursAgo > 24) {
        status = Math.random() > 0.3 ? "taken" : "missed";
        takenAt = status === "taken" ? new Date(new Date(iso).getTime() + 15 * 60000).toISOString() : null;
      } else if (hoursAgo > 4) {
        status = "missed";
      }
      insertDose.run(uuid(), med.id, iso, status, takenAt, null);
    }
  }
}

const appts = [
  {
    title: "Cardiologist - Dr. Mehta",
    doctor: "Dr. Mehta",
    location: "Max Hospital, Floor 4",
    datetime: timeOnDate(addDays(today, 2), "11:00"),
    notes: "Bring ECG report and medication list.",
  },
  {
    title: "General Checkup",
    doctor: "Dr. Rao",
    location: "City Clinic",
    datetime: timeOnDate(addDays(today, 5), "09:30"),
    notes: "Fasting required from 10pm tonight.",
  },
  {
    title: "Pharmacy pickup",
    doctor: null,
    location: "Apollo Pharmacy",
    datetime: timeOnDate(addDays(today, 1), "15:00"),
    notes: null,
  },
];

const insertAppt = db.prepare(
  `INSERT INTO appointments (id, profile_id, title, doctor, location, datetime, notes, reminder_sent, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`
);
for (const a of appts) {
  insertAppt.run(uuid(), profile.id, a.title, a.doctor, a.location, a.datetime, a.notes, now.toISOString());
}

const counts = {
  medications: db.prepare("SELECT COUNT(*) as c FROM medications WHERE profile_id = ?").get(profile.id).c,
  doses: db.prepare("SELECT COUNT(*) as c FROM doses").get().c,
  appointments: db.prepare("SELECT COUNT(*) as c FROM appointments WHERE profile_id = ?").get(profile.id).c,
};
console.log("Seed complete:", counts);