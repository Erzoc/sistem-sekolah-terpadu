import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Meload .env.local jika sedang di laptop
config({ path: '.env.local' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './dev.db',
  },
  // Add this to prevent migration conflicts
  strict: false,
  verbose: true,
  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
  },
} satisfies Config;
