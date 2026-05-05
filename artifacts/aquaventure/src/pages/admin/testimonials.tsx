import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListAllTestimonials, useApproveTestimonial, useDeleteTestimonial } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useListAllTestimonials();
  const approveTestimonial = useApproveTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleApprove = async (id: number, approved: boolean) => {
    try {
      await approveTestimonial.mutateAsync({ id, data: { approved } });
      toast({ title: approved ? "Testimonial approved" : "Testimonial hidden" });
      queryClient.invalidateQueries({ queryKey: ["/admin/testimonials"] });
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial.mutateAsync({ id });
      toast({ title: "Testimonial deleted" });
      queryClient.invalidateQueries({ queryKey: ["/admin/testimonials"] });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Testimonials</h1>
          <p className="text-muted-foreground">Review and approve parent testimonials that appear on the public site.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : !testimonials?.length ? (
          <div className="text-center py-20 border border-dashed rounded-xl text-muted-foreground">No testimonials submitted yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <Card key={t.id} className={`border-l-4 ${t.approved ? "border-l-emerald-400" : "border-l-orange-300"}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{t.parentName}</span>
                      <Badge variant={t.approved ? "default" : "secondary"}>
                        {t.approved ? "Published" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(t.createdAt), "MMM d, yyyy")}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic mb-4">"{t.content}"</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={t.approved ? "outline" : "default"}
                      className="flex items-center gap-1"
                      onClick={() => handleApprove(t.id, !t.approved)}
                    >
                      {t.approved ? <><XCircle className="w-4 h-4" /> Hide</> : <><CheckCircle className="w-4 h-4" /> Approve</>}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
