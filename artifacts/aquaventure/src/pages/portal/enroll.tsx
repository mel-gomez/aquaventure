import { useState } from "react";
import { useLocation } from "wouter";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListSessions, useCreateEnrollment } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const enrollSchema = z.object({
  sessionId: z.coerce.number().min(1, "Please select a session"),
  swimmerName: z.string().min(2, "Swimmer name is required"),
  swimmerAge: z.coerce.number().min(1, "Valid age is required").max(100),
});

export default function EnrollPage() {
  const { data: sessions, isLoading: sessionsLoading } = useListSessions();
  const createEnrollment = useCreateEnrollment();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof enrollSchema>>({
    resolver: zodResolver(enrollSchema),
    defaultValues: { sessionId: 0, swimmerName: "", swimmerAge: 0 },
  });

  const onSubmit = async (values: z.infer<typeof enrollSchema>) => {
    try {
      await createEnrollment.mutateAsync({ data: values });
      toast({ title: "Enrollment submitted successfully!" });
      setLocation("/portal");
    } catch (err: any) {
      toast({
        title: "Enrollment Failed",
        description: err.data?.error || "Could not complete enrollment.",
        variant: "destructive",
      });
    }
  };

  const upcomingSessions = sessions?.filter(s => s.status === "upcoming") || [];

  return (
    <PortalLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Enroll in a Session</h1>
          <p className="text-muted-foreground">Select an upcoming class and register your swimmer.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Details</CardTitle>
            <CardDescription>Fill out the form below to secure a slot.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="sessionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Session</FormLabel>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a session..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sessionsLoading ? (
                            <SelectItem value="loading" disabled>Loading sessions...</SelectItem>
                          ) : upcomingSessions.length === 0 ? (
                            <SelectItem value="none" disabled>No upcoming sessions</SelectItem>
                          ) : (
                            upcomingSessions.map(session => (
                              <SelectItem key={session.id} value={String(session.id)}>
                                {session.programName} ({session.programLevel}) - {format(new Date(session.startDate), "MMM d")} - {session.schedule}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="swimmerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Swimmer's Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swimmerAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Swimmer's Age</FormLabel>
                        <FormControl><Input type="number" placeholder="8" {...field} value={field.value || ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createEnrollment.isPending}>
                  {createEnrollment.isPending ? "Submitting..." : "Confirm Enrollment"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
