// src/pages/PlayerDashboard/Profile.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

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
}

interface ProfileProps {
  player: Player;
}

export default function Profile({ player }: ProfileProps) {
  const router = useRouter();
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile_number: '',
    date_of_birth: '',
    batch: '',
    batter_type: '',
    player_role: '',
    bowler_type: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch player data from Supabase
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', player.id)
          .single();

        if (error) {
          console.error('Error fetching player data:', error);
          setPlayerData(player); // Fallback to localStorage data
        } else {
          setPlayerData(data);
          // Update localStorage with fresh data
          localStorage.setItem('player', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error:', error);
        setPlayerData(player); // Fallback to localStorage data
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, [player]);

  // Initialize edit form when playerData changes
  useEffect(() => {
    if (playerData) {
      setEditForm({
        name: playerData.name || '',
        email: playerData.email || '',
        mobile_number: playerData.mobile_number || '',
        date_of_birth: playerData.date_of_birth || '',
        batch: playerData.batch || '',
        batter_type: playerData.batter_type || '',
        player_role: playerData.player_role || '',
        bowler_type: playerData.bowler_type || ''
      });
    }
  }, [playerData]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('player');
    router.push('/Login');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && playerData) {
      // Reset form to current data if canceling
      setEditForm({
        name: playerData.name || '',
        email: playerData.email || '',
        mobile_number: playerData.mobile_number || '',
        date_of_birth: playerData.date_of_birth || '',
        batch: playerData.batch || '',
        batter_type: playerData.batter_type || '',
        player_role: playerData.player_role || '',
        bowler_type: playerData.bowler_type || ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!playerData) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('players')
        .update(editForm)
        .eq('id', playerData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating player:', error);
        alert('Error updating profile. Please try again.');
      } else {
        setPlayerData(data);
        localStorage.setItem('player', JSON.stringify(data));
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!playerData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600">Unable to load profile data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg font-medium hover:bg-red-100 hover:border-red-300 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <button
            onClick={isEditing ? handleSave : handleEditToggle}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                ? 'bg-green-800 text-white hover:bg-green-900'
                : 'bg-green-800 text-white hover:bg-green-900'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Forms Completed</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">147</div>
          <div className="text-sm text-green-600">+12 this week</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Current Streak</h3>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">28 days</div>
          <div className="text-sm text-orange-600">Personal best!</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">3.2 min</div>
          <div className="text-sm text-gray-600">Faster than 85% of players</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Wellness Score</h3>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">8.7/10</div>
          <div className="text-sm text-green-600">+0.5 from last month</div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>

            {/* Profile Picture and Basic Info */}
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 bg-green-800 rounded-full flex items-center justify-center mr-6">
                <span className="text-white font-bold text-2xl">
                  {getInitials(playerData.name)}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{playerData.name}</h3>
                <p className="text-gray-600 capitalize">{playerData.player_role}</p>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{playerData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {playerData.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobile_number"
                    value={editForm.mobile_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {playerData.mobile_number}
                  </p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <p className="text-gray-900 flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Mumbai, Maharashtra, IN
                </p>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                {isEditing ? (
                  <select
                    name="player_role"
                    value={editForm.player_role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-rounder">All-rounder</option>
                    <option value="Wicket-keeper">Wicket-keeper</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{playerData.player_role}</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jersey Number</label>
                <p className="text-gray-900">#{playerData.id.slice(-2)}</p>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="date_of_birth"
                    value={editForm.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formatDate(playerData.date_of_birth)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Join Date</label>
                <p className="text-gray-900 flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {formatJoinDate(playerData.created_at)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                {isEditing ? (
                  <select
                    name="batch"
                    value={editForm.batch}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{playerData.batch}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batting Style</label>
                {isEditing ? (
                  <select
                    name="batter_type"
                    value={editForm.batter_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select batting style</option>
                    <option value="Right-handed">Right-handed</option>
                    <option value="Left-handed">Left-handed</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{playerData.batter_type || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bowling Style</label>
                {isEditing ? (
                  <select
                    name="bowler_type"
                    value={editForm.bowler_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select bowling style</option>
                    <option value="Fast">Fast</option>
                    <option value="Medium">Medium</option>
                    <option value="Spin">Spin</option>
                    <option value="Off-spin">Off-spin</option>
                    <option value="Leg-spin">Leg-spin</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{playerData.bowler_type || 'Not specified'}</p>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {/* <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  Passionate {playerData.player_role.toLowerCase()} with competitive experience.
                  Known for excellent performance and strategic gameplay.
                </p>
              </div>
            </div> */}

            {/* Season Goals */}
            {/* <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Season Goals</label>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800">
                  Improve performance by 10% this season and maintain 95% form completion rate.
                </p>
              </div>
            </div> */}

            {/* Emergency Contact */}
            {/* <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
              <p className="text-gray-900">Emergency Contact • {playerData.mobile_number}</p>
            </div> */}

            {/* Medical Notes */}
            {/* <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800">
                  No known allergies. Previous injuries: None reported.
                </p>
              </div>
            </div> */}

            {/* Edit/Cancel buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}