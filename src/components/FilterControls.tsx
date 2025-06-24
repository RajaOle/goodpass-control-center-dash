
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export interface FilterState {
  reportStatus: string;
  verificationStatus: string;
  reporterType: string;
}

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[150px]">
          <Select
            value={filters.reportStatus}
            onValueChange={(value) => onFilterChange('reportStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Report Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select
            value={filters.verificationStatus}
            onValueChange={(value) => onFilterChange('verificationStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verification</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Partially Verified">Partially Verified</SelectItem>
              <SelectItem value="Unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select
            value={filters.reporterType}
            onValueChange={(value) => onFilterChange('reporterType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Reporter Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="whitespace-nowrap"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterControls;
