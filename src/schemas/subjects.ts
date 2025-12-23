import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const subjectsTable = sqliteTable('subjects', {
  subjectId: text('subject_id').primaryKey(),
  tenantId: text('tenant_id').notNull().default('default'),
  subjectCode: text('subject_code').notNull(),
  subjectName: text('subject_name').notNull(),
  category: text('category').notNull(), // PAI, Umum, Seni & Budaya
  level: text('level').notNull(), // SD/MI, SMP/MTs, SMA/MA
  kkm: integer('kkm').notNull().default(75), // Kriteria Ketuntasan Minimal
  description: text('description'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export type Subject = typeof subjectsTable.$inferSelect;
export type NewSubject = typeof subjectsTable.$inferInsert;
