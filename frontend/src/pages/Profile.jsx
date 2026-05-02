import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfile, getMyListings, getReports } from '../services/api';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsCard } from '../components/profile/StatsCard';
import { ActivityTabs } from '../components/profile/ActivityTabs';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Home, Flag, CheckSquare, TrendingUp, Lock, Bell, Shield, LifeBuoy } from 'lucide-react';

import DashboardLayout from '../components/DashboardLayout';

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
    queryFn: getReports
  });

  if (profileLoading) {
    return (
      <DashboardLayout title="Account Settings">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-64 bg-gray-100 rounded-3xl"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl"></div>)}
          </div>
        </div>
      </DashboardLayout>
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
    <DashboardLayout title="User Profile">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProfileHeader user={user} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <StatsCard title="Listings" value={listings.length} icon={<Home className="w-6 h-6 text-emerald-600" />} />
          <StatsCard title="Flagged" value={listings.filter(l => l.isFlagged).length} icon={<Flag className="w-6 h-6 text-red-500" />} colorClass="text-red-500" />
          <StatsCard title="Reports" value={reports.length} icon={<CheckSquare className="w-6 h-6 text-blue-600" />} colorClass="text-blue-600" />
          <StatsCard title="Account" value="95%" icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} colorClass="text-emerald-600" trend="up" trendValue="2%" />
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
            <Card className="rounded-3xl border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" /> Account Security
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Two-Factor Auth</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status: Disabled</p>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gray-300 transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                  </div>
                </div>
                <Button className="w-full bg-gray-900 text-white rounded-xl py-3 font-bold text-xs hover:bg-emerald-600 transition-colors">
                  Change Password
                </Button>
              </div>
            </Card>

            <div className="bg-emerald-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-emerald-900/20">
               <div className="relative z-10">
                 <h4 className="font-bold text-xl mb-2">Need Support?</h4>
                 <p className="text-emerald-100 text-sm mb-6 opacity-90 leading-relaxed">
                   Our institutional trust team is available 24/7 to assist with your verification.
                 </p>
                 <button className="w-full bg-white text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/20 text-xs uppercase tracking-widest">
                   Chat Now
                 </button>
               </div>
               <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
