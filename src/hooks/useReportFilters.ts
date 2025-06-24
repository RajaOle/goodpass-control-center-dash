
import { useState, useMemo } from 'react';
import { FilterState } from '@/components/FilterControls';

interface Report {
  id: number;
  reportType: string;
  uniqueId: string;
  initialAmount: string;
  outstandingAmount: string;
  repaymentType: string;
  lastRepaymentDate: string;
  reportStatus: string;
  verificationStatus: string;
  reporterName: string;
  reporterStatus: string;
  reporterPhone: string;
  reporteeName: string;
  reporteePhone: string;
  collateralInfo: string;
}

export const useReportFilters = (reports: Report[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    reportStatus: 'all',
    verificationStatus: 'all',
    reporterType: 'all',
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        report.uniqueId.toLowerCase().includes(searchLower) ||
        report.reporterName.toLowerCase().includes(searchLower) ||
        report.reporteeName.toLowerCase().includes(searchLower) ||
        report.reporterPhone.includes(searchTerm) ||
        report.reporteePhone.includes(searchTerm);

      // Status filters
      const matchesReportStatus = filters.reportStatus === 'all' || 
        report.reportStatus === filters.reportStatus;
      
      const matchesVerificationStatus = filters.verificationStatus === 'all' || 
        report.verificationStatus === filters.verificationStatus;
      
      const matchesReporterType = filters.reporterType === 'all' || 
        report.reporterStatus === filters.reporterType;

      // Date filter
      let matchesDateRange = true;
      if (startDate || endDate) {
        const reportDate = new Date(report.lastRepaymentDate);
        if (startDate) {
          matchesDateRange = matchesDateRange && reportDate >= startDate;
        }
        if (endDate) {
          matchesDateRange = matchesDateRange && reportDate <= endDate;
        }
      }

      return matchesSearch && matchesReportStatus && matchesVerificationStatus && 
             matchesReporterType && matchesDateRange;
    });
  }, [reports, searchTerm, filters, startDate, endDate]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      reportStatus: 'all',
      verificationStatus: 'all',
      reporterType: 'all',
    });
  };

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    clearFilters();
    clearDates();
  };

  const hasActiveFilters = searchTerm !== '' || 
    Object.values(filters).some(value => value !== 'all') ||
    startDate !== undefined || endDate !== undefined;

  return {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    clearFilters,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearDates,
    clearAllFilters,
    filteredReports,
    hasActiveFilters,
  };
};
