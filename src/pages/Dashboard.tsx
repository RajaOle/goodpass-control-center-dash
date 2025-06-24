import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Eye, Activity, TrendingUp, Rocket, Shield } from 'lucide-react';

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
      title: "Pageviews",
      value: "245,600",
      change: "+2.8%",
      description: "from last month",
      icon: Eye,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      textColor: "text-white",
    },
    {
      title: "Transaction Volume",
      value: "$2.6M",
      change: "+15.3%",
      description: "from last month",
      icon: BarChart3,
      color: "bg-gradient-to-br from-orange-400 to-orange-500",
      textColor: "text-white",
    },
  ];

  const recentActivities = [
    { action: "New user registration", time: "2 minutes ago", type: "user" },
    { action: "KYC verification completed", time: "5 minutes ago", type: "verification" },
    { action: "New peer review submitted", time: "10 minutes ago", type: "review" },
    { action: "Security alert resolved", time: "15 minutes ago", type: "security" },
    { action: "Payment processed", time: "22 minutes ago", type: "payment" },
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-0 bg-white">
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
            <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Chart visualization would be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-0 bg-white">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
            <CardDescription className="text-slate-600">
              Latest system events and user actions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-5">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">Quick Actions</CardTitle>
            <CardDescription className="text-slate-600">
              Manage your platform efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Create Announcement
            </button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">Security Center</CardTitle>
            <CardDescription className="text-slate-600">
              Monitor system security
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              View Security Logs
            </button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">System Health</CardTitle>
            <CardDescription className="text-slate-600">
              Monitor platform performance
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              View Metrics
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
