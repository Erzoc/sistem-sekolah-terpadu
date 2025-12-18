import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { tenantsTable } from './tenants';

export const reportTemplatesTable = sqliteTable('report_templates', {
  // Primary Key
  templateId: text('template_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Foreign Key
  tenantId: text('tenant_id')
    .references(() => tenantsTable.tenantId)
    .notNull(),
  
  // Nama Template
  templateName: text('template_name', { length: 100 }).notNull(),
  
  // Jenis Rapor
  reportType: text('report_type', { 
    enum: ['semester', 'mid_semester', 'akhir_tahun'] 
  }).notNull(),
  
  // Template Structure (JSON)
  structure: text('structure', { mode: 'json' }),
  
  // Header & Footer (custom HTML)
  headerHtml: text('header_html'),
  footerHtml: text('footer_html'),
  
  // Logo Sekolah URL
  logoUrl: text('logo_url'),
  
  // Status
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});
