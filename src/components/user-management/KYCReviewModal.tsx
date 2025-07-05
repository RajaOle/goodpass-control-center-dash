import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, FileText, Image, Download } from 'lucide-react';
import { kycService } from '@/services/kycService';
import { useToast } from '@/hooks/use-toast';

interface KYCReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycData: {
    user: {
      id: string;
      phone: string;
      role: string;
      status: string;
      is_kyc_completed: boolean;
      created_at: string;
    };
    kyc: {
      id: number;
      user_id: string;
      kyc_status: 'pending' | 'verified' | 'rejected';
      kyc_data: any;
      created_at: string;
      verified_at?: string;
    };
    documents: {
      id: number;
      description: string;
      file_url: string;
      file_type: string;
      file_size: number;
      uploaded_at: string;
      uploaded_by: string;
      is_deleted: boolean;
    }[];
  };
  onApprove: (userId: string, notes?: string) => Promise<void>;
  onReject: (userId: string, reason: string) => Promise<void>;
}

const KYCReviewModal: React.FC<KYCReviewModalProps> = ({
  isOpen,
  onClose,
  kycData,
  onApprove,
  onReject
}) => {
  const [activeTab, setActiveTab] = useState('documents');
  const [loading, setLoading] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      setLoading(true);
      await onApprove(kycData.user.id, approvalNotes);
      setApprovalNotes('');
    } catch (error) {
      console.error('Error approving KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await onReject(kycData.user.id, rejectionReason);
      setRejectionReason('');
      setShowRejectionForm(false);
    } catch (error) {
      console.error('Error rejecting KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const downloadDocument = async (document: any) => {
    try {
      const url = await kycService.getDocumentUrl(document.file_url);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({
          title: "Error",
          description: "Failed to get document URL",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            KYC Review - {kycData.user.phone}
            {getStatusIcon(kycData.kyc.kyc_status)}
          </DialogTitle>
          <DialogDescription>
            Review KYC documents and verification data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p>{kycData.user.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-sm">{kycData.user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="capitalize">{kycData.user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">KYC Status</label>
                <div className="flex items-center gap-2">
                  {getStatusBadge(kycData.kyc.kyc_status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Data and Documents */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="kyc-data">KYC Data</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {kycData.documents.length === 0 ? (
                    <p className="text-gray-500">No documents uploaded</p>
                  ) : (
                    <div className="grid gap-4">
                      {kycData.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {doc.file_type.startsWith('image/') ? (
                              <Image className="h-8 w-8 text-blue-600" />
                            ) : (
                              <FileText className="h-8 w-8 text-gray-600" />
                            )}
                            <div>
                              <p className="font-medium">{doc.description || 'Document'}</p>
                              <p className="text-sm text-gray-500">
                                {doc.file_type} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <p className="text-sm text-gray-500">
                                Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(doc)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kyc-data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Verification Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(kycData.kyc.kyc_status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted</label>
                      <p>{new Date(kycData.kyc.created_at).toLocaleString()}</p>
                    </div>
                    {kycData.kyc.verified_at && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Verified</label>
                        <p>{new Date(kycData.kyc.verified_at).toLocaleString()}</p>
                      </div>
                    )}
                    {kycData.kyc.kyc_data && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Additional Data</label>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto">
                          {JSON.stringify(kycData.kyc.kyc_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {kycData.kyc.kyc_status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Review Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showRejectionForm ? (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Approval Notes (Optional)</label>
                      <Textarea
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        placeholder="Add any notes about the approval..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Rejection Reason *</label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="mt-1"
                      required
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  {!showRejectionForm ? (
                    <>
                      <Button
                        onClick={handleApprove}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve KYC
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectionForm(true)}
                        disabled={loading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject KYC
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleReject}
                        disabled={loading || !rejectionReason.trim()}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Confirm Rejection
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectionForm(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KYCReviewModal; 