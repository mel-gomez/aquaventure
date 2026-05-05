import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListAdminFaq, useCreateFaq, useDeleteFaq } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  category: z.string().min(1),
  sortOrder: z.coerce.number().int().optional(),
});

export default function AdminFaq() {
  const { data: faqs, isLoading } = useListAdminFaq();
  const createFaq = useCreateFaq();
  const deleteFaq = useDeleteFaq();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof faqSchema>>({
    resolver: zodResolver(faqSchema),
    defaultValues: { question: "", answer: "", category: "general", sortOrder: 0 },
  });

  const onSubmit = async (values: z.infer<typeof faqSchema>) => {
    try {
      await createFaq.mutateAsync({ data: { ...values, category: values.category, sortOrder: values.sortOrder ?? 0 } });
      toast({ title: "FAQ entry created" });
      form.reset();
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/admin/faq"] });
    } catch {
      toast({ title: "Failed to create FAQ", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ entry?")) return;
    try {
      await deleteFaq.mutateAsync({ id });
      toast({ title: "Deleted" });
      queryClient.invalidateQueries({ queryKey: ["/admin/faq"] });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">FAQ Manager</h1>
            <p className="text-muted-foreground">Manage the Frequently Asked Questions that appear on the public FAQ page.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add FAQ
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">New FAQ Entry</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {["general", "programs", "enrollment", "facilities", "payment"].map((c) => (
                              <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="sortOrder" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="question" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl><Input placeholder="What age can children start?" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="answer" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl><Textarea placeholder="Children as young as 3 years old..." className="min-h-[100px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex gap-3">
                    <Button type="submit" disabled={createFaq.isPending}>
                      {createFaq.isPending ? "Creating..." : "Create FAQ"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : !faqs?.length ? (
          <div className="text-center py-20 border border-dashed rounded-xl text-muted-foreground">No FAQ entries yet. Add your first one above.</div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 gap-4">
                  <button className="flex-1 flex items-center gap-3 text-left" onClick={() => setOpenId(openId === faq.id ? null : faq.id)}>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize font-medium">{faq.category}</span>
                    <span className="font-medium leading-snug">{faq.question}</span>
                    {openId === faq.id ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />}
                  </button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={() => handleDelete(faq.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {openId === faq.id && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground border-t pt-4 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
