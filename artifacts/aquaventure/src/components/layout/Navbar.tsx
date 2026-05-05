import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import logo from "@assets/image_1777978704079.png";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src={logo} alt="Aquaventure Logo" className="h-10 w-10 object-contain" />
          <span className="font-bold text-xl tracking-tight text-primary">Aquaventure</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="/programs" className="text-sm font-medium transition-colors hover:text-primary">
            Programs
          </Link>
          {user ? (
            <Link href={user.role === "admin" ? "/admin" : "/portal"} className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Button variant="ghost" onClick={logout}>
              Log out
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Enroll Now</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
