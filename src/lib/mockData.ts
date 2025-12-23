// ============================================
// MOCK DATA - CLASSES MODULE
// ============================================

import { Subject, Class, TeacherAssignment } from './types';

// Subjects sesuai Madrasah Anda
export const mockSubjects: Subject[] = [
  // PAI Category
  { id: 1, name: 'Praktek Ibadah', category: 'PAI', code: 'PIB', createdAt: '2024-01-15' },
  { id: 2, name: 'SKI', category: 'PAI', code: 'SKI', createdAt: '2024-01-15' },
  { id: 3, name: 'Bahasa Arab', category: 'PAI', code: 'ARAB', createdAt: '2024-01-15' },
  { id: 4, name: "Qur'an", category: 'PAI', code: 'QRN', createdAt: '2024-01-15' },
  { id: 5, name: 'Tahfiz', category: 'PAI', code: 'THF', createdAt: '2024-01-15' },
  { id: 6, name: 'Fiqih', category: 'PAI', code: 'FQH', createdAt: '2024-01-15' },
  { id: 7, name: 'Aqidah', category: 'PAI', code: 'AQD', createdAt: '2024-01-15' },
  
  // Umum Category
  { id: 8, name: 'Matematika', category: 'Umum', code: 'MTK', createdAt: '2024-01-15' },
  { id: 9, name: 'Informatika', category: 'Umum', code: 'INF', createdAt: '2024-01-15' },
  { id: 10, name: 'PKN', category: 'Umum', code: 'PKN', createdAt: '2024-01-15' },
  { id: 11, name: 'Bahasa Indonesia', category: 'Umum', code: 'BIND', createdAt: '2024-01-15' },
  { id: 12, name: 'English', category: 'Umum', code: 'ENG', createdAt: '2024-01-15' },
  { id: 13, name: 'IPA', category: 'Umum', code: 'IPA', createdAt: '2024-01-15' },
  { id: 14, name: 'IPS', category: 'Umum', code: 'IPS', createdAt: '2024-01-15' },
  { id: 15, name: 'Kimia', category: 'Umum', code: 'KIM', createdAt: '2024-01-15' },
  { id: 16, name: 'Fisika', category: 'Umum', code: 'FIS', createdAt: '2024-01-15' },
  
  // Seni & Budaya
  { id: 17, name: 'Seni Tari', category: 'Seni & Budaya', code: 'TARI', createdAt: '2024-01-15' },
  { id: 18, name: 'Pustaka', category: 'Seni & Budaya', code: 'PUST', createdAt: '2024-01-15' },
];

