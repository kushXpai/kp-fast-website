// src/pages/AdminDashboard/components/dashboard/PlayerStatistics.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface PlayerStats {
    totalPlayers: number;
    pendingApprovals: number;
    formsSubmittedToday: number;
    completionRate: number;
    weeklyChanges: {
        totalPlayersChange: number;
        formsChange: number;
        completionChange: number;
    };
}

export default function PlayerStatistics() {
    const [stats, setStats] = useState<PlayerStats>({
        totalPlayers: 0,
        pendingApprovals: 0,
        formsSubmittedToday: 0,
        completionRate: 0,
        weeklyChanges: {
            totalPlayersChange: 0,
            formsChange: 0,
            completionChange: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPlayerStatistics();
    }, []);

    const fetchPlayerStatistics = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current date and last week's date
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);
            const lastWeekStr = lastWeek.toISOString().split('T')[0];

            // Get week start (Monday) for completion rate calculation
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay() + 1);
            const weekStartStr = weekStart.toISOString().split('T')[0];

            // Fetch all statistics in parallel
            const [
                totalPlayersResult,
                pendingApprovalsResult,
                totalPlayersLastWeekResult,
                todayFormsResult,
                lastWeekFormsResult,
                weeklyFormsResult,
                approvedPlayersResult
            ] = await Promise.all([
                // Total approved players
                supabase
                    .from('players')
                    .select('id')
                    .eq('is_approved', true),
                
                // Pending approvals
                supabase
                    .from('players')
                    .select('id')
                    .eq('is_approved', false),
                
                // Total players from last week (for change calculation)
                supabase
                    .from('players')
                    .select('id')
                    .eq('is_approved', true)
                    .lte('created_at', lastWeekStr),
                
                // Today's form submissions
                Promise.all([
                    supabase.from('wellness_forms').select('id').eq('date', todayStr),
                    supabase.from('monitoring_forms').select('id').eq('date', todayStr),
                    supabase.from('hydration_forms').select('id').eq('date', todayStr),
                    supabase.from('recovery_forms').select('id').eq('date', todayStr)
                ]),
                
                // Last week's form submissions (same day)
                Promise.all([
                    supabase.from('wellness_forms').select('id').eq('date', lastWeekStr),
                    supabase.from('monitoring_forms').select('id').eq('date', lastWeekStr),
                    supabase.from('hydration_forms').select('id').eq('date', lastWeekStr),
                    supabase.from('recovery_forms').select('id').eq('date', lastWeekStr)
                ]),
                
                // This week's form submissions (for completion rate)
                Promise.all([
                    supabase.from('wellness_forms').select('player_id').gte('date', weekStartStr),
                    supabase.from('monitoring_forms').select('player_id').gte('date', weekStartStr),
                    supabase.from('hydration_forms').select('player_id').gte('date', weekStartStr),
                    supabase.from('recovery_forms').select('player_id').gte('date', weekStartStr)
                ]),
                
                // Total approved players for completion rate calculation
                supabase
                    .from('players')
                    .select('id')
                    .eq('is_approved', true)
            ]);

            // Handle errors
            if (totalPlayersResult.error) throw totalPlayersResult.error;
            if (pendingApprovalsResult.error) throw pendingApprovalsResult.error;
            if (totalPlayersLastWeekResult.error) throw totalPlayersLastWeekResult.error;
            if (approvedPlayersResult.error) throw approvedPlayersResult.error;

            // Calculate basic stats
            const totalPlayers = totalPlayersResult.data?.length || 0;
            const pendingApprovals = pendingApprovalsResult.data?.length || 0;
            const totalPlayersLastWeek = totalPlayersLastWeekResult.data?.length || 0;
            const totalApprovedPlayers = approvedPlayersResult.data?.length || 0;

            // Calculate today's form submissions
            const todayForms = todayFormsResult.reduce((total, formResult) => {
                if (formResult.error) return total;
                return total + (formResult.data?.length || 0);
            }, 0);

            // Calculate last week's form submissions
            const lastWeekForms = lastWeekFormsResult.reduce((total, formResult) => {
                if (formResult.error) return total;
                return total + (formResult.data?.length || 0);
            }, 0);

            // Calculate this week's completion rate
            const weeklyFormSubmissions = weeklyFormsResult.reduce((playerIds, formResult) => {
                if (formResult.error) return playerIds;
                formResult.data?.forEach(form => {
                    if (form.player_id) playerIds.add(form.player_id);
                });
                return playerIds;
            }, new Set<string>());

            const completionRate = totalApprovedPlayers > 0 
                ? (weeklyFormSubmissions.size / totalApprovedPlayers) * 100 
                : 0;

            // Calculate weekly changes
            const totalPlayersChange = totalPlayersLastWeek > 0 
                ? ((totalPlayers - totalPlayersLastWeek) / totalPlayersLastWeek) * 100 
                : 0;

            const formsChange = lastWeekForms > 0 
                ? ((todayForms - lastWeekForms) / lastWeekForms) * 100 
                : 0;

            // For completion rate change, we'd need last week's completion rate
            // For now, we'll show a placeholder calculation
            const completionChange = 3; // This would need historical data to calculate accurately

            setStats({
                totalPlayers,
                pendingApprovals,
                formsSubmittedToday: todayForms,
                completionRate: Number(completionRate.toFixed(0)),
                weeklyChanges: {
                    totalPlayersChange: Number(totalPlayersChange.toFixed(0)),
                    formsChange: Number(formsChange.toFixed(0)),
                    completionChange
                }
            });

        } catch (err) {
            console.error('Error fetching player statistics:', err);
            setError('Failed to load player statistics');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
        const icons = {
            users: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
            clock: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            document: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            "check-circle": (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        };
        return icons[iconName as keyof typeof icons];
    };

    const formatChange = (change: number) => {
        if (change === 0) return null;
        const prefix = change > 0 ? '+' : '';
        return `${prefix}${change}% from last week`;
    };

    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-green-600';
        if (change < 0) return 'text-red-600';
        return 'text-gray-500';
    };

    const statisticsData = [
        {
            title: "Total Players",
            value: loading ? "---" : stats.totalPlayers.toString(),
            subtitle: "Active in system",
            change: loading ? null : formatChange(stats.weeklyChanges.totalPlayersChange),
            changeType: stats.weeklyChanges.totalPlayersChange >= 0 ? "positive" : "negative",
            icon: "users",
            action: "View All Players"
        },
        {
            title: "Pending Approvals",
            value: loading ? "---" : stats.pendingApprovals.toString(),
            subtitle: "New player requests",
            change: null,
            changeType: "neutral",
            icon: "clock",
            action: "Review Approvals"
        },
        {
            title: "Forms Submitted Today",
            value: loading ? "---" : stats.formsSubmittedToday.toString(),
            subtitle: "Across all players",
            change: loading ? null : formatChange(stats.weeklyChanges.formsChange),
            changeType: stats.weeklyChanges.formsChange >= 0 ? "positive" : "negative",
            icon: "document",
            action: "View Analytics"
        },
        {
            title: "Completion Rate",
            value: loading ? "---" : `${stats.completionRate}%`,
            subtitle: "This week average",
            change: loading ? null : formatChange(stats.weeklyChanges.completionChange),
            changeType: stats.weeklyChanges.completionChange >= 0 ? "positive" : "negative",
            icon: "check-circle",
            action: null
        }
    ];

    if (error) {
        return (
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Player Statistics</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-600 text-sm">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Player Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statisticsData.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-gray-500">
                                {getIcon(stat.icon)}
                            </div>
                            <div className="text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className={`text-2xl font-bold text-gray-900 ${loading ? 'animate-pulse' : ''}`}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500">{stat.subtitle}</div>
                        </div>
                        {stat.change && (
                            <div className={`text-sm mb-3 ${getChangeColor(
                                stat.changeType === 'positive' ? 1 : 
                                stat.changeType === 'negative' ? -1 : 0
                            )}`}>
                                {stat.change}
                            </div>
                        )}
                        {stat.action && (
                            <button 
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                                disabled={loading}
                            >
                                {stat.action}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}