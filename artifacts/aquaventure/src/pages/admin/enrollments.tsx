import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListAllEnrollments, useUpdateEnrollmentStatus } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AdminEnrollments() {
  const { data: enrollments, isLoading } = useListAllEnrollments();
  const updateStatus = useUpdateEnrollmentStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (id: number, status: "pending"|"confirmed"|"cancelled"|"completed") => {
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      toast({ title: "Status updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    } catch (err: any) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Enrollment Management</h1>
          <p className="text-muted-foreground">Review and manage all student enrollments.</p>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Swimmer</TableHead>
                <TableHead>Parent/Account</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : enrollments?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No enrollments found.</TableCell></TableRow>
              ) : (
                enrollments?.map((enr) => (
                  <TableRow key={enr.id}>
                    <TableCell className="text-sm">{format(new Date(enr.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="font-medium">{enr.swimmerName}</div>
                      <div className="text-xs text-muted-foreground">Age: {enr.swimmerAge}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{enr.userName || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{enr.userEmail}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {enr.sessionInfo?.programName || `Session #${enr.sessionId}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={enr.status === "confirmed" ? "default" : enr.status === "pending" ? "secondary" : enr.status === "completed" ? "outline" : "destructive"}>
                        {enr.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {enr.status === "pending" && (
                        <Button size="sm" onClick={() => handleStatusUpdate(enr.id, "confirmed")}>Confirm</Button>
                      )}
                      {(enr.status === "pending" || enr.status === "confirmed") && (
                        <Button size="sm" variant="outline" className="text-destructive border-destructive" onClick={() => handleStatusUpdate(enr.id, "cancelled")}>Cancel</Button>
                      )}
                    </TableCell>
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
