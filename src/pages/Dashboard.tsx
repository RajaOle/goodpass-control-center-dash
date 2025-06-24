
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, FileText, CheckCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+20.1%",
      description: "from last month",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white",
    },
    {
      title: "Total Pending reports",
      value: "1,247",
      change: "+12.4%",
      description: "from last month",
      icon: FileText,
      color: "bg-gradient-to-br from-orange-400 to-orange-500",
      textColor: "text-white",
    },
    {
      title: "Total Live reports",
      value: "8,932",
      change: "+7.2%",
      description: "from last month",
      icon: CheckCircle,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-white",
    },
  ];

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Overview</h1>
        <p className="text-slate-600">Last 30 days</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`${stat.color} border-0 shadow-lg hover:shadow-xl transition-shadow duration-200`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                <CardTitle className={`text-sm font-medium ${stat.textColor} opacity-90`}>
                  {stat.title.toUpperCase()}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</div>
              <div className="flex items-center space-x-1">
                <TrendingUp className={`h-3 w-3 ${stat.textColor} opacity-75`} />
                <span className={`text-sm ${stat.textColor} opacity-75`}>
                  {stat.change} {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">Pageviews & Launches</CardTitle>
              <CardDescription className="text-slate-600">
                Performance metrics over time
              </CardDescription>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View more
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>Chart visualization would be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
