import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const rppRecords = sqliteTable(
  'rpp_records',
  {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    
    // References
    prosemRecordId: text('prosem_record_id').notNull(),
    protaRecordId: text('prota_record_id').notNull(),
    simpleCalendarId: text('simple_calendar_id').notNull(),
    
    // Mata pelajaran & kelas
    mapelCode: text('mapel_code').notNull(),
    mapelName: text('mapel_name').notNull(),
    kelasLevel: text('kelas_level').notNull(),      // '10', '11', '12'
    kelasDivision: text('kelas_division'),          // 'A', 'B', 'IPA', 'IPS'
    
    // Academic info
    academicYear: text('academic_year').notNull(),
    semester: integer('semester').notNull(),
    
    // RPP content (stored as JSON)
    pertemuanListJson: text('pertemuan_list_json').notNull(),
    
    // Template & generation
    templateType: text('template_type').default('merdeka'),  // 'merdeka' | 'k13' | 'custom'
    generationMethod: text('generation_method').default('ai'),  // 'ai' | 'manual' | 'template'
    aiProvider: text('ai_provider'),                // 'gemini' | 'openai' | null
    
    // Metadata
    totalPertemuan: integer('total_pertemuan').notNull(),
    totalJamPelajaran: integer('total_jam_pelajaran'),
    
    notes: text('notes'),
    status: text('status').default('draft'),  // 'draft' | 'review' | 'published'
    
    // Timestamps
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text('deleted_at'),
  },
  (table) => ({
    tenantIdx: index('rpp_records_tenant_idx').on(table.tenantId),
    prosemIdx: index('rpp_records_prosem_idx').on(table.prosemRecordId),
    mapelIdx: index('rpp_records_mapel_idx').on(table.mapelCode),
    kelasIdx: index('rpp_records_kelas_idx').on(table.kelasLevel),
  })
);

export type RppRecord = typeof rppRecords.$inferSelect;
export type NewRppRecord = typeof rppRecords.$inferInsert;