// Classes dengan Asmaul Husna
export const mockClasses: Class[] = [
  // Kelas 7 (SMP/MTs)
  { 
    id: 1, 
    name: 'AL-KARIM', 
    level: 'SMP/MTs', 
    grade: 7, 
    academicYear: '2024/2025',
    capacity: 30,
    currentStudents: 28,
    waliKelas: 'Bu Siti Aminah',
    createdAt: '2024-07-01'
  },
  { 
    id: 2, 
    name: 'AR-ROQIIB', 
    level: 'SMP/MTs', 
    grade: 7, 
    academicYear: '2024/2025',
    capacity: 30,
    currentStudents: 27,
    createdAt: '2024-07-01'
  },
  { 
    id: 3, 
    name: 'AL-MUJIB', 
    level: 'SMP/MTs', 
    grade: 7, 
    academicYear: '2024/2025',
    capacity: 30,
    currentStudents: 29,
    createdAt: '2024-07-01'
  },
  
  // Kelas 8 (SMP/MTs)
  { 
    id: 4, 
    name: 'AL-WASII', 
    level: 'SMP/MTs', 
    grade: 8, 
    academicYear: '2024/2025',
    capacity: 32,
    currentStudents: 30,
    createdAt: '2024-07-01'
  },
  { 
    id: 5, 
    name: 'AL-HAKIM', 
    level: 'SMP/MTs', 
    grade: 8, 
    academicYear: '2024/2025',
    capacity: 32,
    currentStudents: 31,
    createdAt: '2024-07-01'
  },
  { 
    id: 6, 
    name: 'AL-MUQTADIR', 
    level: 'SMP/MTs', 
    grade: 8, 
    academicYear: '2024/2025',
    capacity: 32,
    currentStudents: 29,
    createdAt: '2024-07-01'
  },
  { 
    id: 7, 
    name: 'AL-WADUUD', 
    level: 'SMP/MTs', 
    grade: 8, 
    academicYear: '2024/2025',
    capacity: 32,
    currentStudents: 30,
    createdAt: '2024-07-01'
  },
  
  // Kelas 9 (SMP/MTs)
  { 
    id: 8, 
    name: 'AL-QODIR', 
    level: 'SMP/MTs', 
    grade: 9, 
    academicYear: '2024/2025',
    capacity: 30,
    currentStudents: 28,
    createdAt: '2024-07-01'
  },
  { 
    id: 9, 
    name: 'AL-MAJID', 
    level: 'SMP/MTs', 
    grade: 9, 
    academicYear: '2024/2025',
    capacity: 30,
    currentStudents: 27,
    createdAt: '2024-07-01'
  },
  { 
    id: 10, 
    name: 'AL-BAITS', 
    level: 'SMP/MTs', 
    grade: 9, 
    academicYear: '2024/2025',
    capacity: 30,
    currentStudents: 29,
    createdAt: '2024-07-01'
  },
  
  // Kelas 10 (SMA/MA)
  { 
    id: 11, 
    name: 'AS-SYAHID', 
    level: 'SMA/MA', 
    grade: 10, 
    academicYear: '2024/2025',
    capacity: 28,
    currentStudents: 25,
    createdAt: '2024-07-01'
  },
  
  // Kelas 11 (SMA/MA)
  { 
    id: 12, 
    name: 'AL-HAQQ', 
    level: 'SMA/MA', 
    grade: 11, 
    academicYear: '2024/2025',
    capacity: 28,
    currentStudents: 26,
    createdAt: '2024-07-01'
  },
  
  // Kelas 12 (SMA/MA)
  { 
    id: 13, 
    name: 'AL-WAKIIL', 
    level: 'SMA/MA', 
    grade: 12, 
    academicYear: '2024/2025',
    capacity: 25,
    currentStudents: 24,
    createdAt: '2024-07-01'
  },
];

// Teacher Assignments - Sesuai data sample
export const mockTeacherAssignments: TeacherAssignment[] = [
  {
    id: 1,
    teacherId: 1, // Bu Sindy (assuming id from teachers mock)
    teacherName: 'Bu Sindy',
    subjectIds: [9, 14], // Informatika & IPS
    subjectNames: ['Informatika', 'IPS'],
    classIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // All SMP classes
    classNames: [
      '7 - AL-KARIM', '7 - AR-ROQIIB', '7 - AL-MUJIB',
      '8 - AL-WASII', '8 - AL-HAKIM', '8 - AL-MUQTADIR', '8 - AL-WADUUD',
      '9 - AL-QODIR', '9 - AL-MAJID', '9 - AL-BAITS'
    ],
    academicYear: '2024/2025',
    notes: 'Mengajar Informatika di kelas 7, IPS di semua kelas SMP',
    createdAt: '2024-07-10'
  },
  {
    id: 2,
    teacherId: 2, // Ustadz Fauzan
    teacherName: 'Ustadz Fauzan',
    subjectIds: [9], // Informatika
    subjectNames: ['Informatika'],
    classIds: [4, 5, 6, 7, 8, 9, 10], // Kelas 8 & 9
    classNames: [
      '8 - AL-WASII', '8 - AL-HAKIM', '8 - AL-MUQTADIR', '8 - AL-WADUUD',
      '9 - AL-QODIR', '9 - AL-MAJID', '9 - AL-BAITS'
    ],
    academicYear: '2024/2025',
    notes: 'Mengajar Informatika di kelas 8 dan 9',
    createdAt: '2024-07-10'
  },
];
