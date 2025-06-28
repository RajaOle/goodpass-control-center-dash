import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Download } from 'lucide-react';

interface UserFiltersProps {
  userTypeFilter: string;
  gpScoreFilter: string;
  complaintFilter: string;
  kycStatusFilter: string;
  onUserTypeChange: (value: string) => void;
  onGpScoreChange: (value: string) => void;
  onComplaintChange: (value: string) => void;
  onKycStatusChange: (value: string) => void;
  onExport: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  userTypeFilter,
  gpScoreFilter,
  complaintFilter,
  kycStatusFilter,
  onUserTypeChange,
  onGpScoreChange,
  onComplaintChange,
  onKycStatusChange,
  onExport,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Filters:</span>
      </div>
      
      <Select value={userTypeFilter} onValueChange={onUserTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="User Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="reporter">Reporters</SelectItem>
          <SelectItem value="reportee">Reportees</SelectItem>
          <SelectItem value="problem">Problem Users</SelectItem>
        </SelectContent>
      </Select>

      <Select value={gpScoreFilter} onValueChange={onGpScoreChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="GP Score" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Scores</SelectItem>
          <SelectItem value="excellent">80-100</SelectItem>
          <SelectItem value="good">60-79</SelectItem>
          <SelectItem value="fair">40-59</SelectItem>
          <SelectItem value="poor">0-39</SelectItem>
        </SelectContent>
      </Select>

      <Select value={complaintFilter} onValueChange={onComplaintChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Complaints" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="none">No Complaints</SelectItem>
          <SelectItem value="low">1-5 Complaints</SelectItem>
          <SelectItem value="high">5+ Complaints</SelectItem>
        </SelectContent>
      </Select>

      <Select value={kycStatusFilter} onValueChange={onKycStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="KYC Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All KYC Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="verified">Verified</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="none">No KYC</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={onExport} className="ml-auto">
        <Download className="h-4 w-4 mr-2" />
        Export Data
      </Button>
    </div>
  );
};
