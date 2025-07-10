// src/pages/AdminDashboard/components/analysis/useStatsData.ts

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface StatsData {
  totalTeams: number;
  totalPlayers: number;
  formEntries: number;
  formTypes: number;
}

export const useStatsData = () => {
  const [stats, setStats] = useState<StatsData>({
    totalTeams: 2, // Static as requested
    totalPlayers: 0,
    formEntries: 0,
    formTypes: 4 // Static as requested
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch total players count
        const { count: playersCount, error: playersError } = await supabase
          .from('players')
          .select('*', { count: 'exact', head: true });

        if (playersError) throw playersError;

        // Fetch total form entries count from all form tables
        const [
          { count: hydrationCount, error: hydrationError },
          { count: monitoringCount, error: monitoringError },
          { count: wellnessCount, error: wellnessError },
          { count: recoveryCount, error: recoveryError }
        ] = await Promise.all([
          supabase.from('hydration_forms').select('*', { count: 'exact', head: true }),
          supabase.from('monitoring_forms').select('*', { count: 'exact', head: true }),
          supabase.from('wellness_forms').select('*', { count: 'exact', head: true }),
          supabase.from('recovery_forms').select('*', { count: 'exact', head: true })
        ]);

        if (hydrationError || monitoringError || wellnessError || recoveryError) {
          throw new Error('Error fetching form counts');
        }

        const totalFormEntries = (hydrationCount || 0) + (monitoringCount || 0) + (wellnessCount || 0) + (recoveryCount || 0);

        setStats({
          totalTeams: 2, // Static
          totalPlayers: playersCount || 0,
          formEntries: totalFormEntries,
          formTypes: 4 // Static
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};