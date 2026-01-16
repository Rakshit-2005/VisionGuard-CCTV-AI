import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Public Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Layouts
import { CompanyLayout } from "./components/layouts/CompanyLayout";
import { PlatformLayout } from "./components/layouts/PlatformLayout";

// Company Pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import Employees from "./pages/company/Employees";
import Violations from "./pages/company/Violations";
import CCTVManagement from "./pages/company/CCTVManagement";
import Reports from "./pages/company/Reports";
import AIAssistant from "./pages/company/AIAssistant";
import Settings from "./pages/company/Settings";

// Platform Pages
import PlatformDashboard from "./pages/platform/PlatformDashboard";
import Companies from "./pages/platform/Companies";
import SystemActivity from "./pages/platform/SystemActivity";
import PlatformSettings from "./pages/platform/PlatformSettings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Company Admin Routes */}
            <Route path="/company" element={<CompanyLayout />}>
              <Route index element={<CompanyDashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="violations" element={<Violations />} />
              <Route path="cctv" element={<CCTVManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="assistant" element={<AIAssistant />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Platform Admin Routes */}
            <Route path="/platform" element={<PlatformLayout />}>
              <Route index element={<PlatformDashboard />} />
              <Route path="companies" element={<Companies />} />
              <Route path="activity" element={<SystemActivity />} />
              <Route path="settings" element={<PlatformSettings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
