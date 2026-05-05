import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListFaq } from "@workspace/api-client-react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const fallbackFaqs = [
  { id: 1, question: "What age can children start swimming lessons?", answer: "We welcome children as young as 3 years old in our Little Splashers program. Our youngest classes focus on water acclimation and are designed to be fun and stress-free.", category: "programs" },
  { id: 2, question: "How long is each swimming session?", answer: "Each class session is 45 minutes to 1 hour depending on the level. Beginner classes are shorter to avoid fatigue, while advanced classes run the full hour.", category: "programs" },
  { id: 3, question: "What should my child bring to class?", answer: "Swimwear, a swim cap (recommended), goggles, a towel, and a change of clothes. We recommend arriving 10 minutes early for the first class.", category: "general" },
  { id: 4, question: "Are the pools heated?", answer: "Yes, our pools are maintained at a comfortable temperature year-round, making it ideal for year-round swimming in the Philippines.", category: "facilities" },
  { id: 5, question: "How do I enroll my child?", answer: "You can enroll online through our Parent Portal. Create an account, browse available sessions, and submit your enrollment form. Our team will confirm your spot within 24 hours.", category: "enrollment" },
  { id: 6, question: "What is the student-to-coach ratio?", answer: "We maintain a maximum of 8 students per coach for beginner levels, and up to 12 for intermediate and advanced programs to ensure quality instruction and safety.", category: "programs" },
  { id: 7, question: "Can I transfer my child to a different session?", answer: "Yes, reschedules are allowed with at least 48 hours' notice, subject to availability. Contact us through the portal or via email.", category: "enrollment" },
  { id: 8, question: "Do you offer make-up classes for absences?", answer: "Make-up classes can be arranged within the same term for medical absences with a doctor's note. Please contact us within 24 hours of the missed class.", category: "enrollment" },
];

export default function FAQ() {
  const { data: faqData, isLoading } = useListFaq();
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const faqs = (faqData && faqData.length > 0) ? faqData : fallbackFaqs;
  const categories = ["all", ...Array.from(new Set(faqs.map((f) => f.category)))];
  const filtered = activeCategory === "all" ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-ocean-gradient text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="w-14 h-14 mx-auto mb-6 text-accent" />
            <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-white/85 text-xl max-w-2xl mx-auto">
              Everything you need to know before diving in.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-10 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="text-center py-10 text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((faq) => (
                  <div key={faq.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button
                      className="w-full flex items-center justify-between p-5 text-left gap-4"
                      onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    >
                      <span className="font-semibold text-foreground leading-snug">{faq.question}</span>
                      {openId === faq.id
                        ? <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                        : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                      }
                    </button>
                    <AnimatePresence>
                      {openId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-14 text-center bg-primary/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">Can't find the answer you're looking for? Reach out to our team directly.</p>
              <Link href="/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
