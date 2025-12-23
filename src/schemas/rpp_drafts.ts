import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { tenantsTable } from "./tenants";
import { teachersTable } from "./teachers";
import { subjectsTable } from "./subjects";
import { classesTable } from "./classes";
import { prosemTable } from "./prosem";

export const rppDraftsTable = sqliteTable("rpp_drafts", {
  rppId: text("rpp_id").primaryKey().$defaultFn(() => createId()),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenantsTable.tenantId), // ✅ Fixed
  teacherId: text("teacher_id")
    .notNull()
    .references(() => teachersTable.teacherId), // ✅ Fixed - verify PK name
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjectsTable.subjectId), // ✅ Fixed - verify PK name
  classId: text("class_id")
    .notNull()
    .references(() => classesTable.classId), // ✅ Fixed - verify PK name
  prosemId: text("prosem_id").references(() => prosemTable.prosemId),
  topic: text("topic").notNull(),
  curriculum: text("curriculum", { enum: ["K13", "Merdeka", "Custom"] })
    .default("K13")
    .notNull(),
  duration: integer("duration").notNull(),
  learningObjectives: text("learning_objectives"),
  materials: text("materials"),
  content: text("content").notNull(),
  docxFile: blob("docx_file"),
  status: text("status", { enum: ["draft", "published", "archived"] })
    .default("draft")
    .notNull(),
  version: integer("version").default(1).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const rppDraftsRelations = relations(rppDraftsTable, ({ one, many }) => ({
  tenant: one(tenantsTable, {
    fields: [rppDraftsTable.tenantId],
    references: [tenantsTable.tenantId], // ✅ Fixed
  }),
  teacher: one(teachersTable, {
    fields: [rppDraftsTable.teacherId],
    references: [teachersTable.teacherId], // ✅ Fixed - verify PK name
  }),
  subject: one(subjectsTable, {
    fields: [rppDraftsTable.subjectId],
    references: [subjectsTable.subjectId], // ✅ Fixed - verify PK name
  }),
  class: one(classesTable, {
    fields: [rppDraftsTable.classId],
    references: [classesTable.classId], // ✅ Fixed - verify PK name
  }),
  prosem: one(prosemTable, {
    fields: [rppDraftsTable.prosemId],
    references: [prosemTable.prosemId],
  }),
}));

export type RppDraft = typeof rppDraftsTable.$inferSelect;
export type NewRppDraft = typeof rppDraftsTable.$inferInsert;
