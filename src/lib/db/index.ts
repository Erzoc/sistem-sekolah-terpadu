import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
// Pastikan path import schema ini sudah sesuai dengan struktur folder Anda
// (Biasanya './schema' atau '../schemas/index')
import * as schema from './schema'; 

// --- PERBAIKAN DISINI ---
// Kita cek: Apakah ada Environment Variable 'DATABASE_URL'? (Ada di Railway)
// Jika tidak ada, baru kita pakai './dev.db' (Untuk di Laptop/Lokal)
const databaseUrl = process.env.DATABASE_URL || './dev.db';

const sqlite = new Database(databaseUrl);
export const db = drizzle(sqlite, { schema });

export * from './schema';