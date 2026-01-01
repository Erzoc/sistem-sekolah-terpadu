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

// ============================================
// RPP MVP EXTENSIONS (Added 2026-01-01)
// ============================================

// RPP Pertemuan (Detail per pertemuan)
export const rppPertemuan = sqliteTable('rpp_pertemuan', {
  id: text('id').primaryKey(),
  rppId: text('rpp_id').notNull(),
  guruId: text('guru_id').notNull(),
  prosemId: text('prosem_id').notNull(),
  nomorPertemuan: integer('nomor_pertemuan').notNull(),
  topik: text('topik').notNull(),
  subTopik: text('sub_topik'),
  jp: integer('jp').notNull(),
  metodePembelajaran: text('metode_pembelajaran'),
  mediaPembelajaran: text('media_pembelajaran'),
  sumberBelajar: text('sumber_belajar'),
  jenisPenilaian: text('jenis_penilaian'),
  kompetensiInti: text('kompetensi_inti'),
  capaianPembelajaran: text('capaian_pembelajaran'),
  tujuanPembelajaran: text('tujuan_pembelajaran'),
  materi: text('materi'),
  kegiatanPendahuluan: text('kegiatan_pendahuluan'),
  kegiatanInti: text('kegiatan_inti'),
  kegiatanPenutup: text('kegiatan_penutup'),
  asesmen: text('asesmen'),
  status: text('status').notNull(),
  errorMessage: text('error_message'),
  isEdited: integer('is_edited').notNull().default(0),
  retryCount: integer('retry_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// RPP Edit History
export const rppEditHistory = sqliteTable('rpp_edit_history', {
  id: text('id').primaryKey(),
  rppPertemuanId: text('rpp_pertemuan_id').notNull(),
  section: text('section').notNull(),
  contentBefore: text('content_before'),
  contentAfter: text('content_after'),
  editedAt: text('edited_at').notNull(),
});

// Batch Jobs
export const batchJobs = sqliteTable('batch_jobs', {
  id: text('id').primaryKey(),
  guruId: text('guru_id').notNull(),
  rppId: text('rpp_id').notNull(),
  totalRpp: integer('total_rpp').notNull(),
  completed: integer('completed').notNull().default(0),
  failed: integer('failed').notNull().default(0),
  status: text('status').notNull(),
  batchInput: text('batch_input'),
  rppPertemuanIds: text('rpp_pertemuan_ids'),
  createdAt: text('created_at').notNull(),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
});

// Batch Failed Items
export const batchFailedItems = sqliteTable('batch_failed_items', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull(),
  itemNumber: integer('item_number').notNull(),
  topik: text('topik'),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').notNull().default(0),
  failedAt: text('failed_at').notNull(),
});

// App Template
export const appTemplate = sqliteTable('app_template', {
  id: text('id').primaryKey().default('default'),
  logoPath: text('logo_path'),
  schoolName: text('school_name').notNull().default('Nama Sekolah'),
  address: text('address'),
  phone: text('phone'),
  website: text('website'),
  headerLayout: text('header_layout').notNull().default('logo_left'),
  showPageNumber: integer('show_page_number').notNull().default(1),
  showGeneratedDate: integer('show_generated_date').notNull().default(1),
  showTeacherName: integer('show_teacher_name').notNull().default(0),
  fontFamily: text('font_family').notNull().default('Times New Roman'),
  fontSize: integer('font_size').notNull().default(12),
  showCapaianPembelajaran: integer('show_capaian_pembelajaran').notNull().default(1),
  showKodeCp: integer('show_kode_cp').notNull().default(0),
  updatedAt: text('updated_at').notNull(),
});

// Template Test Logs
export const templateTestLogs = sqliteTable('template_test_logs', {
  id: text('id').primaryKey(),
  testPdfPath: text('test_pdf_path'),
  status: text('status').notNull(),
  errorMessage: text('error_message'),
  testedAt: text('tested_at').notNull(),
});

// Export all tables for API use
export * from './schema';
