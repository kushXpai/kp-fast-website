// src/pages/AdminDashboard/Players.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Filter, Eye, Users, Shield, X, Mail, Phone, Calendar, User, Trophy, Target } from 'lucide-react';

// Use the same Player interface as in index.tsx
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
  profile_photo_url?: string;
}

// Props interface for the Players component
interface PlayersProps {
  player: Player;
  onNavigate: (tabId: string) => void;
}

// Player Details Modal Component
interface PlayerDetailsModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({ player, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Batsman': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Bowler': return 'bg-red-100 text-red-800 border-red-200';
      case 'Allrounder': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Wicketkeeper': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Player Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Player Profile Section */}
          <div className="flex items-center mb-8">
            <div className="flex-shrink-0">
              {player.profile_photo_url ? (
                <img
                  src={player.profile_photo_url}
                  alt={player.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-green-100"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-green-600 flex items-center justify-center border-4 border-green-100">
                  <span className="text-2xl font-bold text-white">
                    {getInitials(player.name)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-900">{player.name}</h3>
              <p className="text-lg text-gray-600">@{player.username}</p>
              <div className="mt-2">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
                  player.is_approved 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {player.is_approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            </div>
          </div>

          {/* Player Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-600" />
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{player.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mobile</p>
                    <p className="text-sm text-gray-600">{player.mobile_number}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                    <p className="text-sm text-gray-600">{formatDate(player.date_of_birth)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cricket Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-gray-600" />
                Cricket Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Team/Batch</p>
                  <p className="text-sm text-gray-600">{player.batch}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Player Role</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getRoleColor(player.player_role)}`}>
                    {player.player_role}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Batting Style</p>
                  <p className="text-sm text-gray-600">{player.batter_type || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Bowling Style</p>
                  <p className="text-sm text-gray-600">{player.bowler_type || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Registration Information */}
            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-gray-600" />
                Registration Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Registration Date</p>
                  <p className="text-sm text-gray-600">{formatDate(player.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Registration Time</p>
                  <p className="text-sm text-gray-600">
                    {new Date(player.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Player ID</p>
                  <p className="text-sm text-gray-600 font-mono">{player.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border mt-1 ${
                    player.is_approved 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {player.is_approved ? 'Active' : 'Pending Approval'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Players: React.FC<PlayersProps> = ({ onNavigate }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayer(player);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
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
    <>
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
                            {playerData.profile_photo_url ? (
                              <img
                                src={playerData.profile_photo_url}
                                alt={playerData.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {getInitials(playerData.name)}
                                </span>
                              </div>
                            )}
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
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
                Try adjusting your search or filters to find what you&rsquo;re looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Player Details Modal */}
      {selectedPlayer && (
        <PlayerDetailsModal
          player={selectedPlayer}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Players;