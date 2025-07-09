// src/pages/PlayerDashboard/History.tsx

import { useCallback, useEffect, useState } from 'react';

import { supabase } from '../../lib/supabaseClient';

interface Player {
  id: string;
  name: string;
  mobile_number: string;
  username: string;
  email: string;
  date_of_birth: string;
  batch: string;
  batter_type: string;
  player_role: string;
  bowler_type: string;
  is_approved: boolean;
  created_at: string;
}

interface HistoryProps {
  player: Player;
}

interface FormSubmission {
  id: string;
  form_type: 'hydration' | 'monitoring' | 'wellness' | 'recovery';
  date: string;
  created_at: string;
  status: 'completed';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

// interface FormDetails {
//   hydration?: {
//     session_type: string;
//     session_number: number;
//     pre_session_weight: number;
//     post_session_weight: number;
//     liquid_consumed: number;
//     urination_output: number;
//     comments?: string;
//   };
//   monitoring?: {
//     session_number: number;
//     session_type: string;
//     session_duration: number;
//     session_intensity: string;
//     balls_bowled?: number;
//     comments?: string;
//   };
//   wellness?: {
//     sleep_quality: string;
//     physical_readiness: string;
//     mood: string;
//     mental_alertness: string;
//     muscle_soreness: string;
//     menstrual_cycle?: string;
//     comments?: string;
//   };
//   recovery?: {
//     recovery_methods: string[];
//     injury_present: string;
//     comments?: string;
//   };
// }

export default function History({ player }: HistoryProps) {
  // Early return if player is not provided
  if (!player || !player.id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-500">Player information not available</p>
        </div>
      </div>
    );
  }

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState('All Forms');
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    completed: 0,
    averageScore: 0
  });

  const calculateStats = useCallback((submissions: FormSubmission[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeekSubmissions = submissions.filter(sub =>
      new Date(sub.created_at) >= oneWeekAgo
    );

    // Calculate average wellness score (example calculation)
    const wellnessSubmissions = submissions.filter(sub => sub.form_type === 'wellness');
    let totalScore = 0;
    let scoreCount = 0;

    wellnessSubmissions.forEach(sub => {
      if (sub.details) {
        const scores = [
          parseInt(sub.details.sleep_quality) || 0,
          parseInt(sub.details.physical_readiness) || 0,
          parseInt(sub.details.mood) || 0,
          parseInt(sub.details.mental_alertness) || 0,
          parseInt(sub.details.muscle_soreness) || 0
        ];
        totalScore += scores.reduce((a, b) => a + b, 0);
        scoreCount += scores.length;
      }
    });

    const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;

    setStats({
      total: submissions.length,
      thisWeek: thisWeekSubmissions.length,
      completed: submissions.length,
      averageScore: parseFloat(averageScore.toString())
    });
  }, []);

  const fetchSubmissionHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [hydrationResponse, monitoringResponse, wellnessResponse, recoveryResponse] = await Promise.all([
        supabase.from('hydration_forms').select('*').eq('player_id', player.id).order('created_at', { ascending: false }),
        supabase.from('monitoring_forms').select('*').eq('player_id', player.id).order('created_at', { ascending: false }),
        supabase.from('wellness_forms').select('*').eq('player_id', player.id).order('created_at', { ascending: false }),
        supabase.from('recovery_forms').select('*').eq('player_id', player.id).order('created_at', { ascending: false })
      ]);

      if (hydrationResponse.error) throw hydrationResponse.error;
      if (monitoringResponse.error) throw monitoringResponse.error;
      if (wellnessResponse.error) throw wellnessResponse.error;
      if (recoveryResponse.error) throw recoveryResponse.error;

      const allSubmissions: FormSubmission[] = [
        ...(hydrationResponse.data || []).map(item => ({ ...item, form_type: 'hydration', status: 'completed', details: item })),
        ...(monitoringResponse.data || []).map(item => ({ ...item, form_type: 'monitoring', status: 'completed', details: item })),
        ...(wellnessResponse.data || []).map(item => ({ ...item, form_type: 'wellness', status: 'completed', details: item })),
        ...(recoveryResponse.data || []).map(item => ({ ...item, form_type: 'recovery', status: 'completed', details: item }))
      ];

      const sortedSubmissions = allSubmissions.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSubmissions(sortedSubmissions);
      calculateStats(sortedSubmissions);
    } catch (err) {
      console.error('Error fetching submission history:', err);
      setError('Failed to load submission history');
    } finally {
      setLoading(false);
    }
  }, [player.id, calculateStats]);


  useEffect(() => {
  if (player && player.id) {
    fetchSubmissionHistory();
  }
}, [player, fetchSubmissionHistory]);

  const filterSubmissions = useCallback(() => {
    let filtered = [...submissions];

    if (searchTerm) {
      filtered = filtered.filter(sub =>
        getFormDisplayName(sub.form_type).toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.form_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFormType !== 'All Forms') {
      filtered = filtered.filter(sub =>
        getFormDisplayName(sub.form_type) === selectedFormType ||
        sub.form_type === selectedFormType.toLowerCase()
      );
    }

    if (selectedTimeRange !== 'All Time') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (selectedTimeRange) {
        case 'Last 7 Days':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'Last 30 Days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case 'Last 3 Months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(sub => new Date(sub.created_at) >= cutoffDate);
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, selectedFormType, selectedTimeRange]);


  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, selectedFormType, selectedTimeRange, filterSubmissions]);

  const getFormDisplayName = (formType: string) => {
    switch (formType) {
      case 'hydration':
        return 'Hydration';
      case 'monitoring':
        return 'Performance';
      case 'wellness':
        return 'Wellness';
      case 'recovery':
        return 'Recovery';
      default:
        return 'Form';
    }
  };

  const getFormIcon = (formType: string) => {
    const iconClass = "w-6 h-6 text-white";
    const bgClass = formType === 'hydration' ? 'bg-blue-500' :
      formType === 'monitoring' ? 'bg-yellow-500' :
        formType === 'wellness' ? 'bg-red-500' : 'bg-green-500';

    return (
      <div className={`w-8 h-8 ${bgClass} rounded-full flex items-center justify-center`}>
        {formType === 'hydration' && (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        )}
        {formType === 'monitoring' && (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {formType === 'wellness' && (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        )}
        {formType === 'recovery' && (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    );
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    if (timeString) {
      return `${dateStr} ${timeString}`;
    }

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return `${dateStr} ${timeStr}`;
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const renderFormDetails = (submission: FormSubmission) => {
    if (!submission.details) return null;

    const details = submission.details;

    switch (submission.form_type) {
      case 'hydration':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Intake:</label>
                <p className="text-lg font-semibold text-gray-900">{details.liquid_consumed}ml</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Type:</label>
                <p className="text-lg font-semibold text-gray-900">{details.session_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre Weight:</label>
                <p className="text-lg font-semibold text-gray-900">{details.pre_session_weight}kg</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Weight:</label>
                <p className="text-lg font-semibold text-gray-900">{details.post_session_weight}kg</p>
              </div>
            </div>
            {details.comments && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments:</label>
                <p className="text-gray-900">{details.comments}</p>
              </div>
            )}
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Duration:</label>
                <p className="text-lg font-semibold text-gray-900">{details.session_duration} min</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intensity:</label>
                <p className="text-lg font-semibold text-gray-900">{details.session_intensity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Type:</label>
                <p className="text-lg font-semibold text-gray-900">{details.session_type}</p>
              </div>
              {details.balls_bowled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balls Bowled:</label>
                  <p className="text-lg font-semibold text-gray-900">{details.balls_bowled}</p>
                </div>
              )}
            </div>
            {details.comments && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments:</label>
                <p className="text-gray-900">{details.comments}</p>
              </div>
            )}
          </div>
        );

      case 'wellness':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Quality:</label>
                <p className="text-lg font-semibold text-gray-900">{details.sleep_quality}/5</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Physical Readiness:</label>
                <p className="text-lg font-semibold text-gray-900">{details.physical_readiness}/5</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mood:</label>
                <p className="text-lg font-semibold text-gray-900">{details.mood}/5</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mental Alertness:</label>
                <p className="text-lg font-semibold text-gray-900">{details.mental_alertness}/5</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Soreness:</label>
                <p className="text-lg font-semibold text-gray-900">{details.muscle_soreness}/5</p>
              </div>
            </div>
            {details.comments && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments:</label>
                <p className="text-gray-900">{details.comments}</p>
              </div>
            )}
          </div>
        );

      case 'recovery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recovery Methods:</label>
              <div className="flex flex-wrap gap-2">
                {details.recovery_methods?.map((method: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Injury Present:</label>
              <p className="text-lg font-semibold text-gray-900">{details.injury_present}</p>
            </div>
            {details.comments && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments:</label>
                <p className="text-gray-900">{details.comments}</p>
              </div>
            )}
          </div>
        );

      default:
        return <p>No details available</p>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submission History</h1>
          <p className="text-gray-600">View your complete health form submission history</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export History
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Submissions</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-orange-500 mb-1">{stats.thisWeek}</div>
          <div className="text-sm text-gray-500">This Week</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by form type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <select
            value={selectedFormType}
            onChange={(e) => setSelectedFormType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option>All Forms</option>
            <option>Hydration</option>
            <option>Performance</option>
            <option>Wellness</option>
            <option>Recovery</option>
          </select>

          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option>All Time</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>
      </div>


      {/* Form History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Your Form History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No submissions found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFormIcon(submission.form_type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {getFormDisplayName(submission.form_type)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.form_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(submission.date || submission.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(submission)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Details
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSubmissions.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, filteredSubmissions.length)}</span> of{' '}
                  <span className="font-medium">{filteredSubmissions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Your Progress Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              You&rsquo;ve been consistent with form submissions
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Your wellness scores are trending upward
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              Keep up the great work tracking your health!
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
              Consider adding more detailed comments
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Form Details */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFormIcon(selectedSubmission.form_type)}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {getFormDisplayName(selectedSubmission.form_type)} Form Details
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted on {formatDateTime(selectedSubmission.date || selectedSubmission.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {renderFormDetails(selectedSubmission)}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}