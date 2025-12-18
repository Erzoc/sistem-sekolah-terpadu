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

async function seedFull() {
  console.log('🌱 FULL DATABASE SEEDING - START\n');
  console.log('This will create realistic data for testing...\n');

  try {
    // === 1. SCHOOLS (3 sekolah) ===
    console.log('📚 Creating schools...');
    
    const schools = await db.insert(tenantsTable).values([
      {
        npsn: '12345678',
        schoolName: 'SMA Negeri 1 Jakarta',
        province: 'DKI Jakarta',
        city: 'Jakarta Pusat',
        address: 'Jl. Sudirman No. 1',
        phone: '021-1234567',
        email: 'info@sman1jakarta.sch.id',
        tokenBalance: 1000,
      },
      {
        npsn: '87654321',
        schoolName: 'SMA Islam Al-Azhar BSD',
        province: 'Banten',
        city: 'Tangerang Selatan',
        address: 'Jl. BSD Raya No. 10',
        phone: '021-7654321',
        email: 'admin@alazhar-bsd.sch.id',
        tokenBalance: 1500,
      },
      {
        npsn: '11223344',
        schoolName: 'SMA Cendekia Harapan',
        province: 'Jawa Timur',
        city: 'Surabaya',
        address: 'Jl. Pahlawan No. 5',
        phone: '031-9988776',
        email: 'info@cendekia.sch.id',
        tokenBalance: 800,
      },
    ]).returning();

    console.log(`✅ ${schools.length} schools created`);

    // === 2. ACADEMIC YEARS ===
    console.log('\n📅 Creating academic years...');
    
    const academicYears = await db.insert(academicYearsTable).values([
      {
        tenantId: schools[0].tenantId,
        year: '2024/2025',
        startDate: new Date('2024-07-15'),
        endDate: new Date('2025-06-30'),
        status: 'active',
      },
      {
        tenantId: schools[1].tenantId,
        year: '2024/2025',
        startDate: new Date('2024-07-15'),
        endDate: new Date('2025-06-30'),
        status: 'active',
      },
      {
        tenantId: schools[2].tenantId,
        year: '2024/2025',
        startDate: new Date('2024-07-15'),
        endDate: new Date('2025-06-30'),
        status: 'active',
      },
    ]).returning();

    console.log(`✅ ${academicYears.length} academic years created`);

    // === 3. CLASSES ===
    console.log('\n🏫 Creating classes...');
    
    const classes = await db.insert(classesTable).values([
      // SMAN 1 Jakarta - 6 kelas
      { tenantId: schools[0].tenantId, academicYearId: academicYears[0].academicYearId, className: '10 IPA 1', level: '10', capacity: 36 },
      { tenantId: schools[0].tenantId, academicYearId: academicYears[0].academicYearId, className: '10 IPA 2', level: '10', capacity: 36 },
      { tenantId: schools[0].tenantId, academicYearId: academicYears[0].academicYearId, className: '11 IPA 1', level: '11', capacity: 34 },
      { tenantId: schools[0].tenantId, academicYearId: academicYears[0].academicYearId, className: '11 IPA 2', level: '11', capacity: 34 },
      { tenantId: schools[0].tenantId, academicYearId: academicYears[0].academicYearId, className: '12 IPA 1', level: '12', capacity: 32 },
      { tenantId: schools[0].tenantId, academicYearId: academicYears[0].academicYearId, className: '12 IPA 2', level: '12', capacity: 32 },
      
      // Al-Azhar - 4 kelas
      { tenantId: schools[1].tenantId, academicYearId: academicYears[1].academicYearId, className: '10 A', level: '10', capacity: 30 },
      { tenantId: schools[1].tenantId, academicYearId: academicYears[1].academicYearId, className: '11 A', level: '11', capacity: 28 },
      { tenantId: schools[1].tenantId, academicYearId: academicYears[1].academicYearId, className: '12 A', level: '12', capacity: 26 },
      { tenantId: schools[1].tenantId, academicYearId: academicYears[1].academicYearId, className: '12 B', level: '12', capacity: 26 },
    ]).returning();

    console.log(`✅ ${classes.length} classes created`);

    // === 4. SUBJECTS ===
    console.log('\n📖 Creating subjects...');
    
    const subjects = await db.insert(subjectsTable).values([
      { subjectName: 'Matematika', subjectCode: 'MAT', isCore: true },
      { subjectName: 'Bahasa Indonesia', subjectCode: 'BIND', isCore: true },
      { subjectName: 'Bahasa Inggris', subjectCode: 'BING', isCore: true },
      { subjectName: 'Fisika', subjectCode: 'FIS', isCore: true },
      { subjectName: 'Kimia', subjectCode: 'KIM', isCore: true },
      { subjectName: 'Biologi', subjectCode: 'BIO', isCore: true },
      { subjectName: 'Sejarah', subjectCode: 'SEJ', isCore: true },
      { subjectName: 'Geografi', subjectCode: 'GEO', isCore: false },
      { subjectName: 'Ekonomi', subjectCode: 'EKO', isCore: false },
      { subjectName: 'Sosiologi', subjectCode: 'SOS', isCore: false },
      { subjectName: 'Pendidikan Agama', subjectCode: 'PAI', isCore: true },
      { subjectName: 'PJOK', subjectCode: 'PJOK', isCore: true },
    ]).returning();

    console.log(`✅ ${subjects.length} subjects created`);

    // === 5. USERS & TEACHERS ===
    console.log('\n👤 Creating users...');
    
    const hashedSuper = await bcrypt.hash('121212', 10);
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedGuru = await bcrypt.hash('guru123', 10);
    const hashedSiswa = await bcrypt.hash('siswa123', 10);

    // Super Admin
    const superAdmin = await db.insert(usersTable).values({
      tenantId: schools[0].tenantId,
      role: 'super_admin',
      email: 'superadmin',
      passwordHash: hashedSuper,
      fullName: 'Super Administrator',
      phone: '081234567890',
      status: 'active',
    }).returning();

    // Admin sekolah (3 admin)
    const admins = await db.insert(usersTable).values([
      {
        tenantId: schools[0].tenantId,
        role: 'admin_sekolah',
        email: 'admin1',
        passwordHash: hashedAdmin,
        fullName: 'Admin SMAN 1 Jakarta',
        phone: '081234567891',
        status: 'active',
      },
      {
        tenantId: schools[1].tenantId,
        role: 'admin_sekolah',
        email: 'admin2',
        passwordHash: hashedAdmin,
        fullName: 'Admin Al-Azhar BSD',
        phone: '081234567892',
        status: 'active',
      },
      {
        tenantId: schools[2].tenantId,
        role: 'admin_sekolah',
        email: 'admin3',
        passwordHash: hashedAdmin,
        fullName: 'Admin Cendekia Surabaya',
        phone: '081234567893',
        status: 'active',
      },
    ]).returning();

    // Guru SMAN 1 Jakarta (8 guru)
    const guruUsers = await db.insert(usersTable).values([
      { tenantId: schools[0].tenantId, role: 'guru', email: 'guru1', passwordHash: hashedGuru, fullName: 'Budi Santoso, S.Pd', nip: '197001011998031001', phone: '082111111111', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'guru', email: 'guru2', passwordHash: hashedGuru, fullName: 'Siti Aminah, S.Pd', nip: '197502021998032001', phone: '082222222222', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'guru', email: 'guru3', passwordHash: hashedGuru, fullName: 'Ahmad Fauzi, M.Pd', nip: '198003031999031002', phone: '082333333333', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'guru', email: 'guru4', passwordHash: hashedGuru, fullName: 'Dewi Lestari, S.Si', nip: '198204042000032001', phone: '082444444444', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'guru', email: 'guru5', passwordHash: hashedGuru, fullName: 'Rudi Hartono, S.Pd', nip: '198505052001031001', phone: '082555555555', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'guru', email: 'guru6', passwordHash: hashedGuru, fullName: 'Nia Kurnia, S.Pd', nip: '198706062002032001', phone: '082666666666', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'guru', email: 'guru7', passwordHash: hashedGuru, fullName: 'Hendra Wijaya, M.Pd', nip: '198907072003031001', phone: '082777777777', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'guru', email: 'guru8', passwordHash: hashedGuru, fullName: 'Maya Sari, S.Pd', nip: '199008082004032001', phone: '082888888888', status: 'active' },
    ]).returning();

    // Create Teacher records
    const teachers = await db.insert(teachersTable).values(
      guruUsers.map(u => ({
        userId: u.userId,
        tenantId: u.tenantId,
        nip: u.nip!,
        position: 'guru_mapel' as const,
        status: 'aktif' as const,
      }))
    ).returning();

    console.log(`✅ ${guruUsers.length} teachers created`);

    // === 6. STUDENTS ===
    console.log('\n👨‍🎓 Creating students...');
    
    const studentUsers = await db.insert(usersTable).values([
      // Kelas 10 IPA 1 (5 siswa)
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa1', passwordHash: hashedSiswa, fullName: 'Andi Pratama', nisn: '0051234501', phone: '083111111111', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa2', passwordHash: hashedSiswa, fullName: 'Bella Anastasia', nisn: '0051234502', phone: '083222222222', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa3', passwordHash: hashedSiswa, fullName: 'Citra Dewi', nisn: '0051234503', phone: '083333333333', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa4', passwordHash: hashedSiswa, fullName: 'Doni Firmansyah', nisn: '0051234504', phone: '083444444444', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa5', passwordHash: hashedSiswa, fullName: 'Eka Putri', nisn: '0051234505', phone: '083555555555', status: 'active' },
      
      // Kelas 11 IPA 1 (5 siswa)
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa6', passwordHash: hashedSiswa, fullName: 'Fajar Ramadhan', nisn: '0041234506', phone: '083666666666', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa7', passwordHash: hashedSiswa, fullName: 'Gita Savitri', nisn: '0041234507', phone: '083777777777', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa8', passwordHash: hashedSiswa, fullName: 'Hadi Kusuma', nisn: '0041234508', phone: '083888888888', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa9', passwordHash: hashedSiswa, fullName: 'Indah Permata', nisn: '0041234509', phone: '083999999999', status: 'active' },
      { tenantId: schools[0].tenantId, role: 'siswa', email: 'siswa10', passwordHash: hashedSiswa, fullName: 'Joko Widodo', nisn: '0041234510', phone: '083101010101', status: 'active' },
    ]).returning();

    // Create Student records
    const students = await db.insert(studentsTable).values([
      // 10 IPA 1
      { userId: studentUsers[0].userId, tenantId: schools[0].tenantId, classId: classes[0].classId, nisn: '0051234501', nis: '10001', fullName: 'Andi Pratama', gender: 'male', parentName: 'Bapak Andi Sr.', parentPhone: '081555111111' },
      { userId: studentUsers[1].userId, tenantId: schools[0].tenantId, classId: classes[0].classId, nisn: '0051234502', nis: '10002', fullName: 'Bella Anastasia', gender: 'female', parentName: 'Ibu Bella', parentPhone: '081555222222' },
      { userId: studentUsers[2].userId, tenantId: schools[0].tenantId, classId: classes[0].classId, nisn: '0051234503', nis: '10003', fullName: 'Citra Dewi', gender: 'female', parentName: 'Bapak Citra', parentPhone: '081555333333' },
      { userId: studentUsers[3].userId, tenantId: schools[0].tenantId, classId: classes[0].classId, nisn: '0051234504', nis: '10004', fullName: 'Doni Firmansyah', gender: 'male', parentName: 'Ibu Doni', parentPhone: '081555444444' },
      { userId: studentUsers[4].userId, tenantId: schools[0].tenantId, classId: classes[0].classId, nisn: '0051234505', nis: '10005', fullName: 'Eka Putri', gender: 'female', parentName: 'Bapak Eka', parentPhone: '081555555555' },
      
      // 11 IPA 1
      { userId: studentUsers[5].userId, tenantId: schools[0].tenantId, classId: classes[2].classId, nisn: '0041234506', nis: '11001', fullName: 'Fajar Ramadhan', gender: 'male', parentName: 'Bapak Fajar Sr.', parentPhone: '081555666666' },
      { userId: studentUsers[6].userId, tenantId: schools[0].tenantId, classId: classes[2].classId, nisn: '0041234507', nis: '11002', fullName: 'Gita Savitri', gender: 'female', parentName: 'Ibu Gita', parentPhone: '081555777777' },
      { userId: studentUsers[7].userId, tenantId: schools[0].tenantId, classId: classes[2].classId, nisn: '0041234508', nis: '11003', fullName: 'Hadi Kusuma', gender: 'male', parentName: 'Bapak Hadi Sr.', parentPhone: '081555888888' },
      { userId: studentUsers[8].userId, tenantId: schools[0].tenantId, classId: classes[2].classId, nisn: '0041234509', nis: '11004', fullName: 'Indah Permata', gender: 'female', parentName: 'Ibu Indah', parentPhone: '081555999999' },
      { userId: studentUsers[9].userId, tenantId: schools[0].tenantId, classId: classes[2].classId, nisn: '0041234510', nis: '11005', fullName: 'Joko Widodo', gender: 'male', parentName: 'Bapak Joko Sr.', parentPhone: '081555101010' },
    ]).returning();

    console.log(`✅ ${students.length} students created`);

    // === 7. TEACHER-SUBJECT MAPPING ===
    console.log('\n📚 Creating teacher-subject mappings...');
    
    const teacherSubjects = await db.insert(teacherSubjectsTable).values([
      // Guru 1 (Matematika) mengajar di 10 IPA 1 & 11 IPA 1
      { tenantId: schools[0].tenantId, teacherId: teachers[0].teacherId, subjectId: subjects[0].subjectId, classId: classes[0].classId, academicYearId: academicYears[0].academicYearId, hoursPerWeek: 4 },
      { tenantId: schools[0].tenantId, teacherId: teachers[0].teacherId, subjectId: subjects[0].subjectId, classId: classes[2].classId, academicYearId: academicYears[0].academicYearId, hoursPerWeek: 4 },
      
      // Guru 2 (B.Indonesia) mengajar di 10 IPA 1
      { tenantId: schools[0].tenantId, teacherId: teachers[1].teacherId, subjectId: subjects[1].subjectId, classId: classes[0].classId, academicYearId: academicYears[0].academicYearId, hoursPerWeek: 4 },
      
      // Guru 3 (B.Inggris) mengajar di 10 IPA 1 & 11 IPA 1
      { tenantId: schools[0].tenantId, teacherId: teachers[2].teacherId, subjectId: subjects[2].subjectId, classId: classes[0].classId, academicYearId: academicYears[0].academicYearId, hoursPerWeek: 3 },
      { tenantId: schools[0].tenantId, teacherId: teachers[2].teacherId, subjectId: subjects[2].subjectId, classId: classes[2].classId, academicYearId: academicYears[0].academicYearId, hoursPerWeek: 3 },
      
      // Guru 4 (Fisika) mengajar di 10 IPA 1
      { tenantId: schools[0].tenantId, teacherId: teachers[3].teacherId, subjectId: subjects[3].subjectId, classId: classes[0].classId, academicYearId: academicYears[0].academicYearId, hoursPerWeek: 4 },
      
      // Guru 5 (Kimia) mengajar di 10 IPA 1
      { tenantId: schools[0].tenantId, teacherId: teachers[4].teacherId, subjectId: subjects[4].subjectId, classId: classes[0].classId, academicYearId: academicYears[0].academicYearId, hoursPerWeek: 4 },
      
      // Guru 6 (Biologi) mengajar di 11 IPA 1
      { tenantId: schools[0].tenantId, teacherId: teachers[5].teacherId, subjectId: subjects[5].subjectId, classId: classes[2].classId, academicYearId: academicYears[0].academicYearId, hoursPerWeek: 4 },
    ]).returning();

    console.log(`✅ ${teacherSubjects.length} teacher-subject mappings created`);

    // === 8. REPORT TEMPLATE ===
    console.log('\n📄 Creating report template...');
    
    const templates = await db.insert(reportTemplatesTable).values([
      {
        tenantId: schools[0].tenantId,
        templateName: 'Rapor Semester Default',
        reportType: 'semester',
        structure: JSON.stringify({
          sections: ['identitas', 'nilai', 'kehadiran', 'catatan'],
        }),
        headerHtml: '<h1>RAPOR SEMESTER</h1>',
        footerHtml: '<p>Dicetak tanggal: {date}</p>',
        isActive: true,
      },
    ]).returning();

    console.log(`✅ ${templates.length} report templates created`);

    // === SUMMARY ===
    console.log('\n═══════════════════════════════════════');
    console.log('🎉 FULL SEEDING COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(`Schools: ${schools.length}`);
    console.log(`Academic Years: ${academicYears.length}`);
    console.log(`Classes: ${classes.length}`);
    console.log(`Subjects: ${subjects.length}`);
    console.log(`Teachers: ${teachers.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Teacher-Subject Mappings: ${teacherSubjects.length}`);
    console.log(`Report Templates: ${templates.length}`);
    console.log(`Total Users: ${1 + admins.length + guruUsers.length + studentUsers.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('📝 LOGIN CREDENTIALS:');
    console.log('Super Admin: superadmin / 121212');
    console.log('Admin: admin1 / admin123');
    console.log('Guru: guru1-guru8 / guru123');
    console.log('Siswa: siswa1-siswa10 / siswa123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedFull();
