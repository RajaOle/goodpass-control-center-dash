import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bot, CheckCircle, X, Check, AlertCircle, Zap, RefreshCw, ArrowRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ImportData } from '@/pages/ImportReport';

interface DataPreviewMappingProps {
  importData: ImportData;
  onDataChange: (data: ImportData) => void;
}

interface AISuggestion {
  sourceField: string;
  targetField: string;
  confidence: number;
  status: 'pending' | 'accepted' | 'rejected';
  reason?: string;
}

const DataPreviewMapping: React.FC<DataPreviewMappingProps> = ({
  importData,
  onDataChange
}) => {
  const { toast } = useToast();
  const [isAiMapping, setIsAiMapping] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Standard Goodpass report fields
  const standardFields = [
    { key: 'reporterName', label: 'Reporter Name', required: true, description: 'Name of the person making the report' },
    { key: 'reporterPhone', label: 'Reporter Phone', required: true, description: 'Contact number of the reporter' },
    { key: 'reporteeName', label: 'Reportee Name', required: true, description: 'Name of the person being reported' },
    { key: 'reporteePhone', label: 'Reportee Phone', required: true, description: 'Contact number of the reportee' },
    { key: 'initialAmount', label: 'Initial Amount', required: true, description: 'Original loan amount' },
    { key: 'outstandingAmount', label: 'Outstanding Amount', required: true, description: 'Remaining amount to be paid' },
    { key: 'repaymentType', label: 'Repayment Type', required: true, description: 'Type of repayment agreement' },
    { key: 'lastRepaymentDate', label: 'Last Repayment Date', required: false, description: 'Date of most recent payment' },
    { key: 'collateralInfo', label: 'Collateral Information', required: false, description: 'Details about collateral' },
    { key: 'reportType', label: 'Report Type', required: false, description: 'Category of the report' }
  ];

  const sourceFields = importData.rawData.length > 0 ? Object.keys(importData.rawData[0]) : [];

  useEffect(() => {
    // Auto-suggest AI mapping on component mount
    if (sourceFields.length > 0 && aiSuggestions.length === 0) {
      handleAiMapping();
    }
  }, [sourceFields]);

  const handleAiMapping = () => {
    setIsAiMapping(true);
    
    // Simulate AI field mapping
    setTimeout(() => {
      const suggestions: AISuggestion[] = [];

      // AI mapping logic simulation
      sourceFields.forEach((sourceField) => {
        const lowerField = sourceField.toLowerCase();
        
        if (lowerField.includes('reporter') && lowerField.includes('name')) {
          suggestions.push({ sourceField, targetField: 'reporterName', confidence: 0.95, status: 'pending', reason: 'Exact match found' });
        } else if (lowerField.includes('lender') && lowerField.includes('name')) {
          suggestions.push({ sourceField, targetField: 'reporterName', confidence: 0.85, status: 'pending', reason: 'Similar context match' });
        } else if (lowerField.includes('reporter') && (lowerField.includes('phone') || lowerField.includes('contact'))) {
          suggestions.push({ sourceField, targetField: 'reporterPhone', confidence: 0.90, status: 'pending', reason: 'Phone field detected' });
        } else if (lowerField.includes('lender') && (lowerField.includes('contact') || lowerField.includes('phone'))) {
          suggestions.push({ sourceField, targetField: 'reporterPhone', confidence: 0.80, status: 'pending', reason: 'Contact field match' });
        } else if (lowerField.includes('reportee') && lowerField.includes('name')) {
          suggestions.push({ sourceField, targetField: 'reporteeName', confidence: 0.95, status: 'pending', reason: 'Exact match found' });
        } else if (lowerField.includes('borrower') && lowerField.includes('name')) {
          suggestions.push({ sourceField, targetField: 'reporteeName', confidence: 0.85, status: 'pending', reason: 'Similar context match' });
        } else if (lowerField.includes('reportee') && (lowerField.includes('phone') || lowerField.includes('contact'))) {
          suggestions.push({ sourceField, targetField: 'reporteePhone', confidence: 0.90, status: 'pending', reason: 'Phone field detected' });
        } else if (lowerField.includes('borrower') && (lowerField.includes('contact') || lowerField.includes('phone'))) {
          suggestions.push({ sourceField, targetField: 'reporteePhone', confidence: 0.80, status: 'pending', reason: 'Contact field match' });
        } else if (lowerField.includes('loan') && lowerField.includes('amount') || lowerField.includes('principal')) {
          suggestions.push({ sourceField, targetField: 'initialAmount', confidence: 0.90, status: 'pending', reason: 'Amount field detected' });
        } else if (lowerField.includes('outstanding') || lowerField.includes('remaining') || lowerField.includes('balance')) {
          suggestions.push({ sourceField, targetField: 'outstandingAmount', confidence: 0.85, status: 'pending', reason: 'Balance field detected' });
        } else if (lowerField.includes('repayment') && lowerField.includes('type') || lowerField.includes('payment') && lowerField.includes('terms')) {
          suggestions.push({ sourceField, targetField: 'repaymentType', confidence: 0.75, status: 'pending', reason: 'Payment type detected' });
        } else if (lowerField.includes('collateral') || lowerField.includes('security')) {
          suggestions.push({ sourceField, targetField: 'collateralInfo', confidence: 0.80, status: 'pending', reason: 'Security field detected' });
        }
      });

      // Auto-accept high-confidence suggestions (>90%)
      const autoAcceptedSuggestions = suggestions.filter(s => s.confidence > 0.9);
      const updatedSuggestions = suggestions.map(s => ({
        ...s,
        status: s.confidence > 0.9 ? 'accepted' as const : 'pending' as const
      }));

      // Update field mappings for auto-accepted suggestions
      const newMappings = { ...importData.fieldMappings };
      autoAcceptedSuggestions.forEach(suggestion => {
        newMappings[suggestion.targetField] = suggestion.sourceField;
      });

      if (autoAcceptedSuggestions.length > 0) {
        onDataChange({
          ...importData,
          fieldMappings: newMappings
        });
      }

      setAiSuggestions(updatedSuggestions);
      setIsAiMapping(false);
      
      toast({
        title: "AI Analysis Complete",
        description: `Found ${suggestions.length} potential mappings, auto-accepted ${autoAcceptedSuggestions.length} high-confidence matches`,
      });
    }, 2000);
  };

  const handleAcceptSuggestion = (suggestion: AISuggestion) => {
    // Update AI suggestions
    setAiSuggestions(prev => 
      prev.map(s => 
        s.sourceField === suggestion.sourceField 
          ? { ...s, status: 'accepted' as const }
          : s
      )
    );

    // Update field mappings
    const newMappings = { ...importData.fieldMappings };
    newMappings[suggestion.targetField] = suggestion.sourceField;
    
    onDataChange({
      ...importData,
      fieldMappings: newMappings
    });

    toast({
      title: "Mapping Accepted",
      description: `${suggestion.sourceField} → ${suggestion.targetField}`,
    });
  };

  const handleRejectSuggestion = (suggestion: AISuggestion) => {
    setAiSuggestions(prev => 
      prev.map(s => 
        s.sourceField === suggestion.sourceField 
          ? { ...s, status: 'rejected' as const }
          : s
      )
    );

    toast({
      title: "Mapping Rejected",
      description: `Suggestion for ${suggestion.sourceField} was rejected`,
      variant: "destructive"
    });
  };

  const handleAcceptAll = () => {
    const pendingSuggestions = aiSuggestions.filter(s => s.status === 'pending');
    
    setAiSuggestions(prev => 
      prev.map(s => ({ ...s, status: 'accepted' as const }))
    );

    const newMappings = { ...importData.fieldMappings };
    pendingSuggestions.forEach(suggestion => {
      newMappings[suggestion.targetField] = suggestion.sourceField;
    });
    
    onDataChange({
      ...importData,
      fieldMappings: newMappings
    });

    toast({
      title: "All Mappings Accepted",
      description: `Accepted ${pendingSuggestions.length} AI suggestions`,
    });
  };

  const handleGeneratePreview = () => {
    setIsGeneratingPreview(true);
    
    // Simulate preview generation
    setTimeout(() => {
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

      setIsGeneratingPreview(false);
      
      toast({
        title: "Preview Generated Successfully",
        description: `Generated preview for ${mappedData.length} records. You can now proceed to the next step.`,
      });
    }, 1500);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const requiredFieldsMapped = standardFields
    .filter(field => field.required)
    .every(field => importData.fieldMappings[field.key]);

  const pendingSuggestions = aiSuggestions.filter(s => s.status === 'pending');
  const mappingProgress = (Object.keys(importData.fieldMappings).length / standardFields.filter(f => f.required).length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Status Card */}
      <Card className={`border-2 ${requiredFieldsMapped ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Step 2 Progress</h3>
              <p className="text-sm text-muted-foreground">
                {Math.round(mappingProgress)}% of required fields mapped
              </p>
            </div>
            {requiredFieldsMapped && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Ready to proceed</span>
              </div>
            )}
          </div>
          
          {Object.keys(importData.fieldMappings).length > 0 && importData.mappedData.length === 0 && (
            <Button
              onClick={handleGeneratePreview}
              disabled={isGeneratingPreview}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingPreview ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Preview...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Preview to Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* AI Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Field Mapping Assistant
          </CardTitle>
          <CardDescription>
            AI analyzes your data and suggests field mappings. High-confidence matches ({'>'}90%) are auto-accepted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button
              onClick={handleAiMapping}
              disabled={isAiMapping}
              className="flex items-center gap-2"
            >
              {isAiMapping ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Re-analyze Fields
                </>
              )}
            </Button>
            
            {pendingSuggestions.length > 0 && (
              <Button
                onClick={handleAcceptAll}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Accept All ({pendingSuggestions.length})
              </Button>
            )}
          </div>

          {/* Status Summary */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Pending: {aiSuggestions.filter(s => s.status === 'pending').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Accepted: {aiSuggestions.filter(s => s.status === 'accepted').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Rejected: {aiSuggestions.filter(s => s.status === 'rejected').length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Three-Column Mapping Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Field Mapping Interface</CardTitle>
          <CardDescription>
            Review AI suggestions and manage field mappings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Original Imported Data */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Original Imported Data</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sourceFields.map((field) => (
                  <div key={field} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{field}</div>
                    <div className="text-sm text-gray-600">
                      Sample: {importData.rawData[0]?.[field] || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: AI Suggestions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">AI Suggestions</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className={`p-3 border rounded-lg ${
                    suggestion.status === 'accepted' ? 'bg-green-50 border-green-200' :
                    suggestion.status === 'rejected' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{suggestion.sourceField}</div>
                        <div className="text-xs text-gray-600">→ {suggestion.targetField}</div>
                      </div>
                      <Badge className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">{suggestion.reason}</div>
                    
                    <Badge className={`text-xs ${getStatusColor(suggestion.status)}`}>
                      {suggestion.status === 'accepted' && suggestion.confidence > 0.9 ? 'auto-accepted' : suggestion.status}
                    </Badge>
                    
                    {suggestion.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptSuggestion(suggestion)}
                          className="flex items-center gap-1 h-7 px-2 text-xs"
                        >
                          <Check className="w-3 h-3" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectSuggestion(suggestion)}
                          className="flex items-center gap-1 h-7 px-2 text-xs"
                        >
                          <X className="w-3 h-3" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {aiSuggestions.length === 0 && !isAiMapping && (
                  <div className="text-center py-8 text-gray-500">
                    <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Click "Re-analyze Fields" to get AI suggestions</p>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Goodpass Standard Fields */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Goodpass Standard Fields</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {standardFields.map((field) => {
                  const isMapped = importData.fieldMappings[field.key];
                  return (
                    <div key={field.key} className={`p-3 rounded-lg border ${
                      isMapped ? 'bg-green-50 border-green-200' : 
                      field.required ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{field.label}</span>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {isMapped ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : field.required ? (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        ) : null}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">{field.description}</div>
                      {isMapped && (
                        <div className="text-xs font-medium text-green-700">
                          Mapped from: {importData.fieldMappings[field.key]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {!requiredFieldsMapped && Object.keys(importData.fieldMappings).length === 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Getting Started</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                AI analysis will automatically accept high-confidence field mappings. Review the suggestions and accept or reject them as needed.
              </p>
            </div>
          )}

          {!requiredFieldsMapped && Object.keys(importData.fieldMappings).length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">More Fields Needed</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Please map all required fields before generating the preview.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mapped Data Preview */}
      {importData.mappedData.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Mapped Data Preview
            </CardTitle>
            <CardDescription>
              Preview of your data after field mapping ({importData.mappedData.length} records) - Ready for next step!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(importData.fieldMappings).map((standardField) => (
                      <TableHead key={standardField}>
                        {standardFields.find(f => f.key === standardField)?.label || standardField}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.mappedData.slice(0, 3).map((row, index) => (
                    <TableRow key={index}>
                      {Object.keys(importData.fieldMappings).map((standardField) => (
                        <TableCell key={standardField}>
                          {String(row[standardField] || '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
