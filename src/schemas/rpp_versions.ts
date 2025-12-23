import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { rppDraftsTable } from "./rpp_drafts";
import { teachersTable } from "./teachers";

export const rppVersionsTable = sqliteTable("rpp_versions", {
  versionId: text("version_id").primaryKey().$defaultFn(() => createId()),
  rppId: text("rpp_id")
    .notNull()
    .references(() => rppDraftsTable.rppId),
  versionNumber: integer("version_number").notNull(),
  content: text("content").notNull(),
  changeDescription: text("change_description"),
  createdBy: text("created_by")
    .notNull()
    .references(() => teachersTable.teacherId), // ✅ Fixed - verify PK name
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const rppVersionsRelations = relations(rppVersionsTable, ({ one }) => ({
  rppDraft: one(rppDraftsTable, {
    fields: [rppVersionsTable.rppId],
    references: [rppDraftsTable.rppId],
  }),
  creator: one(teachersTable, {
    fields: [rppVersionsTable.createdBy],
    references: [teachersTable.teacherId], // ✅ Fixed - verify PK name
  }),
}));

export type RppVersion = typeof rppVersionsTable.$inferSelect;
export type NewRppVersion = typeof rppVersionsTable.$inferInsert;
