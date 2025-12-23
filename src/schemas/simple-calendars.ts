import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const simpleCalendars = sqliteTable(
  'simple_calendars',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    
    // Academic calendar basics
    academicYear: text('academic_year').notNull(),
    semester: integer('semester').notNull(),
    startDate: text('start_date').notNull(),  // Store as "YYYY-MM-DD"
    endDate: text('end_date').notNull(),
    effectiveWeeks: integer('effective_weeks').notNull(),
    
    // Holidays (stored as JSON)
    holidaysJson: text('holidays_json'),
    
    // Metadata
    source: text('source').default('manual'),
    notes: text('notes'),
    
    // Timestamps - SQLite uses TEXT for dates
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text('deleted_at'),
  },
  (table) => ({
    tenantIdx: index('simple_calendars_tenant_idx').on(table.tenantId),
    academicYearIdx: index('simple_calendars_academic_year_idx').on(table.academicYear),
    createdAtIdx: index('simple_calendars_created_at_idx').on(table.createdAt),
  })
);

export type SimpleCalendar = typeof simpleCalendars.$inferSelect;
export type NewSimpleCalendar = typeof simpleCalendars.$inferInsert;
