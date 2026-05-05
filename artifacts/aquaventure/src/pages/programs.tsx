import { useListPrograms } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Programs() {
  const { data: programs, isLoading } = useListPrograms();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Swim Programs</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect level for your child. From water acclimation to competitive racing, we have a program for every swimmer.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading programs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs?.map((program) => (
                <Card key={program.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold text-primary mb-2">{program.name}</CardTitle>
                        <CardDescription className="text-sm font-medium">Ages {program.ageMin} - {program.ageMax}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="uppercase">{program.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-6 line-clamp-3">{program.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="font-semibold text-lg">₱{program.pricePerSession} <span className="text-sm font-normal text-muted-foreground">/ session</span></div>
                      <Link href={`/login`}>
                        <Button>Enroll</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {programs?.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed">
                  <p className="text-muted-foreground">No programs available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
