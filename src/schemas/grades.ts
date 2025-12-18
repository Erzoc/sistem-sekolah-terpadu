import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { studentsTable } from './students';
import { subjectsTable } from './subjects';
import { classesTable } from './classes';
import { usersTable } from './users';

export const gradesTable = sqliteTable('grades', {
  // Primary Key
  gradeId: text('grade_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Keys
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  studentId: text('student_id')
    .references(() => studentsTable.studentId)
    .notNull(),
  
  subjectId: text('subject_id')
    .references(() => subjectsTable.subjectId)
    .notNull(),
  
  classId: text('class_id')
    .references(() => classesTable.classId)
    .notNull(),
  
  // Tipe Penilaian
  assessmentType: text('assessment_type', { 
    enum: ['harian', 'uts', 'uas', 'tugas', 'praktek'] 
  }).notNull(),
  
  // Nilai
  score: real('score').notNull(), // Pakai real untuk decimal (85.5)
  maxScore: real('max_score').default(100),
  
  // Tanggal Penilaian
  dateRecorded: integer('date_recorded', { mode: 'timestamp' }).notNull(),
  
  // Dicatat oleh guru mana
  recordedBy: text('recorded_by')
    .references(() => usersTable.userId)
    .notNull(),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
