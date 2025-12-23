// ============================================
// ATTENDANCE TYPES & INTERFACES
// ============================================

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  SICK: 'sick',
  PERMISSION: 'permission',
} as const;

export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];

export interface Attendance {
  attendanceId: string;
  tenantId: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  attendanceDate: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
  recordedBy?: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  summaryId: string;
  tenantId: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  month: string; // YYYY-MM
  presentCount: number;
  absentCount: number;
  sickCount: number;
  permissionCount: number;
  totalDays: number;
  attendanceRate: number; // Percentage
  updatedAt: string;
}

export interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  studentName: string;
  nisn: string;
  classId: string;
  className: string;
  attendanceDate: string;
  status: AttendanceStatus;
  notes?: string;
  recordedAt: string;
}

export interface AttendanceReport {
  studentId: string;
  studentName: string;
  nisn: string;
  presentCount: number;
  absentCount: number;
  sickCount: number;
  permissionCount: number;
  totalRecords: number;
  attendanceRate: number;
}
