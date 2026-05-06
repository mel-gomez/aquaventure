import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import logo from "@assets/image_1777978704079.png";
import {
  LayoutDashboard, Users, ClipboardList, BookOpen, Calendar as CalendarIcon,
  Megaphone, LogOut, Menu, Star, HelpCircle, Mail, ClipboardCheck, Trophy
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Swimmers", href: "/admin/swimmers", icon: Users },
    { name: "Enrollments", href: "/admin/enrollments", icon: ClipboardList },
    { name: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
    { name: "Progress", href: "/admin/progress", icon: Trophy },
    { name: "Programs", href: "/admin/programs", icon: BookOpen },
    { name: "Sessions", href: "/admin/sessions", icon: CalendarIcon },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
    { name: "Contacts", href: "/admin/contacts", icon: Mail },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
        <div>
          <div className="font-bold text-sm text-white">Admin Panel</div>
          <div className="text-white/50 text-xs">Aquaventure Giants</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <span className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm ${isActive ? "bg-sidebar-accent text-white font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground text-sm" onClick={logout}>
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col md:flex-row">
      <div className="md:hidden bg-sidebar text-sidebar-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-sm text-white">Admin</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="fixed w-64 h-screen border-r border-sidebar-border overflow-hidden">
          <SidebarContent />
        </div>
      </div>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
