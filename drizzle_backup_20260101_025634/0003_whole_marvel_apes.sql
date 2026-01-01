CREATE TABLE `prosem_records` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`prota_record_id` text NOT NULL,
	`simple_calendar_id` text NOT NULL,
	`mapel_code` text NOT NULL,
	`mapel_name` text NOT NULL,
	`academic_year` text NOT NULL,
	`semester` integer NOT NULL,
	`weekly_schedule_json` text NOT NULL,
	`total_weeks` integer NOT NULL,
	`effective_weeks` integer NOT NULL,
	`holiday_weeks` integer DEFAULT 0,
	`notes` text,
	`status` text DEFAULT 'draft',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `prosem_records_tenant_idx` ON `prosem_records` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `prosem_records_prota_idx` ON `prosem_records` (`prota_record_id`);--> statement-breakpoint
CREATE INDEX `prosem_records_calendar_idx` ON `prosem_records` (`simple_calendar_id`);--> statement-breakpoint
CREATE TABLE `prota_records` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`simple_calendar_id` text NOT NULL,
	`mapel_code` text NOT NULL,
	`mapel_name` text NOT NULL,
	`academic_year` text NOT NULL,
	`semester` integer NOT NULL,
	`competencies_json` text NOT NULL,
	`strategy` text DEFAULT 'proportional',
	`notes` text,
	`status` text DEFAULT 'draft',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `prota_records_tenant_idx` ON `prota_records` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `prota_records_calendar_idx` ON `prota_records` (`simple_calendar_id`);--> statement-breakpoint
CREATE INDEX `prota_records_academic_year_idx` ON `prota_records` (`academic_year`);--> statement-breakpoint
CREATE TABLE `rpp_records` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`prosem_record_id` text NOT NULL,
	`prota_record_id` text NOT NULL,
	`simple_calendar_id` text NOT NULL,
	`mapel_code` text NOT NULL,
	`mapel_name` text NOT NULL,
	`kelas_level` text NOT NULL,
	`kelas_division` text,
	`academic_year` text NOT NULL,
	`semester` integer NOT NULL,
	`pertemuan_list_json` text NOT NULL,
	`template_type` text DEFAULT 'merdeka',
	`generation_method` text DEFAULT 'ai',
	`ai_provider` text,
	`total_pertemuan` integer NOT NULL,
	`total_jam_pelajaran` integer,
	`notes` text,
	`status` text DEFAULT 'draft',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `rpp_records_tenant_idx` ON `rpp_records` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `rpp_records_prosem_idx` ON `rpp_records` (`prosem_record_id`);--> statement-breakpoint
CREATE INDEX `rpp_records_mapel_idx` ON `rpp_records` (`mapel_code`);--> statement-breakpoint
CREATE INDEX `rpp_records_kelas_idx` ON `rpp_records` (`kelas_level`);--> statement-breakpoint
CREATE TABLE `simple_calendars` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`academic_year` text NOT NULL,
	`semester` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`effective_weeks` integer NOT NULL,
	`holidays_json` text,
	`source` text DEFAULT 'manual',
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `simple_calendars_tenant_idx` ON `simple_calendars` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `simple_calendars_academic_year_idx` ON `simple_calendars` (`academic_year`);--> statement-breakpoint
CREATE INDEX `simple_calendars_created_at_idx` ON `simple_calendars` (`created_at`);