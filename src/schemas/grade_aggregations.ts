import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { studentsTable } from './students';
import { subjectsTable } from './subjects';
import { academicYearsTable } from './academic_years';

export const gradeAggregationsTable = sqliteTable('grade_aggregations', {
  // Primary Key
  aggregationId: text('aggregation_id')
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
  
  academicYearId: text('academic_year_id')
    .references(() => academicYearsTable.academicYearId)
    .notNull(),
  
  // Semester
  semester: text('semester', { enum: ['1', '2'] }).notNull(),
  
  // Nilai Agregat
  finalScore: real('final_score').notNull(),
  letterGrade: text('letter_grade', { length: 2 }), // A, B+, B, C, D, E
  
  // Predikat
  predicate: text('predicate', { 
    enum: ['sangat_baik', 'baik', 'cukup', 'kurang'] 
  }),
  
  // Deskripsi (AI-generated)
  description: text('description'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
