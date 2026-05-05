import { Link } from "wouter";
import logo from "@assets/image_1777978704079.png";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-5">
              <img src={logo} alt="Aquaventure Logo" className="h-12 w-12 object-contain" />
              <div>
                <div className="font-bold text-xl tracking-tight text-white">Aquaventure Giants</div>
                <div className="text-sidebar-foreground/60 text-xs">Swim School · Est. 2019</div>
              </div>
            </Link>
            <p className="text-sidebar-foreground/70 max-w-sm leading-relaxed mb-6">
              Professional swim training for kids and families in Angono, Rizal. Building confidence, one stroke at a time.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 text-sm transition-colors">
                <Facebook className="w-4 h-4" /> Facebook
              </a>
              <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 text-sm transition-colors">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sidebar-foreground/70 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/programs" className="hover:text-white transition-colors">Programs</Link></li>
              <li><Link href="/schedule" className="hover:text-white transition-colors">Schedule</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Parent Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sidebar-foreground/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Angono, Rizal, Philippines</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href="tel:+639123456789" className="hover:text-white transition-colors">+63 912 345 6789</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:hello@aquaventure.com" className="hover:text-white transition-colors">hello@aquaventure.com</a>
              </li>
            </ul>
            <div className="mt-5 text-sidebar-foreground/60 text-xs leading-relaxed">
              Office Hours:<br />
              Mon–Sat · 8:00 AM – 6:00 PM
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-sidebar-foreground/50">
          <span>&copy; {new Date().getFullYear()} Aquaventure Swim School. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/register" className="hover:text-white transition-colors">Enroll</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
