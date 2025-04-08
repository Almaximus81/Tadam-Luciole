CREATE TABLE "congrats_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"message" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "easy_task_suggestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"suggestion" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "motivational_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"message" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "strategies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tip" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"energy_cost" integer DEFAULT 15 NOT NULL,
	"category" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"energy" integer DEFAULT 100 NOT NULL,
	"theme" text DEFAULT 'default' NOT NULL,
	"notifications_completion" boolean DEFAULT true NOT NULL,
	"notifications_reminders" boolean DEFAULT true NOT NULL,
	"notifications_motivation" boolean DEFAULT true NOT NULL,
	"energy_reset_time" text DEFAULT '05:00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "congrats_messages" ADD CONSTRAINT "congrats_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy_task_suggestions" ADD CONSTRAINT "easy_task_suggestions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "motivational_messages" ADD CONSTRAINT "motivational_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;