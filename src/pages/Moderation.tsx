import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
const Moderation = () => {
  const reportData = [{
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
    collateralInfo: "Real Estate Property - 123 Main St"
  }, {
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
    collateralInfo: "Vehicle - Toyota Camry 2020"
  }, {
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
    collateralInfo: "Business Equipment - Manufacturing Tools"
  }];
  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manage Report</h2>
        <p className="text-muted-foreground">
          Monitor and moderate user-generated content and reports.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Reports</CardTitle>
            <CardDescription>Reports awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Partial Verification</CardTitle>
            <CardDescription>Active reports with Partial Verification Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">5</div>
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Moderation Queue</CardTitle>
          <CardDescription>
            Content requiring moderator attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reportData.map(report => <div key={report.id} className="p-6 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                      <label className="text-sm font-medium text-gray-600">Reporter Name</label>
                      <p className="text-sm text-gray-900">{report.reporterName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Collateral Information</label>
                      <p className="text-sm text-gray-900">{report.collateralInfo}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <Button size="sm">Process</Button>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Moderation;