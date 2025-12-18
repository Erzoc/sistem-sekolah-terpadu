CREATE TABLE `discipline_records` (
	`record_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`student_id` text NOT NULL,
	`type` text NOT NULL,
	`category` text(100) NOT NULL,
	`description` text NOT NULL,
	`points` integer DEFAULT 0,
	`incident_date` integer NOT NULL,
	`recorded_by` text NOT NULL,
	`follow_up_status` text DEFAULT 'pending',
	`created_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recorded_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `generated_reports` (
	`report_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`student_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`template_id` text NOT NULL,
	`semester` text NOT NULL,
	`pdf_url` text,
	`status` text DEFAULT 'pending',
	`token_used` integer DEFAULT 0,
	`generated_by` text NOT NULL,
	`created_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `report_templates`(`template_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`generated_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `grade_aggregations` (
	`aggregation_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`student_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester` text NOT NULL,
	`final_score` real NOT NULL,
	`letter_grade` text(2),
	`predicate` text,
	`description` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `report_templates` (
	`template_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`template_name` text(100) NOT NULL,
	`report_type` text NOT NULL,
	`structure` text,
	`header_html` text,
	`footer_html` text,
	`logo_url` text,
	`is_active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `token_transactions` (
	`transaction_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`balance_after` integer NOT NULL,
	`description` text NOT NULL,
	`related_entity_type` text,
	`related_entity_id` text,
	`created_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
