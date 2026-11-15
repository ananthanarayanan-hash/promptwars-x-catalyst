import { getDb } from "../db/init.js";
import { config } from "../config.js";
import { sendMail, renderMissedDose, renderUpcomingDose, renderAppointmentReminder } from "./email.js";

const GRACE_MINUTES = 60;
const UPCOMING_MINUTES = 30;
const APPT_HOURS_AHEAD = [24, 2];

let intervalId = null;
let lastTick = null;

function addMinutes(iso, minutes) {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
}

function isAfter(iso, ref) {
  return new Date(iso).getTime() > new Date(ref).getTime();
}

export function tick() {
  const db = getDb();
  const now = new Date().toISOString();
  lastTick = now;
  const results = { missed: 0, upcoming: 0, appointments: 0 };

  // --- Missed doses ---
  const missed = db.prepare(
    `SELECT d.id as dose_id, d.scheduled_at, d.medication_id, m.profile_id, m.name, m.dosage, m.unit, p.name as profile_name, p.phone, p.emergency_contact
     FROM doses d
     JOIN medications m ON m.id = d.medication_id
     JOIN profiles p ON p.id = m.profile_id
     WHERE d.status = 'pending' AND d.scheduled_at <= ?`
  ).all(addMinutes(now, -GRACE_MINUTES));

  for (const row of missed) {
    db.prepare("UPDATE doses SET status = 'missed' WHERE id = ?").run(row.dose_id);
    const recipients = recipientList(db, row.profile_id);
    for (const email of recipients) {
      sendMail({
        to: email,
        subject: `Missed dose: ${row.name} for ${row.profile_name}`,
        body: renderMissedDose(
          { name: row.profile_name, emergency_contact: row.emergency_contact },
          { name: row.name, dosage: row.dosage, unit: row.unit },
          { scheduled_at: row.scheduled_at }
        ),
        type: "missed_dose",
        metadata: { profile_id: row.profile_id, medication_id: row.medication_id, dose_id: row.dose_id },
      });
    }
    results.missed += recipients.length;
  }

  // --- Upcoming doses ---
  const upcoming = db.prepare(
    `SELECT d.id as dose_id, d.scheduled_at, d.medication_id, m.profile_id, m.name, m.dosage, m.unit, p.name as profile_name, p.emergency_contact
     FROM doses d
     JOIN medications m ON m.id = d.medication_id
     JOIN profiles p ON p.id = m.profile_id
     WHERE d.status = 'pending' AND d.scheduled_at > ? AND d.scheduled_at <= ?`
  ).all(now, addMinutes(now, UPCOMING_MINUTES));

  for (const row of upcoming) {
    const minutesAhead = Math.round(
      (new Date(row.scheduled_at).getTime() - new Date(now).getTime()) / 60000
    );
    const recipients = recipientList(db, row.profile_id);
    for (const email of recipients) {
      sendMail({
        to: email,
        subject: `Upcoming dose: ${row.name} for ${row.profile_name}`,
        body: renderUpcomingDose(
          { name: row.profile_name, emergency_contact: row.emergency_contact },
          { name: row.name, dosage: row.dosage, unit: row.unit },
          { scheduled_at: row.scheduled_at },
          minutesAhead
        ),
        type: "upcoming_dose",
        metadata: { profile_id: row.profile_id, medication_id: row.medication_id, dose_id: row.dose_id },
      });
    }
    results.upcoming += recipients.length;
  }

  // --- Appointments ---
  for (const hours of APPT_HOURS_AHEAD) {
    const windowStart = addMinutes(now, hours * 60);
    const windowEnd = addMinutes(now, hours * 60 + 30);
    const appts = db.prepare(
      `SELECT a.id, a.title, a.doctor, a.location, a.datetime, a.notes, p.name as profile_name, p.emergency_contact
       FROM appointments a
       JOIN profiles p ON p.id = a.profile_id
       WHERE a.datetime > ? AND a.datetime <= ? AND a.reminder_sent = 0`
    ).all(windowStart, windowEnd);

    for (const row of appts) {
      const recipients = recipientList(db, row.profile_id);
      for (const email of recipients) {
        sendMail({
          to: email,
          subject: `Upcoming appointment: ${row.title} for ${row.profile_name}`,
          body: renderAppointmentReminder(
            { name: row.profile_name, emergency_contact: row.emergency_contact },
            row
          ),
          type: "appointment",
          metadata: { profile_id: row.profile_id, appointment_id: row.id, hours_ahead: hours },
        });
      }
      db.prepare("UPDATE appointments SET reminder_sent = 1 WHERE id = ?").run(row.id);
      results.appointments += recipients.length;
    }
  }

  return results;
}

function recipientList(db, profileId) {
  const rows = db.prepare(
    "SELECT email FROM caregivers WHERE active = 1 AND email IS NOT NULL AND email != ''"
  ).all();
  const profile = db.prepare("SELECT emergency_contact FROM profiles WHERE id = ?").get(profileId);
  const emails = rows.map((r) => r.email);
  if (profile && profile.emergency_contact) {
    const match = profile.emergency_contact.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g);
    if (match) emails.push(...match);
  }
  return [...new Set(emails)];
}

export function startScheduler(intervalMs = 60000) {
  if (intervalId) return;
  // Run once immediately, then on a timer.
  try {
    tick();
  } catch (e) {
    console.error("[scheduler] initial tick failed:", e.message);
  }
  intervalId = setInterval(() => {
    try {
      const r = tick();
      if (r.missed || r.upcoming || r.appointments) {
        console.log("[scheduler]", JSON.stringify(r));
      }
    } catch (e) {
      console.error("[scheduler] tick failed:", e.message);
    }
  }, intervalMs);
}

export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function status() {
  return { running: !!intervalId, lastTick };
}