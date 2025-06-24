
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Zap, Lock } from 'lucide-react';

interface VerificationControlsProps {
  verificationEnabled: boolean;
  aiAssistEnabled: boolean;
  onVerificationToggle: (checked: boolean) => void;
  onAiAssistToggle: (checked: boolean) => void;
}

const VerificationControls: React.FC<VerificationControlsProps> = ({
  verificationEnabled,
  aiAssistEnabled,
  onVerificationToggle,
  onAiAssistToggle,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Verification Controls
        </CardTitle>
        <CardDescription>
          Manage automated verification settings for incoming reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div className="space-y-1">
              <Label htmlFor="verification-switch" className="text-sm font-medium">
                Auto-Verification
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable automatic verification of new reports
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!verificationEnabled && <Lock className="w-4 h-4 text-orange-500" />}
            <Switch
              id="verification-switch"
              checked={verificationEnabled}
              onCheckedChange={onVerificationToggle}
            />
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-purple-600" />
            <div className="space-y-1">
              <Label 
                htmlFor="ai-assist-switch" 
                className={`text-sm font-medium ${!verificationEnabled ? 'text-muted-foreground' : ''}`}
              >
                AI-Assisted Verification
              </Label>
              <p className="text-sm text-muted-foreground">
                Use AI to help with verification decisions
              </p>
            </div>
          </div>
          <Switch
            id="ai-assist-switch"
            checked={aiAssistEnabled}
            onCheckedChange={onAiAssistToggle}
            disabled={!verificationEnabled}
          />
        </div>

        {verificationEnabled && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ Verification system is active. New reports will be processed automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationControls;
