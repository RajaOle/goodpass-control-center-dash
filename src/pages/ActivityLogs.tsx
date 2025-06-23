
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ActivityLogs = () => {
  const logs = [
    { type: 'info', message: 'User login successful', time: '2 minutes ago', icon: Info },
    { type: 'warning', message: 'Failed login attempt detected', time: '5 minutes ago', icon: AlertCircle },
    { type: 'success', message: 'KYC verification completed', time: '10 minutes ago', icon: CheckCircle },
    { type: 'info', message: 'New user registration', time: '15 minutes ago', icon: Info },
  ];

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Activity Logs</h1>
        <p className="text-slate-600">Monitor system activity and user actions.</p>
      </div>

      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">Recent System Events</CardTitle>
              <CardDescription className="text-slate-600">
                Latest system logs and user activities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    log.type === 'warning' ? 'bg-orange-100' :
                    log.type === 'success' ? 'bg-emerald-100' :
                    'bg-blue-100'
                  }`}>
                    <log.icon className={`h-4 w-4 ${
                      log.type === 'warning' ? 'text-orange-600' :
                      log.type === 'success' ? 'text-emerald-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <Badge 
                      variant={log.type === 'warning' ? 'destructive' : log.type === 'success' ? 'default' : 'secondary'}
                      className="mb-1"
                    >
                      {log.type}
                    </Badge>
                    <p className="text-slate-800 font-medium">{log.message}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{log.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;
