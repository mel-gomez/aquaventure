import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Trophy, Heart, Target, Users, Droplets } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImg from "@assets/image_1777978704079.png";

const coaches = [
  { name: "Coach Rico Santos", role: "Head Coach & Founder", specialty: "Competitive Swimming, Stroke Technique", years: "8 years experience" },
  { name: "Coach Maria Dela Cruz", role: "Junior Programs Coach", specialty: "Beginner & Intermediate levels, Kids safety", years: "5 years experience" },
  { name: "Coach James Reyes", role: "Advanced & Competition Coach", specialty: "Sprint training, Race strategy", years: "6 years experience" },
];

const values = [
  { icon: ShieldCheck, title: "Safety First", desc: "Every session, every student. Our pool protocols and coach-to-student ratios are designed to keep every child safe." },
  { icon: Heart, title: "Confidence Building", desc: "We celebrate every small win. From floating for the first time to completing a lap, every milestone matters." },
  { icon: Trophy, title: "Excellence", desc: "Our certified coaches hold national aquatics qualifications and pursue continuous professional development." },
  { icon: Target, title: "Clear Progression", desc: "Structured levels ensure every swimmer knows where they are and what they're working toward." },
  { icon: Users, title: "Community", desc: "Aquaventure is more than a swim school — it's a family of coaches, parents, and kids who support each other." },
  { icon: Droplets, title: "Love for the Water", desc: "We believe everyone can learn to love swimming. Our goal is lifelong aquatic confidence, not just certificates." },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-ocean-gradient text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="white" strokeWidth="2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <img src={heroImg} alt="Logo" className="h-20 w-20 mx-auto mb-6 object-contain drop-shadow-xl" />
            <h1 className="text-5xl font-bold mb-6">About Aquaventure</h1>
            <p className="text-xl text-white/85 leading-relaxed">
              Founded in 2019 in the heart of Angono, Rizal, Aquaventure Swim School was built on a simple belief: every child deserves to feel safe and confident in the water.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>Aquaventure was founded by Coach Rico Santos, a competitive swimmer who grew up in Angono and saw a need for structured, affordable swimming education for local families.</p>
                  <p>What started as a small group of 12 kids has grown into a thriving swim school serving over 500 students — from fearful 3-year-olds taking their first steps into the water, to teens competing at regional championships.</p>
                  <p>Angono is known as the Art Capital of the Philippines, a city that values creativity, culture, and community. We carry that same spirit into everything we do — every class is a creative, joyful experience designed to inspire a love of the water.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-4">
                {[
                  { num: "2019", label: "Year Founded" },
                  { num: "500+", label: "Students Trained" },
                  { num: "3", label: "Expert Coaches" },
                  { num: "6", label: "Program Levels" },
                ].map((stat, i) => (
                  <div key={i} className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
                    <div className="text-4xl font-bold text-primary mb-2">{stat.num}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-muted/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg">The principles that guide every class, every coach, every decision.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <v.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Coaches */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">Meet Our Coaches</h2>
              <p className="text-muted-foreground text-lg">Certified aquatics professionals who are passionate about developing confident swimmers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coaches.map((coach, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}>
                  <Card className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-20 h-20 rounded-full bg-ocean-gradient mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                        {coach.name.split(" ")[1]?.charAt(0)}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{coach.name}</h3>
                      <div className="text-primary text-sm font-medium mb-3">{coach.role}</div>
                      <p className="text-muted-foreground text-sm mb-2">{coach.specialty}</p>
                      <span className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">{coach.years}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-ocean-gradient text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Join the Aquaventure Family?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Enroll today and give your child the gift of water confidence.</p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link href="/register"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Enroll Now</Button></Link>
              <Link href="/contact"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Contact Us</Button></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
