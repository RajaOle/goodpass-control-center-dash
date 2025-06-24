
import {
  BarChart3,
  Users,
  MessageSquare,
  Settings,
} from 'lucide-react';

export const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/dashboard",
    items: [
      { title: "Overview", url: "/dashboard" },
    ]
  },
  {
    title: "Manage Report",
    icon: MessageSquare,
    url: "/dashboard/moderation",
    items: [
      { title: "Pending Reviews", url: "/dashboard/moderation" },
      { title: "Import Report", url: "/dashboard/moderation/import" },
      { title: "Moderation History", url: "/dashboard/moderation/history" },
    ]
  },
  {
    title: "User Management",
    icon: Users,
    url: "/dashboard/users",
    items: [
      { title: "User Directory", url: "/dashboard/users" },
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
    items: [
      { title: "General Settings", url: "/dashboard/settings" },
    ]
  },
];
