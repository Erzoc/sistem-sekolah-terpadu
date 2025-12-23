import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const teacherAssignmentsTable = sqliteTable('teacher_assignments', {
  assignmentId: text('assignment_id').primaryKey(),
  tenantId: text('tenant_id').notNull().default('default'),
  teacherId: text('teacher_id').notNull(),
  subjectId: text('subject_id').notNull(),
  classId: text('class_id').notNull(),
  academicYear: text('academic_year').notNull(),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export type TeacherAssignment = typeof teacherAssignmentsTable.$inferSelect;
export type NewTeacherAssignment = typeof teacherAssignmentsTable.$inferInsert;
