import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';

// Choose database path
let databaseUrl: string;

if (isRailway) {
  // Railway production path
  databaseUrl = '/app/data/sqlite.db';
  console.log('🚂 Railway production mode');
} else if (isProduction) {
  // Other production (Vercel, Netlify, etc)
  databaseUrl = process.env.DATABASE_URL || './dev.db';
  console.log('☁️  Production mode');
} else {
  // Local development
  databaseUrl = path.join(process.cwd(), 'dev.db');
  console.log('💻 Local development mode');
}

console.log('🔌 Database path:', databaseUrl);

// Create SQLite connection
const sqlite = new Database(databaseUrl);

// Enable WAL mode for better concurrency (local only)
if (!isRailway) {
  sqlite.pragma('journal_mode = WAL');
}

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

console.log('✅ Database connected successfully!');

export * from './schema';
