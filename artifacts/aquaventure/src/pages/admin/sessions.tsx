import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListSessions, useListPrograms, useCreateSession } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { format } from "date-fns";

const sessionSchema = z.object({
  programId: z.coerce.number().min(1, "Program required"),
  instructorName: z.string().min(2, "Instructor required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  schedule: z.string().min(2, "Schedule required (e.g. MWF 9AM)"),
  location: z.string().min(2, "Location required"),
});

export default function AdminSessions() {
  const { data: sessions, isLoading: sessionsLoading } = useListSessions();
  const { data: programs } = useListPrograms();
  const createSession = useCreateSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      programId: 0, instructorName: "", startDate: "", endDate: "", schedule: "", location: "Main Pool"
    }
  });

  const onSubmit = async (values: z.infer<typeof sessionSchema>) => {
    try {
      await createSession.mutateAsync({ data: values });
      toast({ title: "Session created successfully" });
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    } catch (err: any) {
      toast({ title: "Creation failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Sessions</h1>
            <p className="text-muted-foreground">Manage class schedules and instructors.</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Session</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="programId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : undefined}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {programs?.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="instructorName" render={({ field }) => (
                    <FormItem><FormLabel>Instructor</FormLabel><FormControl><Input placeholder="Coach Name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                      <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                      <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="schedule" render={({ field }) => (
                    <FormItem><FormLabel>Schedule</FormLabel><FormControl><Input placeholder="e.g. Saturdays 9:00 AM" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createSession.isPending}>Submit</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionsLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : sessions?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No sessions found.</TableCell></TableRow>
              ) : (
                sessions?.map((sess) => (
                  <TableRow key={sess.id}>
                    <TableCell className="font-medium">{sess.programName}</TableCell>
                    <TableCell className="text-sm">{format(new Date(sess.startDate), "MMM d")} - {format(new Date(sess.endDate), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-sm">{sess.schedule}</TableCell>
                    <TableCell className="text-sm">{sess.instructorName}</TableCell>
                    <TableCell className="text-sm">{sess.enrolledCount} / {sess.maxStudents}</TableCell>
                    <TableCell className="capitalize text-sm">{sess.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
