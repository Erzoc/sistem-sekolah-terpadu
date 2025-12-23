import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { tenantsTable } from "./tenants";

export const schoolProfilesTable = sqliteTable("school_profiles", {
  profileId: text("profile_id").primaryKey().$defaultFn(() => createId()),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenantsTable.tenantId), // ✅ Changed from .id
  schoolName: text("school_name").notNull(),
  schoolAddress: text("school_address"),
  schoolPhone: text("school_phone"),
  schoolEmail: text("school_email"),
  npsn: text("npsn"),
  principalName: text("principal_name"),
  principalNip: text("principal_nip"),
  logoUrl: text("logo_url"),
  isActive: integer("is_active", { mode: "boolean" }).default(true), // ✅ Changed from boolean()
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const schoolProfilesRelations = relations(schoolProfilesTable, ({ one }) => ({
  tenant: one(tenantsTable, {
    fields: [schoolProfilesTable.tenantId],
    references: [tenantsTable.tenantId], // ✅ Changed from .id
  }),
}));

export type SchoolProfile = typeof schoolProfilesTable.$inferSelect;
export type NewSchoolProfile = typeof schoolProfilesTable.$inferInsert;
