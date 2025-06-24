
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import DashboardSidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import DashboardSidebarFooter from './SidebarFooter';

const AppSidebar: React.FC = () => {
  return (
    <Sidebar className="border-r border-slate-200 bg-slate-50">
      <DashboardSidebarHeader />
      <SidebarNavigation />
      <DashboardSidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
