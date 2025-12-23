import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const attendanceTable = sqliteTable('attendance', {
  attendanceId: text('attendance_id').primaryKey(),
  tenantId: text('tenant_id').notNull().default('default'),
  studentId: text('student_id').notNull(),
  classId: text('class_id').notNull(),
  academicYearId: text('academic_year_id').notNull(),
  attendanceDate: text('attendance_date').notNull(), // YYYY-MM-DD
  status: text('status').notNull(), // present, absent, sick, permission
  notes: text('notes'),
  recordedBy: text('recorded_by'),
  recordedAt: text('recorded_at').notNull().default('CURRENT_TIMESTAMP'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const attendanceSummaryTable = sqliteTable('attendance_summary', {
  summaryId: text('summary_id').primaryKey(),
  tenantId: text('tenant_id').notNull().default('default'),
  studentId: text('student_id').notNull(),
  classId: text('class_id').notNull(),
  academicYearId: text('academic_year_id').notNull(),
  month: text('month').notNull(), // YYYY-MM
  presentCount: integer('present_count').notNull().default(0),
  absentCount: integer('absent_count').notNull().default(0),
  sickCount: integer('sick_count').notNull().default(0),
  permissionCount: integer('permission_count').notNull().default(0),
  totalDays: integer('total_days').notNull().default(0),
  attendanceRate: real('attendance_rate').notNull().default(0),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export type Attendance = typeof attendanceTable.$inferSelect;
export type NewAttendance = typeof attendanceTable.$inferInsert;
export type AttendanceSummary = typeof attendanceSummaryTable.$inferSelect;
export type NewAttendanceSummary = typeof attendanceSummaryTable.$inferInsert;
