import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfile, getMyListings, getReports } from '../services/api';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsCard } from '../components/profile/StatsCard';
import { ActivityTabs } from '../components/profile/ActivityTabs';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Home, Flag, CheckSquare, TrendingUp, Lock, Bell, Shield, LifeBuoy } from 'lucide-react';

export default function Profile() {
  // Queries
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  const { data: listingsData } = useQuery({
    queryKey: ['my-listings'],
    queryFn: getMyListings
  });

  const { data: reportsData } = useQuery({
    queryKey: ['my-reports'],
    queryFn: getReports // Assuming this might need to be filtered by user on backend or here
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  const user = profileData?.data || {
    name: 'User',
    email: 'user@example.com',
    avatar: '',
    verified: false
  };

  const listings = listingsData?.data || [];
  const reports = reportsData?.data?.filter(r => r.reporter?._id === user._id) || [];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 pt-6">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Profile Header */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProfileHeader user={user} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <StatsCard title="Listings Posted" value={listings.length} icon={<Home className="w-6 h-6 text-blue-600" />} />
          <StatsCard title="Listings Flagged" value={listings.filter(l => l.isFlagged).length} icon={<Flag className="w-6 h-6 text-orange-600" />} colorClass="text-orange-600" />
          <StatsCard title="Reports Submitted" value={reports.length} icon={<CheckSquare className="w-6 h-6 text-purple-600" />} colorClass="text-purple-600" />
          <StatsCard title="Account Health" value="95%" icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} colorClass="text-emerald-600" trend="up" trendValue="2%" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          
          {/* Left Column - Tabs */}
          <div className="lg:col-span-2">
            <ActivityTabs 
              listings={listings.map(l => ({
                id: l._id,
                title: l.title,
                price: l.price,
                status: l.isAvailable ? 'Active' : 'Rented',
                image: l.image || l.images?.[0]
              }))} 
              reports={reports.map(r => ({
                id: r._id,
                propertyTitle: r.property?.title,
                date: new Date(r.createdAt).toLocaleDateString(),
                status: r.status
              }))} 
              saved={[]} 
            />
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
                  <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <Button variant="outline" className="w-full justify-center">Change Password</Button>
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
                  <p className="text-xs text-gray-600 mt-1 mb-3">Our support team is available 24/7.</p>
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
