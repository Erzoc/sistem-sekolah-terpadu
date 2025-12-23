import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { tenantsTable } from "./tenants";
import { teachersTable } from "./teachers";
import { subjectsTable } from "./subjects";
import { classesTable } from "./classes";
import { academicYearsTable } from "./academic_years";
import { kaldikTable } from "./kaldik";

export const protaTable = sqliteTable("prota", {
  protaId: text("prota_id").primaryKey().$defaultFn(() => createId()),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenantsTable.tenantId), // ✅ Fixed
  teacherId: text("teacher_id")
    .notNull()
    .references(() => teachersTable.teacherId), // ✅ Check your teachers table PK name
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjectsTable.subjectId), // ✅ Check your subjects table PK name
  classId: text("class_id")
    .notNull()
    .references(() => classesTable.classId), // ✅ Check your classes table PK name
  academicYearId: text("academic_year_id")
    .notNull()
    .references(() => academicYearsTable.academicYearId), // ✅ Fixed
  kaldikId: text("kaldik_id").references(() => kaldikTable.kaldikId),
  title: text("title").notNull(),
  totalAllocatedHours: integer("total_allocated_hours"),
  content: text("content").notNull(),
  status: text("status", { enum: ["draft", "published"] })
    .default("draft")
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const protaRelations = relations(protaTable, ({ one }) => ({
  tenant: one(tenantsTable, {
    fields: [protaTable.tenantId],
    references: [tenantsTable.tenantId], // ✅ Fixed
  }),
  teacher: one(teachersTable, {
    fields: [protaTable.teacherId],
    references: [teachersTable.teacherId], // ✅ Fixed - verify PK name
  }),
  subject: one(subjectsTable, {
    fields: [protaTable.subjectId],
    references: [subjectsTable.subjectId], // ✅ Fixed - verify PK name
  }),
  class: one(classesTable, {
    fields: [protaTable.classId],
    references: [classesTable.classId], // ✅ Fixed - verify PK name
  }),
  academicYear: one(academicYearsTable, {
    fields: [protaTable.academicYearId],
    references: [academicYearsTable.academicYearId], // ✅ Fixed
  }),
  kaldik: one(kaldikTable, {
    fields: [protaTable.kaldikId],
    references: [kaldikTable.kaldikId],
  }),
}));

export type Prota = typeof protaTable.$inferSelect;
export type NewProta = typeof protaTable.$inferInsert;
