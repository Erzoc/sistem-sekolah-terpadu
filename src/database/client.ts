import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

// Remove 'file:' prefix dan gunakan absolute path
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = databaseUrl.replace('file:', ''); // Remove 'file:' prefix

// Convert to absolute path from project root
const absolutePath = path.isAbsolute(dbPath) 
  ? dbPath 
  : path.resolve(process.cwd(), dbPath);

// Buka koneksi ke SQLite database
const sqlite = new Database(absolutePath);

// Buat Drizzle client
export const db = drizzle(sqlite);

// Log saat database connected
console.log('✅ Database connected:', absolutePath);
