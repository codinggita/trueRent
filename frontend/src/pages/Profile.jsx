import React from 'react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsCard } from '../components/profile/StatsCard';
import { ActivityTabs } from '../components/profile/ActivityTabs';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Home, Flag, CheckSquare, TrendingUp, Lock, Bell, Shield, LifeBuoy } from 'lucide-react';

export default function Profile() {
  // Mock Data
  const user = {
    name: 'Alex Developer',
    email: 'alex@truerent.io',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    verified: true
  };

  const mockListings = [
    { id: 1, title: 'Modern Apartment 2B', price: '2,500', status: 'Active', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
  ];

  const mockReports = [
    { id: 1, propertyTitle: 'Suspicious Villa', date: 'Oct 20, 2023', status: 'Resolved' }
  ];

  const mockSaved = [
    { id: 1, title: 'Downtown Loft', image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 pt-6">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Profile Header */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProfileHeader user={user} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <StatsCard title="Listings Posted" value="12" icon={<Home className="w-6 h-6 text-blue-600" />} />
          <StatsCard title="Listings Flagged" value="0" icon={<Flag className="w-6 h-6 text-orange-600" />} colorClass="text-orange-600" />
          <StatsCard title="Reports Submitted" value="3" icon={<CheckSquare className="w-6 h-6 text-purple-600" />} colorClass="text-purple-600" />
          <StatsCard title="Success Rate" value="95%" icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} colorClass="text-emerald-600" trend="up" trendValue="2%" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          
          {/* Left Column - Tabs */}
          <div className="lg:col-span-2">
            <ActivityTabs listings={mockListings} reports={mockReports} saved={mockSaved} />
          </div>

          {/* Right Column - Settings & Support */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-400" /> Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Auth</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                  {/* Mock Toggle */}
                  <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <Button variant="outline" className="w-full justify-center">Change Password</Button>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Recent Login</p>
                  <p className="text-sm text-gray-900">MacBook Pro - Chrome</p>
                  <p className="text-xs text-gray-500">San Francisco, CA • 2 hours ago</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" /> Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /> Privacy Mode</span>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Need Help?</h3>
                  <p className="text-xs text-gray-600 mt-1 mb-3">Our support team is available 24/7 to assist you with any issues.</p>
                  <Button variant="primary" className="w-full text-xs py-2">Contact Support</Button>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
