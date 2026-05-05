import { Link } from "wouter";
import logo from "@assets/image_1777978704079.png";

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <img src={logo} alt="Aquaventure Logo" className="h-12 w-12 object-contain brightness-0 invert" />
            <span className="font-bold text-2xl tracking-tight">Aquaventure</span>
          </Link>
          <p className="text-sidebar-foreground/70 max-w-sm">
            Professional swim training for kids and families in Angono, Rizal. Building confidence in every stroke.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sidebar-foreground/70">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/programs" className="hover:text-white transition-colors">Programs</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Parent Portal</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Contact</h3>
          <ul className="space-y-2 text-sidebar-foreground/70">
            <li>Angono, Rizal</li>
            <li>Philippines</li>
            <li>hello@aquaventure.com</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-sm text-sidebar-foreground/50">
        &copy; {new Date().getFullYear()} Aquaventure Swim School. All rights reserved.
      </div>
    </footer>
  );
}
