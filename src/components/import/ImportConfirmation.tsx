
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, FileText, Users, Settings, MessageSquare } from 'lucide-react';
import type { ImportData } from '@/pages/ImportReport';

interface ImportConfirmationProps {
  importData: ImportData;
  onDataChange: (data: ImportData) => void;
}

const ImportConfirmation: React.FC<ImportConfirmationProps> = ({
  importData,
  onDataChange
}) => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [importNotes, setImportNotes] = useState('');
  const [importComplete, setImportComplete] = useState(false);

  const handleImport = () => {
    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      setImportComplete(true);
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${importData.sanitizedData.length} records`,
      });
    }, 3000);
  };

  const getSourceIcon = () => {
    switch (importData.source) {
      case 'csv':
      case 'excel':
      case 'json':
        return <FileText className="w-5 h-5" />;
      case 'api':
        return <Settings className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getSourceLabel = () => {
    switch (importData.source) {
      case 'csv': return 'CSV File';
      case 'excel': return 'Excel File';
      case 'json': return 'JSON File';
      case 'api': return 'API Import';
      default: return 'Unknown';
    }
  };

  if (importComplete) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Import Complete!</h2>
          <p className="text-gray-600 mb-6">
            {importData.sanitizedData.length} records have been successfully imported into the system
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = '/dashboard/moderation'}>
              View Reports
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Import More Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Summary</CardTitle>
          <CardDescription>
            Review your import configuration before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Data Source Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                {getSourceIcon()}
                Data Source
              </div>
              <div className="pl-7">
                <p className="font-medium">{getSourceLabel()}</p>
                {importData.file && (
                  <p className="text-sm text-gray-600">{importData.file.name}</p>
                )}
                {importData.apiEndpoint && (
                  <p className="text-sm text-gray-600">{importData.apiEndpoint}</p>
                )}
              </div>
            </div>

            {/* Record Count */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Users className="w-5 h-5" />
                Records
              </div>
              <div className="pl-7">
                <p className="font-medium">{importData.sanitizedData.length} records</p>
                <p className="text-sm text-gray-600">Ready for import</p>
              </div>
            </div>

            {/* Field Mappings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Settings className="w-5 h-5" />
                Field Mappings
              </div>
              <div className="pl-7">
                <p className="font-medium">{Object.keys(importData.fieldMappings).length} fields mapped</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.keys(importData.fieldMappings).slice(0, 3).map(field => (
                    <Badge key={field} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                  {Object.keys(importData.fieldMappings).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{Object.keys(importData.fieldMappings).length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Sanitization Rules */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <CheckCircle className="w-5 h-5" />
                Sanitization
              </div>
              <div className="pl-7">
                <p className="font-medium">{importData.sanitizationRules.length} rules applied</p>
                <p className="text-sm text-gray-600">Data cleaned and validated</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Mapping Details */}
      <Card>
        <CardHeader>
          <CardTitle>Field Mapping Details</CardTitle>
          <CardDescription>
            How your source fields map to Goodpass standard fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(importData.fieldMappings).map(([standardField, sourceField]) => (
              <div key={standardField} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{standardField}</Badge>
                  <span className="text-sm text-gray-600">maps to</span>
                  <span className="font-medium">{sourceField}</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sanitization Summary */}
      {importData.sanitizationRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Applied Sanitization Rules</CardTitle>
            <CardDescription>
              Data quality improvements that were applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {importData.sanitizationRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">{rule.field}</p>
                    <p className="text-sm text-green-600">{rule.description}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {rule.affectedRecords} records
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Import Notes (Optional)
          </CardTitle>
          <CardDescription>
            Add any notes or comments about this import
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="import-notes">Notes</Label>
            <Textarea
              id="import-notes"
              placeholder="Add any relevant notes about this import..."
              value={importNotes}
              onChange={(e) => setImportNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Final Import Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Import</h3>
            <p className="text-gray-600 mb-6">
              Click the button below to finalize the import of {importData.sanitizedData.length} records
            </p>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              size="lg"
              className="w-full max-w-md"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing Records...
                </>
              ) : (
                'Complete Import'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportConfirmation;
