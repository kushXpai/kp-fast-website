// src/pages/AdminDashboard/components/dashboard/OverviewSection.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface OverviewStats {
    formSubmissions: number;
    avgWellnessScore: number;
    activePlayers: number;
}

interface FormData {
    id: string;
    player_id?: string;
}

interface WellnessFormData {
    sleep_quality: string;
    physical_readiness: string;
    mood: string;
    mental_alertness: string;
    muscle_soreness: string;
}

export default function OverviewSection() {
    const [stats, setStats] = useState<OverviewStats>({
        formSubmissions: 0,
        avgWellnessScore: 0,
        activePlayers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOverviewStats();
    }, []);

    const fetchOverviewStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];

            // Fetch form submissions for today (wellness + monitoring + hydration + recovery)
            const [wellnessResult, monitoringResult, hydrationResult, recoveryResult] = await Promise.all([
                supabase
                    .from('wellness_forms')
                    .select('id')
                    .eq('date', today),
                supabase
                    .from('monitoring_forms')
                    .select('id')
                    .eq('date', today),
                supabase
                    .from('hydration_forms')
                    .select('id')
                    .eq('date', today),
                supabase
                    .from('recovery_forms')
                    .select('id')
                    .eq('date', today)
            ]);

            if (wellnessResult.error) throw wellnessResult.error;
            if (monitoringResult.error) throw monitoringResult.error;
            if (hydrationResult.error) throw hydrationResult.error;
            if (recoveryResult.error) throw recoveryResult.error;

            const totalSubmissions = 
                (wellnessResult.data?.length || 0) +
                (monitoringResult.data?.length || 0) +
                (hydrationResult.data?.length || 0) +
                (recoveryResult.data?.length || 0);

            // Calculate average wellness score for today
            const { data: wellnessData, error: wellnessError } = await supabase
                .from('wellness_forms')
                .select('sleep_quality, physical_readiness, mood, mental_alertness, muscle_soreness')
                .eq('date', today);

            if (wellnessError) throw wellnessError;

            let avgWellnessScore = 0;
            if (wellnessData && wellnessData.length > 0) {
                const totalScores = wellnessData.reduce((acc, form) => {
                    const wellnessForm = form as WellnessFormData;
                    return acc + 
                        parseInt(wellnessForm.sleep_quality) +
                        parseInt(wellnessForm.physical_readiness) +
                        parseInt(wellnessForm.mood) +
                        parseInt(wellnessForm.mental_alertness) +
                        parseInt(wellnessForm.muscle_soreness);
                }, 0);
                avgWellnessScore = totalScores / (wellnessData.length * 5); // 5 categories per form
            }

            // Get active players (players who submitted any form today)
            const { data: activePlayersData, error: activePlayersError } = await supabase
                .rpc('get_active_players_today');

            // If the RPC doesn't exist, we'll calculate it differently
            if (activePlayersError) {
                // Alternative approach: get unique player IDs from today's form submissions
                const uniquePlayerIds = new Set([
                    ...(wellnessResult.data?.map((form: FormData) => form.player_id).filter(Boolean) || []),
                    ...(monitoringResult.data?.map((form: FormData) => form.player_id).filter(Boolean) || []),
                    ...(hydrationResult.data?.map((form: FormData) => form.player_id).filter(Boolean) || []),
                    ...(recoveryResult.data?.map((form: FormData) => form.player_id).filter(Boolean) || [])
                ]);

                setStats({
                    formSubmissions: totalSubmissions,
                    avgWellnessScore: Number(avgWellnessScore.toFixed(1)),
                    activePlayers: uniquePlayerIds.size
                });
            } else {
                setStats({
                    formSubmissions: totalSubmissions,
                    avgWellnessScore: Number(avgWellnessScore.toFixed(1)),
                    activePlayers: activePlayersData || 0
                });
            }

        } catch (err) {
            console.error('Error fetching overview stats:', err);
            setError('Failed to load overview statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-green-800 to-blue-900 rounded-xl p-4 md:p-6 mb-6">
                <h2 className="text-white text-lg font-semibold mb-4">Today&rsquo;s Overview</h2>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 text-center">
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1 animate-pulse">
                                ---
                            </div>
                            <div className="text-blue-200 text-sm">Loading...</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-4 md:p-6 mb-6">
                <h2 className="text-white text-lg font-semibold mb-4">Today&rsquo;s Overview</h2>
                <div className="text-red-200 text-sm text-center">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-green-800 to-blue-900 rounded-xl p-4 md:p-6 mb-6">
            <h2 className="text-white text-lg font-semibold mb-4">Today&rsquo;s Overview</h2>

            {/* Use responsive grid layout */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
                <div className="p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {stats.formSubmissions}
                    </div>
                    <div className="text-blue-200 text-sm">Form Submissions</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {stats.avgWellnessScore || '---'}
                    </div>
                    <div className="text-blue-200 text-sm">Avg Wellness Score</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {stats.activePlayers}
                    </div>
                    <div className="text-blue-200 text-sm">Active Players</div>
                </div>
            </div>
        </div>
    );
}