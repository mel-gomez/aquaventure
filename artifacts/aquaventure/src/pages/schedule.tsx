import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { useListSessions, useListPrograms } from "@workspace/api-client-react";
import { format } from "date-fns";
import { useState } from "react";

const levelColors: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
  competitive: "bg-orange-100 text-orange-800",
};

export default function Schedule() {
  const { data: sessions, isLoading } = useListSessions();
  const { data: programs } = useListPrograms();
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const levels = ["all", "beginner", "intermediate", "advanced", "competitive"];

  const filtered = sessions?.filter((s) => {
    if (selectedLevel === "all") return s.status !== "cancelled";
    return s.programLevel === selectedLevel && s.status !== "cancelled";
  }) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-ocean-gradient text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Class Schedule</h1>
            <p className="text-white/85 text-xl max-w-2xl mx-auto">
              Browse all upcoming swimming sessions. Find the right time and level for your swimmer.
            </p>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Level Filter */}
            <div className="flex flex-wrap gap-3 mb-10">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                    selectedLevel === level
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="py-20 text-center text-muted-foreground">Loading schedule...</div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-5xl mb-4">🏊</div>
                <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
                <p className="text-muted-foreground">Check back soon for upcoming schedules.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((session) => {
                  const spotsLeft = session.maxStudents - session.enrolledCount;
                  const isFull = spotsLeft <= 0;
                  return (
                    <Card key={session.id} className="border-none shadow-md hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                      <div className={`h-2 w-full ${session.status === "upcoming" ? "bg-emerald-400" : session.status === "ongoing" ? "bg-blue-400" : "bg-gray-300"}`} />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg leading-tight">{session.programName}</CardTitle>
                          <Badge className={`shrink-0 text-xs ${levelColors[session.programLevel] ?? "bg-gray-100"}`} variant="outline">
                            {session.programLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={session.status === "upcoming" ? "default" : "secondary"} className="text-xs capitalize">
                            {session.status}
                          </Badge>
                          {isFull && <Badge variant="destructive" className="text-xs">Full</Badge>}
                          {!isFull && spotsLeft <= 3 && <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">Only {spotsLeft} left</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{format(new Date(session.startDate), "MMM d")} – {format(new Date(session.endDate), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{session.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span>{session.enrolledCount}/{session.maxStudents} enrolled</span>
                          </div>
                        </div>
                        <div className="pt-2 text-xs text-muted-foreground">Coach: {session.instructorName}</div>
                        <Link href="/portal/enroll">
                          <Button className="w-full mt-2" size="sm" disabled={isFull}>
                            {isFull ? "Session Full" : "Enroll Now"}
                            {!isFull && <ChevronRight className="w-4 h-4 ml-1" />}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Programs Reference */}
            {programs && programs.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-primary mb-6">Program Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programs.map((p) => (
                    <div key={p.id} className="bg-card border rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">{p.level} · Ages {p.ageMin}–{p.ageMax}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">₱{p.pricePerSession}</div>
                        <div className="text-xs text-muted-foreground">/ session</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
