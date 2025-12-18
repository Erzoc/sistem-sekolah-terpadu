import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';

export const academicYearsTable = sqliteTable('academic_years', {
  // Primary Key
  academicYearId: text('academic_year_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Key
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  // Data Tahun Ajaran
  year: text('year', { length: 10 }).notNull(), // "2024/2025"
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  
  // Status
  status: text('status', { 
    enum: ['active', 'inactive'] 
  }).default('active'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
