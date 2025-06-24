
import React from 'react';
import { SidebarHeader } from '@/components/ui/sidebar';

const DashboardSidebarHeader: React.FC = () => {
  return (
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
  );
};

export default DashboardSidebarHeader;
