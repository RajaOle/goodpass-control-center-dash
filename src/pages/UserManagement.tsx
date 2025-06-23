
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Users } from 'lucide-react';

const UserManagement = () => {
  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">User Management</h1>
        <p className="text-slate-600">Manage user accounts, permissions, and account status.</p>
      </div>

      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">User Directory</CardTitle>
              <CardDescription className="text-slate-600">
                Search and manage all user accounts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search users..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-300 transition-colors" 
              />
            </div>
            <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b bg-slate-50 text-slate-700">
              <div>Name</div>
              <div>Email</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="p-8 text-center text-slate-500 bg-white">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>User data would be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
