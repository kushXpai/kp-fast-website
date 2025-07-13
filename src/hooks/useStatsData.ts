import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface StatsData {
  totalTeams: number;
  totalPlayers: number;
  formEntries: number;
  formTypes: number;
}

export const useStatsData = () => {
  const [stats, setStats] = useState<StatsData>({
    totalTeams: 0,
    totalPlayers: 0,
    formEntries: 0,
    formTypes: 0
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
        console.log('Players count:', playersCount);

        // Fetch unique teams count
        const { data: teamsData, error: teamsError } = await supabase
          .from('players')
          .select('batch')
          .eq('is_approved', true);
        if (teamsError) throw teamsError;
        const uniqueTeams = Array.from(new Set(teamsData?.map(p => p.batch).filter(Boolean)));
        console.log('Unique teams:', uniqueTeams);

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
        console.log('Form entries counts:', {
          hydration: hydrationCount,
          monitoring: monitoringCount,
          wellness: wellnessCount,
          recovery: recoveryCount,
          total: totalFormEntries
        });

        // Fetch form types (simulating dynamic fetch; adjust based on your schema)
        const formTypes = ['Monitoring', 'Wellness', 'Hydration', 'Recovery'];
        console.log('Form types:', formTypes);

        setStats({
          totalTeams: uniqueTeams.length,
          totalPlayers: playersCount || 0,
          formEntries: totalFormEntries,
          formTypes: formTypes.length
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