import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserStatusBadge } from './UserStatusBadge';
import { GPScoreDisplay } from './GPScoreDisplay';
import { UserActionsDropdown } from './UserActionsDropdown';
import { Button } from '@/components/ui/button';

interface UserData {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  isReporter: boolean;
  isReportee: boolean;
  totalReports: number;
  verifiedReports: number;
  unverifiedReports: number;
  complaints: number;
  gpScore: number;
  status: 'active' | 'suspended' | 'deactivated';
  kycStatus?: 'pending' | 'verified' | 'rejected';
  kycDocuments?: { name: string; url: string; type: string }[];
}

interface UserTableRowProps {
  user: UserData;
  onAction: (action: string, userId: string) => void;
  onViewKyc?: () => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({ user, onAction, onViewKyc }) => {
  return (
    <TableRow className="hover:bg-slate-50">
      <TableCell>
        <div>
          <div className="font-medium text-slate-900">{user.name}</div>
          <div className="text-sm text-slate-500">{user.email}</div>
          <div className="text-xs text-slate-400">{user.registrationDate}</div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col space-y-1">
          <Badge variant="outline" className="w-fit">
            Registered User
          </Badge>
          {user.isReporter && (
            <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-700">
              Reporter
            </Badge>
          )}
          {user.isReportee && (
            <Badge variant="secondary" className="w-fit bg-orange-100 text-orange-700">
              Reportee
            </Badge>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm">
          <div className="font-medium">Total: {user.totalReports}</div>
          <div className="text-green-600">Verified: {user.verifiedReports}</div>
          <div className="text-orange-600">Unverified: {user.unverifiedReports}</div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className={`text-sm font-medium ${user.complaints > 5 ? 'text-red-600' : user.complaints > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
          {user.complaints}
        </div>
      </TableCell>
      
      <TableCell>
        <GPScoreDisplay score={user.gpScore} />
      </TableCell>
      
      <TableCell>
        <UserStatusBadge status={user.status} />
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col space-y-2">
          {user.kycStatus && (
            <Badge variant={
              user.kycStatus === 'verified'
                ? 'default'
                : user.kycStatus === 'pending'
                ? 'secondary'
                : 'destructive'
            }>
              {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
            </Badge>
          )}
          {onViewKyc && (
            <Button
              size="sm"
              variant="outline"
              onClick={onViewKyc}
              className="w-full"
            >
              View KYC
            </Button>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <UserActionsDropdown user={user} onAction={onAction} />
      </TableCell>
    </TableRow>
  );
};
