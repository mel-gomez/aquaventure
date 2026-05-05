import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, ShieldCheck, Trophy, Users, Star, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { useListTestimonials, useListPrograms } from "@workspace/api-client-react";
import heroImg from "@assets/image_1777978704079.png";

export default function Home() {
  const { data: testimonials } = useListTestimonials();
  const { data: programs } = useListPrograms();

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
              {(programs?.slice(0, 4) ?? [
                { id: 0, level: "Beginner", ageMin: 3, ageMax: 5, description: "Water acclimation, breathing, and floating." },
                { id: 1, level: "Intermediate", ageMin: 6, ageMax: 9, description: "Stroke introduction and independent swimming." },
                { id: 2, level: "Advanced", ageMin: 10, ageMax: 14, description: "Stroke refinement, endurance, and technique." },
                { id: 3, level: "Competitive", ageMin: 12, ageMax: 18, description: "Speed, power, race prep and the Giants team." },
              ]).map((prog, i) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="relative overflow-hidden group h-full cursor-pointer">
                    <div className="absolute inset-0 bg-ocean-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-6 relative z-10 group-hover:text-white transition-colors duration-500">
                      <div className="text-sm font-bold text-primary group-hover:text-white/80 mb-2 uppercase tracking-wider">Ages {prog.ageMin}–{prog.ageMax}</div>
                      <h3 className="text-xl font-bold mb-3 capitalize">{prog.level}</h3>
                      <p className="text-muted-foreground group-hover:text-white/90 text-sm">{prog.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Angono / Local Identity Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="art-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="20" fill="none" stroke="white" strokeWidth="1"/>
                  <path d="M10 30 Q 30 10, 50 30 Q 30 50, 10 30" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#art-pattern)" />
            </svg>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-block bg-white/10 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                  Proudly Local
                </div>
                <h2 className="text-4xl font-bold mb-6">Rooted in Angono, Rizal</h2>
                <p className="text-primary-foreground/80 text-lg mb-6">
                  Angono is known as the Art Capital of the Philippines — a city that celebrates creativity, culture, and community. Aquaventure Swim School carries that same spirit into the water.
                </p>
                <p className="text-primary-foreground/80 text-lg mb-8">
                  We believe every child in our community deserves access to quality swim education — building not just swimmers, but confident, resilient individuals ready for life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                    <MapPin className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Location</div>
                      <div className="text-primary-foreground/70 text-sm">Angono, Rizal, PH</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                    <Users className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Est. 2019</div>
                      <div className="text-primary-foreground/70 text-sm">Serving families since</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { num: "500+", label: "Swimmers Trained" },
                  { num: "6", label: "Program Levels" },
                  { num: "98%", label: "Parent Satisfaction" },
                  { num: "5★", label: "Average Rating" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/10">
                    <div className="text-4xl font-bold text-accent mb-2">{stat.num}</div>
                    <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {testimonials && testimonials.length > 0 && (
          <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-primary mb-4">What Parents Say</h2>
                <p className="text-muted-foreground text-lg">Real stories from families in Angono who have seen the Aquaventure difference.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.slice(0, 6).map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-card">
                      <CardContent className="p-6">
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-6 italic leading-relaxed">"{t.content}"</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {t.parentName.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-semibold">{t.parentName}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/contact">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                    Share Your Story
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="py-24 bg-accent">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-accent-foreground mb-6">
                Start Your Child's Swimming Journey Today
              </h2>
              <p className="text-accent-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
                Join hundreds of families in Angono who trust Aquaventure Giants to build their children's confidence in the water.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 font-bold shadow-lg">
                    Enroll Now
                  </Button>
                </Link>
                <Link href="/schedule">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-10">
                    View Schedule
                  </Button>
                </Link>
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-accent-foreground/70">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+63 912 345 6789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">hello@aquaventure.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Angono, Rizal</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
