import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListAnnouncements, useCreateAnnouncement } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { format } from "date-fns";

const annSchema = z.object({
  title: z.string().min(2, "Title required"),
  content: z.string().min(5, "Content required"),
});

export default function AdminAnnouncements() {
  const { data: announcements, isLoading } = useListAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof annSchema>>({
    resolver: zodResolver(annSchema),
    defaultValues: { title: "", content: "" }
  });

  const onSubmit = async (values: z.infer<typeof annSchema>) => {
    try {
      await createAnnouncement.mutateAsync({ data: values });
      toast({ title: "Announcement posted successfully" });
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    } catch (err: any) {
      toast({ title: "Creation failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Announcements</h1>
            <p className="text-muted-foreground">Broadcast messages to parent and swimmer portals.</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Post</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Post Announcement</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g. Holiday Schedule" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={5} placeholder="Write the message here..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createAnnouncement.isPending}>Publish</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full py-8 text-center text-muted-foreground">Loading announcements...</div>
          ) : announcements?.length === 0 ? (
            <div className="col-span-full py-8 text-center border border-dashed rounded-lg bg-muted/30 text-muted-foreground">No announcements posted yet.</div>
          ) : (
            announcements?.map((ann) => (
              <Card key={ann.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{ann.title}</CardTitle>
                  <div className="text-xs text-muted-foreground">{format(new Date(ann.createdAt), "MMM d, yyyy h:mm a")}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{ann.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
