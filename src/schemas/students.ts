import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const studentsTable = sqliteTable('students', {
  studentId: text('student_id').primaryKey(),
  tenantId: text('tenant_id').notNull().default('default'),
  nisn: text('nisn').notNull().unique(),
  fullName: text('full_name').notNull(),
  classId: text('class_id').notNull(),
  gender: text('gender').notNull(), // male, female
  birthDate: text('birth_date'),
  birthPlace: text('birth_place'),
  religion: text('religion'),
  address: text('address'),
  parentName: text('parent_name'),
  parentPhone: text('parent_phone'),
  enrollmentDate: text('enrollment_date').notNull(),
  status: text('status').notNull().default('active'), // active, inactive, graduated, dropped
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export type Student = typeof studentsTable.$inferSelect;
export type NewStudent = typeof studentsTable.$inferInsert;
