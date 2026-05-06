import { pgTable, text, serial, timestamp, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { enrollmentsTable } from "./enrollments";

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollmentsTable.id),
  skill: text("skill").notNull(),
  achievedAt: date("achieved_at").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProgressSchema = createInsertSchema(progressTable).omit({ id: true, createdAt: true });
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progressTable.$inferSelect;
