import { config } from "../config.js";

export function requirePasscode(req, res, next) {
  const passcode = req.headers["x-passcode"] || req.body?.passcode;
  if (!passcode || passcode !== config.caregiverPasscode) {
    return res.status(401).json({ error: "Invalid or missing passcode." });
  }
  next();
}