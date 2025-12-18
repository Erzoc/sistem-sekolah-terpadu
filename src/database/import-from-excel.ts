import { db } from './client';
import {
  tenantsTable,
  usersTable,
  academicYearsTable,
  classesTable,
  subjectsTable,
  teachersTable,
  studentsTable,
  teacherSubjectsTable,
  reportTemplatesTable,
} from '@/schemas';
import bcrypt from 'bcryptjs';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// Cek apakah file Excel ada
const excelPath = path.join(process.cwd(), 'data-import', 'data-sekolah.xlsx');

if (!fs.existsSync(excelPath)) {
  console.error('❌ File tidak ditemukan: data-import/data-sekolah.xlsx');
  console.log('\n📝 Langkah-langkah:');
  console.log('1. Buat folder: data-import/');
  console.log('2. Buat file Excel: data-sekolah.xlsx');
  console.log('3. Isi data sesuai template di: data-import/TEMPLATE_DATA_SEKOLAH.md');
  console.log('4. Jalankan lagi: npm run db:import\n');
  process.exit(1);
}

async function importFromExcel() {
  console.log('📥 IMPORTING DATA FROM EXCEL\n');
  console.log('Reading file:', excelPath, '\n');

  try {
    // Baca Excel file
    const workbook = XLSX.readFile(excelPath);

    // Helper: Get sheet data as JSON
    const getSheet = (sheetName: string) => {
      if (!workbook.SheetNames.includes(sheetName)) {
        console.warn(`⚠️ Sheet "${sheetName}" tidak ditemukan, skip...`);
        return [];
      }
      const sheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(sheet);
    };

    // === 1. IMPORT SEKOLAH ===
    console.log('📚 Importing schools...');
    const schoolData: any[] = getSheet('SEKOLAH');
    
    if (schoolData.length === 0) {
      throw new Error('Sheet SEKOLAH kosong atau tidak ditemukan!');
    }

    const schools = await db.insert(tenantsTable).values(
      schoolData.map((row: any) => ({
        npsn: String(row.npsn),
        schoolName: row.nama_sekolah,
        province: row.provinsi,
        city: row.kota,
        address: row.alamat,
        phone: row.telepon,
        email: row.email,
        tokenBalance: row.token_balance || 1000,
      }))
    ).returning();

    console.log(`✅ ${schools.length} schools imported`);

    // === 2. IMPORT TAHUN AJARAN ===
    console.log('\n📅 Importing academic years...');
    const academicYearData: any[] = getSheet('TAHUN_AJARAN');
    
    const academicYears = await db.insert(academicYearsTable).values(
      academicYearData.map((row: any) => ({
        tenantId: schools[0].tenantId,
        year: row.tahun,
        startDate: new Date(row.tanggal_mulai),
        endDate: new Date(row.tanggal_selesai),
        status: 'active' as const,
      }))
    ).returning();

    console.log(`✅ ${academicYears.length} academic years imported`);

    // === 3. IMPORT KELAS ===
    console.log('\n🏫 Importing classes...');
    const classData: any[] = getSheet('KELAS');
    
    const classes = await db.insert(classesTable).values(
      classData.map((row: any) => ({
        tenantId: schools[0].tenantId,
        academicYearId: academicYears[0].academicYearId,
        className: row.nama_kelas,
        level: String(row.tingkat),
        capacity: row.kapasitas,
        status: 'active' as const,
      }))
    ).returning();

    console.log(`✅ ${classes.length} classes imported`);

    // === 4. IMPORT MATA PELAJARAN ===
    console.log('\n📖 Importing subjects...');
    const subjectData: any[] = getSheet('MATA_PELAJARAN');
    
    const subjects = await db.insert(subjectsTable).values(
      subjectData.map((row: any) => ({
        subjectName: row.nama_mapel,
        subjectCode: row.kode,
        isCore: row.wajib === 'Y' || row.wajib === 'y' || row.wajib === true,
      }))
    ).returning();

    console.log(`✅ ${subjects.length} subjects imported`);

    // === 5. IMPORT GURU ===
    console.log('\n👤 Importing teachers...');
    const guruData: any[] = getSheet('GURU');
    
    const hashedGuru = await bcrypt.hash('guru123', 10);

    const guruUsers = await db.insert(usersTable).values(
      guruData.map((row: any) => ({
        tenantId: schools[0].tenantId,
        role: 'guru' as const,
        email: row.username,
        passwordHash: hashedGuru,
        fullName: row.nama_lengkap,
        nip: row.nip || null,
        phone: row.hp,
        status: 'active' as const,
      }))
    ).returning();

    const teachers = await db.insert(teachersTable).values(
      guruUsers.map((u, i) => ({
        userId: u.userId,
        tenantId: u.tenantId,
        nip: guruData[i].nip || `TEMP-${i + 1}`,
        position: guruData[i].jabatan as 'guru_mapel' | 'wali_kelas' | 'guru_bk' | 'kepala_sekolah',
        status: 'aktif' as const,
      }))
    ).returning();

    console.log(`✅ ${teachers.length} teachers imported`);

    // === 6. IMPORT SISWA ===
    console.log('\n👨‍🎓 Importing students...');
    const siswaData: any[] = getSheet('SISWA');
    
    const hashedSiswa = await bcrypt.hash('siswa123', 10);

    const siswaUsers = await db.insert(usersTable).values(
      siswaData.map((row: any) => ({
        tenantId: schools[0].tenantId,
        role: 'siswa' as const,
        email: row.username,
        passwordHash: hashedSiswa,
        fullName: row.nama_lengkap,
        nisn: row.nisn,
        phone: String(row.hp_ortu || ''),
        status: 'active' as const,
      }))
    ).returning();

    const students = await db.insert(studentsTable).values(
      siswaUsers.map((u, i) => {
        const row = siswaData[i];
        const kelas = classes.find(c => c.className === row.nama_kelas);
        
        return {
          userId: u.userId,
          tenantId: u.tenantId,
          classId: kelas?.classId || null,
          nisn: row.nisn,
          nis: row.nis,
          fullName: row.nama_lengkap,
          gender: row.jk === 'L' ? 'male' as const : 'female' as const,
          parentName: row.nama_ortu,
          parentPhone: row.hp_ortu,
          status: 'active' as const,
        };
      })
    ).returning();

    console.log(`✅ ${students.length} students imported`);

    // === 7. IMPORT GURU MENGAJAR ===
    console.log('\n📚 Importing teacher-subject mappings...');
    const mengajarData: any[] = getSheet('GURU_MENGAJAR');
    
    // Filter valid mappings first
const validMappings = mengajarData
  .map((row: any) => {
    const guru = guruUsers.find(g => g.email === row.username_guru);
    const teacher = teachers.find(t => t.userId === guru?.userId);
    const subject = subjects.find(s => s.subjectCode === row.kode_mapel);
    const kelas = classes.find(c => c.className === row.nama_kelas);

    if (!teacher || !subject || !kelas) {
      console.warn(`⚠️ Skip mapping: ${row.username_guru} - ${row.kode_mapel} - ${row.nama_kelas}`);
      return null;
    }

    return {
      tenantId: schools[0].tenantId,
      teacherId: teacher.teacherId,
      subjectId: subject.subjectId,
      classId: kelas.classId,
      academicYearId: academicYears[0].academicYearId,
      hoursPerWeek: row.jam_per_minggu,
      status: 'active' as const,
    };
  })
  .filter((item): item is NonNullable<typeof item> => item !== null);

// Only insert if there are valid mappings
let teacherSubjects: any[] = [];
if (validMappings.length > 0) {
  teacherSubjects = await db.insert(teacherSubjectsTable).values(validMappings).returning();
}


    console.log(`✅ ${teacherSubjects.length} teacher-subject mappings imported`);

    // === 8. CREATE DEFAULT ADMIN & TEMPLATE ===
    console.log('\n🔐 Creating default admin...');
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedSuper = await bcrypt.hash('121212', 10);

    await db.insert(usersTable).values([
      {
        tenantId: schools[0].tenantId,
        role: 'super_admin',
        email: 'superadmin',
        passwordHash: hashedSuper,
        fullName: 'Super Administrator',
        phone: '081234567890',
        status: 'active',
      },
      {
        tenantId: schools[0].tenantId,
        role: 'admin_sekolah',
        email: 'admin',
        passwordHash: hashedAdmin,
        fullName: `Admin ${schools[0].schoolName}`,
        phone: schools[0].phone || '',
        status: 'active',
      },
    ]);

    console.log('✅ Admin accounts created');

    console.log('\n📄 Creating report template...');
    await db.insert(reportTemplatesTable).values({
      tenantId: schools[0].tenantId,
      templateName: 'Rapor Semester Default',
      reportType: 'semester',
      structure: JSON.stringify({ sections: ['identitas', 'nilai', 'kehadiran', 'catatan'] }),
      isActive: true,
    });

    console.log('✅ Report template created');

    // === SUMMARY ===
    console.log('\n═══════════════════════════════════════');
    console.log('🎉 IMPORT COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(`Schools: ${schools.length}`);
    console.log(`Academic Years: ${academicYears.length}`);
    console.log(`Classes: ${classes.length}`);
    console.log(`Subjects: ${subjects.length}`);
    console.log(`Teachers: ${teachers.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Teacher-Subject Mappings: ${teacherSubjects.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('📝 LOGIN CREDENTIALS:');
    console.log('Super Admin: superadmin / 121212');
    console.log('Admin Sekolah: admin / admin123');
    console.log('Guru: [username dari Excel] / guru123');
    console.log('Siswa: [username dari Excel] / siswa123');

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    console.log('\n💡 Tips:');
    console.log('- Pastikan semua sheet ada: SEKOLAH, TAHUN_AJARAN, KELAS, MATA_PELAJARAN, GURU, GURU_MENGAJAR, SISWA');
    console.log('- Cek nama kolom sesuai template');
    console.log('- Pastikan tidak ada sel kosong di kolom wajib');
    process.exit(1);
  }
}

importFromExcel();
