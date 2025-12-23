import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const protaRecords = sqliteTable(
  'prota_records',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    
    // Reference to SimpleCalendar
    simpleCalendarId: text('simple_calendar_id').notNull(),
    
    // Mata pelajaran
    mapelCode: text('mapel_code').notNull(),    // 'mtk', 'ipa', 'ips', etc.
    mapelName: text('mapel_name').notNull(),    // 'Matematika'
    
    // Academic info
    academicYear: text('academic_year').notNull(),
    semester: integer('semester').notNull(),
    
    // Competencies (stored as JSON array)
    competenciesJson: text('competencies_json').notNull(),
    
    // Strategy used
    strategy: text('strategy').default('proportional'),  // 'proportional' | 'linear' | 'manual'
    
    // Metadata
    notes: text('notes'),
    status: text('status').default('draft'),  // 'draft' | 'published'
    
    // Timestamps
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text('deleted_at'),
  },
  (table) => ({
    tenantIdx: index('prota_records_tenant_idx').on(table.tenantId),
    calendarIdx: index('prota_records_calendar_idx').on(table.simpleCalendarId),
    academicYearIdx: index('prota_records_academic_year_idx').on(table.academicYear),
  })
);

export type ProtaRecord = typeof protaRecords.$inferSelect;
export type NewProtaRecord = typeof protaRecords.$inferInsert;
