
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
    // Simulate logout - in real app this would clear auth state
    navigate('/');
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <img 
            src="/lovable-uploads/a05eee5d-4990-41a8-9e2d-10b8fd74349a.png" 
            alt="Goodpass Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold text-lg">Goodpass</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        {section.items[0] === item && <section.icon className="w-4 h-4" />}
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start"
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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger />
              <div className="ml-4">
                <h1 className="font-semibold">Goodpass Backoffice</h1>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
