import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import KYCReviewModal from '@/components/user-management/KYCReviewModal';
import { kycService, UserProfile, KYCVerification, SupportingDocument } from '@/services/kycService';
import { useToast } from '@/hooks/use-toast';
import { supabaseAdmin } from '@/integrations/supabase/client';

interface KYCData {
  user: UserProfile;
  kyc: KYCVerification;
  documents: SupportingDocument[];
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [kycData, setKycData] = useState<KYCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadAllUsers();
    loadKYCStats();
  }, []);

  const loadAllUsers = async () => {
    setLoading(true);
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setUsers(data);
    setLoading(false);
  };

  const loadKYCStats = async () => {
    const { data, error } = await supabaseAdmin
      .from('kyc_verifications')
      .select('kyc_status');
    if (!error && data) {
      setPendingCount(data.filter((k: any) => k.kyc_status === 'pending').length);
      setVerifiedCount(data.filter((k: any) => k.kyc_status === 'verified').length);
      setRejectedCount(data.filter((k: any) => k.kyc_status === 'rejected').length);
    }
  };

  const handleViewKYC = async (user: UserProfile) => {
    // Fetch KYC data for the selected user
    const kyc = await kycService.getUserKYCData(user.id);
    if (kyc) {
      setKycData([kyc]);
      setSelectedUser(user);
      setKycModalOpen(true);
    } else {
      toast({
        title: 'Error',
        description: 'Failed to load KYC data.',
        variant: 'destructive',
      });
    }
  };

  const handleKycApprove = async (userId: string, notes?: string) => {
    try {
      const success = await kycService.approveKYC(userId, notes);
      if (success) {
        toast({ title: 'Success', description: 'KYC approved successfully' });
        setKycModalOpen(false);
        loadAllUsers();
        loadKYCStats();
      } else {
        throw new Error('Failed to approve KYC');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve KYC',
        variant: 'destructive',
      });
    }
  };

  const handleKycReject = async (userId: string, reason: string) => {
    try {
      const success = await kycService.rejectKYC(userId, reason);
      if (success) {
        toast({ title: 'Success', description: 'KYC rejected successfully' });
        setKycModalOpen(false);
        loadAllUsers();
        loadKYCStats();
      } else {
        throw new Error('Failed to reject KYC');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject KYC',
        variant: 'destructive',
      });
    }
  };

  const getKycBadge = (kycStatus: string) => {
    switch (kycStatus) {
      case 'verified':
        return <span className="block rounded-full px-3 py-1 text-xs font-semibold mb-1 bg-blue-500 text-white">Verified</span>;
      case 'pending':
        return <span className="block rounded-full px-3 py-1 text-xs font-semibold mb-1 bg-gray-200 text-gray-700">Pending</span>;
      case 'rejected':
        return <span className="block rounded-full px-3 py-1 text-xs font-semibold mb-1 bg-red-500 text-white">Rejected</span>;
      default:
        return <span className="block rounded-full px-3 py-1 text-xs font-semibold mb-1 bg-gray-100 text-gray-700">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending KYC</CardTitle>
            <CardDescription>{pendingCount}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verified KYC</CardTitle>
            <CardDescription>{verifiedCount}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rejected KYC</CardTitle>
            <CardDescription>{rejectedCount}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>{users.length}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Export */}
      <div className="flex justify-between items-center">
        {/* ...your filter controls here... */}
        <Button variant="outline">Export Data</Button>
      </div>

      {/* User Directory Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Info</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Report Stats</TableHead>
                <TableHead>Complaints</TableHead>
                <TableHead>GP Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.email || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 mr-1">Registered User</span>
                    <span className={`rounded px-2 py-1 text-xs font-medium ${user.role === 'reporter' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{user.role === 'reporter' ? 'Reporter' : 'Reportee'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">Total: 0</span><br />
                    <span className="text-xs text-green-600">Verified: 0</span><br />
                    <span className="text-xs text-red-600">Unverified: 0</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-green-600">0</span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">85</span>
                    <span className="ml-2 text-xs">Excellent</span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                  <TableCell>
                    {getKycBadge('pending')}
                    <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => handleViewKYC(user)}>
                      View KYC
                    </Button>
                  </TableCell>
                  <TableCell>
                    {/* Actions menu or dropdown can go here */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* KYC Review Modal */}
      {kycModalOpen && kycData.length > 0 && (
        <KYCReviewModal
          isOpen={kycModalOpen}
          onClose={() => setKycModalOpen(false)}
          kycData={kycData[0]}
          onApprove={handleKycApprove}
          onReject={handleKycReject}
        />
      )}
    </div>
  );
};

export default UserManagement;
