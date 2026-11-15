import "dotenv/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbPath: process.env.DB_PATH || path.join(__dirname, "..", "data", "catalyst.db"),
  caregiverPasscode: process.env.CAREGIVER_PASSCODE || "1234",
  email: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "catalyst-care@elderlycare.example.com",
  },
  simulationMode:
    process.env.SIMULATION_MODE === undefined
      ? true
      : process.env.SIMULATION_MODE !== "false",
};