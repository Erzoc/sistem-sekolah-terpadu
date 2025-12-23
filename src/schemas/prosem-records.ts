import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const prosemRecords = sqliteTable(
  'prosem_records',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    
    // References
    protaRecordId: text('prota_record_id').notNull(),
    simpleCalendarId: text('simple_calendar_id').notNull(),
    
    // Mata pelajaran
    mapelCode: text('mapel_code').notNull(),
    mapelName: text('mapel_name').notNull(),
    
    // Academic info
    academicYear: text('academic_year').notNull(),
    semester: integer('semester').notNull(),
    
    // Weekly breakdown (stored as JSON array)
    weeklyScheduleJson: text('weekly_schedule_json').notNull(),
    
    // Metadata
    totalWeeks: integer('total_weeks').notNull(),
    effectiveWeeks: integer('effective_weeks').notNull(),
    holidayWeeks: integer('holiday_weeks').default(0),
    
    notes: text('notes'),
    status: text('status').default('draft'),  // 'draft' | 'published'
    
    // Timestamps
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text('deleted_at'),
  },
  (table) => ({
    tenantIdx: index('prosem_records_tenant_idx').on(table.tenantId),
    protaIdx: index('prosem_records_prota_idx').on(table.protaRecordId),
    calendarIdx: index('prosem_records_calendar_idx').on(table.simpleCalendarId),
  })
);

export type ProsemRecord = typeof prosemRecords.$inferSelect;
export type NewProsemRecord = typeof prosemRecords.$inferInsert;
