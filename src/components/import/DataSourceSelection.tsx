
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Globe, Database } from 'lucide-react';
import type { ImportData } from '@/pages/ImportReport';

interface DataSourceSelectionProps {
  importData: ImportData;
  onDataChange: (data: ImportData) => void;
}

const DataSourceSelection: React.FC<DataSourceSelectionProps> = ({
  importData,
  onDataChange
}) => {
  const { toast } = useToast();
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toLowerCase();
    let source: 'csv' | 'excel' | 'json' | null = null;

    if (fileType === 'csv') source = 'csv';
    else if (fileType === 'xlsx' || fileType === 'xls') source = 'excel';
    else if (fileType === 'json') source = 'json';

    if (!source) {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a CSV, Excel, or JSON file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate file parsing
    setTimeout(() => {
      const mockData = generateMockData(source);
      onDataChange({
        ...importData,
        source,
        file,
        rawData: mockData
      });
      
      toast({
        title: "File Uploaded Successfully",
        description: `Parsed ${mockData.length} records from ${file.name}`,
      });
      
      setIsLoading(false);
    }, 1500);
  };

  const handleApiImport = async () => {
    if (!apiEndpoint) {
      toast({
        title: "API Endpoint Required",
        description: "Please enter a valid API endpoint URL.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API data fetching
    setTimeout(() => {
      const mockData = generateMockApiData();
      onDataChange({
        ...importData,
        source: 'api',
        apiEndpoint,
        rawData: mockData
      });
      
      toast({
        title: "API Data Imported",
        description: `Successfully imported ${mockData.length} records from API`,
      });
      
      setIsLoading(false);
    }, 2000);
  };

  const generateMockData = (source: string) => {
    const mockRecords = [
      {
        "Reporter Name": "John Smith",
        "Reporter Phone": "+1-555-0101",
        "Reportee Name": "Alice Johnson",
        "Reportee Phone": "+1-555-0102",
        "Loan Amount": "50000",
        "Outstanding Amount": "35000",
        "Loan Date": "2024-01-15",
        "Due Date": "2024-12-15",
        "Repayment Type": "Installment",
        "Collateral": "Real Estate"
      },
      {
        "Reporter Name": "Sarah Wilson",
        "Reporter Phone": "+1-555-0201",
        "Reportee Name": "Bob Brown",
        "Reportee Phone": "+1-555-0202",
        "Loan Amount": "25000",
        "Outstanding Amount": "20000",
        "Loan Date": "2024-02-20",
        "Due Date": "2024-08-20",
        "Repayment Type": "Single Payment",
        "Collateral": "Vehicle"
      },
      {
        "Reporter Name": "Mike Davis",
        "Reporter Phone": "+1-555-0301",
        "Reportee Name": "Carol White",
        "Reportee Phone": "+1-555-0302",
        "Loan Amount": "75000",
        "Outstanding Amount": "60000",
        "Loan Date": "2024-03-10",
        "Due Date": "2025-03-10",
        "Repayment Type": "Open Payment",
        "Collateral": "Equipment"
      }
    ];
    
    return mockRecords;
  };

  const generateMockApiData = () => {
    return [
      {
        id: 1,
        lender_name: "Jane Miller",
        lender_contact: "+1-555-0401",
        borrower_name: "Tom Garcia",
        borrower_contact: "+1-555-0402",
        principal_amount: 100000,
        remaining_balance: 85000,
        issue_date: "2024-01-05",
        maturity_date: "2025-01-05",
        payment_terms: "Monthly",
        security: "Commercial Property"
      },
      {
        id: 2,
        lender_name: "Robert Taylor",
        lender_contact: "+1-555-0501",
        borrower_name: "Lisa Anderson",
        borrower_contact: "+1-555-0502",
        principal_amount: 40000,
        remaining_balance: 30000,
        issue_date: "2024-02-15",
        maturity_date: "2024-11-15",
        payment_terms: "Quarterly",
        security: "Inventory"
      }
    ];
  };

  const dataSourceOptions = [
    {
      id: 'file',
      title: 'File Upload',
      description: 'Upload CSV, Excel, or JSON files',
      icon: Upload,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: 'api',
      title: 'API Import',
      description: 'Import from REST API endpoint',
      icon: Globe,
      color: 'bg-green-50 text-green-600 border-green-200'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Data Source</CardTitle>
          <CardDescription>
            Choose how you want to import your report data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {dataSourceOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  (option.id === 'file' && importData.file) ||
                  (option.id === 'api' && importData.source === 'api')
                    ? 'ring-2 ring-blue-500'
                    : ''
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`p-3 rounded-lg ${option.color}`}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    
                    {option.id === 'file' && (
                      <div className="w-full">
                        <Label htmlFor="file-upload" className="sr-only">
                          Upload file
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls,.json"
                          onChange={handleFileUpload}
                          disabled={isLoading}
                          className="w-full"
                        />
                        {importData.file && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {importData.file.name} ({importData.rawData.length} records)
                          </p>
                        )}
                      </div>
                    )}
                    
                    {option.id === 'api' && (
                      <div className="w-full space-y-3">
                        <div>
                          <Label htmlFor="api-endpoint">API Endpoint URL</Label>
                          <Input
                            id="api-endpoint"
                            type="url"
                            placeholder="https://api.example.com/reports"
                            value={apiEndpoint}
                            onChange={(e) => setApiEndpoint(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <Button
                          onClick={handleApiImport}
                          disabled={!apiEndpoint || isLoading}
                          className="w-full"
                        >
                          {isLoading ? 'Importing...' : 'Import from API'}
                        </Button>
                        {importData.source === 'api' && (
                          <p className="text-sm text-green-600">
                            ✓ Imported {importData.rawData.length} records from API
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      {importData.rawData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Data Preview
            </CardTitle>
            <CardDescription>
              Preview of your imported data ({importData.rawData.length} records)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(importData.rawData[0] || {}).map((key) => (
                      <th key={key} className="border border-gray-300 px-4 py-2 text-left">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importData.rawData.slice(0, 3).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {importData.rawData.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  ... and {importData.rawData.length - 3} more records
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSourceSelection;
