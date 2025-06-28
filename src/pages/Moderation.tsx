import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AdminPinDialog from '@/components/AdminPinDialog';
import VerificationControls from '@/components/VerificationControls';
import ReportsPagination from '@/components/ReportsPagination';
import SearchBar from '@/components/SearchBar';
import FilterControls from '@/components/FilterControls';
import DateRangeFilter from '@/components/DateRangeFilter';
import { useReportFilters } from '@/hooks/useReportFilters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Moderation = () => {
  const { toast } = useToast();
  
  // Verification states
  const [verificationEnabled, setVerificationEnabled] = useState(false);
  const [aiAssistEnabled, setAiAssistEnabled] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  const reportData = [
    {
      id: 1,
      reportType: "Loan Commitment (LC)",
      uniqueId: "LC-2024-001",
      initialAmount: "$50,000",
      outstandingAmount: "$35,000",
      repaymentType: "Installment",
      lastRepaymentDate: "2024-01-15",
      reportStatus: "Active",
      verificationStatus: "Verified",
      reporterName: "John Smith",
      reporterStatus: "individual",
      reporterPhone: "+1 (555) 123-4567",
      reporteeName: "Michael Johnson",
      reporteePhone: "+1 (555) 987-6543",
      collateralInfo: "Real Estate Property - 123 Main St"
    },
    {
      id: 2,
      reportType: "Loan Commitment (LC)",
      uniqueId: "LC-2024-002",
      initialAmount: "$25,000",
      outstandingAmount: "$20,000",
      repaymentType: "Single Payment",
      lastRepaymentDate: "2024-02-20",
      reportStatus: "Pending",
      verificationStatus: "Partially Verified",
      reporterName: "Jane Doe",
      reporterStatus: "business",
      reporterPhone: "+1 (555) 234-5678",
      reporteeName: "Sarah Williams",
      reporteePhone: "+1 (555) 876-5432",
      collateralInfo: "Vehicle - Toyota Camry 2020"
    },
    {
      id: 3,
      reportType: "Loan Commitment (LC)",
      uniqueId: "LC-2024-003",
      initialAmount: "$100,000",
      outstandingAmount: "$75,000",
      repaymentType: "Open Payment",
      lastRepaymentDate: "2024-03-10",
      reportStatus: "Active",
      verificationStatus: "Verified",
      reporterName: "Mike Johnson",
      reporterStatus: "business",
      reporterPhone: "+1 (555) 345-6789",
      reporteeName: "David Brown",
      reporteePhone: "+1 (555) 765-4321",
      collateralInfo: "Business Equipment - Manufacturing Tools"
    },
    {
      id: 4,
      reportType: "Loan Commitment (LC)",
      uniqueId: "LC-2024-004",
      initialAmount: "$75,000",
      outstandingAmount: "$60,000",
      repaymentType: "Installment",
      lastRepaymentDate: "2024-03-15",
      reportStatus: "Pending",
      verificationStatus: "Unverified",
      reporterName: "Alice Brown",
      reporterStatus: "individual",
      reporterPhone: "+1 (555) 456-7890",
      reporteeName: "Lisa Davis",
      reporteePhone: "+1 (555) 654-3210",
      collateralInfo: "Commercial Property - Office Building"
    },
    {
      id: 5,
      reportType: "Loan Commitment (LC)",
      uniqueId: "LC-2024-005",
      initialAmount: "$30,000",
      outstandingAmount: "$25,000",
      repaymentType: "Single Payment",
      lastRepaymentDate: "2024-03-20",
      reportStatus: "Active",
      verificationStatus: "Partially Verified",
      reporterName: "Bob Wilson",
      reporterStatus: "individual",
      reporterPhone: "+1 (555) 567-8901",
      reporteeName: "Robert Miller",
      reporteePhone: "+1 (555) 543-2109",
      collateralInfo: "Equipment - Construction Machinery"
    },
    {
      id: 6,
      reportType: "Loan Commitment (LC)",
      uniqueId: "LC-2024-006",
      initialAmount: "$120,000",
      outstandingAmount: "$90,000",
      repaymentType: "Open Payment",
      lastRepaymentDate: "2024-03-25",
      reportStatus: "Pending",
      verificationStatus: "Verified",
      reporterName: "Carol Davis",
      reporterStatus: "business",
      reporterPhone: "+1 (555) 678-9012",
      reporteeName: "Jennifer Wilson",
      reporteePhone: "+1 (555) 432-1098",
      collateralInfo: "Real Estate - Warehouse Facility"
    }
  ];

  // Initialize search and filter functionality
  const {
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
  } = useReportFilters(reportData);

  // Calculate pagination for filtered results
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    const endIndex = startIndex + reportsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, currentPage, reportsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, startDate, endDate]);

  // Statistics calculations based on original data
  const pendingReports = reportData.filter(report => report.reportStatus === "Pending").length;
  const partiallyVerifiedReports = reportData.filter(report => report.verificationStatus === "Partially Verified").length;

  // New state for processing modal
  const [processingReport, setProcessingReport] = useState(null);
  const [reporterVerification, setReporterVerification] = useState('unverified');
  const [reporteeVerification, setReporteeVerification] = useState('unverified');
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

  const handleVerificationToggle = (checked: boolean) => {
    if (!checked && verificationEnabled) {
      // Deactivating requires PIN
      setPendingAction(() => () => {
        setVerificationEnabled(false);
        setAiAssistEnabled(false); // Also disable AI assist
        toast({
          title: "Verification Disabled",
          description: "Auto-verification has been turned off.",
        });
      });
      setShowPinDialog(true);
    } else if (checked) {
      // Activating doesn't require PIN
      setVerificationEnabled(true);
      toast({
        title: "Verification Enabled",
        description: "Auto-verification is now active.",
      });
    }
  };

  const handleAiAssistToggle = (checked: boolean) => {
    setAiAssistEnabled(checked);
    toast({
      title: checked ? "AI Assist Enabled" : "AI Assist Disabled",
      description: checked 
        ? "AI will now assist with verification decisions." 
        : "AI assistance has been turned off.",
    });
  };

  const handlePinSuccess = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handlePinClose = () => {
    setShowPinDialog(false);
    setPendingAction(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleProcessReport = (reportId) => {
    // Find the report to process
    const report = paginatedReports.find(r => r.id === reportId);
    setProcessingReport(report);
    setReporterVerification('unverified');
    setReporteeVerification('unverified');
    setIsProcessingModalOpen(true);
  };

  const handleSubmitVerification = () => {
    if (!processingReport) return;

    // Determine new verification status
    let newVerificationStatus = 'Partially Verified';
    if (reporterVerification === 'verified' && reporteeVerification === 'verified') {
      newVerificationStatus = 'Verified';
    }

    // Simulate sending to backend and updating local state
    toast({
      title: "Report Processed",
      description: `Report ${processingReport.uniqueId} is now Live/Active and ${newVerificationStatus}`,
    });

    // Here you would send the updated data to the backend

    // Update local data (for demo, you may want to update state or refetch)
    processingReport.reportStatus = 'Active';
    processingReport.verificationStatus = newVerificationStatus;

    setIsProcessingModalOpen(false);
    setProcessingReport(null);
  };

  const handleSearch = () => {
    toast({
      title: "Search Initiated",
      description: `Searching for: "${searchTerm}"`,
    });
    console.log('Search initiated with term:', searchTerm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manage Report</h2>
        <p className="text-muted-foreground">
          Monitor and moderate user-generated content and reports.
        </p>
      </div>

      <VerificationControls
        verificationEnabled={verificationEnabled}
        aiAssistEnabled={aiAssistEnabled}
        onVerificationToggle={handleVerificationToggle}
        onAiAssistToggle={handleAiAssistToggle}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Reports</CardTitle>
            <CardDescription>Reports awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pendingReports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Partial Verification</CardTitle>
            <CardDescription>Active reports with Partial Verification Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{partiallyVerifiedReports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resolved Today</CardTitle>
            <CardDescription>Moderation actions completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">28</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Reports</CardTitle>
          <CardDescription>
            Use the controls below to find specific reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
          />
          
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
            
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClearDates={clearDates}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredReports.length} of {reportData.length} reports
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Moderation Queue</CardTitle>
          <CardDescription>
            Reports Requiring Review (Page {currentPage} of {totalPages || 1})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports found matching your criteria.</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="mt-2"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedReports.map(report => (
                <div key={report.id} className="p-6 border rounded-lg bg-gray-50 relative">
                  {/* Reporter Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={report.reporterStatus === "individual" ? "default" : "secondary"}
                      className={report.reporterStatus === "individual" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
                    >
                      {report.reporterStatus === "individual" ? "Individual" : "Business"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-20">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Report Type</label>
                        <p className="text-sm text-gray-900">{report.reportType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Report Unique ID</label>
                        <p className="text-sm text-gray-900">{report.uniqueId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Initial Amount</label>
                        <p className="text-sm text-gray-900">{report.initialAmount}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Outstanding Amount</label>
                        <p className="text-sm text-gray-900">{report.outstandingAmount}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Repayment Type</label>
                        <p className="text-sm text-gray-900">{report.repaymentType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Last Repayment Date</label>
                        <p className="text-sm text-gray-900">{report.lastRepaymentDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Reporter Name</label>
                        <p className="text-sm text-gray-900">{report.reporterName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Reporter Phone Number</label>
                        <p className="text-sm text-gray-900">{report.reporterPhone}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Report Status</label>
                        <div className="mt-1">
                          <Badge variant={report.reportStatus === "Active" ? "default" : "secondary"}>
                            {report.reportStatus}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Verification Status</label>
                        <div className="mt-1">
                          <Badge variant={report.verificationStatus === "Verified" ? "default" : "outline"}>
                            {report.verificationStatus}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Reportee Name</label>
                        <p className="text-sm text-gray-900">{report.reporteeName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Reportee Phone Number</label>
                        <p className="text-sm text-gray-900">{report.reporteePhone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Collateral Information</label>
                        <p className="text-sm text-gray-900">{report.collateralInfo}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      size="sm" 
                      onClick={() => handleProcessReport(report.id)}
                      disabled={report.reportStatus !== "Pending"}
                    >
                      Process
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <ReportsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AdminPinDialog
        isOpen={showPinDialog}
        onClose={handlePinClose}
        onSuccess={handlePinSuccess}
      />

      {/* Processing Modal */}
      <Dialog open={isProcessingModalOpen} onOpenChange={setIsProcessingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Report</DialogTitle>
          </DialogHeader>
          {processingReport && (
            <div className="space-y-6">
              {/* Section 1: Reporter Information */}
              <div>
                <h3 className="font-semibold mb-2">Reporter Information</h3>
                <div>Name: {processingReport.reporterName}</div>
                <div>Phone: {processingReport.reporterPhone}</div>
                <div>Status: {processingReport.reporterStatus}</div>
                <div>
                  <RadioGroup
                    value={reporterVerification}
                    onValueChange={setReporterVerification}
                    className="flex gap-4 mt-2"
                  >
                    <RadioGroupItem value="verified" id="reporter-verified" />
                    <label htmlFor="reporter-verified">Verified</label>
                    <RadioGroupItem value="unverified" id="reporter-unverified" />
                    <label htmlFor="reporter-unverified">Not Verified</label>
                  </RadioGroup>
                </div>
              </div>
              {/* Section 2: Reportee Information */}
              <div>
                <h3 className="font-semibold mb-2">Reportee Information</h3>
                <div>Name: {processingReport.reporteeName}</div>
                <div>Phone: {processingReport.reporteePhone}</div>
                <div>
                  <RadioGroup
                    value={reporteeVerification}
                    onValueChange={setReporteeVerification}
                    className="flex gap-4 mt-2"
                  >
                    <RadioGroupItem value="verified" id="reportee-verified" />
                    <label htmlFor="reportee-verified">Verified</label>
                    <RadioGroupItem value="unverified" id="reportee-unverified" />
                    <label htmlFor="reportee-unverified">Not Verified</label>
                  </RadioGroup>
                </div>
              </div>
              {/* Section 3: Loan Information */}
              <div>
                <h3 className="font-semibold mb-2">Loan Information</h3>
                <div>Type: {processingReport.reportType}</div>
                <div>Initial Amount: {processingReport.initialAmount}</div>
                <div>Outstanding Amount: {processingReport.outstandingAmount}</div>
                <div>Repayment Type: {processingReport.repaymentType}</div>
                <div>Last Repayment Date: {processingReport.lastRepaymentDate}</div>
              </div>
              {/* Section 4: Supporting Documents */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-800">Supporting Documents</h3>
                {processingReport.supportingDocuments && processingReport.supportingDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {processingReport.supportingDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {doc.type === 'image' ? (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <img src={doc.url} alt={doc.name} className="h-12 w-12 object-cover rounded border hover:scale-105 transition-transform" />
                          </a>
                        ) : (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline flex items-center gap-1">
                            <span className="material-icons">description</span>
                            {doc.name}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-700">{processingReport.collateralInfo}</div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitVerification} disabled={!processingReport}>
              Submit
            </Button>
            <Button variant="outline" onClick={() => setIsProcessingModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Moderation;
