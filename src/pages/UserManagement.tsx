
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Users } from 'lucide-react';
import { UserFilters } from '@/components/user-management/UserFilters';
import { UserTableRow } from '@/components/user-management/UserTableRow';

// Sample data - in real app this would come from API
const sampleUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    registrationDate: '2024-01-15',
    isReporter: true,
    isReportee: false,
    totalReports: 12,
    verifiedReports: 10,
    unverifiedReports: 2,
    complaints: 0,
    gpScore: 85,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    registrationDate: '2024-02-20',
    isReporter: false,
    isReportee: true,
    totalReports: 3,
    verifiedReports: 1,
    unverifiedReports: 2,
    complaints: 8,
    gpScore: 25,
    status: 'suspended' as const,
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@example.com',
    registrationDate: '2024-03-10',
    isReporter: true,
    isReportee: true,
    totalReports: 7,
    verifiedReports: 5,
    unverifiedReports: 2,
    complaints: 2,
    gpScore: 68,
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Emily Wilson',
    email: 'emily.w@example.com',
    registrationDate: '2024-01-05',
    isReporter: true,
    isReportee: false,
    totalReports: 25,
    verifiedReports: 23,
    unverifiedReports: 2,
    complaints: 1,
    gpScore: 92,
    status: 'active' as const,
  },
  {
    id: '5',
    name: 'Alex Thompson',
    email: 'alex.t@example.com',
    registrationDate: '2024-04-15',
    isReporter: false,
    isReportee: true,
    totalReports: 0,
    verifiedReports: 0,
    unverifiedReports: 0,
    complaints: 12,
    gpScore: 15,
    status: 'deactivated' as const,
  },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [gpScoreFilter, setGpScoreFilter] = useState('all');
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(sampleUsers);

  const usersPerPage = 10;

  const handleAction = (action: string, userId: string) => {
    console.log(`Action: ${action} for user: ${userId}`);
    // Here you would implement the actual action logic
    // For now, just log the action
  };

  const handleExport = () => {
    console.log('Exporting user data...');
    // Implement export functionality
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.includes(searchTerm);

    const matchesUserType = userTypeFilter === 'all' ||
                           (userTypeFilter === 'reporter' && user.isReporter) ||
                           (userTypeFilter === 'reportee' && user.isReportee) ||
                           (userTypeFilter === 'problem' && user.complaints > 5);

    const matchesGpScore = gpScoreFilter === 'all' ||
                          (gpScoreFilter === 'excellent' && user.gpScore >= 80) ||
                          (gpScoreFilter === 'good' && user.gpScore >= 60 && user.gpScore < 80) ||
                          (gpScoreFilter === 'fair' && user.gpScore >= 40 && user.gpScore < 60) ||
                          (gpScoreFilter === 'poor' && user.gpScore < 40);

    const matchesComplaints = complaintFilter === 'all' ||
                             (complaintFilter === 'none' && user.complaints === 0) ||
                             (complaintFilter === 'low' && user.complaints >= 1 && user.complaints <= 5) ||
                             (complaintFilter === 'high' && user.complaints > 5);

    return matchesSearch && matchesUserType && matchesGpScore && matchesComplaints;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">User Management</h1>
        <p className="text-slate-600">Comprehensive user account management and analytics.</p>
      </div>

      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">User Directory</CardTitle>
              <CardDescription className="text-slate-600">
                Manage users, view reports, and take administrative actions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name, email, or user ID..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-300 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <UserFilters
            userTypeFilter={userTypeFilter}
            gpScoreFilter={gpScoreFilter}
            complaintFilter={complaintFilter}
            onUserTypeChange={setUserTypeFilter}
            onGpScoreChange={setGpScoreFilter}
            onComplaintChange={setComplaintFilter}
            onExport={handleExport}
          />
          
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">User Info</TableHead>
                  <TableHead className="font-semibold text-slate-700">Roles</TableHead>
                  <TableHead className="font-semibold text-slate-700">Report Stats</TableHead>
                  <TableHead className="font-semibold text-slate-700">Complaints</TableHead>
                  <TableHead className="font-semibold text-slate-700">GP Score</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      onAction={handleAction}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p>No users found matching your criteria</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="mt-4 text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
