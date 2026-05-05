import { useGetMyEnrollments, useListAnnouncements } from "@workspace/api-client-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, MapPin, Clock, Info, Megaphone } from "lucide-react";
import { format } from "date-fns";

export default function PortalDashboard() {
  const { data: enrollments, isLoading: enrollmentsLoading } = useGetMyEnrollments();
  const { data: announcements, isLoading: announcementsLoading } = useListAnnouncements();

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to your Portal</h1>
          <p className="text-muted-foreground">Manage your swimming journey and stay up to date with Aquaventure.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>My Enrollments</CardTitle>
                  <CardDescription>Your current and past class enrollments</CardDescription>
                </div>
                <Link href="/portal/enroll">
                  <Button size="sm">Enroll New</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {enrollmentsLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : !enrollments?.length ? (
                  <div className="py-12 text-center border border-dashed rounded-lg bg-muted/30">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-1">No Active Enrollments</h3>
                    <p className="text-muted-foreground text-sm mb-4">You haven't enrolled in any swimming sessions yet.</p>
                    <Link href="/portal/enroll">
                      <Button variant="outline">Browse Sessions</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{enrollment.sessionInfo?.programName || "Program"}</h3>
                            <Badge variant={
                              enrollment.status === "confirmed" ? "default" :
                              enrollment.status === "pending" ? "secondary" : "outline"
                            }>
                              {enrollment.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-primary mb-2">{enrollment.swimmerName} (Age {enrollment.swimmerAge})</p>
                          
                          {enrollment.sessionInfo && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(enrollment.sessionInfo.startDate), "MMM d")} - {format(new Date(enrollment.sessionInfo.endDate), "MMM d")}</div>
                              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {enrollment.sessionInfo.schedule}</div>
                              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {enrollment.sessionInfo.location}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-ocean-gradient text-white border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5" /> Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcementsLoading ? (
                  <div className="text-white/70 text-sm">Loading...</div>
                ) : !announcements?.length ? (
                  <div className="text-white/70 text-sm">No new announcements.</div>
                ) : (
                  announcements.map((ann) => (
                    <div key={ann.id} className="border-b border-white/20 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-semibold mb-1">{ann.title}</h4>
                      <p className="text-sm text-white/80 line-clamp-3 mb-2">{ann.content}</p>
                      <span className="text-xs text-white/50">{format(new Date(ann.createdAt), "MMM d, yyyy")}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
