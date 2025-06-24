
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { menuItems } from './menuItems';

const SidebarNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
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
  );
};

export default SidebarNavigation;
