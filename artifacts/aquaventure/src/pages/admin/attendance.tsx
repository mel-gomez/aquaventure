import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListAttendance, useMarkAttendance, useListAllEnrollments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ClipboardCheck, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const attendanceSchema = z.object({
  enrollmentId: z.coerce.number().int().min(1),
  date: z.string().min(1),
  status: z.enum(["present", "absent", "excused"]),
  notes: z.string().optional(),
});

const statusColors: Record<string, string> = {
  present: "bg-emerald-100 text-emerald-800",
  absent: "bg-red-100 text-red-800",
  excused: "bg-yellow-100 text-yellow-800",
};

export default function AdminAttendance() {
  const { data: records, isLoading } = useListAttendance({});
  const { data: enrollments } = useListAllEnrollments();
  const markAttendance = useMarkAttendance();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      enrollmentId: 0,
      date: new Date().toISOString().split("T")[0],
      status: "present",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof attendanceSchema>) => {
    try {
      await markAttendance.mutateAsync({
        data: {
          enrollmentId: values.enrollmentId,
          date: values.date,
          status: values.status,
          notes: values.notes || null,
        },
      });
      toast({ title: "Attendance marked successfully" });
      form.reset({ enrollmentId: 0, date: new Date().toISOString().split("T")[0], status: "present", notes: "" });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/admin/attendance"] });
    } catch {
      toast({ title: "Failed to mark attendance", variant: "destructive" });
    }
  };

  const confirmedEnrollments = enrollments?.filter((e) => e.status === "confirmed") ?? [];

  const presentCount = records?.filter((r) => r.status === "present").length ?? 0;
  const absentCount = records?.filter((r) => r.status === "absent").length ?? 0;
  const excusedCount = records?.filter((r) => r.status === "excused").length ?? 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Attendance Tracker</h1>
            <p className="text-muted-foreground">Record and monitor student attendance for all sessions.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Mark Attendance
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Present", count: presentCount, color: "text-emerald-600" },
            { label: "Absent", count: absentCount, color: "text-red-500" },
            { label: "Excused", count: excusedCount, color: "text-yellow-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-4 text-center">
                <div className={`text-3xl font-bold ${s.color}`}>{s.count}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary" /> Mark Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="enrollmentId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enrollment (Swimmer)</FormLabel>
                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ""}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select student..." /></SelectTrigger></FormControl>
                          <SelectContent>
                            {confirmedEnrollments.map((e) => (
                              <SelectItem key={e.id} value={String(e.id)}>
                                #{e.id} — {e.swimmerName} (Age {e.swimmerAge})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="excused">Excused</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. Medical excuse" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={markAttendance.isPending}>
                      {markAttendance.isPending ? "Saving..." : "Save Attendance"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : !records?.length ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">No attendance records yet.</div>
            ) : (
              <div className="space-y-2">
                {records.slice().reverse().map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{r.swimmerName ?? `Enrollment #${r.enrollmentId}`}</div>
                      <div className="text-sm text-muted-foreground">{r.programName ?? "—"}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{r.date}</div>
                    {r.notes && <div className="text-xs text-muted-foreground hidden sm:block max-w-[150px] truncate">{r.notes}</div>}
                    <Badge className={`text-xs capitalize ${statusColors[r.status] ?? ""}`} variant="outline">
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
