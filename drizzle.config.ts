import type { Config } from "drizzle-kit";
import { config } from 'dotenv';

// Meload .env.local jika sedang di laptop
config({ path: '.env.local' });

export default {
  // Pastikan path schema ini menunjuk ke file schema definisi tabel Anda
  schema: "./src/schemas/index.ts", 
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    // Railway akan mengisi process.env.DATABASE_URL otomatis
    url: process.env.DATABASE_URL || "./dev.db",
  },
} satisfies Config;