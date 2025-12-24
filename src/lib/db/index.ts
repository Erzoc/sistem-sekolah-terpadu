import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// KITA PAKSA PAKAI PATH RAILWAY (PERINGATAN: INI AKAN ERROR DI LOKAL/LAPTOP)
// Tapi ini akan menyembuhkan error di Railway.
const databaseUrl = '/app/data/sqlite.db';

console.log(`🔌 FORCED Database connected: ${databaseUrl}`);

const sqlite = new Database(databaseUrl);
export const db = drizzle(sqlite, { schema });

export * from './schema';
