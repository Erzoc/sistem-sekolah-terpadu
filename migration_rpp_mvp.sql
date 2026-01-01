-- Manual Migration: Add RPP MVP Tables
-- Date: 2026-01-01
-- Purpose: Add tables for RPP MVP features

-- 1. RPP Pertemuan (Detail per pertemuan)
CREATE TABLE IF NOT EXISTS rpp_pertemuan (
  id TEXT PRIMARY KEY,
  rpp_id TEXT NOT NULL,
  guru_id TEXT NOT NULL,
  prosem_id TEXT NOT NULL,
  nomor_pertemuan INTEGER NOT NULL,
  topik TEXT NOT NULL,
  sub_topik TEXT,
  jp INTEGER NOT NULL,
  metode_pembelajaran TEXT,
  media_pembelajaran TEXT,
  sumber_belajar TEXT,
  jenis_penilaian TEXT,
  kompetensi_inti TEXT,
  capaian_pembelajaran TEXT,
  tujuan_pembelajaran TEXT,
  materi TEXT,
  kegiatan_pendahuluan TEXT,
  kegiatan_inti TEXT,
  kegiatan_penutup TEXT,
  asesmen TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  is_edited INTEGER NOT NULL DEFAULT 0,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. RPP Edit History
CREATE TABLE IF NOT EXISTS rpp_edit_history (
  id TEXT PRIMARY KEY,
  rpp_pertemuan_id TEXT NOT NULL,
  section TEXT NOT NULL,
  content_before TEXT,
  content_after TEXT,
  edited_at TEXT NOT NULL
);

-- 3. Batch Jobs
CREATE TABLE IF NOT EXISTS batch_jobs (
  id TEXT PRIMARY KEY,
  guru_id TEXT NOT NULL,
  rpp_id TEXT NOT NULL,
  total_rpp INTEGER NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  failed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  batch_input TEXT,
  rpp_pertemuan_ids TEXT,
  created_at TEXT NOT NULL,
  started_at TEXT,
  completed_at TEXT
);

-- 4. Batch Failed Items
CREATE TABLE IF NOT EXISTS batch_failed_items (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  item_number INTEGER NOT NULL,
  topik TEXT,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  failed_at TEXT NOT NULL
);

-- 5. App Template
CREATE TABLE IF NOT EXISTS app_template (
  id TEXT PRIMARY KEY DEFAULT 'default',
  logo_path TEXT,
  school_name TEXT NOT NULL DEFAULT 'Nama Sekolah',
  address TEXT,
  phone TEXT,
  website TEXT,
  header_layout TEXT NOT NULL DEFAULT 'logo_left',
  show_page_number INTEGER NOT NULL DEFAULT 1,
  show_generated_date INTEGER NOT NULL DEFAULT 1,
  show_teacher_name INTEGER NOT NULL DEFAULT 0,
  font_family TEXT NOT NULL DEFAULT 'Times New Roman',
  font_size INTEGER NOT NULL DEFAULT 12,
  show_capaian_pembelajaran INTEGER NOT NULL DEFAULT 1,
  show_kode_cp INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

-- 6. Template Test Logs
CREATE TABLE IF NOT EXISTS template_test_logs (
  id TEXT PRIMARY KEY,
  test_pdf_path TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  tested_at TEXT NOT NULL
);

-- Insert default template
INSERT OR IGNORE INTO app_template (id, school_name, updated_at)
VALUES ('default', 'SMA Muhammadiyah 1 Medan', datetime('now'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rpp_pertemuan_rpp_id ON rpp_pertemuan(rpp_id);
CREATE INDEX IF NOT EXISTS idx_rpp_pertemuan_guru_id ON rpp_pertemuan(guru_id);
CREATE INDEX IF NOT EXISTS idx_rpp_edit_history_pertemuan ON rpp_edit_history(rpp_pertemuan_id);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_guru_id ON batch_jobs(guru_id);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_status ON batch_jobs(status);
CREATE INDEX IF NOT EXISTS idx_batch_failed_batch_id ON batch_failed_items(batch_id);

SELECT 'Migration completed successfully!' as result;
