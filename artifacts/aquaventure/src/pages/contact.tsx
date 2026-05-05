import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContact } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
      await submitContact.mutateAsync({
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          subject: values.subject,
          message: values.message,
        },
      });
      setSubmitted(true);
    } catch {
      toast({ title: "Failed to send message", description: "Please try again.", variant: "destructive" });
    }
  };

  const contactInfo = [
    { icon: MapPin, label: "Address", value: "Angono, Rizal, Philippines" },
    { icon: Phone, label: "Phone", value: "+63 912 345 6789" },
    { icon: Mail, label: "Email", value: "hello@aquaventure.com" },
    { icon: Clock, label: "Office Hours", value: "Mon–Sat, 8:00 AM – 6:00 PM" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-ocean-gradient text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-white/85 text-xl max-w-2xl mx-auto">
              Questions about enrollment, programs, or anything else? We'd love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 pb-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <info.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{info.label}</div>
                          <div className="font-semibold text-foreground">{info.value}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                <div className="pt-4">
                  <h3 className="font-semibold mb-3 text-muted-foreground text-sm uppercase tracking-wide">Follow Us</h3>
                  <div className="flex gap-3">
                    {["Facebook", "Instagram"].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-lg px-4 py-2 text-sm font-medium text-primary transition-colors"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <Button className="mt-8" variant="outline" onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <Card className="border-none shadow-md">
                    <CardContent className="pt-8 pb-8 px-8">
                      <h2 className="text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl><Input placeholder="Maria Santos" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input placeholder="maria@email.com" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone (optional)</FormLabel>
                                <FormControl><Input placeholder="+63 912 345 6789" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="subject" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl><Input placeholder="Enrollment inquiry" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us more about what you're looking for..."
                                  className="min-h-[140px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <Button type="submit" className="w-full" size="lg" disabled={submitContact.isPending}>
                            {submitContact.isPending ? "Sending..." : "Send Message"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
