import { PortalLayout } from "@/components/layout/PortalLayout";
import { useGetMyAttendance } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck } from "lucide-react";

const statusColors: Record<string, string> = {
  present: "bg-emerald-100 text-emerald-800",
  absent: "bg-red-100 text-red-800",
  excused: "bg-yellow-100 text-yellow-800",
};

export default function PortalAttendance() {
  const { data: records, isLoading } = useGetMyAttendance();

  const present = records?.filter((r) => r.status === "present").length ?? 0;
  const total = records?.length ?? 0;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Attendance</h1>
          <p className="text-muted-foreground">Track your swimmer's class attendance records.</p>
        </div>

        {total > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Present", count: present, color: "text-emerald-600" },
              { label: "Absent", count: records?.filter((r) => r.status === "absent").length ?? 0, color: "text-red-500" },
              { label: "Attendance Rate", count: `${rate}%`, color: "text-primary" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-4 pb-4 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" /> Attendance History
            </CardTitle>
            <CardDescription>Class-by-class attendance records for your enrolled swimmers.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : !records?.length ? (
              <div className="py-12 text-center border border-dashed rounded-lg">
                <ClipboardCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold mb-1">No Attendance Records Yet</p>
                <p className="text-sm text-muted-foreground">Attendance records will appear here once classes start.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {records.slice().reverse().map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{r.swimmerName ?? "—"}</div>
                      <div className="text-sm text-muted-foreground">{r.programName ?? "—"}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{r.date}</div>
                    {r.notes && (
                      <div className="text-xs text-muted-foreground hidden sm:block italic max-w-[150px] truncate">
                        {r.notes}
                      </div>
                    )}
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
    </PortalLayout>
  );
}
