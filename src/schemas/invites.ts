import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';

export const invitesTable = sqliteTable('invites', {
  // Primary Key
  inviteId: text('invite_id')
    .primaryKey()
    .$defaultFn(() => createId()),

  // Foreign Key ke Tenants
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),

  // Invite Details
  inviteCode: text('invite_code', { length: 50 }).notNull().unique(),
  
  role: text('role', {
    enum: ['guru', 'siswa', 'ortu', 'admin_sekolah']
  }).notNull(),

  // Usage Limits
  maxUses: integer('max_uses').default(1),
  usedCount: integer('used_count').default(0),

  // Status
  isActive: integer('is_active', { mode: 'boolean' }).default(true),

  // Expiry
  expiresAt: integer('expires_at', { mode: 'timestamp' }),

  // Creator
  createdBy: text('created_by').notNull(),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});

export type Invite = typeof invitesTable.$inferSelect;
export type NewInvite = typeof invitesTable.$inferInsert;
