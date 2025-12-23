// src/schemas/kaldik-files.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const kaldikFiles = sqliteTable("kaldik_files", {
  fileId: text("file_id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  tenantId: text("tenant_id").notNull(),
  kaldikId: text("kaldik_id"),

  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  storagePath: text("storage_path").notNull(),

  status: text("status", {
    enum: ["pending", "processing", "completed", "failed"],
  })
    .notNull()
    .default("pending"),

  extractionAttempts: integer("extraction_attempts").notNull().default(0),
  lastError: text("last_error"),

  extractedData: text("extracted_data"),

  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  processedAt: integer("processed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export type KaldikFile = typeof kaldikFiles.$inferSelect;
export type KaldikFileInsert = typeof kaldikFiles.$inferInsert;
