import type { Config } from "drizzle-kit";
import { config } from 'dotenv';

config({ path: '.env.local' });

export default {
  schema: "./src/schemas/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "./dev.db",  // ← KONSISTEN dengan original
  },
} satisfies Config;
