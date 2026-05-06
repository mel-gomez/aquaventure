import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import logo from "@assets/image_1777978704079.png";
import {
  LayoutDashboard, Users, ClipboardList, BookOpen, Calendar as CalendarIcon,
  Megaphone, LogOut, Menu, Star, HelpCircle, Mail, ClipboardCheck, Trophy,
  ShieldCheck, UserCircle2
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/30",
    dot: "bg-rose-400",
  },
  parent: {
    label: "Parent",
    icon: UserCircle2,
    gradient: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-500/30",
    dot: "bg-blue-400",
  },
  swimmer: {
    label: "Swimmer",
    icon: UserCircle2,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/30",
    dot: "bg-emerald-400",
  },
};

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const roleKey = (user?.role ?? "admin") as keyof typeof ROLE_CONFIG;
  const roleConfig = ROLE_CONFIG[roleKey] ?? ROLE_CONFIG.admin;
  const RoleIcon = roleConfig.icon;

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
      {/* Logo header */}
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
        <div>
          <div className="font-bold text-sm text-white">Admin Panel</div>
          <div className="text-white/50 text-xs">Aquaventure Giants</div>
        </div>
      </div>

      {/* User identity card */}
      {user && (
        <div className="mx-3 mt-3 mb-1 rounded-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${roleConfig.gradient} p-px rounded-xl shadow-lg ${roleConfig.glow}`}>
            <div className="bg-sidebar/90 backdrop-blur-sm rounded-[11px] px-3.5 py-3 flex items-center gap-3">
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white text-xs font-bold shadow-inner shrink-0`}>
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white text-xs font-semibold truncate leading-tight">
                  {user.firstName} {user.lastName}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${roleConfig.dot} animate-pulse`} />
                  <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">
                    {roleConfig.label}
                  </span>
                </div>
              </div>
              <RoleIcon className="w-4 h-4 text-white/40 shrink-0" />
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
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
        <div className="flex items-center gap-2">
          {user && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${roleConfig.gradient} text-white text-xs font-semibold shadow-md`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse`} />
              {roleConfig.label}
            </span>
          )}
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
