import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import logo from "@assets/image_1777978704079.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const publicNav = [
  { label: "Programs", href: "/programs" },
  { label: "Schedule", href: "/schedule" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src={logo} alt="Aquaventure Logo" className="h-10 w-10 object-contain" />
          <span className="font-bold text-xl tracking-tight text-primary">Aquaventure</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-1 items-center">
          {publicNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${location === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                {item.label}
              </span>
            </Link>
          ))}
          {user && (
            <Link href={user.role === "admin" ? "/admin" : "/portal"}>
              <span className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${location.startsWith(user.role === "admin" ? "/admin" : "/portal") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                Dashboard
              </span>
            </Link>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Hi, {user.firstName}</span>
              <Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Enroll Now</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-1">
          {publicNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <span className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${location === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                {item.label}
              </span>
            </Link>
          ))}
          {user && (
            <Link href={user.role === "admin" ? "/admin" : "/portal"} onClick={() => setMobileOpen(false)}>
              <span className="block px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
                Dashboard
              </span>
            </Link>
          )}
          <div className="pt-3 border-t space-y-2">
            {user ? (
              <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setMobileOpen(false); }}>
                Log out
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Enroll Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
