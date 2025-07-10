// src/pages/AdminDashboard/Analysis.tsx

import React, { useState, useEffect } from 'react';
import { Calendar, Download } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import StatsCards from './components/analysis/StatsCards';
import FiltersSection from './components/analysis/FiltersSection';
import DataTable from './components/analysis/DataTable';

interface Player {
  id: string;
  name: string;
  batch: string;
  email: string;
  player_role: string;
}

interface FormEntry {
  id: string;
  date: string;
  player_id: string;
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

const Analysis: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [formEntries, setFormEntries] = useState<FormEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedFormType, setSelectedFormType] = useState('');
  const [dateRange, setDateRange] = useState('');

  // Stats for the cards
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalPlayers: 0,
    formEntries: 0,
    formTypes: 4
  });

  const teams = ['Baroda Cricket Association', 'Delhi Capitals'];
  const formTypes = ['Monitoring', 'Wellness', 'Hydration', 'Recovery'];

  // Fetch players data
  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id, name, batch, email, player_role')
        .eq('is_approved', true);

      if (error) throw error;
      
      console.log('Fetched players:', data);
      setPlayers(data || []);
      
      // Update stats
      const uniqueTeams = new Set(data?.map(p => p.batch).filter(Boolean));
      setStats(prev => ({
        ...prev,
        totalTeams: uniqueTeams.size,
        totalPlayers: data?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  // Fetch form entries based on selected form type
  const fetchFormEntries = async () => {
    // Don't fetch if no form type is selected
    if (!selectedFormType) {
      setFormEntries([]);
      return;
    }

    setLoading(true);
    try {
      let tableName = '';
      let selectFields = '';
      
      // Determine which table to query and what fields to select based on form type
      switch (selectedFormType) {
        case 'Monitoring':
          tableName = 'monitoring_forms';
          selectFields = 'id, date, player_id, session_number, session_type, session_duration, session_intensity, balls_bowled, comments';
          break;
        case 'Wellness':
          tableName = 'wellness_forms';
          selectFields = 'id, date, player_id, sleep_quality, physical_readiness, mood, mental_alertness, muscle_soreness, menstrual_cycle, comments';
          break;
        case 'Hydration':
          tableName = 'hydration_forms';
          selectFields = 'id, date, player_id, session_type, session_number, pre_session_weight, post_session_weight, liquid_consumed, urination_output, comments';
          break;
        case 'Recovery':
          tableName = 'recovery_forms';
          selectFields = 'id, date, player_id, recovery_methods, injury_present, comments';
          break;
        default:
          setFormEntries([]);
          return;
      }

      let queryBuilder = supabase.from(tableName).select(selectFields);

      // Filter by player if selected
      if (selectedPlayer) {
        const selectedPlayerObj = players.find(p => p.name === selectedPlayer);
        if (selectedPlayerObj) {
          queryBuilder = queryBuilder.eq('player_id', selectedPlayerObj.id);
        }
      }

      // Filter by team (batch) if selected but no specific player
      if (selectedTeam && !selectedPlayer) {
        const teamPlayers = players.filter(p => p.batch === selectedTeam);
        const playerIds = teamPlayers.map(p => p.id);
        if (playerIds.length > 0) {
          queryBuilder = queryBuilder.in('player_id', playerIds);
        } else {
          // If no players found for the team, return empty results
          setFormEntries([]);
          setStats(prev => ({ ...prev, formEntries: 0 }));
          return;
        }
      }

      // Add date range filter if selected
      if (dateRange) {
        const now = new Date();
        let startDate = new Date();
        
        switch (dateRange) {
          case 'last7days':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'last30days':
            startDate.setDate(now.getDate() - 30);
            break;
          case 'last90days':
            startDate.setDate(now.getDate() - 90);
            break;
          case 'lastYear':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            startDate = new Date(0); // No filter
        }
        
        if (dateRange !== 'all') {
          queryBuilder = queryBuilder.gte('date', startDate.toISOString().split('T')[0]);
        }
      }

      // Order by date descending
      queryBuilder = queryBuilder.order('date', { ascending: false });

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);
      console.log('Available players for mapping:', players);

      // Add player names to the entries
      const entriesWithPlayerNames = (data as unknown as FormEntry[])?.map(entry => {
        const player = players.find(p => p.id === entry.player_id);
        console.log(`Mapping player_id ${entry.player_id} to player:`, player);
        return {
          ...entry,
          player_name: player?.name || 'Unknown Player',
          // Normalize field names for recovery forms
          injury_status: entry.injury_present || entry.injury_status
        };
      }) || [];

      console.log('Processed entries:', entriesWithPlayerNames);

      setFormEntries(entriesWithPlayerNames);
      
      // Update form entries count in stats
      setStats(prev => ({
        ...prev,
        formEntries: entriesWithPlayerNames.length
      }));

    } catch (error) {
      console.error('Error fetching form entries:', error);
      setFormEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Export data to CSV
  const exportToCSV = () => {
    if (formEntries.length === 0) return;

    const headers = getCSVHeaders();
    const csvContent = [
      headers.join(','),
      ...formEntries.map(entry => headers.map(header => {
        const fieldKey = header.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
        let value = entry[fieldKey as keyof FormEntry];
        
        // Handle arrays (like recovery_methods)
        if (Array.isArray(value)) {
          value = value.join('; ');
        }
        
        return typeof value === 'string' ? `"${value}"` : value || '';
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFormType}_form_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCSVHeaders = () => {
    switch (selectedFormType) {
      case 'Monitoring':
        return ['Date', 'Player Name', 'Session Number', 'Session Type', 'Session Duration', 'Session Intensity', 'Balls Bowled', 'Comments'];
      case 'Wellness':
        return ['Date', 'Player Name', 'Sleep Quality', 'Physical Readiness', 'Mood', 'Mental Alertness', 'Muscle Soreness', 'Menstrual Cycle', 'Comments'];
      case 'Hydration':
        return ['Date', 'Player Name', 'Session Type', 'Session Number', 'Pre Session Weight', 'Post Session Weight', 'Liquid Consumed', 'Urination Output', 'Comments'];
      case 'Recovery':
        return ['Date', 'Player Name', 'Recovery Methods', 'Injury Present', 'Comments'];
      default:
        return [];
    }
  };

  // Handle filter changes
  const handleTeamChange = (team: string) => {
    setSelectedTeam(team);
    setSelectedPlayer(''); // Clear player selection when team changes
  };

  const handlePlayerChange = (player: string) => {
    setSelectedPlayer(player);
  };

  const handleFormTypeChange = (formType: string) => {
    setSelectedFormType(formType);
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  // Initial data fetch
  useEffect(() => {
    fetchPlayers();
  }, []);

  // Fetch form entries when filters change
  useEffect(() => {
    if (players.length > 0) {
      fetchFormEntries();
    }
  }, [players, selectedTeam, selectedPlayer, selectedFormType, dateRange, fetchFormEntries]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Form Analytics</h1>
              <p className="text-gray-600 mt-1">View player form submissions by team, player, and form type</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Time</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="lastYear">Last Year</option>
                </select>
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={exportToCSV}
                disabled={formEntries.length === 0}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards/>

        {/* Filters Section */}
        <FiltersSection
          teams={teams}
          players={players}
          formTypes={formTypes}
          selectedTeam={selectedTeam}
          selectedPlayer={selectedPlayer}
          selectedFormType={selectedFormType}
          onTeamChange={handleTeamChange}
          onPlayerChange={handlePlayerChange}
          onFormTypeChange={handleFormTypeChange}
        />

        {/* Data Table - Only show if form type is selected */}
        {selectedFormType && (
          <DataTable
            formEntries={formEntries}
            formType={selectedFormType}
            playerName={selectedPlayer}
            loading={loading}
          />
        )}

        {/* Show message when no form type is selected */}
        {!selectedFormType && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Form Type</h3>
              <p>Please select a form type to view the data table with entries.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;