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
CREATE TABLE `classes` (
	`class_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`class_name` text(50) NOT NULL,
	`level` text(2) NOT NULL,
	`homeroom_teacher_id` text,
	`capacity` integer DEFAULT 40,
	`status` text DEFAULT 'active',
	`created_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`subject_id` text PRIMARY KEY NOT NULL,
	`subject_name` text(100) NOT NULL,
	`subject_code` text(20) NOT NULL,
	`is_core` integer DEFAULT true,
	`created_at` integer
);
