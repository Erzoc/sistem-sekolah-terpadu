import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const tenantsTable = sqliteTable('tenants', {
  // Primary Key
  tenantId: text('tenant_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Data Sekolah
  npsn: text('npsn', { length: 50 }).unique().notNull(),
  schoolName: text('school_name', { length: 255 }).notNull(),
  province: text('province', { length: 100 }),
  city: text('city', { length: 100 }),
  address: text('address'),
  phone: text('phone', { length: 20 }),
  email: text('email', { length: 100 }),
  
  // Status & Subscription
  status: text('status', { 
    enum: ['active', 'suspended', 'inactive'] 
  }).default('active'),
  
  subscriptionTier: text('subscription_tier', { 
    enum: ['starter', 'professional', 'enterprise'] 
  }).default('starter'),
  
  tokenBalance: integer('token_balance').default(500),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
