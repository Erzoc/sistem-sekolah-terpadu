// src/lib/database/client.ts
// ⚠️ SERVER ONLY - DO NOT IMPORT IN CLIENT COMPONENTS

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from '@/schemas';

// Initialize database only on server
const dbPath = path.resolve(process.cwd(), 'data', 'app.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

export type Database = typeof db;
