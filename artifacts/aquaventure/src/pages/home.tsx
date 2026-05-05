import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, ShieldCheck, Trophy, Users } from "lucide-react";
import heroImg from "@assets/image_1777978704079.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-ocean-gradient text-white py-32 lg:py-48">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="white" strokeWidth="2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img src={heroImg} alt="Aquaventure Logo" className="h-36 w-36 mx-auto mb-8 object-contain drop-shadow-2xl" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                  Building Confidence in <span className="text-accent">Every Stroke</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-10">
                  Professional swim training for kids and families in Angono, Rizal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                      Enroll Now
                    </Button>
                  </Link>
                  <Link href="/programs">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/30 text-white text-lg px-8">
                      View Programs
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Aquaventure?</h2>
              <p className="text-muted-foreground text-lg">We combine expert instruction with a welcoming environment to create the perfect setting for learning.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: "Safe Environment", desc: "Our facilities are designed with safety as the #1 priority." },
                { icon: Droplets, title: "Structured Programs", desc: "Clear progression levels from beginners to competitive." },
                { icon: Trophy, title: "Certified Coaches", desc: "Expert instructors trained in modern aquatic techniques." },
                { icon: Users, title: "Family Friendly", desc: "A welcoming community for parents and children alike." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <feature.icon size={24} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Preview */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4">Our Swim Levels</h2>
                <p className="text-muted-foreground max-w-2xl text-lg">A clear pathway from water acclimation to competitive swimming.</p>
              </div>
              <Link href="/programs">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">Explore All Programs</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { level: "Beginner", age: "3-5 years", desc: "Water acclimation, breathing, and floating." },
                { level: "Intermediate", age: "6-9 years", desc: "Stroke introduction and independent swimming." },
                { level: "Advanced", age: "10-14 years", desc: "Stroke refinement, endurance, and technique." },
                { level: "Competitive", age: "12+ years", desc: "Speed, power, race prep and the Giants team." },
              ].map((prog, i) => (
                <Card key={i} className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-ocean-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 relative z-10 group-hover:text-white transition-colors duration-500">
                    <div className="text-sm font-bold text-primary group-hover:text-white/80 mb-2 uppercase tracking-wider">{prog.age}</div>
                    <h3 className="text-xl font-bold mb-3">{prog.level}</h3>
                    <p className="text-muted-foreground group-hover:text-white/90">{prog.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
