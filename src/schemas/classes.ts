import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { academicYearsTable } from './academic_years';

export const classesTable = sqliteTable('classes', {
  // Primary Key
  classId: text('class_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Keys
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  academicYearId: text('academic_year_id')
    .references(() => academicYearsTable.academicYearId)
    .notNull(),
  
  // Data Kelas
  className: text('class_name', { length: 50 }).notNull(), // "10 IPA 1"
  level: text('level', { length: 2 }).notNull(), // "10", "11", "12"
  
  // Wali Kelas (akan diisi nanti setelah ada tabel teachers)
  homeroomTeacherId: text('homeroom_teacher_id'),
  
  // Kapasitas
  capacity: integer('capacity').default(40),
  
  // Status
  status: text('status', { 
    enum: ['active', 'inactive'] 
  }).default('active'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
