
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface UserStatusBadgeProps {
  status: 'active' | 'suspended' | 'deactivated';
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { variant: 'default' as const, label: 'Active', className: 'bg-green-500 hover:bg-green-600' };
      case 'suspended':
        return { variant: 'secondary' as const, label: 'Suspended', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' };
      case 'deactivated':
        return { variant: 'destructive' as const, label: 'Deactivated', className: 'bg-red-500 hover:bg-red-600' };
      default:
        return { variant: 'outline' as const, label: 'Unknown', className: '' };
    }
  };

  const config = getStatusConfig();
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
