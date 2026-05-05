import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Programs from "@/pages/programs";

// Portal
import PortalDashboard from "@/pages/portal/index";
import EnrollPage from "@/pages/portal/enroll";

// Admin
import AdminDashboard from "@/pages/admin/index";
import AdminEnrollments from "@/pages/admin/enrollments";
import AdminPrograms from "@/pages/admin/programs";
import AdminSessions from "@/pages/admin/sessions";
import AdminAnnouncements from "@/pages/admin/announcements";
import AdminSwimmers from "@/pages/admin/swimmers";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/programs" component={Programs} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Parent/Swimmer Portal */}
      <Route path="/portal">
        <ProtectedRoute><PortalDashboard /></ProtectedRoute>
      </Route>
      <Route path="/portal/enroll">
        <ProtectedRoute><EnrollPage /></ProtectedRoute>
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
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
