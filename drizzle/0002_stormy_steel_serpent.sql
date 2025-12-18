CREATE TABLE `teachers` (
	`teacher_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`nip` text(50) NOT NULL,
	`position` text DEFAULT 'guru_mapel',
	`status` text DEFAULT 'aktif',
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`student_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`class_id` text,
	`nisn` text(50) NOT NULL,
	`nis` text(50),
	`full_name` text(255) NOT NULL,
	`date_of_birth` integer,
	`gender` text,
	`parent_name` text(255),
	`parent_phone` text(20),
	`parent_email` text(100),
	`status` text DEFAULT 'active',
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action
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
