
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ActivityLogs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
        <p className="text-muted-foreground">
          Monitor system activity and user actions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
          <CardDescription>
            Latest system logs and user activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'info', message: 'User login successful', time: '2 minutes ago' },
              { type: 'warning', message: 'Failed login attempt detected', time: '5 minutes ago' },
              { type: 'success', message: 'KYC verification completed', time: '10 minutes ago' },
              { type: 'info', message: 'New user registration', time: '15 minutes ago' },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={log.type === 'warning' ? 'destructive' : log.type === 'success' ? 'default' : 'secondary'}
                  >
                    {log.type}
                  </Badge>
                  <span>{log.message}</span>
                </div>
                <span className="text-sm text-muted-foreground">{log.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;
