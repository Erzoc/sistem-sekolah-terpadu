CREATE TABLE `attendance` (
	`attendance_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`class_id` text NOT NULL,
	`user_id` text NOT NULL,
	`date` integer NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`recorded_by` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recorded_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `teaching_journal` (
	`journal_id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`teacher_id` text NOT NULL,
	`class_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`attendance_id` text,
	`date` integer NOT NULL,
	`material` text,
	`method` text DEFAULT 'tatap_muka',
	`learning_outcome` text,
	`notes` text,
	`auto_generated` integer DEFAULT false,
	`created_at` integer,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`attendance_id`) ON UPDATE no action ON DELETE no action
);
