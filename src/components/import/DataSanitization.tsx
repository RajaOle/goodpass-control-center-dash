
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Bot, CheckCircle, AlertTriangle, Trash2, Wand2 } from 'lucide-react';
import type { ImportData } from '@/pages/ImportReport';

interface SanitizationRule {
  id: string;
  field: string;
  type: 'format' | 'validation' | 'cleanup' | 'standardization';
  description: string;
  severity: 'error' | 'warning' | 'info';
  autoFix: boolean;
  affectedRecords: number;
  applied: boolean;
}

interface DataSanitizationProps {
  importData: ImportData;
  onDataChange: (data: ImportData) => void;
}

const DataSanitization: React.FC<DataSanitizationProps> = ({
  importData,
  onDataChange
}) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sanitizationRules, setSanitizationRules] = useState<SanitizationRule[]>([]);
  const [sanitizedData, setSanitizedData] = useState<any[]>([]);

  useEffect(() => {
    if (importData.mappedData.length > 0 && sanitizationRules.length === 0) {
      analyzeData();
    }
  }, [importData.mappedData]);

  const analyzeData = () => {
    setIsAnalyzing(true);
    
    // Simulate AI data analysis
    setTimeout(() => {
      const rules: SanitizationRule[] = [];
      
      // Analyze phone numbers
      const phoneIssues = importData.mappedData.filter(row => {
        const reporterPhone = row.reporterPhone || '';
        const reporteePhone = row.reporteePhone || '';
        return !isValidPhone(reporterPhone) || !isValidPhone(reporteePhone);
      }).length;
      
      if (phoneIssues > 0) {
        rules.push({
          id: 'phone-format',
          field: 'Phone Numbers',
          type: 'format',
          description: 'Standardize phone number format to +1-XXX-XXX-XXXX',
          severity: 'warning',
          autoFix: true,
          affectedRecords: phoneIssues,
          applied: false
        });
      }

      // Analyze amounts
      const amountIssues = importData.mappedData.filter(row => {
        const initial = row.initialAmount || '';
        const outstanding = row.outstandingAmount || '';
        return !isValidAmount(initial) || !isValidAmount(outstanding);
      }).length;
      
      if (amountIssues > 0) {
        rules.push({
          id: 'amount-format',
          field: 'Amount Fields',
          type: 'format',
          description: 'Remove currency symbols and ensure numeric format',
          severity: 'error',
          autoFix: true,
          affectedRecords: amountIssues,
          applied: false
        });
      }

      // Analyze names
      const nameIssues = importData.mappedData.filter(row => {
        const reporterName = row.reporterName || '';
        const reporteeName = row.reporteeName || '';
        return reporterName.length < 2 || reporteeName.length < 2;
      }).length;
      
      if (nameIssues > 0) {
        rules.push({
          id: 'name-validation',
          field: 'Name Fields',
          type: 'validation',
          description: 'Names must be at least 2 characters long',
          severity: 'error',
          autoFix: false,
          affectedRecords: nameIssues,
          applied: false
        });
      }

      // Analyze duplicate records
      const duplicates = findDuplicates(importData.mappedData);
      if (duplicates.length > 0) {
        rules.push({
          id: 'remove-duplicates',
          field: 'All Fields',
          type: 'cleanup',
          description: 'Remove duplicate records based on reporter and reportee combination',
          severity: 'warning',
          autoFix: true,
          affectedRecords: duplicates.length,
          applied: false
        });
      }

      // Analyze repayment types
      const repaymentTypes = importData.mappedData.map(row => row.repaymentType || '').filter(Boolean);
      const invalidRepaymentTypes = repaymentTypes.filter(type => 
        !['Installment', 'Single Payment', 'Open Payment'].includes(type)
      ).length;
      
      if (invalidRepaymentTypes > 0) {
        rules.push({
          id: 'repayment-standardization',
          field: 'Repayment Type',
          type: 'standardization',
          description: 'Standardize repayment types to: Installment, Single Payment, Open Payment',
          severity: 'warning',
          autoFix: true,
          affectedRecords: invalidRepaymentTypes,
          applied: false
        });
      }

      setSanitizationRules(rules);
      setIsAnalyzing(false);
      
      toast({
        title: "Data Analysis Complete",
        description: `Found ${rules.length} potential issues to address`,
      });
    }, 2500);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  const isValidAmount = (amount: string): boolean => {
    const cleanAmount = amount.toString().replace(/[$,]/g, '');
    return !isNaN(Number(cleanAmount)) && Number(cleanAmount) >= 0;
  };

  const findDuplicates = (data: any[]): any[] => {
    const seen = new Set();
    const duplicates: any[] = [];
    
    data.forEach((row, index) => {
      const key = `${row.reporterName}-${row.reporteeName}`;
      if (seen.has(key)) {
        duplicates.push({ ...row, originalIndex: index });
      } else {
        seen.add(key);
      }
    });
    
    return duplicates;
  };

  const toggleRule = (ruleId: string) => {
    setSanitizationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, applied: !rule.applied } : rule
      )
    );
  };

  const applyAllAutoFixes = () => {
    const autoFixRules = sanitizationRules.filter(rule => rule.autoFix);
    setSanitizationRules(prev => 
      prev.map(rule => 
        rule.autoFix ? { ...rule, applied: true } : rule
      )
    );
    
    toast({
      title: "Auto-fixes Applied",
      description: `Applied ${autoFixRules.length} automatic fixes`,
    });
  };

  const applySanitization = () => {
    let cleaned = [...importData.mappedData];
    const appliedRules = sanitizationRules.filter(rule => rule.applied);
    
    appliedRules.forEach(rule => {
      switch (rule.id) {
        case 'phone-format':
          cleaned = cleaned.map(row => ({
            ...row,
            reporterPhone: formatPhone(row.reporterPhone || ''),
            reporteePhone: formatPhone(row.reporteePhone || '')
          }));
          break;
          
        case 'amount-format':
          cleaned = cleaned.map(row => ({
            ...row,
            initialAmount: cleanAmount(row.initialAmount || ''),
            outstandingAmount: cleanAmount(row.outstandingAmount || '')
          }));
          break;
          
        case 'remove-duplicates':
          const seen = new Set();
          cleaned = cleaned.filter(row => {
            const key = `${row.reporterName}-${row.reporteeName}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          break;
          
        case 'repayment-standardization':
          cleaned = cleaned.map(row => ({
            ...row,
            repaymentType: standardizeRepaymentType(row.repaymentType || '')
          }));
          break;
      }
    });

    setSanitizedData(cleaned);
    onDataChange({
      ...importData,
      sanitizedData: cleaned,
      sanitizationRules: appliedRules
    });

    toast({
      title: "Data Sanitization Complete",
      description: `Processed ${cleaned.length} records with ${appliedRules.length} rules applied`,
    });
  };

  const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return phone; // Return original if can't format
  };

  const cleanAmount = (amount: string): string => {
    return amount.toString().replace(/[$,]/g, '');
  };

  const standardizeRepaymentType = (type: string): string => {
    const lower = type.toLowerCase();
    if (lower.includes('install') || lower.includes('monthly') || lower.includes('quarterly')) {
      return 'Installment';
    }
    if (lower.includes('single') || lower.includes('lump') || lower.includes('one')) {
      return 'Single Payment';
    }
    if (lower.includes('open') || lower.includes('flexible')) {
      return 'Open Payment';
    }
    return 'Installment'; // Default
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Data Sanitization
          </CardTitle>
          <CardDescription>
            Automatically detect and fix data quality issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Analyzing data quality...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Data Quality Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    {sanitizationRules.length} issues detected
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={applyAllAutoFixes}
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    Apply All Auto-fixes
                  </Button>
                  <Button
                    onClick={applySanitization}
                    disabled={!sanitizationRules.some(rule => rule.applied)}
                  >
                    Apply Sanitization
                  </Button>
                </div>
              </div>

              {sanitizationRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 border rounded-lg ${rule.applied ? 'bg-green-50 border-green-200' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={rule.applied}
                        onCheckedChange={() => toggleRule(rule.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSeverityIcon(rule.severity)}
                          <span className="font-medium">{rule.field}</span>
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity}
                          </Badge>
                          {rule.autoFix && (
                            <Badge variant="outline" className="text-xs">
                              Auto-fix
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {rule.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Affects {rule.affectedRecords} record{rule.affectedRecords !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {sanitizationRules.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-medium text-green-800">Data Quality Excellent</h3>
                  <p className="text-sm text-green-600">
                    No data quality issues detected in your import
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sanitized Data Preview */}
      {sanitizedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sanitized Data Preview</CardTitle>
            <CardDescription>
              Preview of your data after sanitization ({sanitizedData.length} records)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(sanitizedData[0] || {}).map((key) => (
                      <th key={key} className="border border-gray-300 px-4 py-2 text-left">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sanitizedData.slice(0, 3).map((row, index) => (
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
              {sanitizedData.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">
                  ... and {sanitizedData.length - 3} more records
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSanitization;
