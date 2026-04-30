import React from 'react';
import { Card } from '../ui/Card';

export function StatsCard({ title, value, icon, trend, trendValue, colorClass = "text-blue-600" }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '50')}`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </Card>
  );
}
