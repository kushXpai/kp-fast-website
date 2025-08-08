/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/AdminDashboard/Analysis.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
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
  sleep_quality?: string;
  physical_readiness?: string;
  mood?: string;
  mental_alertness?: string;
  muscle_soreness?: string;
  menstrual_cycle?: string;
  pre_session_weight?: number;
  post_session_weight?: number;
  liquid_consumed?: number;
  urination_output?: number;
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
  const [selectedDate, setSelectedDate] = useState('');
  const [teams, setTeams] = useState<string[]>([]);
  const [formTypes, setFormTypes] = useState<string[]>([]);

  // Stats for the cards
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalPlayers: 0,
    formEntries: 0,
    formTypes: 0
  });

  // Fetch teams dynamically
  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('batch')
        .eq('is_approved', true);
      if (error) throw error;
      const uniqueTeams = Array.from(new Set(data?.map(p => p.batch).filter(Boolean)));
      console.log('Fetched teams:', uniqueTeams);
      setTeams(uniqueTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Fetch form types
  const fetchFormTypes = async () => {
    const types = ['Monitoring', 'Wellness', 'Hydration', 'Recovery'];
    console.log('Fetched form types:', types);
    setFormTypes(types);
    setStats(prev => ({ ...prev, formTypes: types.length }));
  };

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
  const fetchFormEntries = useCallback(async () => {
    if (!selectedFormType) {
      console.log('No form type selected, skipping fetch');
      setFormEntries([]);
      return;
    }

    setLoading(true);
    try {
      let tableName = '';
      let selectFields = '';
      
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
          console.warn('Invalid form type:', selectedFormType);
          setFormEntries([]);
          return;
      }

      let queryBuilder = supabase.from(tableName).select(selectFields);

      if (selectedPlayer) {
        const selectedPlayerObj = players.find(p => p.name === selectedPlayer);
        if (selectedPlayerObj) {
          console.log('Filtering by player_id:', selectedPlayerObj.id);
          queryBuilder = queryBuilder.eq('player_id', selectedPlayerObj.id);
        } else {
          console.warn('Selected player not found:', selectedPlayer);
        }
      }

      if (selectedTeam && !selectedPlayer) {
        const teamPlayers = players.filter(p => String(p.batch) === String(selectedTeam));
        const playerIds = teamPlayers.map(p => p.id);
        console.log('Team players:', teamPlayers);
        console.log('Player IDs for team:', playerIds);
        if (playerIds.length > 0) {
          queryBuilder = queryBuilder.in('player_id', playerIds);
        } else {
          console.warn(`No players found for team: ${selectedTeam}`);
          setFormEntries([]);
          setStats(prev => ({ ...prev, formEntries: 0 }));
          return;
        }
      }

      if (selectedDate) {
        console.log('Filtering by specific date:', selectedDate);
        queryBuilder = queryBuilder.eq('date', selectedDate);
      }

      queryBuilder = queryBuilder.order('date', { ascending: false });

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);
      console.log('Available players for mapping:', players);

      const entriesWithPlayerNames = (data as unknown as FormEntry[])?.map(entry => {
        const player = players.find(p => p.id === entry.player_id);
        console.log(`Mapping player_id ${entry.player_id} to player:`, player);
        return {
          ...entry,
          player_name: player?.name || 'Unknown Player',
          injury_status: entry.injury_present || entry.injury_status
        };
      }) || [];

      console.log('Processed entries:', entriesWithPlayerNames);

      setFormEntries(entriesWithPlayerNames);
      
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
  }, [selectedFormType, selectedPlayer, selectedTeam, selectedDate, players]);

  // Helper function to get background colors for different values
  const getBadgeColor = (value: string | number, type: string): string => {
    switch (type) {
      case 'session_type':
        switch (value) {
          case 'Match': return '#DC2626'; // red-600
          case 'Training': return '#2563EB'; // blue-600
          case 'Gym': return '#059669'; // emerald-600
          case 'Conditioning': return '#7C3AED'; // violet-600
          default: return '#6B7280'; // gray-500
        }
      case 'session_intensity':
        const intensity = parseInt(value as string) || 0;
        if (intensity >= 8) return '#DC2626'; // High intensity - red
        if (intensity >= 6) return '#D97706'; // Medium intensity - amber
        return '#059669'; // Low intensity - emerald
      case 'wellness_score':
        const score = parseInt(value as string) || 3;
        if (score >= 4) return '#059669'; // Good - emerald
        if (score >= 3) return '#D97706'; // Average - amber
        return '#DC2626'; // Poor - red
      case 'muscle_soreness':
        const soreness = parseInt(value as string) || 3;
        if (soreness <= 2) return '#059669'; // Low soreness - emerald
        if (soreness <= 3) return '#D97706'; // Medium soreness - amber
        return '#DC2626'; // High soreness - red
      case 'menstrual_cycle':
        return value === 'Yes' ? '#EC4899' : '#6B7280'; // Pink for Yes, gray for No
      case 'injury_status':
        return (value === 'Yes' || value === 'Present') ? '#DC2626' : '#059669'; // Red for injury, emerald for no injury
      case 'session_number':
        return '#2563EB'; // blue-600
      default:
        return '#6B7280'; // gray-500
    }
  };

  // Generate filename based on filters
  const generateFilename = (): string => {
    const today = new Date();
    const dateStr = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : today.toISOString().split('T')[0];
    
    if (selectedPlayer) {
      return `${selectedPlayer.replace(/\s+/g, '_')}_${dateStr}_${selectedFormType}`;
    } else if (selectedTeam) {
      return `${selectedTeam.replace(/\s+/g, '_')}_${dateStr}_${selectedFormType}`;
    } else {
      return `All_Teams_${dateStr}_${selectedFormType}`;
    }
  };

  // Load jsPDF library dynamically
  const loadJsPDF = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).jsPDF) {
        resolve((window as any).jsPDF);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        if ((window as any).jspdf) {
          resolve((window as any).jspdf.jsPDF);
        } else {
          reject(new Error('jsPDF failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load jsPDF'));
      document.head.appendChild(script);
    });
  };

  // Export data to PDF with direct download
  const exportToPDF = async () => {
    if (formEntries.length === 0) return;

    try {
      const filename = generateFilename();
      
      // Load jsPDF
      const jsPDF = await loadJsPDF();
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Set up styling
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - (margin * 2);
      
      let yPosition = margin + 10;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`${selectedFormType} Form Data`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 15;

      // Table headers
      const headers = getTableHeaders();
      const colWidth = usableWidth / headers.length;
      
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, yPosition - 5, usableWidth, 8, 'F');
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      headers.forEach((header, index) => {
        doc.text(header, margin + (index * colWidth) + 2, yPosition, { maxWidth: colWidth - 4 });
      });
      
      yPosition += 10;

      // Table rows
      doc.setFont('helvetica', 'normal');
      let rowCount = 0;
      
      formEntries.forEach((entry, entryIndex) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin + 10;
          
          // Repeat headers on new page
          doc.setFillColor(249, 250, 251);
          doc.rect(margin, yPosition - 5, usableWidth, 8, 'F');
          doc.setFont('helvetica', 'bold');
          headers.forEach((header, index) => {
            doc.text(header, margin + (index * colWidth) + 2, yPosition, { maxWidth: colWidth - 4 });
          });
          yPosition += 10;
          doc.setFont('helvetica', 'normal');
        }

        // Alternate row colors
        if (entryIndex % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, yPosition - 5, usableWidth, 8, 'F');
        }

        let rowData: string[] = [];
        
        switch (selectedFormType) {
          case 'Monitoring':
            rowData = [
              new Date(entry.date).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' }),
              entry.player_name || 'Unknown',
              String(entry.session_number || '-'),
              entry.session_type || '-',
              `${entry.session_duration || 0} min`,
              `${entry.session_intensity || 0}/10`,
              String(entry.balls_bowled || 0),
              (entry.comments || '-').substring(0, 30) + (entry.comments && entry.comments.length > 30 ? '...' : '')
            ];
            break;
            
          case 'Wellness':
            rowData = [
              new Date(entry.date).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' }),
              entry.player_name || 'Unknown',
              `${entry.sleep_quality || 3}/5`,
              `${entry.physical_readiness || 3}/5`,
              `${entry.mood || 3}/5`,
              `${entry.mental_alertness || 3}/5`,
              `${entry.muscle_soreness || 3}/5`,
              entry.menstrual_cycle || 'No',
              (entry.comments || '-').substring(0, 20) + (entry.comments && entry.comments.length > 20 ? '...' : '')
            ];
            break;
            
          case 'Hydration':
            rowData = [
              new Date(entry.date).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' }),
              entry.player_name || 'Unknown',
              entry.session_type || '-',
              String(entry.session_number || '-'),
              `${entry.pre_session_weight || 0} kg`,
              `${entry.post_session_weight || 0} kg`,
              `${entry.liquid_consumed || 0} ml`,
              `${entry.urination_output || 0} ml`,
              (entry.comments || '-').substring(0, 20) + (entry.comments && entry.comments.length > 20 ? '...' : '')
            ];
            break;
            
          case 'Recovery':
            rowData = [
              new Date(entry.date).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' }),
              entry.player_name || 'Unknown',
              entry.recovery_methods && entry.recovery_methods.length > 0 ? entry.recovery_methods.join(', ').substring(0, 30) : '-',
              entry.injury_present || entry.injury_status || 'No',
              (entry.comments || '-').substring(0, 30) + (entry.comments && entry.comments.length > 30 ? '...' : '')
            ];
            break;
        }

        // Add colored indicators for specific columns
        rowData.forEach((cellData, colIndex) => {
          let textColor = [0, 0, 0]; // Default black
          
          // Apply colors based on data type and value
          if (selectedFormType === 'Wellness' && colIndex >= 2 && colIndex <= 6) {
            const value = parseInt(cellData.split('/')[0]) || 3;
            if (colIndex === 6) { // Muscle soreness (reverse logic)
              textColor = value <= 2 ? [5, 150, 105] : value <= 3 ? [217, 119, 6] : [220, 38, 38];
            } else { // Other wellness scores
              textColor = value >= 4 ? [5, 150, 105] : value >= 3 ? [217, 119, 6] : [220, 38, 38];
            }
          } else if (selectedFormType === 'Monitoring' && colIndex === 5) { // Intensity
            const intensity = parseInt(cellData.split('/')[0]) || 0;
            textColor = intensity >= 8 ? [220, 38, 38] : intensity >= 6 ? [217, 119, 6] : [5, 150, 105];
          } else if (selectedFormType === 'Recovery' && colIndex === 3) { // Injury status
            textColor = (cellData === 'Yes' || cellData === 'Present') ? [220, 38, 38] : [5, 150, 105];
          }

          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(cellData, margin + (colIndex * colWidth) + 2, yPosition, { maxWidth: colWidth - 4 });
        });
        
        doc.setTextColor(0, 0, 0); // Reset to black
        yPosition += 8;
      });

      // Footer
      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(`Total Entries: ${formEntries.length} | Export Format: PDF`, pageWidth / 2, yPosition, { align: 'center' });

      // Save the PDF
      doc.save(`${filename}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const getTableHeaders = () => {
    switch (selectedFormType) {
      case 'Monitoring':
        return ['Date', 'Player Name', 'Session Number', 'Session Type', 'Duration (min)', 'Intensity (/10)', 'Balls Bowled', 'Comments'];
      case 'Wellness':
        return ['Date', 'Player Name', 'Sleep Quality', 'Physical Readiness', 'Mood', 'Mental Alertness', 'Muscle Soreness', 'Menstrual Cycle', 'Comments'];
      case 'Hydration':
        return ['Date', 'Player Name', 'Session Type', 'Session Number', 'Pre-Session Weight', 'Post-Session Weight', 'Liquid Consumed', 'Urination Output', 'Comments'];
      case 'Recovery':
        return ['Date', 'Player Name', 'Recovery Methods', 'Injury Present', 'Comments'];
      default:
        return [];
    }
  };

  // Handle filter changes
  const handleTeamChange = (team: string) => {
    console.log('Team changed to:', team);
    setSelectedTeam(team);
  };

  const handlePlayerChange = (player: string) => {
    console.log('Player changed to:', player);
    setSelectedPlayer(player);
  };

  const handleFormTypeChange = (formType: string) => {
    console.log('Form type changed to:', formType);
    setSelectedFormType(formType);
  };

  const handleDateChange = (date: string) => {
    console.log('Date changed to:', date);
    setSelectedDate(date);
  };

  // Initial data fetch
  useEffect(() => {
    fetchTeams();
    fetchFormTypes();
    fetchPlayers();
  }, []);

  // Fetch form entries when filters change
  useEffect(() => {
    console.log('Filters changed:', { selectedTeam, selectedPlayer, selectedFormType, selectedDate, playersLength: players.length });
    if (players.length > 0) {
      fetchFormEntries();
    }
  }, [players, selectedTeam, selectedPlayer, selectedFormType, selectedDate, fetchFormEntries]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Form Analytics</h1>
              <p className="text-gray-600 mt-1">Analyze player form submissions with step-by-step filtering</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToPDF}
                disabled={formEntries.length === 0}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <StatsCards/>

        <FiltersSection
          teams={teams}
          players={players}
          formTypes={formTypes}
          selectedTeam={selectedTeam}
          selectedPlayer={selectedPlayer}
          selectedFormType={selectedFormType}
          dateRange={selectedDate}
          onTeamChange={handleTeamChange}
          onPlayerChange={handlePlayerChange}
          onFormTypeChange={handleFormTypeChange}
          onDateRangeChange={handleDateChange}
        />

        {selectedFormType && (selectedTeam || selectedPlayer) && (
          <DataTable
            formEntries={formEntries}
            formType={selectedFormType}
            playerName={selectedPlayer}
            loading={loading}
          />
        )}

        {!selectedFormType && (selectedTeam || selectedPlayer) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Form Type</h3>
              <p>Please select a form type to view the data table with entries.</p>
            </div>
          </div>
        )}

        {(!selectedTeam && !selectedPlayer) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500">
              <Filter className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Analysis</h3>
              <p>Follow the 4-step process above to filter and view form data.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;