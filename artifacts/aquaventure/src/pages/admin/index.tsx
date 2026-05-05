import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, BookOpen, Calendar, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return <AdminLayout><div className="p-8 text-center">Loading dashboard...</div></AdminLayout>;
  }

  if (!stats) return null;

  const statCards = [
    { title: "Total Swimmers", value: stats.totalSwimmers, icon: Users, color: "text-blue-500" },
    { title: "Active Programs", value: stats.activePrograms, icon: BookOpen, color: "text-emerald-500" },
    { title: "Upcoming Sessions", value: stats.upcomingSessions, icon: Calendar, color: "text-orange-500" },
    { title: "Total Enrollments", value: stats.totalEnrollments, icon: ClipboardList, color: "text-indigo-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">High-level metrics for Aquaventure Swim School.</p>
        </div>

        {/* Top Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Chart */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Enrollments by Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.enrollmentsByLevel} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="level" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pending Enrollments Status */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Pending Action</span>
                </div>
                <span className="text-xl font-bold">{stats.pendingEnrollments}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">Confirmed</span>
                </div>
                <span className="text-xl font-bold">{stats.confirmedEnrollments}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentEnrollments.map((enr) => (
                <div key={enr.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-semibold">{enr.swimmerName} <span className="text-muted-foreground text-sm font-normal">(Age {enr.swimmerAge})</span></p>
                    <p className="text-sm text-primary">{enr.sessionInfo?.programName || `Session #${enr.sessionId}`}</p>
                  </div>
                  <Badge variant={enr.status === "confirmed" ? "default" : enr.status === "pending" ? "secondary" : "outline"}>
                    {enr.status}
                  </Badge>
                </div>
              ))}
              {stats.recentEnrollments.length === 0 && (
                <div className="text-center text-muted-foreground py-4">No recent enrollments.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
