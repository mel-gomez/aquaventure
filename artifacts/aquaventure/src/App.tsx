import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FloatingEnrollButton } from "@/components/FloatingEnrollButton";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Programs from "@/pages/programs";
import About from "@/pages/about";
import Schedule from "@/pages/schedule";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";

// Portal
import PortalDashboard from "@/pages/portal/index";
import EnrollPage from "@/pages/portal/enroll";
import PortalAttendance from "@/pages/portal/attendance";

// Admin
import AdminDashboard from "@/pages/admin/index";
import AdminEnrollments from "@/pages/admin/enrollments";
import AdminPrograms from "@/pages/admin/programs";
import AdminSessions from "@/pages/admin/sessions";
import AdminAnnouncements from "@/pages/admin/announcements";
import AdminSwimmers from "@/pages/admin/swimmers";
import AdminTestimonials from "@/pages/admin/testimonials";
import AdminFaq from "@/pages/admin/faq";
import AdminContacts from "@/pages/admin/contacts";
import AdminAttendance from "@/pages/admin/attendance";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/programs" component={Programs} />
      <Route path="/about" component={About} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Parent/Swimmer Portal */}
      <Route path="/portal">
        <ProtectedRoute><PortalDashboard /></ProtectedRoute>
      </Route>
      <Route path="/portal/enroll">
        <ProtectedRoute><EnrollPage /></ProtectedRoute>
      </Route>
      <Route path="/portal/attendance">
        <ProtectedRoute><PortalAttendance /></ProtectedRoute>
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin">
        <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
      </Route>
      <Route path="/admin/swimmers">
        <ProtectedRoute adminOnly><AdminSwimmers /></ProtectedRoute>
      </Route>
      <Route path="/admin/enrollments">
        <ProtectedRoute adminOnly><AdminEnrollments /></ProtectedRoute>
      </Route>
      <Route path="/admin/programs">
        <ProtectedRoute adminOnly><AdminPrograms /></ProtectedRoute>
      </Route>
      <Route path="/admin/sessions">
        <ProtectedRoute adminOnly><AdminSessions /></ProtectedRoute>
      </Route>
      <Route path="/admin/announcements">
        <ProtectedRoute adminOnly><AdminAnnouncements /></ProtectedRoute>
      </Route>
      <Route path="/admin/testimonials">
        <ProtectedRoute adminOnly><AdminTestimonials /></ProtectedRoute>
      </Route>
      <Route path="/admin/faq">
        <ProtectedRoute adminOnly><AdminFaq /></ProtectedRoute>
      </Route>
      <Route path="/admin/contacts">
        <ProtectedRoute adminOnly><AdminContacts /></ProtectedRoute>
      </Route>
      <Route path="/admin/attendance">
        <ProtectedRoute adminOnly><AdminAttendance /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <FloatingEnrollButton />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
