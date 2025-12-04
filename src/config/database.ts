import { Client } from "pg";
import { DATABASE_URL } from "./env.js";

export const db = new Client({
  connectionString: DATABASE_URL
});

export async function connectDB(): Promise<void> {
  try {
    await db.connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
