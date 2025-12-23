// src/lib/types/schedule.ts
export interface Schedule {
  scheduleId: string;  // ← STRING, bukan number
  classId: string;     // ← STRING
  subjectId: string;   // ← STRING
  teacherId: string;   // ← STRING
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ScheduleWithRelations extends Schedule {
  class: {
    classId: string;
    className: string;
    level?: string | null;
  };
  subject: {
    subjectId: string;
    subjectName: string;
    subjectCode?: string | null;
  };
  teacher: {
    teacherId: string;
    fullName: string;
  };
}

export interface CreateScheduleDTO {
  classId: string;     // ← STRING
  subjectId: string;   // ← STRING
  teacherId: string;   // ← STRING
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}

export const DAY_NAMES = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
