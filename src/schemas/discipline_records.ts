import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { studentsTable } from './students';
import { usersTable } from './users';

export const disciplineRecordsTable = sqliteTable('discipline_records', {
  // Primary Key
  recordId: text('record_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Keys
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  studentId: text('student_id')
    .references(() => studentsTable.studentId)
    .notNull(),
  
  // Tipe Record
  type: text('type', { 
    enum: ['pelanggaran', 'prestasi'] 
  }).notNull(),
  
  // Kategori
  category: text('category', { length: 100 }).notNull(),
  
  // Deskripsi
  description: text('description').notNull(),
  
  // Poin (positif untuk prestasi, negatif untuk pelanggaran)
  points: integer('points').default(0),
  
  // Tanggal Kejadian
  incidentDate: integer('incident_date', { mode: 'timestamp' }).notNull(),
  
  // Dicatat oleh
  recordedBy: text('recorded_by')
    .references(() => usersTable.userId)
    .notNull(),
  
  // Status Follow-up
  followUpStatus: text('follow_up_status', { 
    enum: ['pending', 'resolved', 'escalated'] 
  }).default('pending'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
