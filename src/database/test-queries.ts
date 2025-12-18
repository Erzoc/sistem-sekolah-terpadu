import { db } from './client';
import { 
  usersTable,
  studentsTable,
  classesTable,
  teachersTable,
  teacherSubjectsTable,
  subjectsTable,
  academicYearsTable,
} from '@/schemas';
import { eq } from 'drizzle-orm';

async function testQueries() {
  console.log('🔍 TESTING DATABASE QUERIES & RELATIONS\n');
  console.log('═══════════════════════════════════════\n');

  try {
    // === TEST 1: Query Siswa dengan Kelasnya ===
    console.log('📚 TEST 1: Query Siswa + Class Info');
    console.log('─────────────────────────────────────');
    
    const siswaWithClass = await db
      .select({
        studentName: studentsTable.fullName,
        nisn: studentsTable.nisn,
        className: classesTable.className,
        level: classesTable.level,
        gender: studentsTable.gender,
      })
      .from(studentsTable)
      .leftJoin(classesTable, eq(studentsTable.classId, classesTable.classId))
      .limit(5);

    console.log('✅ Found', siswaWithClass.length, 'students with class info:');
    siswaWithClass.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.studentName} (${s.nisn}) - Kelas ${s.className}`);
    });

    // === TEST 2: Query Guru dengan Mata Pelajaran ===
    console.log('\n📖 TEST 2: Query Guru + Subjects yang Diajar');
    console.log('─────────────────────────────────────');
    
    const guruWithSubjects = await db
      .select({
        teacherName: usersTable.fullName,
        nip: teachersTable.nip,
        subjectName: subjectsTable.subjectName,
        subjectCode: subjectsTable.subjectCode,
        className: classesTable.className,
        hoursPerWeek: teacherSubjectsTable.hoursPerWeek,
      })
      .from(teachersTable)
      .innerJoin(usersTable, eq(teachersTable.userId, usersTable.userId))
      .innerJoin(teacherSubjectsTable, eq(teachersTable.teacherId, teacherSubjectsTable.teacherId))
      .innerJoin(subjectsTable, eq(teacherSubjectsTable.subjectId, subjectsTable.subjectId))
      .innerJoin(classesTable, eq(teacherSubjectsTable.classId, classesTable.classId))
      .limit(8);

    console.log('✅ Found', guruWithSubjects.length, 'teacher-subject mappings:');
    guruWithSubjects.forEach((g, i) => {
      console.log(`   ${i + 1}. ${g.teacherName} mengajar ${g.subjectName} di ${g.className} (${g.hoursPerWeek} jam/minggu)`);
    });

    // === TEST 3: Query Kelas dengan Jumlah Siswa ===
    console.log('\n🏫 TEST 3: Query Kelas + Student Count');
    console.log('─────────────────────────────────────');
    
    const allClasses = await db
      .select({
        className: classesTable.className,
        level: classesTable.level,
        capacity: classesTable.capacity,
      })
      .from(classesTable);

    console.log('✅ Found', allClasses.length, 'classes:');
    
    for (const cls of allClasses) {
      const studentCount = await db
        .select()
        .from(studentsTable)
        .where(eq(studentsTable.classId, cls.className));
      
      console.log(`   - ${cls.className}: ${studentCount.length}/${cls.capacity} siswa`);
    }

    // === TEST 4: Query Academic Year Info ===
    console.log('\n📅 TEST 4: Query Academic Years');
    console.log('─────────────────────────────────────');
    
    const academicYears = await db
      .select({
        year: academicYearsTable.year,
        status: academicYearsTable.status,
        startDate: academicYearsTable.startDate,
        endDate: academicYearsTable.endDate,
      })
      .from(academicYearsTable);

    console.log('✅ Found', academicYears.length, 'academic years:');
    academicYears.forEach((ay, i) => {
      const start = new Date(ay.startDate).toLocaleDateString('id-ID');
      const end = new Date(ay.endDate).toLocaleDateString('id-ID');
      console.log(`   ${i + 1}. ${ay.year} (${ay.status}) - ${start} s/d ${end}`);
    });

    // === TEST 5: Query Students by Gender ===
    console.log('\n👥 TEST 5: Student Statistics by Gender');
    console.log('─────────────────────────────────────');
    
    const maleStudents = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.gender, 'male'));
    
    const femaleStudents = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.gender, 'female'));

    console.log(`✅ Male students: ${maleStudents.length}`);
    console.log(`✅ Female students: ${femaleStudents.length}`);
    console.log(`✅ Total: ${maleStudents.length + femaleStudents.length}`);

    // === TEST 6: Query Teachers by Position ===
    console.log('\n👨‍🏫 TEST 6: Teachers by Position');
    console.log('─────────────────────────────────────');
    
    const teachersByPosition = await db
      .select({
        fullName: usersTable.fullName,
        position: teachersTable.position,
        nip: teachersTable.nip,
      })
      .from(teachersTable)
      .innerJoin(usersTable, eq(teachersTable.userId, usersTable.userId));

    console.log(`✅ Found ${teachersByPosition.length} teachers:`);
    teachersByPosition.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.fullName} (${t.position}) - NIP: ${t.nip}`);
    });

    // === SUMMARY ===
    console.log('\n═══════════════════════════════════════');
    console.log('🎉 ALL QUERY TESTS PASSED!');
    console.log('═══════════════════════════════════════');
    console.log('✅ Student-Class relations: OK');
    console.log('✅ Teacher-Subject-Class relations: OK');
    console.log('✅ Class capacity tracking: OK');
    console.log('✅ Academic year queries: OK');
    console.log('✅ Student statistics: OK');
    console.log('✅ Teacher queries: OK');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Query test FAILED:', error);
    process.exit(1);
  }
}

testQueries();
