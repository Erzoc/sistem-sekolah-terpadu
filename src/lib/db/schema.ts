import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Kalender Pendidikan (Kaldik)
export const kaldik = sqliteTable('kaldik', {
  id: text('id').primaryKey(),
  guruId: text('guru_id').notNull(),
  academicYear: text('academic_year').notNull(),
  semester: integer('semester').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  effectiveWeeks: integer('effective_weeks').notNull(),
  holidays: text('holidays'), // JSON string
  createdAt: text('created_at').notNull(),
});

// Program Tahunan (Prota)
export const prota = sqliteTable('prota', {
  id: text('id').primaryKey(),
  guruId: text('guru_id').notNull(),
  kaldikId: text('kaldik_id').notNull(),
  mapelName: text('mapel_name').notNull(),
  className: text('class_name').notNull(),
  cpList: text('cp_list'), // JSON string
  totalWeeks: integer('total_weeks').notNull(),
  createdAt: text('created_at').notNull(),
});

// Program Semester (Prosem)
export const prosem = sqliteTable('prosem', {
  id: text('id').primaryKey(),
  guruId: text('guru_id').notNull(),
  protaId: text('prota_id').notNull(),
  weeklySchedule: text('weekly_schedule'), // JSON string
  totalWeeks: integer('total_weeks').notNull(),
  effectiveWeeks: integer('effective_weeks').notNull(),
  createdAt: text('created_at').notNull(),
});

// RPP
export const rpp = sqliteTable('rpp', {
  id: text('id').primaryKey(),
  guruId: text('guru_id').notNull(),
  prosemId: text('prosem_id').notNull(),
  mapelName: text('mapel_name').notNull(),
  kelasLevel: text('kelas_level').notNull(),
  kelasDivision: text('kelas_division'),
  academicYear: text('academic_year').notNull(),
  semester: integer('semester').notNull(),
  totalPertemuan: integer('total_pertemuan').notNull(),
  totalJamPelajaran: integer('total_jam_pelajaran').notNull(),
  pertemuanListJson: text('pertemuan_list_json'), // JSON string
  templateType: text('template_type').notNull(),
  generationMethod: text('generation_method').notNull(),
  aiProvider: text('ai_provider'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});
