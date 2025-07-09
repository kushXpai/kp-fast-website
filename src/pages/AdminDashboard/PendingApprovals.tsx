// src/pages/AdminDashboard/PendingApprovals.tsx

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Player {
    id: string;
    name: string;
    email: string;
    player_role: string;
    batch: string | null;
    created_at: string;
    date_of_birth: string;
    mobile_number: string | null;
    batter_type: string | null;
    bowler_type: string | null;
    username: string;
}

interface PendingApprovalsProps {
    onNavigate: (tabId: string) => void;
}

export default function PendingApprovals({ onNavigate }: PendingApprovalsProps) {
    const [pendingPlayers, setPendingPlayers] = useState<Player[]>([]);
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedBatch, setSelectedBatch] = useState('All Batches');

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
                    mobile_number,
                    batter_type,
                    bowler_type,
                    username
                `)
                .eq('is_approved', false)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setPendingPlayers(data || []);
        } catch (err) {
            console.error('Error fetching pending players:', err);
            setError('Failed to load pending approvals');
        } finally {
            setLoading(false);
        }
    };

    const filterPlayers = useCallback(() => {
        let filtered = pendingPlayers;

        // Search filter - search in name, email, and username
        if (searchTerm) {
            filtered = filtered.filter(player =>
                player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                player.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter (player role)
        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(player => player.player_role === selectedCategory);
        }

        // Batch filter
        if (selectedBatch !== 'All Batches') {
            filtered = filtered.filter(player => player.batch === selectedBatch);
        }

        setFilteredPlayers(filtered);
    }, [pendingPlayers, searchTerm, selectedCategory, selectedBatch]);

    useEffect(() => {
        fetchPendingPlayers();
    }, []);

    useEffect(() => {
        filterPlayers();
    }, [filterPlayers]);

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
            
            console.log('Player approved successfully');
        } catch (err) {
            console.error('Error approving player:', err);
            setError('Failed to approve player');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectPlayer = async (playerId: string) => {
        try {
            setActionLoading(playerId);

            const { error } = await supabase
                .from('players')
                .delete()
                .eq('id', playerId);

            if (error) throw error;

            // Remove the rejected player from the list
            setPendingPlayers(prev => prev.filter(player => player.id !== playerId));
            
            console.log('Player rejected successfully');
        } catch (err) {
            console.error('Error rejecting player:', err);
            setError('Failed to reject player');
        } finally {
            setActionLoading(null);
        }
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
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
            return 'Today';
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
        return batch; // Display the actual batch name as stored
    };

    const getRoleDisplay = (role: string) => {
        return role; // Display the actual role name as stored
    };

    const getCategoryBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'batsman':
                return 'bg-purple-100 text-purple-900 border border-purple-200';
            case 'bowler':
                return 'bg-blue-100 text-blue-900 border border-blue-200';
            case 'allrounder':
                return 'bg-green-100 text-green-900 border border-green-200';
            case 'wicketkeeper':
                return 'bg-yellow-100 text-yellow-900 border border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-900 border border-gray-200';
        }
    };

    const getBatchBadgeColor = (batch: string | null) => {
        if (!batch) return 'bg-gray-100 text-gray-900 border border-gray-200';
        
        switch (batch.toLowerCase()) {
            case 'baroda cricket association':
                return 'bg-orange-100 text-orange-900 border border-orange-200';
            case 'delhi capitals':
                return 'bg-blue-100 text-blue-900 border border-blue-200';
            default:
                return 'bg-gray-100 text-gray-900 border border-gray-200';
        }
    };

    const getPosition = (role: string) => {
        switch (role.toLowerCase()) {
            case 'batsman':
                return 'Batsman';
            case 'bowler':
                return 'Bowler';
            case 'allrounder':
                return 'All-rounder';
            case 'wicketkeeper':
                return 'Wicket Keeper';
            default:
                return 'Player';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="h-10 bg-gray-300 rounded mb-4"></div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Admin Dashboard
                    </button>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Player Approvals</h1>
                            <p className="text-gray-600 mt-1">Review and manage pending player registration requests</p>
                        </div>
                        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            {filteredPlayers.length} Pending
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center mb-4">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
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
                                placeholder="Search by name, email, or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                            />
                        </div>
                        
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        >
                            <option>All Categories</option>
                            <option value="Batsman">Batsman</option>
                            <option value="Bowler">Bowler</option>
                            <option value="Allrounder">All-rounder</option>
                            <option value="Wicketkeeper">Wicket Keeper</option>
                        </select>
                        
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        >
                            <option>All Batches</option>
                            <option value="Baroda Cricket Association">Baroda Cricket Association</option>
                            <option value="Delhi Capitals">Delhi Capitals</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Players List */}
                <div className="space-y-4">
                    {filteredPlayers.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                            <p className="text-gray-600">All players have been reviewed or no players match your filters</p>
                        </div>
                    ) : (
                        filteredPlayers.map((player, index) => (
                            <div key={player.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 ${getRandomColor(index)} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4`}>
                                            {getInitials(player.name)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryBadgeColor(player.player_role)}`}>
                                                    {getRoleDisplay(player.player_role)}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getBatchBadgeColor(player.batch)}`}>
                                                    {getBatchDisplay(player.batch)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-700 space-y-1">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium">Position: <span className="font-normal">{getPosition(player.player_role)}</span></span>
                                                    <span className="font-medium">Username: <span className="font-normal">{player.username}</span></span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center font-medium">
                                                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="font-normal">{player.email}</span>
                                                    </span>
                                                    {player.mobile_number && (
                                                        <span className="flex items-center font-medium">
                                                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <span className="font-normal">{player.mobile_number}</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Submitted {getTimeAgo(player.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleApprovePlayer(player.id)}
                                            disabled={actionLoading === player.id}
                                            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading === player.id ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Approving...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleRejectPlayer(player.id)}
                                            disabled={actionLoading === player.id}
                                            className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 border border-red-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}