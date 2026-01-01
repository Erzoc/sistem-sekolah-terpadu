PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_kaldik_files` (
	`file_id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`tenant_id` text NOT NULL,
	`kaldik_id` text,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`storage_path` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`extraction_attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`extracted_data` text,
	`uploaded_at` integer DEFAULT CURRENT_TIMESTAMP,
	`processed_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_kaldik_files`("file_id", "tenant_id", "kaldik_id", "file_name", "file_size", "mime_type", "storage_path", "status", "extraction_attempts", "last_error", "extracted_data", "uploaded_at", "processed_at", "created_at", "updated_at") SELECT "file_id", "tenant_id", "kaldik_id", "file_name", "file_size", "mime_type", "storage_path", "status", "extraction_attempts", "last_error", "extracted_data", "uploaded_at", "processed_at", "created_at", "updated_at" FROM `kaldik_files`;--> statement-breakpoint
DROP TABLE `kaldik_files`;--> statement-breakpoint
ALTER TABLE `__new_kaldik_files` RENAME TO `kaldik_files`;--> statement-breakpoint
PRAGMA foreign_keys=ON;