import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { teachersTable } from './teachers';
import { subjectsTable } from './subjects';
import { classesTable } from './classes';
import { academicYearsTable } from './academic_years';

export const teacherSubjectsTable = sqliteTable('teacher_subjects', {
  // Primary Key
  teacherSubjectId: text('teacher_subject_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Keys
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  teacherId: text('teacher_id')
    .references(() => teachersTable.teacherId)
    .notNull(),
  
  subjectId: text('subject_id')
    .references(() => subjectsTable.subjectId)
    .notNull(),
  
  classId: text('class_id')
    .references(() => classesTable.classId)
    .notNull(),
  
  academicYearId: text('academic_year_id')
    .references(() => academicYearsTable.academicYearId)
    .notNull(),
  
  // Jam Per Minggu
  hoursPerWeek: integer('hours_per_week').default(2),
  
  // Status
  status: text('status', { 
    enum: ['active', 'inactive'] 
  }).default('active'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
