import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const subjectsTable = sqliteTable('subjects', {
  // Primary Key
  subjectId: text('subject_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Data Mata Pelajaran
  subjectName: text('subject_name', { length: 100 }).notNull(),
  subjectCode: text('subject_code', { length: 20 }).notNull(),
  
  // Jenis Mapel
  isCore: integer('is_core', { mode: 'boolean' }).default(true), // Mapel wajib atau pilihan
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
