import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import DataSourceSelection from '@/components/import/DataSourceSelection';
import DataPreviewMapping from '@/components/import/DataPreviewMapping';
import DataSanitization from '@/components/import/DataSanitization';
import ImportConfirmation from '@/components/import/ImportConfirmation';

export interface ImportData {
  source: 'csv' | 'excel' | 'json' | 'api' | null;
  file?: File;
  apiEndpoint?: string;
  rawData: any[];
  mappedData: any[];
  fieldMappings: Record<string, string>;
  sanitizedData: any[];
  sanitizationRules: any[];
}

const ImportReport = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [importData, setImportData] = useState<ImportData>({
    source: null,
    rawData: [],
    mappedData: [],
    fieldMappings: {},
    sanitizedData: [],
    sanitizationRules: []
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: 'Data Source', description: 'Select your data source' },
    { number: 2, title: 'Preview & Mapping', description: 'Map fields with AI assistance' },
    { number: 3, title: 'Data Sanitization', description: 'Clean and validate data' },
    { number: 4, title: 'Confirmation', description: 'Review and import' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Allow going to previous steps or next step if current step is valid
    if (stepNumber <= currentStep || (stepNumber === currentStep + 1 && canProceedToNextStep())) {
      setCurrentStep(stepNumber);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return importData.source !== null && importData.rawData.length > 0;
      case 2:
        return importData.mappedData.length > 0;
      case 3:
        return importData.sanitizedData.length > 0;
      case 4:
        return false; // Final step
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataSourceSelection
            importData={importData}
            onDataChange={setImportData}
          />
        );
      case 2:
        return (
          <DataPreviewMapping
            importData={importData}
            onDataChange={setImportData}
          />
        );
      case 3:
        return (
          <DataSanitization
            importData={importData}
            onDataChange={setImportData}
          />
        );
      case 4:
        return (
          <ImportConfirmation
            importData={importData}
            onDataChange={setImportData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Import Report</h2>
        <p className="text-muted-foreground">
          Import external data into the Goodpass reporting system
        </p>
      </div>

      {/* Progress Indicator with Navigation Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                
                {/* Navigation Buttons - Now positioned in top right */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleNext}
                    disabled={currentStep === totalSteps || !canProceedToNextStep()}
                    className={canProceedToNextStep() ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {currentStep === totalSteps ? 'Complete Import' : 'Next'}
                    {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-1" />}
                  </Button>
                </div>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
            
            {/* Step Navigation */}
            <div className="flex justify-between items-center">
              {steps.map((step) => {
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;
                const canAccess = step.number <= currentStep || (step.number === currentStep + 1 && canProceedToNextStep());
                
                return (
                  <button
                    key={step.number}
                    onClick={() => handleStepClick(step.number)}
                    className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-blue-50 text-blue-600'
                        : isCompleted
                        ? 'text-green-600 hover:bg-green-50'
                        : canAccess
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!canAccess}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : canAccess
                        ? 'bg-gray-300 text-gray-700'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.number}
                    </div>
                    <div className="text-xs font-medium">{step.title}</div>
                    <div className="text-xs text-center hidden sm:block">{step.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Status Indicator */}
      {!canProceedToNextStep() && currentStep < totalSteps && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Complete This Step</p>
                <p className="text-sm text-yellow-700">
                  {currentStep === 1 && "Please select a data source and upload your data."}
                  {currentStep === 2 && "Please complete field mapping and generate the preview."}
                  {currentStep === 3 && "Please apply sanitization rules to clean your data."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="min-h-[600px]">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default ImportReport;
