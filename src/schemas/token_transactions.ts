import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';
import { usersTable } from './users';

export const tokenTransactionsTable = sqliteTable('token_transactions', {
  // Primary Key
  transactionId: text('transaction_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Keys
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  userId: text('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  
  // Tipe Transaksi
  type: text('type', { 
    enum: ['purchase', 'usage', 'refund', 'bonus'] 
  }).notNull(),
  
  // Amount (positif = tambah, negatif = kurang)
  amount: integer('amount').notNull(),
  
  // Balance Setelah Transaksi
  balanceAfter: integer('balance_after').notNull(),
  
  // Deskripsi
  description: text('description').notNull(),
  
  // Related Entity (untuk tracking)
  relatedEntityType: text('related_entity_type', { 
    enum: ['report', 'ai_generation', 'manual'] 
  }),
  relatedEntityId: text('related_entity_id'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
