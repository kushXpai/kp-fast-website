// src/pages/PlayerDashboard/components/dashboard/RecentSubmissionsCard.tsx

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

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

interface RecentSubmissionsCardProps {
    player: Player;
    onViewFullProfile: () => void;
    onNavigate: (tabId: string) => void; // Add this prop for navigation
}

interface FormSubmission {
    id: string;
    form_type: 'hydration' | 'monitoring' | 'wellness' | 'recovery';
    date: string;
    created_at: string;
    status: 'completed';
}

export default function RecentSubmissionsCard({ player, onNavigate }: RecentSubmissionsCardProps) {
    if (!player || !player.id) {
        return null;
    }
    const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecentSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all form types for the player
            const [hydrationResponse, monitoringResponse, wellnessResponse, recoveryResponse] = await Promise.all([
                supabase
                    .from('hydration_forms')
                    .select('id, date, created_at')
                    .eq('player_id', player.id)
                    .order('created_at', { ascending: false }),
                
                supabase
                    .from('monitoring_forms')
                    .select('id, date, created_at')
                    .eq('player_id', player.id)
                    .order('created_at', { ascending: false }),
                
                supabase
                    .from('wellness_forms')
                    .select('id, date, created_at')
                    .eq('player_id', player.id)
                    .order('created_at', { ascending: false }),
                
                supabase
                    .from('recovery_forms')
                    .select('id, date, created_at')
                    .eq('player_id', player.id)
                    .order('created_at', { ascending: false })
            ]);

            // Check for errors
            if (hydrationResponse.error) throw hydrationResponse.error;
            if (monitoringResponse.error) throw monitoringResponse.error;
            if (wellnessResponse.error) throw wellnessResponse.error;
            if (recoveryResponse.error) throw recoveryResponse.error;

            // Combine all submissions with their form types
            const allSubmissions: FormSubmission[] = [
                ...(hydrationResponse.data || []).map(item => ({
                    id: item.id,
                    form_type: 'hydration' as const,
                    date: item.date,
                    created_at: item.created_at,
                    status: 'completed' as const
                })),
                ...(monitoringResponse.data || []).map(item => ({
                    id: item.id,
                    form_type: 'monitoring' as const,
                    date: item.date,
                    created_at: item.created_at,
                    status: 'completed' as const
                })),
                ...(wellnessResponse.data || []).map(item => ({
                    id: item.id,
                    form_type: 'wellness' as const,
                    date: item.date,
                    created_at: item.created_at,
                    status: 'completed' as const
                })),
                ...(recoveryResponse.data || []).map(item => ({
                    id: item.id,
                    form_type: 'recovery' as const,
                    date: item.date,
                    created_at: item.created_at,
                    status: 'completed' as const
                }))
            ];

            // Sort by created_at and get the latest 4
            const sortedSubmissions = allSubmissions
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 4);

            setSubmissions(sortedSubmissions);
        } catch (err) {
            console.error('Error fetching recent submissions:', err);
            setError('Failed to load recent submissions');
        } finally {
            setLoading(false);
        }
    }, [player.id]);

    useEffect(() => {
        fetchRecentSubmissions();
    }, [player.id, fetchRecentSubmissions]);

    const getFormDisplayName = (formType: string) => {
        switch (formType) {
            case 'hydration':
                return 'Hydration Tracking';
            case 'monitoring':
                return 'Performance Monitoring';
            case 'wellness':
                return 'Wellness Check';
            case 'recovery':
                return 'Recovery Status';
            default:
                return 'Form Submission';
        }
    };

    const getFormIcon = (formType: string) => {
        switch (formType) {
            case 'hydration':
                return (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                );
            case 'monitoring':
                return (
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'wellness':
                return (
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                );
            case 'recovery':
                return (
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                );
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInDays === 0) {
            return `Today, ${date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            })}`;
        } else if (diffInDays === 1) {
            return `Yesterday, ${date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            })}`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
    };

    const handleViewAll = () => {
        onNavigate('history');
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
                </div>
                <div className="text-center py-8">
                    <div className="text-red-500 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500">{error}</p>
                    <button 
                        onClick={fetchRecentSubmissions}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
            </div>
            
            {submissions.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500">No form submissions yet</p>
                    <p className="text-xs text-gray-400 mt-1">Your recent form submissions will appear here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {submissions.map((submission) => (
                        <div key={`${submission.form_type}-${submission.id}`} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center">
                                    {getFormIcon(submission.form_type)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {getFormDisplayName(submission.form_type)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDateTime(submission.created_at)}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                {submission.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {submissions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button 
                        onClick={handleViewAll}
                        className="w-full text-sm text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        View Complete History →
                    </button>
                </div>
            )}
        </div>
    );
}