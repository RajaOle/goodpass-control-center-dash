
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  CreditCard,
  Shield,
  Activity,
  MessageSquare,
  Megaphone,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/dashboard",
    items: [
      { title: "Overview", url: "/dashboard" },
    ]
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/dashboard/analytics",
    items: [
      { title: "Overview", url: "/dashboard/analytics" },
      { title: "User Growth", url: "/dashboard/analytics/user-growth" },
      { title: "Transaction Volume", url: "/dashboard/analytics/transactions" },
      { title: "Engagement Metrics", url: "/dashboard/analytics/engagement" },
    ]
  },
  {
    title: "User Management",
    icon: Users,
    url: "/dashboard/users",
    items: [
      { title: "User Directory", url: "/dashboard/users" },
      { title: "Account Status", url: "/dashboard/users/status" },
      { title: "Permissions", url: "/dashboard/users/permissions" },
    ]
  },
  {
    title: "Financial Reputation",
    icon: CreditCard,
    url: "/dashboard/financial",
    items: [
      { title: "Reputation Scores", url: "/dashboard/financial" },
      { title: "Score History", url: "/dashboard/financial/history" },
      { title: "Algorithm Settings", url: "/dashboard/financial/settings" },
    ]
  },
  {
    title: "KYC/KYB Verification",
    icon: Shield,
    url: "/dashboard/verification",
    items: [
      { title: "Pending Verifications", url: "/dashboard/verification" },
      { title: "Completed Verifications", url: "/dashboard/verification/completed" },
      { title: "Rejected Applications", url: "/dashboard/verification/rejected" },
    ]
  },
  {
    title: "Activity Logs",
    icon: Activity,
    url: "/dashboard/activity",
    items: [
      { title: "System Logs", url: "/dashboard/activity" },
      { title: "User Actions", url: "/dashboard/activity/user-actions" },
      { title: "Security Events", url: "/dashboard/activity/security" },
    ]
  },
  {
    title: "Peer Review Moderation",
    icon: MessageSquare,
    url: "/dashboard/moderation",
    items: [
      { title: "Pending Reviews", url: "/dashboard/moderation" },
      { title: "Flagged Content", url: "/dashboard/moderation/flagged" },
      { title: "Moderation History", url: "/dashboard/moderation/history" },
    ]
  },
  {
    title: "Announcements",
    icon: Megaphone,
    url: "/dashboard/announcements",
    items: [
      { title: "Create Announcement", url: "/dashboard/announcements" },
      { title: "Scheduled Posts", url: "/dashboard/announcements/scheduled" },
      { title: "Announcement History", url: "/dashboard/announcements/history" },
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
    items: [
      { title: "General Settings", url: "/dashboard/settings" },
      { title: "User Preferences", url: "/dashboard/settings/preferences" },
      { title: "System Configuration", url: "/dashboard/settings/system" },
    ]
  },
];

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-slate-50">
      <SidebarHeader className="border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <img 
              src="/lovable-uploads/a05eee5d-4990-41a8-9e2d-10b8fd74349a.png" 
              alt="Goodpass Logo" 
              className="w-5 h-5 object-contain filter brightness-0 invert"
            />
          </div>
          <span className="font-bold text-lg text-slate-800">Goodpass</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-slate-50">
        {menuItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-slate-600 font-medium text-xs uppercase tracking-wider px-4 py-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      className="mx-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 text-slate-700 hover:text-slate-900"
                      >
                        {section.items[0] === item && <section.icon className="w-4 h-4" />}
                        <span className="text-sm font-medium">{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start mx-2 rounded-lg hover:bg-slate-100 text-slate-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-slate-200 bg-white shadow-sm">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
              <div className="ml-4">
                <h1 className="font-semibold text-slate-800">Goodpass Backoffice</h1>
              </div>
            </div>
          </header>
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
