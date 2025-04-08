import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  difficulty: integer("difficulty").notNull().default(1),
  energyCost: integer("energy_cost").notNull().default(15),
  category: text("category"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  energy: integer("energy").notNull().default(100),
  theme: text("theme").notNull().default("default"),
  notificationsCompletion: boolean("notifications_completion").notNull().default(true),
  notificationsReminders: boolean("notifications_reminders").notNull().default(true),
  notificationsMotivation: boolean("notifications_motivation").notNull().default(true),
  energyResetTime: text("energy_reset_time").notNull().default("05:00"),
});

export const motivationalMessages = pgTable("motivational_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const easyTaskSuggestions = pgTable("easy_task_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  suggestion: text("suggestion").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  name: true,
  difficulty: true,
  energyCost: true,
  category: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  energy: true,
  theme: true,
  notificationsCompletion: true,
  notificationsReminders: true,
  notificationsMotivation: true,
  energyResetTime: true,
});

export const insertMotivationalMessageSchema = createInsertSchema(motivationalMessages).pick({
  message: true,
  isActive: true,
});

export const insertEasyTaskSuggestionSchema = createInsertSchema(easyTaskSuggestions).pick({
  suggestion: true,
  isActive: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

export type InsertMotivationalMessage = z.infer<typeof insertMotivationalMessageSchema>;
export type MotivationalMessage = typeof motivationalMessages.$inferSelect;

export type InsertEasyTaskSuggestion = z.infer<typeof insertEasyTaskSuggestionSchema>;
export type EasyTaskSuggestion = typeof easyTaskSuggestions.$inferSelect;
