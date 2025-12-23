// src/schemas/schedules.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { classesTable } from './classes';
import { subjectsTable } from './subjects';
import { teachersTable } from './teachers';
import { createId } from '@paralleldrive/cuid2';

export const schedulesTable = sqliteTable('schedules', {
  scheduleId: text('schedule_id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  classId: text('class_id')
    .notNull()
    .references(() => classesTable.classId, { onDelete: 'cascade' }),
  
  subjectId: text('subject_id')
    .notNull()
    .references(() => subjectsTable.subjectId, { onDelete: 'cascade' }),
  
  teacherId: text('teacher_id')
    .notNull()
    .references(() => teachersTable.teacherId, { onDelete: 'cascade' }),
  
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  room: text('room'),
  
  // FIX: Ubah format timestamp
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const schedulesRelations = relations(schedulesTable, ({ one }) => ({
  class: one(classesTable, {
    fields: [schedulesTable.classId],
    references: [classesTable.classId],
  }),
  subject: one(subjectsTable, {
    fields: [schedulesTable.subjectId],
    references: [subjectsTable.subjectId],
  }),
  teacher: one(teachersTable, {
    fields: [schedulesTable.teacherId],
    references: [teachersTable.teacherId],
  }),
}));

export type Schedule = typeof schedulesTable.$inferSelect;
export type NewSchedule = typeof schedulesTable.$inferInsert;
