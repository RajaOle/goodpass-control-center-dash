
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Filter, Eye, User, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: number;
  reportId: string;
  reportType: string;
  reviewerId: string | null;
  reviewerName: string | null;
  reviewType: 'human' | 'ai';
  action: 'approved' | 'rejected' | 'flagged' | 'verified' | 'pending';
  incomingTimestamp: string;
  reviewedTimestamp: string;
  liveTimestamp: string | null;
  reporterName: string;
  reporteeName: string;
  amount: string;
  reason: string;
  notes: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const ModerationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterReviewType, setFilterReviewType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock audit log data
  const auditLogs: AuditLog[] = [
    {
      id: 1,
      reportId: 'LC-2024-001',
      reportType: 'Loan Commitment',
      reviewerId: 'admin001',
      reviewerName: 'Sarah Johnson',
      reviewType: 'human',
      action: 'approved',
      incomingTimestamp: '2024-01-15T09:30:00Z',
      reviewedTimestamp: '2024-01-15T10:45:00Z',
      liveTimestamp: '2024-01-15T10:47:00Z',
      reporterName: 'John Smith',
      reporteeName: 'Michael Johnson',
      amount: '$50,000',
      reason: 'Documentation verified',
      notes: 'All required documents provided and verified',
      priority: 'medium'
    },
    {
      id: 2,
      reportId: 'LC-2024-002',
      reportType: 'Loan Commitment',
      reviewerId: null,
      reviewerName: null,
      reviewType: 'ai',
      action: 'flagged',
      incomingTimestamp: '2024-01-16T14:20:00Z',
      reviewedTimestamp: '2024-01-16T14:21:00Z',
      liveTimestamp: null,
      reporterName: 'Jane Doe',
      reporteeName: 'Sarah Williams',
      amount: '$25,000',
      reason: 'Suspicious pattern detected',
      notes: 'AI flagged for manual review due to unusual reporting pattern',
      priority: 'high'
    },
    {
      id: 3,
      reportId: 'LC-2024-003',
      reportType: 'Loan Commitment',
      reviewerId: 'admin002',
      reviewerName: 'Mike Davis',
      reviewType: 'human',
      action: 'rejected',
      incomingTimestamp: '2024-01-17T11:15:00Z',
      reviewedTimestamp: '2024-01-17T16:30:00Z',
      liveTimestamp: null,
      reporterName: 'Mike Johnson',
      reporteeName: 'David Brown',
      amount: '$100,000',
      reason: 'Insufficient documentation',
      notes: 'Missing collateral verification documents',
      priority: 'low'
    },
    {
      id: 4,
      reportId: 'LC-2024-004',
      reportType: 'Loan Commitment',
      reviewerId: null,
      reviewerName: null,
      reviewType: 'ai',
      action: 'verified',
      incomingTimestamp: '2024-01-18T08:45:00Z',
      reviewedTimestamp: '2024-01-18T08:46:00Z',
      liveTimestamp: '2024-01-18T08:47:00Z',
      reporterName: 'Alice Brown',
      reporteeName: 'Lisa Davis',
      amount: '$75,000',
      reason: 'Auto-verification successful',
      notes: 'All criteria met for automatic verification',
      priority: 'low'
    },
    {
      id: 5,
      reportId: 'LC-2024-005',
      reportType: 'Loan Commitment',
      reviewerId: 'admin001',
      reviewerName: 'Sarah Johnson',
      reviewType: 'human',
      action: 'approved',
      incomingTimestamp: '2024-01-19T13:20:00Z',
      reviewedTimestamp: '2024-01-19T15:10:00Z',
      liveTimestamp: '2024-01-19T15:12:00Z',
      reporterName: 'Bob Wilson',
      reporteeName: 'Robert Miller',
      amount: '$30,000',
      reason: 'Manual verification completed',
      notes: 'Contacted both parties for confirmation',
      priority: 'medium'
    },
    {
      id: 6,
      reportId: 'LC-2024-006',
      reportType: 'Loan Commitment',
      reviewerId: 'admin003',
      reviewerName: 'Emma Thompson',
      reviewType: 'human',
      action: 'pending',
      incomingTimestamp: '2024-01-20T10:30:00Z',
      reviewedTimestamp: '2024-01-20T11:00:00Z',
      liveTimestamp: null,
      reporterName: 'Carol Davis',
      reporteeName: 'Jennifer Wilson',
      amount: '$120,000',
      reason: 'Additional verification required',
      notes: 'Waiting for collateral assessment report',
      priority: 'critical'
    }
  ];

  // Filter logic
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reporteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.reviewerName && log.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAction = filterAction === 'all' || log.action === filterAction;
      const matchesReviewType = filterReviewType === 'all' || log.reviewType === filterReviewType;
      const matchesPriority = filterPriority === 'all' || log.priority === filterPriority;

      const reviewDate = new Date(log.reviewedTimestamp);
      const matchesDateFrom = !dateFrom || reviewDate >= dateFrom;
      const matchesDateTo = !dateTo || reviewDate <= dateTo;

      return matchesSearch && matchesAction && matchesReviewType && matchesPriority && matchesDateFrom && matchesDateTo;
    });
  }, [auditLogs, searchTerm, filterAction, filterReviewType, filterPriority, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'approved':
      case 'verified':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'flagged':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterAction('all');
    setFilterReviewType('all');
    setFilterPriority('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Moderation History</h2>
        <p className="text-muted-foreground">
          Complete audit log of all moderation activities and decisions
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Human Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {auditLogs.filter(log => log.reviewType === 'human').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {auditLogs.filter(log => log.reviewType === 'ai').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {auditLogs.filter(log => log.action === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Report ID, Reporter, Reportee, or Reviewer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterReviewType} onValueChange={setFilterReviewType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">From:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">To:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Showing {filteredLogs.length} of {auditLogs.length} audit logs</span>
            <span>Page {currentPage} of {totalPages || 1}</span>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>
            Detailed history of all moderation activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Report ID</TableHead>
                  <TableHead className="w-32">Reviewer</TableHead>
                  <TableHead className="w-24">Type</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                  <TableHead className="w-24">Priority</TableHead>
                  <TableHead className="w-40">Reporter → Reportee</TableHead>
                  <TableHead className="w-24">Amount</TableHead>
                  <TableHead className="w-40">Timestamps</TableHead>
                  <TableHead className="w-60">Details</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {log.reportId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {log.reviewType === 'human' ? (
                          <User className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Bot className="h-4 w-4 text-purple-500" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {log.reviewerName || 'AI System'}
                          </span>
                          {log.reviewerId && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {log.reviewerId}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.reviewType === 'human' ? 'default' : 'secondary'}>
                        {log.reviewType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(log.priority)}>
                        {log.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{log.reporterName}</span>
                        <span className="text-muted-foreground">→ {log.reporteeName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs space-y-1">
                        <div>
                          <span className="text-muted-foreground">In:</span>
                          <span className="ml-1">{format(new Date(log.incomingTimestamp), 'MMM dd HH:mm')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rev:</span>
                          <span className="ml-1">{format(new Date(log.reviewedTimestamp), 'MMM dd HH:mm')}</span>
                        </div>
                        {log.liveTimestamp && (
                          <div>
                            <span className="text-muted-foreground">Live:</span>
                            <span className="ml-1">{format(new Date(log.liveTimestamp), 'MMM dd HH:mm')}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs space-y-1">
                        <div className="font-medium">{log.reason}</div>
                        <div className="text-muted-foreground">{log.notes}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModerationHistory;
