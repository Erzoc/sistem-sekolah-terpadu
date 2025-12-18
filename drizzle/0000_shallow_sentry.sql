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
