import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { config } from "../config.js";

let db = null;

export function getDb() {
  if (db) return db;
  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  db = new Database(config.dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSchema(db);
  return db;
}

function initSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      dob TEXT,
      phone TEXT,
      emergency_contact TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      unit TEXT NOT NULL,
      schedule_type TEXT NOT NULL,
      times TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      with_food INTEGER DEFAULT 0,
      caution TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS doses (
      id TEXT PRIMARY KEY,
      medication_id TEXT NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
      scheduled_at TEXT NOT NULL,
      status TEXT NOT NULL,
      taken_at TEXT,
      note TEXT,
      UNIQUE(medication_id, scheduled_at)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      doctor TEXT,
      location TEXT,
      datetime TEXT NOT NULL,
      notes TEXT,
      reminder_sent INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS caregivers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      passcode TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_logs (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_doses_med ON doses(medication_id);
    CREATE INDEX IF NOT EXISTS idx_doses_sched ON doses(scheduled_at);
    CREATE INDEX IF NOT EXISTS idx_appt ON appointments(profile_id, datetime);
    CREATE INDEX IF NOT EXISTS idx_email_logs ON email_logs(created_at);
  `);

  const hasProfile = database.prepare("SELECT 1 FROM profiles LIMIT 1").get();
  if (!hasProfile) {
    const now = new Date().toISOString();
    database.prepare(
      "INSERT INTO profiles (id, name, dob, phone, emergency_contact, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(
      "seed-profile-1",
      "Margaret Chen",
      "1948-03-12",
      "+91-98765 43210",
      "David Chen (son) +91-98765 43211",
      "Allergic to penicillin. Prefers warm water with meals.",
      now
    );
    database.prepare(
      "INSERT INTO caregivers (id, name, email, role, passcode, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run("seed-care-1", "David Chen", "david.chen@example.com", "family", config.caregiverPasscode, 1, now);
    database.prepare(
      "INSERT INTO caregivers (id, name, email, role, passcode, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run("seed-care-2", "Nurse Priya", "priya@example.com", "caretaker", config.caregiverPasscode, 1, now);
  }
}

export default getDb;