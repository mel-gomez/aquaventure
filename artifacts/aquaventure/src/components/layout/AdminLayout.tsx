import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import logo from "@assets/image_1777978704079.png";
import { LayoutDashboard, Users, ClipboardList, BookOpen, Calendar as CalendarIcon, Megaphone, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Swimmers", href: "/admin/swimmers", icon: Users },
    { name: "Enrollments", href: "/admin/enrollments", icon: ClipboardList },
    { name: "Programs", href: "/admin/programs", icon: BookOpen },
    { name: "Sessions", href: "/admin/sessions", icon: CalendarIcon },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-6 flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-10 h-10 brightness-0 invert object-contain" />
        <span className="font-bold text-xl">Admin Panel</span>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <span className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
                <item.icon className="h-5 w-5" />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col md:flex-row">
      <div className="md:hidden bg-sidebar text-sidebar-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 brightness-0 invert object-contain" />
          <span className="font-bold text-lg">Admin</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="fixed w-64 h-screen border-r border-sidebar-border">
          <SidebarContent />
        </div>
      </div>

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
