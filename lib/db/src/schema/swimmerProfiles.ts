import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const swimmerProfilesTable = pgTable("swimmer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  swimmerName: text("swimmer_name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  level: text("level"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSwimmerProfileSchema = createInsertSchema(swimmerProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSwimmerProfile = z.infer<typeof insertSwimmerProfileSchema>;
export type SwimmerProfile = typeof swimmerProfilesTable.$inferSelect;
