CREATE TABLE `tenants` (
	`tenant_id` text PRIMARY KEY NOT NULL,
	`npsn` text(50) NOT NULL,
	`school_name` text(255) NOT NULL,
	`province` text(100),
	`city` text(100),
	`address` text,
	`phone` text(20),
	`email` text(100),
	`status` text DEFAULT 'active',
	`subscription_tier` text DEFAULT 'starter',
	`token_balance` integer DEFAULT 500,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_npsn_unique` ON `tenants` (`npsn`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`role` text NOT NULL,
	`email` text(100) NOT NULL,
	`password_hash` text(255) NOT NULL,
	`full_name` text(255) NOT NULL,
	`phone` text(20),
	`nip` text(50),
	`nisn` text(50),
	`status` text DEFAULT 'pending',
	`invite_token` text(255),
	`invite_expires_at` integer,
	`last_login` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`teacher_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`nip` text,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`position` text NOT NULL,
	`employment_status` text DEFAULT 'active' NOT NULL,
	`join_date` text NOT NULL,
	`address` text,
	`birth_date` text,
	`gender` text,
	`education` text,
	`certification` text,
	`notes` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`student_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`nisn` text NOT NULL,
	`full_name` text NOT NULL,
	`class_id` text NOT NULL,
	`gender` text NOT NULL,
	`birth_date` text,
	`birth_place` text,
	`religion` text,
	`address` text,
	`parent_name` text,
	`parent_phone` text,
	`enrollment_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_nisn_unique` ON `students` (`nisn`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`subject_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`subject_code` text NOT NULL,
	`subject_name` text NOT NULL,
	`category` text NOT NULL,
	`level` text NOT NULL,
	`kkm` integer DEFAULT 75 NOT NULL,
	`description` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`class_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`class_name` text NOT NULL,
	`grade` integer NOT NULL,
	`level` text NOT NULL,
	`academic_year` text NOT NULL,
	`capacity` integer DEFAULT 30 NOT NULL,
	`wali_kelas` text,
	`room` text,
	`notes` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `academic_years` (
	`academic_year_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`year` text(10) NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`status` text DEFAULT 'active',
	`created_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teacher_subjects` (
	`teacher_subject_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`teacher_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`class_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`hours_per_week` integer DEFAULT 2,
	`status` text DEFAULT 'active',
	`created_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teacher_assignments` (
	`assignment_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`teacher_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`class_id` text NOT NULL,
	`academic_year` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `attendance_summary` (
	`summary_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`student_id` text NOT NULL,
	`class_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`month` text NOT NULL,
	`present_count` integer DEFAULT 0 NOT NULL,
	`absent_count` integer DEFAULT 0 NOT NULL,
	`sick_count` integer DEFAULT 0 NOT NULL,
	`permission_count` integer DEFAULT 0 NOT NULL,
	`total_days` integer DEFAULT 0 NOT NULL,
	`attendance_rate` real DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`attendance_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`student_id` text NOT NULL,
	`class_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`attendance_date` text NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`recorded_by` text,
	`recorded_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `grades` (
	`grade_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`student_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`class_id` text NOT NULL,
	`assessment_type` text NOT NULL,
	`score` real NOT NULL,
	`max_score` real DEFAULT 100,
	`date_recorded` integer NOT NULL,
	`recorded_by` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recorded_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `school_profiles` (
	`profile_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`school_name` text NOT NULL,
	`school_address` text,
	`school_phone` text,
	`school_email` text,
	`npsn` text,
	`principal_name` text,
	`principal_nip` text,
	`logo_url` text,
	`is_active` integer DEFAULT true,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kaldik` (
	`kaldik_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`effective_weeks` integer NOT NULL,
	`holidays` text,
	`file_url` text,
	`extracted_data` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `prota` (
	`prota_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`teacher_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`class_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`kaldik_id` text,
	`title` text NOT NULL,
	`total_allocated_hours` integer,
	`content` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`kaldik_id`) REFERENCES `kaldik`(`kaldik_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `prosem` (
	`prosem_id` text PRIMARY KEY NOT NULL,
	`prota_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`semester` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`prota_id`) REFERENCES `prota`(`prota_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rpp_drafts` (
	`rpp_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`teacher_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`class_id` text NOT NULL,
	`prosem_id` text,
	`topic` text NOT NULL,
	`curriculum` text DEFAULT 'K13' NOT NULL,
	`duration` integer NOT NULL,
	`learning_objectives` text,
	`materials` text,
	`content` text NOT NULL,
	`docx_file` blob,
	`status` text DEFAULT 'draft' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prosem_id`) REFERENCES `prosem`(`prosem_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rpp_versions` (
	`version_id` text PRIMARY KEY NOT NULL,
	`rpp_id` text NOT NULL,
	`version_number` integer NOT NULL,
	`content` text NOT NULL,
	`change_description` text,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`rpp_id`) REFERENCES `rpp_drafts`(`rpp_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `teachers`(`teacher_id`) ON UPDATE no action ON DELETE no action
);
