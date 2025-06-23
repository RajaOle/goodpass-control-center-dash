
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Activity, BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Analytics Overview</h1>
        <p className="text-slate-600">Comprehensive analytics and insights for your platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">User Growth</CardTitle>
                  <CardDescription className="text-slate-600">Track user acquisition and retention</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">User growth chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Transaction Volume</CardTitle>
                  <CardDescription className="text-slate-600">Monitor financial activity trends</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Transaction volume chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Engagement Metrics</CardTitle>
                  <CardDescription className="text-slate-600">User interaction and engagement data</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Engagement metrics visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
