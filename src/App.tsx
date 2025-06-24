
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import UserManagement from "./pages/UserManagement";
import FinancialReputation from "./pages/FinancialReputation";
import Verification from "./pages/Verification";
import Moderation from "./pages/Moderation";
import ImportReport from "./pages/ImportReport";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="analytics/user-growth" element={<Analytics />} />
            <Route path="analytics/transactions" element={<Analytics />} />
            <Route path="analytics/engagement" element={<Analytics />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/status" element={<UserManagement />} />
            <Route path="users/permissions" element={<UserManagement />} />
            <Route path="financial" element={<FinancialReputation />} />
            <Route path="financial/history" element={<FinancialReputation />} />
            <Route path="financial/settings" element={<FinancialReputation />} />
            <Route path="verification" element={<Verification />} />
            <Route path="verification/completed" element={<Verification />} />
            <Route path="verification/rejected" element={<Verification />} />
            <Route path="moderation" element={<Moderation />} />
            <Route path="moderation/import" element={<ImportReport />} />
            <Route path="moderation/history" element={<Moderation />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="announcements/scheduled" element={<Announcements />} />
            <Route path="announcements/history" element={<Announcements />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/preferences" element={<Settings />} />
            <Route path="settings/system" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
