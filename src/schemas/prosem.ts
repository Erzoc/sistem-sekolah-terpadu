import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { tenantsTable } from "./tenants";
import { protaTable } from "./prota";

export const prosemTable = sqliteTable("prosem", {
  prosemId: text("prosem_id").primaryKey().$defaultFn(() => createId()),
  protaId: text("prota_id")
    .notNull()
    .references(() => protaTable.protaId),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenantsTable.tenantId), // ✅ Fixed
  semester: text("semester", { enum: ["1", "2"] }).notNull(),
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

export const prosemRelations = relations(prosemTable, ({ one }) => ({
  tenant: one(tenantsTable, {
    fields: [prosemTable.tenantId],
    references: [tenantsTable.tenantId], // ✅ Fixed
  }),
  prota: one(protaTable, {
    fields: [prosemTable.protaId],
    references: [protaTable.protaId],
  }),
}));

export type Prosem = typeof prosemTable.$inferSelect;
export type NewProsem = typeof prosemTable.$inferInsert;
