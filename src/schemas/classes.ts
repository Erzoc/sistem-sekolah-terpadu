import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const classesTable = sqliteTable('classes', {
  classId: text('class_id').primaryKey(),
  tenantId: text('tenant_id').notNull().default('default'),
  className: text('class_name').notNull(),
  grade: integer('grade').notNull(), // 1-12
  level: text('level').notNull(), // SD/MI, SMP/MTs, SMA/MA
  academicYear: text('academic_year').notNull(), // 2024/2025
  capacity: integer('capacity').notNull().default(30),
  waliKelas: text('wali_kelas'), // Homeroom teacher ID
  room: text('room'), // Ruang kelas
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export type Class = typeof classesTable.$inferSelect;
export type NewClass = typeof classesTable.$inferInsert;
