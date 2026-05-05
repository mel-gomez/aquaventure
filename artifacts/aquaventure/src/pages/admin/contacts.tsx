import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListContacts, useUpdateContactStatus } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  unread: "default",
  read: "secondary",
  replied: "outline",
};

export default function AdminContacts() {
  const { data: contacts, isLoading } = useListContacts();
  const updateStatus = useUpdateContactStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleStatus = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status: status as "unread" | "read" | "replied" } });
      queryClient.invalidateQueries({ queryKey: ["/admin/contacts"] });
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const unread = contacts?.filter((c) => c.status === "unread").length ?? 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Inbox</h1>
          <p className="text-muted-foreground">
            Inquiries submitted through the Contact page.
            {unread > 0 && <span className="ml-2 inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5">{unread}</span>}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : !contacts?.length ? (
          <div className="text-center py-20 border border-dashed rounded-xl text-muted-foreground">No contact inquiries yet.</div>
        ) : (
          <div className="space-y-3">
            {contacts.slice().reverse().map((contact) => (
              <Card key={contact.id} className={`border-l-4 ${contact.status === "unread" ? "border-l-primary" : contact.status === "replied" ? "border-l-emerald-400" : "border-l-gray-200"}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{contact.name}</span>
                        <Badge variant={statusVariant[contact.status] ?? "secondary"} className="text-xs capitalize">
                          {contact.status}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium text-primary mt-0.5">{contact.subject}</div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(contact.createdAt), "MMM d, yyyy h:mm a")}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {contact.email}</span>
                    {contact.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {contact.phone}</span>}
                  </div>

                  {expandedId === contact.id && (
                    <div className="bg-muted/40 rounded-lg p-4 text-sm text-foreground leading-relaxed mb-3 border">
                      {contact.message}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}>
                      {expandedId === contact.id ? "Hide Message" : "View Message"}
                    </Button>
                    {contact.status !== "read" && (
                      <Button size="sm" variant="outline" onClick={() => handleStatus(contact.id, "read")}>
                        Mark as Read
                      </Button>
                    )}
                    {contact.status !== "replied" && (
                      <Button size="sm" className="flex items-center gap-1" onClick={() => handleStatus(contact.id, "replied")}>
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Replied
                      </Button>
                    )}
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
