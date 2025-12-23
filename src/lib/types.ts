// ============================================
// SHARED TYPES FOR SST v1
// ============================================

// Existing types (Teachers & Students)
export interface Teacher {
  id: number;
  name: string;
  nip?: string;
  email: string;
  phone: string;
  position: string;
  subject: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Student {
  id: number;
  name: string;
  nisn: string;
  class: string;
  gender: 'male' | 'female';
  birthDate: string;
  address: string;
  parentName: string;
  parentPhone: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

// ============================================
// NEW: CLASSES MODULE TYPES
// ============================================

export type AcademicLevel = 'SD/MI' | 'SMP/MTs' | 'SMA/MA';

export type SubjectCategory = 'PAI' | 'Umum' | 'Seni & Budaya';

export interface Subject {
  id: number;
  name: string;
  category: SubjectCategory;
  code: string; // e.g., MTK, IPA, ARAB
  description?: string;
  createdAt: string;
}

export interface Class {
  id: number;
  name: string; // e.g., AL-KARIM, AR-ROQIIB
  level: AcademicLevel;
  grade: number; // 1-12
  academicYear: string; // e.g., 2024/2025
  capacity: number;
  currentStudents: number;
  waliKelas?: string; // Homeroom teacher name
  createdAt: string;
}

export interface TeacherAssignment {
  id: number;
  teacherId: number;
  teacherName: string;
  subjectIds: number[]; // Multiple subjects
  subjectNames: string[];
  classIds: number[]; // Multiple classes
  classNames: string[];
  academicYear: string;
  notes?: string;
  createdAt: string;
}

// Display format for full class name
export const getFullClassName = (cls: Class): string => {
  return `${cls.grade} - ${cls.name}`;
};
