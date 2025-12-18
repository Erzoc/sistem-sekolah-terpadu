import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { classesTable } from './classes';
import { usersTable } from './users';

export const attendanceTable = sqliteTable('attendance', {
  // Primary Key
  attendanceId: text('attendance_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Keys
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  classId: text('class_id')
    .references(() => classesTable.classId)
    .notNull(),
  
  userId: text('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  
  // Tanggal Presensi
  date: integer('date', { mode: 'timestamp' }).notNull(),
  
  // Status Presensi
  status: text('status', { 
    enum: ['hadir', 'sakit', 'izin', 'alpha'] 
  }).notNull(),
  
  // Catatan (optional)
  notes: text('notes'),
  
  // Dicatat oleh siapa (guru)
  recordedBy: text('recorded_by')
    .references(() => usersTable.userId)
    .notNull(),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
