import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

// Buka koneksi ke SQLite database
const sqlite = new Database(process.env.DATABASE_URL || './dev.db');

// Buat Drizzle client
export const db = drizzle(sqlite);

// Log saat database connected
console.log('✅ Database connected:', process.env.DATABASE_URL || './dev.db');
