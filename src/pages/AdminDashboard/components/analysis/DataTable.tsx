// src/pages/AdminDashboard/components/analysis/DataTable.tsx

import React from 'react';
import { Activity } from 'lucide-react';

interface FormEntry {
  id: string;
  date: string;
  player_name?: string;
  session_type?: string;
  session_duration?: number;
  session_intensity?: string;
  session_number?: number;
  balls_bowled?: number;
  match_played?: boolean;
  match_performance?: string;
  coach_feedback?: boolean;
  comments?: string;
  // Wellness form fields
  sleep_quality?: string;
  physical_readiness?: string;
  mood?: string;
  mental_alertness?: string;
  muscle_soreness?: string;
  menstrual_cycle?: string;
  // Hydration form fields
  pre_session_weight?: number;
  post_session_weight?: number;
  liquid_consumed?: number;
  urination_output?: number;
  // Recovery form fields
  recovery_methods?: string[];
  injury_present?: string;
  injury_status?: string;
}

interface DataTableProps {
  formEntries: FormEntry[];
  formType: string;
  playerName: string;
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ 
  formEntries, 
  formType, 
  playerName, 
  loading 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderMonitoringRow = (entry: FormEntry) => (
    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(entry.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.player_name || 'Unknown'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {entry.session_number || '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          entry.session_type === 'Match' ? 'bg-red-100 text-red-800' :
          entry.session_type === 'Training' ? 'bg-blue-100 text-blue-800' :
          entry.session_type === 'Gym' ? 'bg-green-100 text-green-800' :
          entry.session_type === 'Conditioning' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {entry.session_type || '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.session_duration || 0} min
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          parseInt(entry.session_intensity || '0') >= 8 ? 'bg-red-100 text-red-800' :
          parseInt(entry.session_intensity || '0') >= 6 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {entry.session_intensity || 0}/10
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.balls_bowled || 0}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
        {entry.comments || '-'}
      </td>
    </tr>
  );

  const renderWellnessRow = (entry: FormEntry) => (
    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(entry.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.player_name || 'Unknown'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          parseInt(entry.sleep_quality || '3') >= 4 ? 'bg-green-100 text-green-800' :
          parseInt(entry.sleep_quality || '3') >= 3 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {entry.sleep_quality || 3}/5
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          parseInt(entry.physical_readiness || '3') >= 4 ? 'bg-green-100 text-green-800' :
          parseInt(entry.physical_readiness || '3') >= 3 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {entry.physical_readiness || 3}/5
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          parseInt(entry.mood || '3') >= 4 ? 'bg-green-100 text-green-800' :
          parseInt(entry.mood || '3') >= 3 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {entry.mood || 3}/5
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          parseInt(entry.mental_alertness || '3') >= 4 ? 'bg-green-100 text-green-800' :
          parseInt(entry.mental_alertness || '3') >= 3 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {entry.mental_alertness || 3}/5
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          parseInt(entry.muscle_soreness || '3') <= 2 ? 'bg-green-100 text-green-800' :
          parseInt(entry.muscle_soreness || '3') <= 3 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {entry.muscle_soreness || 3}/5
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          entry.menstrual_cycle === 'Yes' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {entry.menstrual_cycle || 'No'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
        {entry.comments || '-'}
      </td>
    </tr>
  );

  const renderHydrationRow = (entry: FormEntry) => (
    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(entry.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.player_name || 'Unknown'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          entry.session_type === 'Match' ? 'bg-red-100 text-red-800' :
          entry.session_type === 'Training' ? 'bg-blue-100 text-blue-800' :
          entry.session_type === 'Gym' ? 'bg-green-100 text-green-800' :
          entry.session_type === 'Conditioning' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {entry.session_type || '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {entry.session_number || '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.pre_session_weight || 0} kg
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.post_session_weight || 0} kg
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.liquid_consumed || 0} ml
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.urination_output || 0} ml
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
        {entry.comments || '-'}
      </td>
    </tr>
  );

  const renderRecoveryRow = (entry: FormEntry) => (
    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(entry.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.player_name || 'Unknown'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {entry.recovery_methods && entry.recovery_methods.length > 0 
          ? entry.recovery_methods.join(', ') 
          : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          (entry.injury_present === 'Yes' || entry.injury_status === 'Yes') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {entry.injury_present || entry.injury_status || 'No'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
        {entry.comments || '-'}
      </td>
    </tr>
  );

  const getTableHeaders = () => {
    switch (formType) {
      case 'Monitoring':
        return [
          'Date', 'Player Name', 'Session Number', 'Session Type', 'Duration (min)', 'Intensity (/10)', 
          'Balls Bowled', 'Comments'
        ];
      case 'Wellness':
        return [
          'Date', 'Player Name', 'Sleep Quality', 'Physical Readiness', 'Mood', 
          'Mental Alertness', 'Muscle Soreness', 'Menstrual Cycle', 'Comments'
        ];
      case 'Hydration':
        return [
          'Date', 'Player Name', 'Session Type', 'Session Number', 'Pre-Session Weight', 'Post-Session Weight',
          'Liquid Consumed', 'Urination Output', 'Comments'
        ];
      case 'Recovery':
        return [
          'Date', 'Player Name', 'Recovery Methods', 'Injury Present', 'Comments'
        ];
      default:
        return ['Date', 'Player Name', 'Data', 'Comments'];
    }
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={getTableHeaders().length} className="px-6 py-8 text-center text-gray-500">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading data...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (formEntries.length === 0) {
      return (
        <tr>
          <td colSpan={getTableHeaders().length} className="px-6 py-8 text-center text-gray-500">
            No data available for the selected filters
          </td>
        </tr>
      );
    }

    switch (formType) {
      case 'Monitoring':
        return formEntries.map(renderMonitoringRow);
      case 'Wellness':
        return formEntries.map(renderWellnessRow);
      case 'Hydration':
        return formEntries.map(renderHydrationRow);
      case 'Recovery':
        return formEntries.map(renderRecoveryRow);
      default:
        return formEntries.map((entry) => (
          <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {formatDate(entry.date)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {entry.player_name || 'Unknown'}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              Form data
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {entry.comments || '-'}
            </td>
          </tr>
        ));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {formType} Form Data {playerName && `- ${playerName}`}
            </h3>
          </div>
          <div className="text-sm text-gray-500">
            {Array.isArray(formEntries) ? formEntries.length : 0} entries
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {getTableHeaders().map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;