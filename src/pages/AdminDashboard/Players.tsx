// src/pages/AdminDashboard/Players.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Filter, Eye, Users, Shield } from 'lucide-react';

// Types based on your database schema
type BatchEnum = 'Baroda Cricket Association' | 'Delhi Capitals';
type BatterTypeEnum = 'Right Hand' | 'Left Hand';
type PlayerRoleEnum = 'Batsman' | 'Wicketkeeper' | 'Allrounder' | 'Bowler';
type BowlerTypeEnum = 'Right Arm Fast' | 'Left Arm Fast' | 'Right Arm Medium' | 'Left Arm Medium' | 'Off Spin' | 'Leg Spin' | 'Left Arm Spin' | 'Chinaman';

// Use the same Player interface as in index.tsx
interface Player {
  id: string;
  name: string;
  mobile_number: string;
  username: string;
  email: string;
  date_of_birth: string;
  batch: string; // Changed to string to match index.tsx
  batter_type: string; // Changed to string to match index.tsx
  player_role: string; // Changed to string to match index.tsx
  bowler_type: string; // Changed to string to match index.tsx
  is_approved: boolean;
  created_at: string;
}

// Props interface for the Players component
interface PlayersProps {
  player: Player;
  onNavigate: (tabId: string) => void;
}

const Players: React.FC<PlayersProps> = ({ player, onNavigate }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');

  // Fetch players from Supabase
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching players:', error);
      } else {
        setPlayers(data || []);
        setFilteredPlayers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter players based on search and filters
  useEffect(() => {
    let filtered = players;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Batch filter
    if (selectedBatch !== 'All Batches') {
      filtered = filtered.filter(player => player.batch === selectedBatch);
    }

    // Role filter
    if (selectedRole !== 'All Roles') {
      filtered = filtered.filter(player => player.player_role === selectedRole);
    }

    // Status filter
    if (selectedStatus !== 'All Status') {
      if (selectedStatus === 'Approved') {
        filtered = filtered.filter(player => player.is_approved);
      } else if (selectedStatus === 'Pending') {
        filtered = filtered.filter(player => !player.is_approved);
      }
    }

    setFilteredPlayers(filtered);
  }, [players, searchTerm, selectedBatch, selectedRole, selectedStatus]);

  // Calculate stats
  const totalPlayers = players.length;
  const totalTeams = [...new Set(players.map(p => p.batch))].length;
  const approvedPlayers = players.filter(p => p.is_approved).length;
  const pendingPlayers = players.filter(p => !p.is_approved).length;
  const approvalRate = totalPlayers > 0 ? Math.round((approvedPlayers / totalPlayers) * 100) : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Batsman': return 'bg-blue-100 text-blue-800';
      case 'Bowler': return 'bg-red-100 text-red-800';
      case 'Allrounder': return 'bg-yellow-100 text-yellow-800';
      case 'Wicketkeeper': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleViewDetails = (playerId: string) => {
    // You can implement player details modal or navigation here
    console.log('View details for player:', playerId);
  };

  const handleApprovalNavigation = () => {
    onNavigate('pending-approvals');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Players Management</h1>
          <p className="text-gray-600">Manage and view all registered players</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalPlayers}</p>
                <p className="text-xs sm:text-sm text-gray-500">Total Players</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{approvedPlayers}</p>
                <p className="text-xs sm:text-sm text-gray-500">Approved Players</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Filter className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{pendingPlayers}</p>
                <p className="text-xs sm:text-sm text-gray-500">Pending Approval</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{approvalRate}%</p>
                <p className="text-xs sm:text-sm text-gray-500">Approval Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {pendingPlayers > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  {pendingPlayers} player{pendingPlayers > 1 ? 's' : ''} pending approval
                </h3>
                <p className="text-sm text-yellow-700">
                  Review and approve new player registrations
                </p>
              </div>
              <button
                onClick={handleApprovalNavigation}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Review Approvals
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white text-black rounded-lg shadow mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Search & Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All Batches">All Batches</option>
                <option value="Baroda Cricket Association">Baroda Cricket Association</option>
                <option value="Delhi Capitals">Delhi Capitals</option>
              </select>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All Roles">All Roles</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="Allrounder">Allrounder</option>
                <option value="Wicketkeeper">Wicketkeeper</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All Status">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Players Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Players List ({filteredPlayers.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((playerData) => (
                  <tr key={playerData.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {getInitials(playerData.name)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {playerData.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{playerData.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{playerData.batch}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(playerData.player_role)}`}>
                        {playerData.player_role}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(playerData.created_at)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(playerData.created_at)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        playerData.is_approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {playerData.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => handleViewDetails(playerData.id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300c rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results State */}
        {filteredPlayers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No players found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;