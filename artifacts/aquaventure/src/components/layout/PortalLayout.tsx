import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LayoutDashboard, FilePlus, ClipboardCheck, UserCircle2 } from "lucide-react";

export function PortalLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "My Dashboard", href: "/portal", icon: LayoutDashboard },
    { name: "Enroll in Class", href: "/portal/enroll", icon: FilePlus },
    { name: "Attendance", href: "/portal/attendance", icon: ClipboardCheck },
    { name: "My Profile", href: "/portal/profile", icon: UserCircle2 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-56 flex-shrink-0">
              <div className="bg-card rounded-xl border shadow-sm p-3 sticky top-24">
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <span className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm ${isActive ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
