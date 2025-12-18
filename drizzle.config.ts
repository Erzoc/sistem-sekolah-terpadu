import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schemas/*.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './dev.db',
  },
} satisfies Config;
