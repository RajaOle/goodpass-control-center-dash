
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import FinancialReputation from "./pages/FinancialReputation";
import Verification from "./pages/Verification";
import Moderation from "./pages/Moderation";
import ModerationHistory from "./pages/ModerationHistory";
import ImportReport from "./pages/ImportReport";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="viewer">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="financial" element={<FinancialReputation />} />
              <Route path="financial/history" element={<FinancialReputation />} />
              <Route path="financial/settings" element={<FinancialReputation />} />
              <Route path="verification" element={<Verification />} />
              <Route path="verification/completed" element={<Verification />} />
              <Route path="verification/rejected" element={<Verification />} />
              <Route path="moderation" element={<Moderation />} />
              <Route path="moderation/import" element={<ImportReport />} />
              <Route path="moderation/history" element={<ModerationHistory />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
