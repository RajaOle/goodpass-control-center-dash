import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

interface KYCDocument {
  name: string;
  url: string;
  type: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  kycStatus?: 'pending' | 'verified' | 'rejected';
  kycDocuments?: KYCDocument[];
}

interface KYCReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  onApprove: (userId: string, notes?: string) => void;
  onReject: (userId: string, reason: string) => void;
}

export const KYCReviewModal: React.FC<KYCReviewModalProps> = ({
  isOpen,
  onClose,
  user,
  onApprove,
  onReject
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      await onApprove(user.id, approvalNotes);
      onClose();
    } catch (error) {
      console.error('Error approving KYC:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!user || !rejectionReason.trim()) return;
    setIsProcessing(true);
    try {
      await onReject(user.id, rejectionReason);
      onClose();
    } catch (error) {
      console.error('Error rejecting KYC:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            KYC Review - {user.name}
            {getStatusIcon(user.kycStatus)}
          </DialogTitle>
          <DialogDescription>
            Review KYC documents for {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">User ID</Label>
                  <p className="text-sm">{user.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">KYC Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getStatusBadgeVariant(user.kycStatus)}>
                      {user.kycStatus ? user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1) : 'Not Submitted'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Documents */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Submitted Documents</h3>
              {user.kycDocuments && user.kycDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.kycDocuments.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{doc.name}</h4>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = doc.url;
                              link.download = doc.name;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-video bg-gray-100 rounded border flex items-center justify-center">
                        {doc.type === 'image' ? (
                          <img
                            src={doc.url}
                            alt={doc.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-gray-500 text-sm">Document Preview</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No documents submitted</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Actions */}
          {user.kycStatus === 'pending' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="approval-notes" className="text-sm font-medium">
                  Approval Notes (Optional)
                </Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Add any notes about the approval..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="rejection-reason" className="text-sm font-medium">
                  Rejection Reason (Required for rejection)
                </Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          {user.kycStatus === 'pending' && (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing || !rejectionReason.trim()}
              >
                Reject KYC
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve KYC
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 