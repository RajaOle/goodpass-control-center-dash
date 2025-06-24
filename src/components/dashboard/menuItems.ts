
import {
  BarChart3,
  Users,
  MessageSquare,
  Megaphone,
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
    title: "Analytics",
    icon: BarChart3,
    url: "/dashboard/analytics",
    items: [
      { title: "Overview", url: "/dashboard/analytics" },
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
      { title: "Account Status", url: "/dashboard/users/status" },
      { title: "Permissions", url: "/dashboard/users/permissions" },
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
