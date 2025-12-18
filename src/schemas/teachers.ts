import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { usersTable } from './users';

export const teachersTable = sqliteTable('teachers', {
  // Primary Key
  teacherId: text('teacher_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Keys
  userId: text('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  // Data Guru
  nip: text('nip', { length: 50 }).notNull(),
  
  // Jabatan
  position: text('position', { 
    enum: ['guru_mapel', 'wali_kelas', 'guru_bk', 'kepala_sekolah'] 
  }).default('guru_mapel'),
  
  // Status
  status: text('status', { 
    enum: ['aktif', 'nonaktif', 'pensiun'] 
  }).default('aktif'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
