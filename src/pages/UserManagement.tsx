import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { UserFilters } from '@/components/user-management/UserFilters';
import { UserTableRow } from '@/components/user-management/UserTableRow';
import { KYCReviewModal } from '@/components/user-management/KYCReviewModal';

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

// Sample data - in real app this would come from API
const sampleUsers: UserData[] = [
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
    status: 'active',
    kycStatus: 'verified',
    kycDocuments: [
      { name: 'ID Card Front', url: '/placeholder.svg', type: 'image' },
      { name: 'ID Card Back', url: '/placeholder.svg', type: 'image' },
      { name: 'Proof of Address', url: '/placeholder.svg', type: 'image' }
    ]
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
    status: 'suspended',
    kycStatus: 'pending',
    kycDocuments: [
      { name: 'Passport', url: '/placeholder.svg', type: 'image' },
      { name: 'Bank Statement', url: '/placeholder.svg', type: 'image' }
    ]
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
    status: 'active',
    kycStatus: 'rejected',
    kycDocuments: [
      { name: 'Driver License', url: '/placeholder.svg', type: 'image' },
      { name: 'Utility Bill', url: '/placeholder.svg', type: 'image' }
    ]
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
    status: 'active',
    kycStatus: 'verified',
    kycDocuments: [
      { name: 'National ID', url: '/placeholder.svg', type: 'image' },
      { name: 'Employment Letter', url: '/placeholder.svg', type: 'image' }
    ]
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
    status: 'deactivated',
    kycStatus: 'pending',
    kycDocuments: [
      { name: 'Government ID', url: '/placeholder.svg', type: 'image' }
    ]
  },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [gpScoreFilter, setGpScoreFilter] = useState('all');
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [kycStatusFilter, setKycStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserData[]>(sampleUsers);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const usersPerPage = 10;

  const handleAction = (action: string, userId: string) => {
    console.log(`Action: ${action} for user: ${userId}`);
    // Here you would implement the actual action logic
    // For now, just log the action
  };

  const handleViewKyc = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setKycModalOpen(true);
    }
  };

  const handleKycApprove = async (userId: string, notes?: string) => {
    console.log(`Approving KYC for user ${userId} with notes: ${notes}`);
    // Update user KYC status
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, kycStatus: 'verified' }
          : user
      )
    );
    // Here you would make an API call to update the KYC status
  };

  const handleKycReject = async (userId: string, reason: string) => {
    console.log(`Rejecting KYC for user ${userId} with reason: ${reason}`);
    // Update user KYC status
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, kycStatus: 'rejected' }
          : user
      )
    );
    // Here you would make an API call to update the KYC status
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

    const matchesKycStatus = kycStatusFilter === 'all' ||
                            (kycStatusFilter === 'pending' && user.kycStatus === 'pending') ||
                            (kycStatusFilter === 'verified' && user.kycStatus === 'verified') ||
                            (kycStatusFilter === 'rejected' && user.kycStatus === 'rejected') ||
                            (kycStatusFilter === 'none' && !user.kycStatus);

    return matchesSearch && matchesUserType && matchesGpScore && matchesComplaints && matchesKycStatus;
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

      {/* KYC Status Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Pending KYC</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => u.kycStatus === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Verified KYC</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.kycStatus === 'verified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Rejected KYC</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.kycStatus === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-600">
                  {users.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            kycStatusFilter={kycStatusFilter}
            onUserTypeChange={setUserTypeFilter}
            onGpScoreChange={setGpScoreFilter}
            onComplaintChange={setComplaintFilter}
            onKycStatusChange={setKycStatusFilter}
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
                  <TableHead className="font-semibold text-slate-700">KYC</TableHead>
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
                      onViewKyc={() => handleViewKyc(user.id)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
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

      {/* KYC Review Modal */}
      <KYCReviewModal
        isOpen={kycModalOpen}
        onClose={() => {
          setKycModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onApprove={handleKycApprove}
        onReject={handleKycReject}
      />
    </div>
  );
};

export default UserManagement;
