import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const teachersTable = sqliteTable('teachers', {
  teacherId: text('teacher_id').primaryKey(),
  tenantId: text('tenant_id').notNull().default('default'),
  nip: text('nip'),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  position: text('position').notNull(), // Guru Tetap, Honorer, Kontrak
  employmentStatus: text('employment_status').notNull().default('active'), // active, inactive, retired
  joinDate: text('join_date').notNull(),
  address: text('address'),
  birthDate: text('birth_date'),
  gender: text('gender'), // male, female
  education: text('education'), // S1, S2, S3
  certification: text('certification'), // yes, no
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export type Teacher = typeof teachersTable.$inferSelect;
export type NewTeacher = typeof teachersTable.$inferInsert;
