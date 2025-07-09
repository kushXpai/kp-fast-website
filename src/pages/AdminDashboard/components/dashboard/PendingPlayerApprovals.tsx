// src/pages/AdminDashboard/components/dashboard/PendingPlayerApprovals.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface PendingPlayer {
    id: string;
    name: string;
    email: string;
    player_role: string;
    batch: string | null;
    created_at: string;
    date_of_birth: string;
    mobile_number: string | null;
}

interface PendingPlayerApprovalsProps {
    onNavigate?: (tabId: string) => void;
}

export default function PendingPlayerApprovals({ onNavigate }: PendingPlayerApprovalsProps) {
    const [pendingPlayers, setPendingPlayers] = useState<PendingPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingPlayers();
    }, []);

    const fetchPendingPlayers = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('players')
                .select(`
                    id,
                    name,
                    email,
                    player_role,
                    batch,
                    created_at,
                    date_of_birth,
                    mobile_number
                `)
                .eq('is_approved', false)
                .order('created_at', { ascending: false })
                .limit(5); // Show only the 5 most recent

            if (error) throw error;

            setPendingPlayers(data || []);
        } catch (err) {
            console.error('Error fetching pending players:', err);
            setError('Failed to load pending approvals');
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePlayer = async (playerId: string) => {
        try {
            setActionLoading(playerId);

            const { error } = await supabase
                .from('players')
                .update({ is_approved: true })
                .eq('id', playerId);

            if (error) throw error;

            // Remove the approved player from the list
            setPendingPlayers(prev => prev.filter(player => player.id !== playerId));
            
            // Show success message (you can implement toast notifications here)
            console.log('Player approved successfully');
        } catch (err) {
            console.error('Error approving player:', err);
            // Show error message (you can implement toast notifications here)
        } finally {
            setActionLoading(null);
        }
    };

    const handleReviewPlayer = (playerId: string) => {
        console.log('Review player:', playerId);
    };


    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    };

    const getRandomColor = (index: number) => {
        const colors = [
            'bg-blue-600',
            'bg-green-600',
            'bg-purple-600',
            'bg-red-600',
            'bg-yellow-600',
            'bg-indigo-600',
            'bg-pink-600',
            'bg-teal-600'
        ];
        return colors[index % colors.length];
    };

    const getBatchDisplay = (batch: string | null) => {
        if (!batch) return 'No batch';
        return batch.replace('_', ' ').toUpperCase();
    };

    const getRoleDisplay = (role: string) => {
        return role.replace('_', ' ');
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="text-orange-500 mr-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Pending Player Approvals</h3>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
                        Loading...
                    </span>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                <div className="ml-3">
                                    <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-6 bg-gray-300 rounded w-16"></div>
                                <div className="h-6 bg-gray-300 rounded w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="text-red-500 mr-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Pending Player Approvals</h3>
                    </div>
                </div>
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="text-orange-500 mr-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Pending Player Approvals</h3>
                </div>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {pendingPlayers.length} pending
                </span>
            </div>

            {pendingPlayers.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No pending approvals</p>
                    <p className="text-gray-400 text-xs mt-1">All players have been reviewed</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingPlayers.map((player, index) => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className={`w-10 h-10 ${getRandomColor(index)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                                    {getInitials(player.name)}
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{player.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {getRoleDisplay(player.player_role)} • {getBatchDisplay(player.batch)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        • Submitted {getTimeAgo(player.created_at)}
                                    </div>
                                    {player.mobile_number && (
                                        <div className="text-xs text-gray-400">
                                            • {player.mobile_number}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleApprovePlayer(player.id)}
                                    disabled={actionLoading === player.id}
                                    className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    {actionLoading === player.id ? (
                                        <>
                                            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Approving...
                                        </>
                                    ) : (
                                        'Approve'
                                    )}
                                </button>
                                <button 
                                    onClick={() => handleReviewPlayer(player.id)}
                                    disabled={actionLoading === player.id}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}