// migrate-rpp-mvp.js
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Read migration SQL
const migrationSQL = `
-- Manual Migration: Add RPP MVP Tables
-- Date: 2026-01-01

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
`;

console.log('🔧 Starting RPP MVP Migration...\n');

try {
  // Connect to database
  const db = new Database('./dev.db');
  console.log('✅ Connected to dev.db');
  
  // Backup database first
  const backupPath = `./dev.db.backup_${new Date().toISOString().replace(/:/g, '-').split('.')[0]}`;
  fs.copyFileSync('./dev.db', backupPath);
  console.log(`✅ Backup created: ${backupPath}\n`);
  
  // Split and execute SQL statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  console.log(`📝 Executing ${statements.length} SQL statements...\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const statement of statements) {
    try {
      db.exec(statement);
      
      // Log table creation
      if (statement.includes('CREATE TABLE')) {
        const match = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
        if (match) {
          console.log(`  ✅ Table created/verified: ${match[1]}`);
          successCount++;
        }
      }
      // Log index creation
      else if (statement.includes('CREATE INDEX')) {
        const match = statement.match(/CREATE INDEX IF NOT EXISTS (\w+)/);
        if (match) {
          console.log(`  ✅ Index created/verified: ${match[1]}`);
        }
      }
      // Log insert
      else if (statement.includes('INSERT')) {
        console.log('  ✅ Default template inserted');
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      errorCount++;
    }
  }
  
  // Verify tables
  console.log('\n📊 Verifying tables...\n');
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    AND (name LIKE 'rpp_%' OR name LIKE 'batch_%' OR name='app_template')
    ORDER BY name
  `).all();
  
  console.log('  Tables found:');
  tables.forEach(table => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name} `).get();
    console.log(`    • ${table.name} (${count.count} rows)`);
  });
  
  db.close();
  
  console.log(`\n✅ Migration completed!`);
  console.log(`   Success: ${successCount} tables created`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount}`);
  }
  console.log('\n🎉 RPP MVP tables ready!');
  console.log('   Run: npm run db:studio');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
