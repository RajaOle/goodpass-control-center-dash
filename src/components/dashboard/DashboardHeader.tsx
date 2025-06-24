
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const DashboardHeader: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center px-6">
        <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
        <div className="ml-4">
          <h1 className="font-semibold text-slate-800">Goodpass Backoffice</h1>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
