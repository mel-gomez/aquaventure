import { pgTable, text, serial, timestamp, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { enrollmentsTable } from "./enrollments";

export const attendanceTable = pgTable("attendance", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollmentsTable.id),
  date: date("date").notNull(),
  status: text("status").notNull().default("present"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAttendanceSchema = createInsertSchema(attendanceTable).omit({ id: true, createdAt: true });
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendanceTable.$inferSelect;
