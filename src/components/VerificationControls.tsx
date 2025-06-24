
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Zap, Lock, Users, User } from 'lucide-react';

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
          Manual Verification Controls
        </CardTitle>
        <CardDescription>
          Configure manual verification requirements for incoming reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            {verificationEnabled ? (
              <Users className="w-5 h-5 text-blue-600" />
            ) : (
              <User className="w-5 h-5 text-orange-600" />
            )}
            <div className="space-y-1">
              <Label htmlFor="verification-switch" className="text-sm font-medium">
                Full Verification Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                {verificationEnabled 
                  ? "AI will replace manual verification for both Reporter AND Reportee"
                  : "Verify only Reporter manually"
                }
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
                AI-Assisted Manual Verification
              </Label>
              <p className="text-sm text-muted-foreground">
                {verificationEnabled 
                  ? "AI provides suggestions during manual verification"
                  : "AI assistance unavailable in Reporter-only mode"
                }
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
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800">
                  Full Verification Mode Active
                </p>
                <p className="text-sm text-blue-700">
                  • AI will replace manual verification for both Reporter and Reportee<br />
                  • Reports can achieve "Verified" status<br />
                  • AI assistance is available to help with verification decisions
                </p>
              </div>
            </div>
          </div>
        )}

        {!verificationEnabled && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-800">
                  Reporter-Only Verification Mode
                </p>
                <p className="text-sm text-orange-700">
                  • Only Reporter will be manually verified<br />
                  • Reports with complete documents get "Partially Verified" status<br />
                  • Reports automatically go live when partially verified<br />
                  • AI assistance is disabled in this mode
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationControls;
