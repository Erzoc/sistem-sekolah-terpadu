// ============================================
// ATTENDANCE UTILITIES
// ============================================

import { AttendanceStatus } from './types/attendance';

export const attendanceConfig = {
  statuses: [
    { key: 'present', label: 'Hadir', color: '#10b981', bgColor: 'bg-green-50', emoji: '✅' },
    { key: 'absent', label: 'Tidak Hadir', color: '#ef4444', bgColor: 'bg-red-50', emoji: '❌' },
    { key: 'sick', label: 'Sakit', color: '#f59e0b', bgColor: 'bg-yellow-50', emoji: '🤒' },
    { key: 'permission', label: 'Izin', color: '#3b82f6', bgColor: 'bg-blue-50', emoji: '📋' },
  ] as const,
};

// Format date to YYYY-MM-DD
export const formatDateForAttendance = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  return formatDateForAttendance(new Date());
};

// Get status badge config
export const getStatusConfig = (status: string) => {
  return attendanceConfig.statuses.find((s) => s.key === status);
};

// Calculate attendance rate percentage
export const calculateAttendanceRate = (presentCount: number, totalDays: number): number => {
  if (totalDays === 0) return 0;
  return Math.round((presentCount / totalDays) * 100);
};

// Get attendance rate color based on percentage
export const getAttendanceRateColor = (rate: number): string => {
  if (rate >= 90) return '#10b981'; // Green
  if (rate >= 75) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

// Generate date range (skip weekends)
export const getDateRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    // Skip Sunday (0) and Saturday (6)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(formatDateForAttendance(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

// Get month from date string (YYYY-MM)
export const getMonthFromDate = (dateStr: string): string => {
  return dateStr.substring(0, 7);
};

// Format date for display
export const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Generate unique ID for attendance
export const generateAttendanceId = (): string => {
  return `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
