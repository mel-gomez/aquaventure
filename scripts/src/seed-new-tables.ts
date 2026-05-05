import { db, testimonialsTable, faqTable } from "@workspace/db";

async function seed() {
  console.log("Seeding testimonials...");
  await db.insert(testimonialsTable).values([
    { parentName: "Anna Reyes", content: "My daughter was terrified of water before Aquaventure. After just one month, she's swimming laps confidently. Coach Rico is incredible!", rating: 5, approved: true },
    { parentName: "Joselito Bautista", content: "Best swim school in Rizal! The coaches are patient and professional. My son went from not being able to float to completing freestyle in 6 weeks.", rating: 5, approved: true },
    { parentName: "Grace Mendoza", content: "We tried two other swim schools before Aquaventure. The difference in teaching quality is night and day. Highly recommended!", rating: 5, approved: true },
    { parentName: "Ferdinand Lim", content: "My twins (ages 5 and 7) both enrolled and they absolutely love coming to class. The environment is safe and the coaches are amazing with young kids.", rating: 5, approved: true },
    { parentName: "Maria Clara Santos", content: "Our son is now competing regionally thanks to the Giants Elite program. So proud! Coach James really knows how to push kids to their potential.", rating: 5, approved: true },
    { parentName: "Roberto Aquino", content: "Affordable, professional, and results-driven. What more can a parent ask for? Aquaventure truly lives up to its reputation.", rating: 4, approved: true },
  ]).onConflictDoNothing();

  console.log("Seeding FAQ...");
  await db.insert(faqTable).values([
    { question: "What age can children start swimming lessons?", answer: "We welcome children as young as 3 years old in our Little Splashers program. Our youngest classes focus on water acclimation and are designed to be fun and stress-free.", category: "programs", sortOrder: 1 },
    { question: "How long is each swimming session?", answer: "Each class session is 45 minutes to 1 hour depending on the level. Beginner classes are shorter to avoid fatigue, while advanced classes run the full hour.", category: "programs", sortOrder: 2 },
    { question: "What should my child bring to class?", answer: "Swimwear, a swim cap (recommended), goggles, a towel, and a change of clothes. We recommend arriving 10 minutes early for the first class.", category: "general", sortOrder: 3 },
    { question: "Are the pools heated?", answer: "Yes, our pools are maintained at a comfortable temperature year-round, making it ideal for year-round swimming in the Philippines.", category: "facilities", sortOrder: 4 },
    { question: "How do I enroll my child?", answer: "You can enroll online through our Parent Portal. Create an account, browse available sessions, and submit your enrollment form. Our team will confirm your spot within 24 hours.", category: "enrollment", sortOrder: 5 },
    { question: "What is the student-to-coach ratio?", answer: "We maintain a maximum of 8 students per coach for beginner levels, and up to 12 for intermediate and advanced programs to ensure quality instruction and safety.", category: "programs", sortOrder: 6 },
    { question: "Can I transfer my child to a different session?", answer: "Yes, reschedules are allowed with at least 48 hours notice, subject to availability. Contact us through the portal or via email.", category: "enrollment", sortOrder: 7 },
    { question: "Do you offer make-up classes for absences?", answer: "Make-up classes can be arranged within the same term for medical absences with a doctor's note. Please contact us within 24 hours of the missed class.", category: "enrollment", sortOrder: 8 },
    { question: "How much do classes cost?", answer: "Pricing varies by program level. Visit our Schedule page for full pricing. We also offer sibling discounts for families enrolling more than one child.", category: "payment", sortOrder: 9 },
    { question: "Is there a registration fee?", answer: "There is a one-time registration fee of ₱500 per swimmer per school year, which covers your starter kit and assessment session.", category: "payment", sortOrder: 10 },
  ]).onConflictDoNothing();

  console.log("Done! Testimonials and FAQ seeded.");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
