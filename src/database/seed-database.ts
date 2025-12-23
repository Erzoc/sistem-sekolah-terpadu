import { db } from './client';
import {
  teachersTable,
  studentsTable,
  subjectsTable,
  classesTable,
  teacherAssignmentsTable,
} from '../schemas';

async function seed() {
  console.log('🌱 Seeding database with REAL school data...');

  try {
    // 1. SEED SUBJECTS (Sesuai daftar asli)
    console.log('📚 Seeding subjects...');
    const subjects = [
      { subjectId: 'subj-1', subjectCode: 'PRAKTEK', subjectName: 'Praktek Ibadah', category: 'PAI', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-2', subjectCode: 'SKI', subjectName: 'SKI', category: 'PAI', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-3', subjectCode: 'ARAB', subjectName: 'B Arab', category: 'PAI', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-4', subjectCode: 'QURAN', subjectName: "Qur'an", category: 'PAI', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-5', subjectCode: 'TAHFIZ', subjectName: 'Tahfiz', category: 'PAI', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-6', subjectCode: 'FIQIH', subjectName: 'Fiqih', category: 'PAI', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-7', subjectCode: 'SENI', subjectName: 'Seni Tari', category: 'Seni & Budaya', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-8', subjectCode: 'MTK', subjectName: 'Matematika', category: 'Umum', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-9', subjectCode: 'INFORMATIKA', subjectName: 'Informatika', category: 'Umum', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-10', subjectCode: 'PKN', subjectName: 'PKn', category: 'Umum', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-11', subjectCode: 'AQIDAH', subjectName: 'Aqidah', category: 'PAI', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-12', subjectCode: 'PUSTAKA', subjectName: 'Pustaka', category: 'Umum', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-13', subjectCode: 'BIND', subjectName: 'B Indo', category: 'Umum', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-14', subjectCode: 'ENGLISH', subjectName: 'English', category: 'Umum', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-15', subjectCode: 'IPA', subjectName: 'IPA', category: 'Umum', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-16', subjectCode: 'IPS', subjectName: 'IPS', category: 'Umum', level: 'SMP/MTs', kkm: 75 },
      { subjectId: 'subj-17', subjectCode: 'KIMIA', subjectName: 'Kimia', category: 'Umum', level: 'SMA/MA', kkm: 75 },
      { subjectId: 'subj-18', subjectCode: 'FISIKA', subjectName: 'Fisika', category: 'Umum', level: 'SMA/MA', kkm: 75 },
    ];
    await db.insert(subjectsTable).values(subjects);
    console.log(`✅ Inserted ${subjects.length} subjects`);

    // 2. SEED CLASSES (Struktur sesuai asli)
    console.log('🏫 Seeding classes...');
    const classes = [
      // Kelas VII (Grade 7)
      { classId: 'cls-7-karim', className: 'AL-KARIM', grade: 7, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      { classId: 'cls-7-roqiib', className: 'AR-ROQIIB', grade: 7, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      { classId: 'cls-7-mujib', className: 'AL-MUJIB', grade: 7, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      
      // Kelas VIII (Grade 8)
      { classId: 'cls-8-wasii', className: 'AL-WASII', grade: 8, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      { classId: 'cls-8-hakim', className: 'AL-HAKIM', grade: 8, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      { classId: 'cls-8-muqtadir', className: 'AL-MUQTADIR', grade: 8, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      { classId: 'cls-8-waduud', className: 'AL-WADUUD', grade: 8, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      
      // Kelas IX (Grade 9)
      { classId: 'cls-9-qodir', className: 'AL-QODIR', grade: 9, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      { classId: 'cls-9-majid', className: 'AL-MAJID', grade: 9, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      { classId: 'cls-9-baits', className: 'AL-BAITS', grade: 9, level: 'SMP/MTs', academicYear: '2024/2025', capacity: 30 },
      
      // Kelas X (Grade 10)
      { classId: 'cls-10-syahid', className: 'AS-SYAHID', grade: 10, level: 'SMA/MA', academicYear: '2024/2025', capacity: 30 },
      
      // Kelas XI (Grade 11)
      { classId: 'cls-11-haqq', className: 'AL-HAQQ', grade: 11, level: 'SMA/MA', academicYear: '2024/2025', capacity: 30 },
      
      // Kelas XII (Grade 12)
      { classId: 'cls-12-wakiil', className: 'AL-WAKIIL', grade: 12, level: 'SMA/MA', academicYear: '2024/2025', capacity: 30 },
    ];
    await db.insert(classesTable).values(classes);
    console.log(`✅ Inserted ${classes.length} classes`);

    // 3. SEED TEACHERS
    console.log('👨‍🏫 Seeding teachers...');
    const teachers = [
      {
        teacherId: 'tchr-sindy',
        nip: '198501012010012001',
        fullName: 'Bu Sindy',
        email: 'sindy@sstf.id',
        phone: '081234567890',
        position: 'Guru Tetap',
        employmentStatus: 'active',
        joinDate: '2015-07-01',
        gender: 'female',
        education: 'S1',
        certification: 'yes',
      },
      {
        teacherId: 'tchr-fauzan',
        nip: '198703152012011001',
        fullName: 'Ustadz Fauzan',
        email: 'fauzan@sstf.id',
        phone: '081234567891',
        position: 'Guru Tetap',
        employmentStatus: 'active',
        joinDate: '2016-07-01',
        gender: 'male',
        education: 'S1',
        certification: 'yes',
      },
      {
        teacherId: 'tchr-3',
        nip: '199001202015011003',
        fullName: 'Ahmad Fadli',
        email: 'ahmad.fadli@sstf.id',
        phone: '081234567892',
        position: 'Guru Tetap',
        employmentStatus: 'active',
        joinDate: '2015-07-01',
        gender: 'male',
        education: 'S1',
        certification: 'no',
      },
      {
        teacherId: 'tchr-4',
        nip: '199205102016012004',
        fullName: 'Rina Wijaya',
        email: 'rina.wijaya@sstf.id',
        phone: '081234567893',
        position: 'Guru Honorer',
        employmentStatus: 'active',
        joinDate: '2016-07-01',
        gender: 'female',
        education: 'S1',
        certification: 'no',
      },
      {
        teacherId: 'tchr-5',
        nip: '199308152018011005',
        fullName: 'Dedi Kurniawan',
        email: 'dedi.kurniawan@sstf.id',
        phone: '081234567894',
        position: 'Guru Kontrak',
        employmentStatus: 'active',
        joinDate: '2018-07-01',
        gender: 'male',
        education: 'S1',
        certification: 'no',
      },
    ];
    await db.insert(teachersTable).values(teachers);
    console.log(`✅ Inserted ${teachers.length} teachers`);

    // 4. SEED STUDENTS (Sample per kelas)
    console.log('👨‍🎓 Seeding students...');
    const students = [
      // Kelas 7 AL-KARIM
      { studentId: 'std-7k-1', nisn: '0075001001', fullName: 'Muhammad Rizki', classId: 'cls-7-karim', gender: 'male', birthDate: '2010-05-15', parentName: 'Bapak Rizki', parentPhone: '081234560001', enrollmentDate: '2022-07-01', status: 'active' },
      { studentId: 'std-7k-2', nisn: '0075001002', fullName: 'Siti Aisyah', classId: 'cls-7-karim', gender: 'female', birthDate: '2010-08-20', parentName: 'Ibu Aisyah', parentPhone: '081234560002', enrollmentDate: '2022-07-01', status: 'active' },
      
      // Kelas 7 AR-ROQIIB
      { studentId: 'std-7r-1', nisn: '0075002001', fullName: 'Ahmad Fauzi', classId: 'cls-7-roqiib', gender: 'male', birthDate: '2010-03-10', parentName: 'Bapak Fauzi', parentPhone: '081234560003', enrollmentDate: '2022-07-01', status: 'active' },
      { studentId: 'std-7r-2', nisn: '0075002002', fullName: 'Fatimah Zahra', classId: 'cls-7-roqiib', gender: 'female', birthDate: '2010-11-05', parentName: 'Ibu Zahra', parentPhone: '081234560004', enrollmentDate: '2022-07-01', status: 'active' },
      
      // Kelas 8 AL-WASII
      { studentId: 'std-8w-1', nisn: '0074001001', fullName: 'Usman Hakim', classId: 'cls-8-wasii', gender: 'male', birthDate: '2009-06-12', parentName: 'Bapak Hakim', parentPhone: '081234560005', enrollmentDate: '2021-07-01', status: 'active' },
      { studentId: 'std-8w-2', nisn: '0074001002', fullName: 'Khadijah Nur', classId: 'cls-8-wasii', gender: 'female', birthDate: '2009-09-18', parentName: 'Ibu Nur', parentPhone: '081234560006', enrollmentDate: '2021-07-01', status: 'active' },
    ];
    await db.insert(studentsTable).values(students);
    console.log(`✅ Inserted ${students.length} students`);

    // 5. SEED TEACHER ASSIGNMENTS (Sesuai pattern asli)
    console.log('📋 Seeding teacher assignments...');
    const assignments: Array<{
  assignmentId: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  academicYear: string;
}> = [];
    let assignmentCounter = 1;

    // Bu Sindy: Informatika di semua kelas 7 + IPS di semua SMP
    ['cls-7-karim', 'cls-7-roqiib', 'cls-7-mujib'].forEach(classId => {
      assignments.push({
        assignmentId: `asgn-${assignmentCounter++}`,
        teacherId: 'tchr-sindy',
        subjectId: 'subj-9', // Informatika
        classId,
        academicYear: '2024/2025',
      });
    });

    // Bu Sindy: IPS di semua kelas SMP (7, 8, 9)
    ['cls-7-karim', 'cls-7-roqiib', 'cls-7-mujib', 'cls-8-wasii', 'cls-8-hakim', 'cls-8-muqtadir', 'cls-8-waduud', 'cls-9-qodir', 'cls-9-majid', 'cls-9-baits'].forEach(classId => {
      assignments.push({
        assignmentId: `asgn-${assignmentCounter++}`,
        teacherId: 'tchr-sindy',
        subjectId: 'subj-16', // IPS
        classId,
        academicYear: '2024/2025',
      });
    });

    // Ustadz Fauzan: Informatika di kelas 8 dan 9
    ['cls-8-wasii', 'cls-8-hakim', 'cls-8-muqtadir', 'cls-8-waduud', 'cls-9-qodir', 'cls-9-majid', 'cls-9-baits'].forEach(classId => {
      assignments.push({
        assignmentId: `asgn-${assignmentCounter++}`,
        teacherId: 'tchr-fauzan',
        subjectId: 'subj-9', // Informatika
        classId,
        academicYear: '2024/2025',
      });
    });

    await db.insert(teacherAssignmentsTable).values(assignments);
    console.log(`✅ Inserted ${assignments.length} teacher assignments`);

    console.log('✅ Database seeded successfully with REAL data!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding error:', error);
    process.exit(1);
  });
