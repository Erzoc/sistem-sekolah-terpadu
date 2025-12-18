import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { usersTable } from './users';
import { classesTable } from './classes';

export const studentsTable = sqliteTable('students', {
  // Primary Key
  studentId: text('student_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Keys
  userId: text('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  classId: text('class_id')
    .references(() => classesTable.classId),
  
  // Data Siswa
  nisn: text('nisn', { length: 50 }).notNull(),
  nis: text('nis', { length: 50 }),
  fullName: text('full_name', { length: 255 }).notNull(),
  dateOfBirth: integer('date_of_birth', { mode: 'timestamp' }),
  
  // Gender
  gender: text('gender', { enum: ['male', 'female'] }),
  
  // Data Orang Tua
  parentName: text('parent_name', { length: 255 }),
  parentPhone: text('parent_phone', { length: 20 }),
  parentEmail: text('parent_email', { length: 100 }),
  
  // Status
  status: text('status', { 
    enum: ['active', 'graduated', 'dropped'] 
  }).default('active'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
