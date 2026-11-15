import nodemailer from "nodemailer";
import { config } from "../config.js";
import { v4 as uuid } from "uuid";
import { getDb } from "../db/init.js";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!config.email.host) return null;
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: { user: config.email.user, pass: config.email.pass },
  });
  return transporter;
}

export async function verifyConnection() {
  const t = getTransporter();
  if (!t) return { ok: false, reason: "no_smtp_config" };
  try {
    await t.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

export async function sendMail({ to, subject, body, type, metadata }) {
  const db = getDb();
  const id = uuid();
  const mode = config.simulationMode ? "simulated" : "real";

  const log = (status) =>
    db.prepare(
      `INSERT INTO email_logs (id, type, recipient, subject, body, status, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, type, to, subject, body, status, metadata ? JSON.stringify(metadata) : null, new Date().toISOString());

  if (mode === "simulated") {
    log("simulated");
    return { id, status: "simulated" };
  }

  const t = getTransporter();
  if (!t) {
    log("failed");
    throw new Error("No SMTP configured and simulation mode is off.");
  }

  try {
    await t.sendMail({
      from: config.email.from,
      to,
      subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
    });
    log("sent");
    return { id, status: "sent" };
  } catch (e) {
    log("failed");
    throw e;
  }
}

export function renderMissedDose(profile, medication, dose) {
  return `Hello,

This is a reminder from Catalyst Care.

${medication.name} (${medication.dosage} ${medication.unit}) was scheduled for ${new Date(
    dose.scheduled_at
  ).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} and has not been recorded as taken.

Please help ${profile.name} take this dose when it is safe to do so.

If this was already taken, you can mark it done in the app.

- Catalyst Care`;
}

export function renderUpcomingDose(profile, medication, dose, minutesAhead) {
  return `Hello,

This is a reminder from Catalyst Care.

${profile.name}'s next dose of ${medication.name} (${medication.dosage} ${medication.unit}) is coming up in about ${minutesAhead} minutes, at ${new Date(
    dose.scheduled_at
  ).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}.

Please make sure it is taken on time.

- Catalyst Care`;
}

export function renderAppointmentReminder(profile, appointment) {
  return `Hello,

This is a reminder from Catalyst Care.

${profile.name} has an upcoming appointment:
${appointment.title}
With: ${appointment.doctor || "TBD"}
When: ${new Date(appointment.datetime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
Where: ${appointment.location || "TBD"}

${appointment.notes ? `Notes: ${appointment.notes}` : ""}

- Catalyst Care`;
}