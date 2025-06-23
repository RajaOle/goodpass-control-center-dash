
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, TrendingUp } from 'lucide-react';

const FinancialReputation = () => {
  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Financial Reputation</h1>
        <p className="text-slate-600">Monitor and manage user financial reputation scores.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">Reputation Distribution</CardTitle>
                <CardDescription className="text-slate-600">Overview of user reputation scores</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
              <div className="text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Reputation distribution chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">Score Trends</CardTitle>
                <CardDescription className="text-slate-600">Historical reputation score changes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Score trends chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReputation;
