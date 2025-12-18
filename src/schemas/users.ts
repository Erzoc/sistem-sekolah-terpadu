import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';

export const usersTable = sqliteTable('users', {
  // Primary Key
  userId: text('user_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Key ke Tenants (Multi-tenant)
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  // Role
  role: text('role', { 
    enum: ['super_admin', 'admin_sekolah', 'guru', 'siswa', 'ortu'] 
  }).notNull(),
  
  // Authentication
  email: text('email', { length: 100 }).notNull(),
  passwordHash: text('password_hash', { length: 255 }).notNull(),
  
  // Profile
  fullName: text('full_name', { length: 255 }).notNull(),
  phone: text('phone', { length: 20 }),
  
  // Identifiers
  nip: text('nip', { length: 50 }),   // untuk guru
  nisn: text('nisn', { length: 50 }), // untuk siswa
  
  // Status
  status: text('status', { 
    enum: ['active', 'inactive', 'pending'] 
  }).default('pending'),
  
  // Invite System
  inviteToken: text('invite_token', { length: 255 }),
  inviteExpiresAt: integer('invite_expires_at', { mode: 'timestamp' }),
  
  // Tracking
  lastLogin: integer('last_login', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
