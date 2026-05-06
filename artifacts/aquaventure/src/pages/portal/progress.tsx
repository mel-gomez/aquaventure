import { PortalLayout } from "@/components/layout/PortalLayout";
import { useGetMyProgress } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";
import { format } from "date-fns";

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

export default function PortalProgress() {
  const { data: records, isLoading } = useGetMyProgress();

  const bySwimmer = (records ?? []).reduce<Record<string, typeof records>>((acc, r) => {
    const key = r.swimmerName ?? `Enrollment #${r.enrollmentId}`;
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(r);
    return acc;
  }, {});

  const totalCount = records?.length ?? 0;
  const uniqueSkills = new Set(records?.map((r) => r.skill)).size;

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Swimmer Progress</h1>
          <p className="text-muted-foreground">View skill milestones and achievements logged by your coaches.</p>
        </div>

        {totalCount > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <div className="text-2xl font-bold text-amber-500">{totalCount}</div>
                <div className="text-xs text-muted-foreground mt-1">Skills Achieved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <div className="text-2xl font-bold text-primary">{uniqueSkills}</div>
                <div className="text-xs text-muted-foreground mt-1">Unique Milestones</div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Loading...</CardContent>
          </Card>
        ) : totalCount === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="font-semibold text-lg mb-1">No Milestones Yet</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your coach will log skill achievements here as your swimmer progresses through their program.
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(bySwimmer).map(([swimmerName, swimmerRecords]) => (
            <Card key={swimmerName}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="w-5 h-5 text-amber-500" />
                  {swimmerName}
                </CardTitle>
                <CardDescription>
                  {swimmerRecords?.length} skill{swimmerRecords!.length !== 1 ? "s" : ""} achieved
                  {swimmerRecords?.[0]?.programName ? ` · ${swimmerRecords[0].programName}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {swimmerRecords?.slice().reverse().map((r) => (
                    <div key={r.id} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/20 transition-colors">
                      <div className="mt-0.5 flex-shrink-0">
                        <Trophy className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${skillColor(r.skill)}`}>
                            {r.skill}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {r.achievedAt}
                          </span>
                        </div>
                        {r.notes && (
                          <p className="text-sm text-muted-foreground italic">"{r.notes}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PortalLayout>
  );
}
