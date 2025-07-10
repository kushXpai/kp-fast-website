// src/pages/AdminDashboard/components/analysis/StatsCards.tsx

import React from 'react';
import { Users, User, FileText, Activity, Loader2 } from 'lucide-react';
import { useStatsData } from '../../../../hooks/useStatsData';

const StatsCards: React.FC = () => {
  const { stats, loading, error } = useStatsData();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-600">Error loading stats: {error}</p>
      </div>
    );
  }

  const statsConfig = [
    {
      title: 'Total Teams',
      value: stats.totalTeams,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Team Players',
      value: stats.totalPlayers,
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Form Entries',
      value: stats.formEntries,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Form Types',
      value: stats.formTypes,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <div className="flex items-center">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  )}
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <IconComponent className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;