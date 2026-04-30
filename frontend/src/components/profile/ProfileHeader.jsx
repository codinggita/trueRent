import React from 'react';
import { BadgeCheck, Edit3, Shield, Mail, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

export function ProfileHeader({ user }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      
      <div className="relative pt-12 sm:pt-16 sm:flex sm:items-end justify-between">
        <div className="sm:flex sm:space-x-5 items-end">
          <div className="relative">
            <img 
              className="h-24 w-24 rounded-full ring-4 ring-white bg-white object-cover" 
              src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || 'User') + "&background=random"} 
              alt={user?.name} 
            />
            {user?.verified && (
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                <BadgeCheck className="h-6 w-6 text-blue-500" />
              </div>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0 sm:pb-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate flex items-center gap-2">
              {user?.name || 'Jane Doe'}
            </h1>
            <p className="text-sm font-medium text-gray-500 flex flex-wrap gap-4 mt-1">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email || 'jane@example.com'}</span>
              {user?.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {user?.phone}</span>}
            </p>
          </div>
        </div>
        
        <div className="mt-5 sm:mt-0 flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Button>
        </div>
      </div>
      
      {/* Trust Indicator */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" /> Trust Score
            </h3>
            <p className="text-xs text-gray-500 mt-1">Based on verification and activity</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-emerald-600">98</span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98%' }}></div>
        </div>
      </div>
    </div>
  );
}
