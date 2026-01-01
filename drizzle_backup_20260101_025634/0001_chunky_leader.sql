CREATE TABLE `kaldik_files` (
	`file_id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`tenant_id` text NOT NULL,
	`kaldik_id` text,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`storage_path` text NOT NULL,
	`status` text DEFAULT 'pending',
	`extraction_attempts` integer DEFAULT 0,
	`last_error` text,
	`extracted_data` text,
	`uploaded_at` integer DEFAULT CURRENT_TIMESTAMP,
	`processed_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
