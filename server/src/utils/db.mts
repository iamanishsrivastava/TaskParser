// src/utils/db.mts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL) {
  console.error("Missing DB_URL env var!");
  process.exit(1);
}

let db: Pool;

try {
  db = new Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  console.log("Connected pool created");
} catch (err) {
  console.error("Failed to create DB pool:", err);
  throw err;
}

export { db };
