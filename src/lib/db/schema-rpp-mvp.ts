import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ============================================
// RPP Pertemuan (Detail per pertemuan)
// ============================================
export const rppPertemuan = sqliteTable('rpp_pertemuan', {
  id: text('id').primaryKey(),
  rppId: text('rpp_id').notNull(), // FK to rpp table
  guruId: text('guru_id').notNull(),
  prosemId: text('prosem_id').notNull(),
  
  // Basic Info
  nomorPertemuan: integer('nomor_pertemuan').notNull(),
  topik: text('topik').notNull(),
  subTopik: text('sub_topik'),
  jp: integer('jp').notNull(),
  
  // Manual Input (from form)
  metodePembelajaran: text('metode_pembelajaran'), // JSON array
  mediaPembelajaran: text('media_pembelajaran'),   // JSON array
  sumberBelajar: text('sumber_belajar'),           // JSON array
  jenisPenilaian: text('jenis_penilaian'),         // JSON array
  
  // AI Generated Content (JSON)
  kompetensiInti: text('kompetensi_inti'),         // JSON object
  capaianPembelajaran: text('capaian_pembelajaran'), // JSON object
  tujuanPembelajaran: text('tujuan_pembelajaran'), // JSON array
  materi: text('materi'),                          // JSON array
  kegiatanPendahuluan: text('kegiatan_pendahuluan'), // JSON array
  kegiatanInti: text('kegiatan_inti'),             // JSON array
  kegiatanPenutup: text('kegiatan_penutup'),       // JSON array
  asesmen: text('asesmen'),                        // JSON object
  
  // Status & Metadata
  status: text('status').notNull(), // 'draft', 'completed', 'failed'
  errorMessage: text('error_message'),
  isEdited: integer('is_edited').notNull().default(0), // boolean
  retryCount: integer('retry_count').notNull().default(0),
  
  // Timestamps
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============================================
// RPP Edit History (Auto-save tracking)
// ============================================
export const rppEditHistory = sqliteTable('rpp_edit_history', {
  id: text('id').primaryKey(),
  rppPertemuanId: text('rpp_pertemuan_id').notNull(),
  section: text('section').notNull(), // 'tujuan', 'materi', 'kegiatan_inti', etc
  contentBefore: text('content_before'), // JSON
  contentAfter: text('content_after'),   // JSON
  editedAt: text('edited_at').notNull(),
});

// ============================================
// Batch Jobs (Batch generation tracking)
// ============================================
export const batchJobs = sqliteTable('batch_jobs', {
  id: text('id').primaryKey(), // 'batch_YYYYMMDD_HHMMSS'
  guruId: text('guru_id').notNull(),
  rppId: text('rpp_id').notNull(), // FK to parent rpp
  
  totalRpp: integer('total_rpp').notNull(),
  completed: integer('completed').notNull().default(0),
  failed: integer('failed').notNull().default(0),
  status: text('status').notNull(), // 'pending', 'in_progress', 'completed', 'paused', 'failed'
  
  // Metadata
  batchInput: text('batch_input'), // JSON - form data
  rppPertemuanIds: text('rpp_pertemuan_ids'), // JSON array of IDs
  
  // Timestamps
  createdAt: text('created_at').notNull(),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
});

// ============================================
// Batch Failed Items
// ============================================
export const batchFailedItems = sqliteTable('batch_failed_items', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull(),
  itemNumber: integer('item_number').notNull(),
  topik: text('topik'),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').notNull().default(0),
  failedAt: text('failed_at').notNull(),
});

// ============================================
// App Template (PDF Template Config)
// ============================================
export const appTemplate = sqliteTable('app_template', {
  id: text('id').primaryKey().default('default'), // Always 'default'
  
  // Header Config
  logoPath: text('logo_path'),
  schoolName: text('school_name').notNull().default('Nama Sekolah'),
  address: text('address'),
  phone: text('phone'),
  website: text('website'),
  headerLayout: text('header_layout').notNull().default('logo_left'), // 'logo_left', 'logo_center', 'logo_right'
  
  // Footer Config
  showPageNumber: integer('show_page_number').notNull().default(1),
  showGeneratedDate: integer('show_generated_date').notNull().default(1),
  showTeacherName: integer('show_teacher_name').notNull().default(0),
  
  // Layout Config
  fontFamily: text('font_family').notNull().default('Times New Roman'),
  fontSize: integer('font_size').notNull().default(12),
  
  // Kurikulum Config
  showCapaianPembelajaran: integer('show_capaian_pembelajaran').notNull().default(1),
  showKodeCp: integer('show_kode_cp').notNull().default(0),
  
  // Timestamps
  updatedAt: text('updated_at').notNull(),
});

// ============================================
// Template Test Logs
// ============================================
export const templateTestLogs = sqliteTable('template_test_logs', {
  id: text('id').primaryKey(),
  testPdfPath: text('test_pdf_path'),
  status: text('status').notNull(), // 'success', 'failed'
  errorMessage: text('error_message'),
  testedAt: text('tested_at').notNull(),
});
