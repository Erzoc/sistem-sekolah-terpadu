import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { tenantsTable } from "./tenants";
import { academicYearsTable } from "./academic_years";

export const kaldikTable = sqliteTable("kaldik", {
  kaldikId: text("kaldik_id").primaryKey().$defaultFn(() => createId()),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenantsTable.tenantId), // ✅ Fixed
  academicYearId: text("academic_year_id")
    .notNull()
    .references(() => academicYearsTable.academicYearId), // ✅ Fixed
  semester: text("semester", { enum: ["1", "2"] }).notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  effectiveWeeks: integer("effective_weeks").notNull(),
  holidays: text("holidays"),
  fileUrl: text("file_url"),
  extractedData: text("extracted_data"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const kaldikRelations = relations(kaldikTable, ({ one }) => ({
  tenant: one(tenantsTable, {
    fields: [kaldikTable.tenantId],
    references: [tenantsTable.tenantId], // ✅ Fixed
  }),
  academicYear: one(academicYearsTable, {
    fields: [kaldikTable.academicYearId],
    references: [academicYearsTable.academicYearId], // ✅ Fixed
  }),
}));

export type Kaldik = typeof kaldikTable.$inferSelect;
export type NewKaldik = typeof kaldikTable.$inferInsert;
