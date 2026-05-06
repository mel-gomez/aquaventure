import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListProgress, useLogProgress, useDeleteProgress, useListAllEnrollments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trophy, Plus, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const PRESET_SKILLS = [
  "Water safety basics",
  "Floating independently",
  "Freestyle kick",
  "Freestyle arm stroke",
  "Freestyle lap (25m)",
  "Backstroke kick",
  "Backstroke arm stroke",
  "Backstroke lap (25m)",
  "Breaststroke kick",
  "Breaststroke arm stroke",
  "Breaststroke lap (25m)",
  "Butterfly kick",
  "Butterfly lap (25m)",
  "Treading water (30 sec)",
  "Treading water (1 min)",
  "Underwater swimming",
  "Diving from poolside",
  "Independent lap (any stroke)",
  "Completed level assessment",
];

const progressSchema = z.object({
  enrollmentId: z.coerce.number().int().min(1, "Select a student"),
  skill: z.string().min(1, "Skill is required"),
  achievedAt: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

const skillColors = [
  "bg-blue-100 text-blue-800",
  "bg-emerald-100 text-emerald-800",
  "bg-purple-100 text-purple-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-cyan-100 text-cyan-800",
];

function skillColor(skill: string) {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  return skillColors[Math.abs(hash) % skillColors.length];
}

export default function AdminProgress() {
  const { data: records, isLoading } = useListProgress({});
  const { data: enrollments } = useListAllEnrollments();
  const logProgress = useLogProgress();
  const deleteProgress = useDeleteProgress();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [customSkill, setCustomSkill] = useState(false);

  const form = useForm<z.infer<typeof progressSchema>>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      enrollmentId: 0,
      skill: "",
      achievedAt: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof progressSchema>) => {
    try {
      await logProgress.mutateAsync({
        data: {
          enrollmentId: values.enrollmentId,
          skill: values.skill,
          achievedAt: values.achievedAt,
          notes: values.notes || null,
        },
      });
      toast({ title: "Skill achievement logged!" });
      form.reset({ enrollmentId: 0, skill: "", achievedAt: new Date().toISOString().split("T")[0], notes: "" });
      setCustomSkill(false);
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/admin/progress"] });
    } catch {
      toast({ title: "Failed to log achievement", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProgress.mutateAsync({ id });
      toast({ title: "Record deleted" });
      queryClient.invalidateQueries({ queryKey: ["/admin/progress"] });
    } catch {
      toast({ title: "Failed to delete record", variant: "destructive" });
    }
  };

  const confirmedEnrollments = enrollments?.filter((e) => e.status === "confirmed") ?? [];
  const uniqueSkills = [...new Set(records?.map((r) => r.skill) ?? [])];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Swimmer Progress</h1>
            <p className="text-muted-foreground">Log and track skill milestones for enrolled swimmers.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Log Achievement
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-3xl font-bold text-primary">{records?.length ?? 0}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Achievements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-3xl font-bold text-amber-500">{uniqueSkills.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Unique Skills</div>
            </CardContent>
          </Card>
          <Card className="sm:col-span-1 col-span-2">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {new Set(records?.map((r) => r.enrollmentId)).size}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Swimmers with Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Log Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Log Skill Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="enrollmentId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student (Enrollment)</FormLabel>
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
                    <FormField control={form.control} name="achievedAt" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Achieved</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="skill" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill</FormLabel>
                      {!customSkill ? (
                        <>
                          <Select onValueChange={(val) => { if (val === "__custom__") { setCustomSkill(true); field.onChange(""); } else field.onChange(val); }} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Choose a skill..." /></SelectTrigger></FormControl>
                            <SelectContent>
                              {PRESET_SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              <SelectItem value="__custom__">+ Enter custom skill...</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <FormControl><Input placeholder="Describe the skill achieved..." {...field} /></FormControl>
                          <Button type="button" variant="outline" onClick={() => { setCustomSkill(false); field.onChange(""); }}>Preset</Button>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coach Notes (optional)</FormLabel>
                      <FormControl><Input placeholder="e.g. Great technique, needs to work on breathing rhythm" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="flex gap-3">
                    <Button type="submit" disabled={logProgress.isPending}>
                      {logProgress.isPending ? "Saving..." : "Save Achievement"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setCustomSkill(false); }}>Cancel</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" /> Achievement Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : !records?.length ? (
              <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground">
                <Trophy className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="font-semibold mb-1">No achievements logged yet</p>
                <p className="text-sm">Start logging skill milestones for your swimmers.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {records.slice().reverse().map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{r.swimmerName ?? `Enrollment #${r.enrollmentId}`}</div>
                      <div className="text-sm text-muted-foreground">{r.programName ?? "—"}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${skillColor(r.skill)}`}>
                        {r.skill}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                        {r.achievedAt}
                      </span>
                      {r.notes && (
                        <span className="text-xs text-muted-foreground italic hidden md:block max-w-[140px] truncate">
                          {r.notes}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
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
