import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import KYCReviewModal from '@/components/user-management/KYCReviewModal';
import { kycService, UserProfile, KYCVerification, SupportingDocument } from '@/services/kycService';
import { useToast } from '@/hooks/use-toast';

interface KYCData {
  user: UserProfile;
  kyc: KYCVerification;
  documents: SupportingDocument[];
}

const UserManagement = () => {
  const [kycData, setKycData] = useState<KYCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [selectedKYC, setSelectedKYC] = useState<KYCData | null>(null);

  const { toast } = useToast();

  // Load pending KYC data
  useEffect(() => {
    loadPendingKYC();
  }, []);

  const loadPendingKYC = async () => {
    try {
      setLoading(true);
      console.log('Loading pending KYC data...');
      const data = await kycService.getPendingKYC();
      console.log('Loaded KYC data:', data);
      setKycData(data);
    } catch (error) {
      console.error('Failed to load KYC data:', error);
      toast({
        title: "Error",
        description: "Failed to load KYC data: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewKYC = (kycItem: KYCData) => {
    setSelectedKYC(kycItem);
    setKycModalOpen(true);
  };

  const handleKycApprove = async (userId: string, notes?: string) => {
    try {
      const success = await kycService.approveKYC(userId, notes);
      
      if (success) {
        toast({
          title: "Success",
          description: "KYC approved successfully",
        });
        
        setKycModalOpen(false);
        loadPendingKYC(); // Refresh the list
      } else {
        throw new Error('Failed to approve KYC');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve KYC",
        variant: "destructive"
      });
    }
  };

  const handleKycReject = async (userId: string, reason: string) => {
    try {
      const success = await kycService.rejectKYC(userId, reason);
      
      if (success) {
        toast({
          title: "Success",
          description: "KYC rejected successfully",
        });
        
        setKycModalOpen(false);
        loadPendingKYC(); // Refresh the list
      } else {
        throw new Error('Failed to reject KYC');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject KYC",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'deactivated':
        return <Badge className="bg-gray-100 text-gray-800">Deactivated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KYC Review</h1>
          <p className="text-muted-foreground">
            Review and approve pending KYC verifications
          </p>
        </div>
        <Button variant="outline" onClick={loadPendingKYC}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pending KYC Verifications</CardTitle>
          <CardDescription>
            {kycData.length} KYC verification{kycData.length !== 1 ? 's' : ''} awaiting review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Debug info for troubleshooting */}
          <div className="text-sm text-gray-500 mb-4">
            <p>Debug: Found {kycData.length} records</p>
            {kycData.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer">View raw data</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(kycData.map(item => ({
                    userId: item.user.id,
                    phone: item.user.phone,
                    status: item.user.status,
                    kycStatus: item.kyc.kyc_status,
                    documentsCount: item.documents.length
                  })), null, 2)}
                </pre>
              </details>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KYC Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {kycData.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No pending KYC verifications</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kycData.map((item) => (
                  <TableRow key={item.user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.user.phone || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">ID: {item.user.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.user.phone}</TableCell>
                    <TableCell>{getStatusBadge(item.user.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.documents.length} document{item.documents.length !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.kyc.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewKYC(item)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* KYC Review Modal */}
      {selectedKYC && (
        <KYCReviewModal
          isOpen={kycModalOpen}
          onClose={() => setKycModalOpen(false)}
          kycData={selectedKYC}
          onApprove={handleKycApprove}
          onReject={handleKycReject}
        />
      )}
    </div>
  );
};

export default UserManagement;
