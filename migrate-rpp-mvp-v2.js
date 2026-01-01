// migrate-rpp-mvp-v2.js
const Database = require('better-sqlite3');
const fs = require('fs');

console.log('🔧 Starting RPP MVP Migration V2...\n');

try {
  // Connect to database
  const db = new Database('./dev.db');
  console.log('✅ Connected to dev.db');
  
  // Backup database first
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupPath = `./dev.db.backup_${timestamp}`;
  fs.copyFileSync('./dev.db', backupPath);
  console.log(`✅ Backup created: ${backupPath}\n`);
  
  console.log('📝 Creating tables...\n');
  
  // 1. RPP Pertemuan
  try {
    db.exec(`
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
      )
    `);
    console.log('  ✅ Table created: rpp_pertemuan');
  } catch (err) {
    console.log(`  ⚠️  rpp_pertemuan: ${err.message}`);
  }
  
  // 2. RPP Edit History
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS rpp_edit_history (
        id TEXT PRIMARY KEY,
        rpp_pertemuan_id TEXT NOT NULL,
        section TEXT NOT NULL,
        content_before TEXT,
        content_after TEXT,
        edited_at TEXT NOT NULL
      )
    `);
    console.log('  ✅ Table created: rpp_edit_history');
  } catch (err) {
    console.log(`  ⚠️  rpp_edit_history: ${err.message}`);
  }
  
  // 3. Batch Jobs
  try {
    db.exec(`
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
      )
    `);
    console.log('  ✅ Table created: batch_jobs');
  } catch (err) {
    console.log(`  ⚠️  batch_jobs: ${err.message}`);
  }
  
  // 4. Batch Failed Items
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS batch_failed_items (
        id TEXT PRIMARY KEY,
        batch_id TEXT NOT NULL,
        item_number INTEGER NOT NULL,
        topik TEXT,
        error_message TEXT,
        retry_count INTEGER NOT NULL DEFAULT 0,
        failed_at TEXT NOT NULL
      )
    `);
    console.log('  ✅ Table created: batch_failed_items');
  } catch (err) {
    console.log(`  ⚠️  batch_failed_items: ${err.message}`);
  }
  
  // 5. App Template
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_template (
        id TEXT PRIMARY KEY,
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
      )
    `);
    console.log('  ✅ Table created: app_template');
  } catch (err) {
    console.log(`  ⚠️  app_template: ${err.message}`);
  }
  
  // 6. Template Test Logs
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS template_test_logs (
        id TEXT PRIMARY KEY,
        test_pdf_path TEXT,
        status TEXT NOT NULL,
        error_message TEXT,
        tested_at TEXT NOT NULL
      )
    `);
    console.log('  ✅ Table created: template_test_logs');
  } catch (err) {
    console.log(`  ⚠️  template_test_logs: ${err.message}`);
  }
  
  // Insert default template
  console.log('\n📝 Inserting default data...\n');
  try {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO app_template (id, school_name, updated_at)
      VALUES (?, ?, datetime('now'))
    `);
    stmt.run('default', 'SMA Muhammadiyah 1 Medan');
    console.log('  ✅ Default template inserted');
  } catch (err) {
    console.log(`  ⚠️  Template insert: ${err.message}`);
  }
  
  // Create indexes
  console.log('\n📝 Creating indexes...\n');
  
  const indexes = [
    { name: 'idx_rpp_pertemuan_rpp_id', sql: 'CREATE INDEX IF NOT EXISTS idx_rpp_pertemuan_rpp_id ON rpp_pertemuan(rpp_id)' },
    { name: 'idx_rpp_pertemuan_guru_id', sql: 'CREATE INDEX IF NOT EXISTS idx_rpp_pertemuan_guru_id ON rpp_pertemuan(guru_id)' },
    { name: 'idx_rpp_edit_history_pertemuan', sql: 'CREATE INDEX IF NOT EXISTS idx_rpp_edit_history_pertemuan ON rpp_edit_history(rpp_pertemuan_id)' },
    { name: 'idx_batch_jobs_guru_id', sql: 'CREATE INDEX IF NOT EXISTS idx_batch_jobs_guru_id ON batch_jobs(guru_id)' },
    { name: 'idx_batch_jobs_status', sql: 'CREATE INDEX IF NOT EXISTS idx_batch_jobs_status ON batch_jobs(status)' },
    { name: 'idx_batch_failed_batch_id', sql: 'CREATE INDEX IF NOT EXISTS idx_batch_failed_batch_id ON batch_failed_items(batch_id)' },
  ];
  
  indexes.forEach(idx => {
    try {
      db.exec(idx.sql);
      console.log(`  ✅ Index created: ${idx.name}`);
    } catch (err) {
      console.log(`  ⚠️  ${idx.name}: ${err.message}`);
    }
  });
  
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
    const count = db.prepare(`SELECT COUNT(*) as count FROM ```).get();
    console.log(`    • ${table.name} (${count.count} rows)`);
  });
  
  // Count total tables
  const totalTables = db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'").get();
  console.log(`\n  Total tables in database: ${totalTables.count}`);
  
  db.close();
  
  console.log('\n✅ Migration completed successfully!');
  console.log('🎉 RPP MVP tables ready!');
  console.log('\n📌 Next steps:');
  console.log('   1. Run: npm run db:studio');
  console.log('   2. Verify new tables in Drizzle Studio');
  console.log('   3. Ready for API development!');
  
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
