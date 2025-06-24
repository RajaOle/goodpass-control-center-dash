
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bot, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import type { ImportData } from '@/pages/ImportReport';

interface DataPreviewMappingProps {
  importData: ImportData;
  onDataChange: (data: ImportData) => void;
}

const DataPreviewMapping: React.FC<DataPreviewMappingProps> = ({
  importData,
  onDataChange
}) => {
  const { toast } = useToast();
  const [isAiMapping, setIsAiMapping] = useState(false);
  const [mappingConfidence, setMappingConfidence] = useState<Record<string, number>>({});

  // Standard Goodpass report fields
  const standardFields = [
    { key: 'reporterName', label: 'Reporter Name', required: true },
    { key: 'reporterPhone', label: 'Reporter Phone', required: true },
    { key: 'reporteeName', label: 'Reportee Name', required: true },
    { key: 'reporteePhone', label: 'Reportee Phone', required: true },
    { key: 'initialAmount', label: 'Initial Amount', required: true },
    { key: 'outstandingAmount', label: 'Outstanding Amount', required: true },
    { key: 'repaymentType', label: 'Repayment Type', required: true },
    { key: 'lastRepaymentDate', label: 'Last Repayment Date', required: false },
    { key: 'collateralInfo', label: 'Collateral Information', required: false },
    { key: 'reportType', label: 'Report Type', required: false }
  ];

  const sourceFields = importData.rawData.length > 0 ? Object.keys(importData.rawData[0]) : [];

  useEffect(() => {
    // Auto-suggest AI mapping on component mount
    if (sourceFields.length > 0 && Object.keys(importData.fieldMappings).length === 0) {
      handleAiMapping();
    }
  }, [sourceFields]);

  const handleAiMapping = () => {
    setIsAiMapping(true);
    
    // Simulate AI field mapping
    setTimeout(() => {
      const aiMappings: Record<string, string> = {};
      const confidence: Record<string, number> = {};

      // AI mapping logic simulation
      sourceFields.forEach((sourceField) => {
        const lowerField = sourceField.toLowerCase();
        
        if (lowerField.includes('reporter') && lowerField.includes('name')) {
          aiMappings['reporterName'] = sourceField;
          confidence['reporterName'] = 0.95;
        } else if (lowerField.includes('lender') && lowerField.includes('name')) {
          aiMappings['reporterName'] = sourceField;
          confidence['reporterName'] = 0.85;
        } else if (lowerField.includes('reporter') && (lowerField.includes('phone') || lowerField.includes('contact'))) {
          aiMappings['reporterPhone'] = sourceField;
          confidence['reporterPhone'] = 0.90;
        } else if (lowerField.includes('lender') && (lowerField.includes('contact') || lowerField.includes('phone'))) {
          aiMappings['reporterPhone'] = sourceField;
          confidence['reporterPhone'] = 0.80;
        } else if (lowerField.includes('reportee') && lowerField.includes('name')) {
          aiMappings['reporteeName'] = sourceField;
          confidence['reporteeName'] = 0.95;
        } else if (lowerField.includes('borrower') && lowerField.includes('name')) {
          aiMappings['reporteeName'] = sourceField;
          confidence['reporteeName'] = 0.85;
        } else if (lowerField.includes('reportee') && (lowerField.includes('phone') || lowerField.includes('contact'))) {
          aiMappings['reporteePhone'] = sourceField;
          confidence['reporteePhone'] = 0.90;
        } else if (lowerField.includes('borrower') && (lowerField.includes('contact') || lowerField.includes('phone'))) {
          aiMappings['reporteePhone'] = sourceField;
          confidence['reporteePhone'] = 0.80;
        } else if (lowerField.includes('loan') && lowerField.includes('amount') || lowerField.includes('principal')) {
          aiMappings['initialAmount'] = sourceField;
          confidence['initialAmount'] = 0.90;
        } else if (lowerField.includes('outstanding') || lowerField.includes('remaining') || lowerField.includes('balance')) {
          aiMappings['outstandingAmount'] = sourceField;
          confidence['outstandingAmount'] = 0.85;
        } else if (lowerField.includes('repayment') && lowerField.includes('type') || lowerField.includes('payment') && lowerField.includes('terms')) {
          aiMappings['repaymentType'] = sourceField;
          confidence['repaymentType'] = 0.75;
        } else if (lowerField.includes('collateral') || lowerField.includes('security')) {
          aiMappings['collateralInfo'] = sourceField;
          confidence['collateralInfo'] = 0.80;
        }
      });

      setMappingConfidence(confidence);
      onDataChange({
        ...importData,
        fieldMappings: aiMappings
      });

      setIsAiMapping(false);
      
      toast({
        title: "AI Mapping Complete",
        description: `Mapped ${Object.keys(aiMappings).length} fields with AI assistance`,
      });
    }, 2000);
  };

  const handleManualMapping = (standardField: string, sourceField: string) => {
    const newMappings = { ...importData.fieldMappings };
    
    if (sourceField === 'none') {
      delete newMappings[standardField];
    } else {
      newMappings[standardField] = sourceField;
    }
    
    onDataChange({
      ...importData,
      fieldMappings: newMappings
    });
  };

  const handleGeneratePreview = () => {
    const mappedData = importData.rawData.map((row) => {
      const mappedRow: any = {};
      
      Object.entries(importData.fieldMappings).forEach(([standardField, sourceField]) => {
        mappedRow[standardField] = row[sourceField];
      });
      
      return mappedRow;
    });

    onDataChange({
      ...importData,
      mappedData
    });

    toast({
      title: "Preview Generated",
      description: `Generated preview for ${mappedData.length} records`,
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const requiredFieldsMapped = standardFields
    .filter(field => field.required)
    .every(field => importData.fieldMappings[field.key]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI-Assisted Field Mapping
          </CardTitle>
          <CardDescription>
            Let AI automatically map your data fields or customize the mapping manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button
              onClick={handleAiMapping}
              disabled={isAiMapping}
              className="flex items-center gap-2"
            >
              {isAiMapping ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  AI Mapping...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Auto-Map with AI
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGeneratePreview}
              disabled={Object.keys(importData.fieldMappings).length === 0}
            >
              Generate Preview
            </Button>
          </div>

          <div className="space-y-4">
            {standardFields.map((field) => (
              <div key={field.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{field.label}</span>
                      {field.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      {mappingConfidence[field.key] && (
                        <Badge className={`text-xs ${getConfidenceColor(mappingConfidence[field.key])}`}>
                          {Math.round(mappingConfidence[field.key] * 100)}% confidence
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Standard Goodpass field
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Select
                    value={importData.fieldMappings[field.key] || 'none'}
                    onValueChange={(value) => handleManualMapping(field.key, value)}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select source field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not mapped</SelectItem>
                      {sourceFields.map((sourceField) => (
                        <SelectItem key={sourceField} value={sourceField}>
                          {sourceField}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {importData.fieldMappings[field.key] ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : field.required ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {!requiredFieldsMapped && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Missing Required Fields</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Please map all required fields before proceeding to the next step.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mapped Data Preview */}
      {importData.mappedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mapped Data Preview</CardTitle>
            <CardDescription>
              Preview of your data after field mapping ({importData.mappedData.length} records)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(importData.fieldMappings).map((standardField) => (
                      <th key={standardField} className="border border-gray-300 px-4 py-2 text-left">
                        {standardFields.find(f => f.key === standardField)?.label || standardField}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importData.mappedData.slice(0, 3).map((row, index) => (
                    <tr key={index}>
                      {Object.keys(importData.fieldMappings).map((standardField) => (
                        <td key={standardField} className="border border-gray-300 px-4 py-2">
                          {String(row[standardField] || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {importData.mappedData.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  ... and {importData.mappedData.length - 3} more records
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataPreviewMapping;
