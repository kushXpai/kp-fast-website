// src/pages/PlayerDashboard/Profile.tsx

import { useState, useEffect, useRef } from 'react';
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
  profile_photo_url?: string;
}

interface ProfileProps {
  player: Player;
}

export default function Profile({ player }: ProfileProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Photo modal states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
          setPlayerData(player);
        } else {
          setPlayerData(data);
          localStorage.setItem('player', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error:', error);
        setPlayerData(player);
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
    // Keep existing values when entering edit mode
    if (!isEditing && playerData) {
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

  // Handle photo modal open
  const handlePhotoClick = () => {
    setShowPhotoModal(true);
  };

  // Replace the existing photo upload functions with these improved versions

  // Generate filename based on batch and player name
  const generateFileName = (originalName: string) => {
    if (!playerData) return originalName;

    const fileExt = originalName.split('.').pop()?.toLowerCase();
    const batchName = playerData.batch?.replace(/[^a-zA-Z0-9]/g, '_') || 'default';
    const playerName = playerData.name.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now(); // Add timestamp to avoid conflicts

    return `${batchName}_${playerName}_${timestamp}.${fileExt}`;
  };

  // Improved photo upload function
  const handlePhotoUpload = async () => {
    if (!selectedPhoto || !playerData) {
      alert('Please select a photo first');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      console.log('Starting photo upload...');

      // Generate unique filename
      const fileName = generateFileName(selectedPhoto.name);
      console.log('Generated filename:', fileName);

      // Delete existing photo if it exists
      if (playerData.profile_photo_url) {
        try {
          const existingUrl = new URL(playerData.profile_photo_url);
          const pathSegments = existingUrl.pathname.split('/');
          const existingFileName = pathSegments[pathSegments.length - 1];

          if (existingFileName) {
            console.log('Deleting existing photo:', existingFileName);
            const { error: deleteError } = await supabase.storage
              .from('profile-photos')
              .remove([existingFileName]);

            if (deleteError) {
              console.warn('Could not delete existing photo:', deleteError);
            } else {
              console.log('Successfully deleted existing photo');
            }
          }
        } catch (deleteError) {
          console.warn('Error processing existing photo deletion:', deleteError);
        }
      }

      // Upload new photo
      console.log('Uploading new photo...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, selectedPhoto, {
          cacheControl: '3600',
          upsert: true, // Overwrite if exists
          contentType: selectedPhoto.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      console.log('Public URL generated:', urlData.publicUrl);

      // Update player record with new photo URL
      const { data: updateData, error: updateError } = await supabase
        .from('players')
        .update({ profile_photo_url: urlData.publicUrl })
        .eq('id', playerData.id)
        .select()
        .single();

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log('Database updated successfully:', updateData);

      // Update local state and localStorage
      setPlayerData(updateData);
      localStorage.setItem('player', JSON.stringify(updateData));

      // Reset modal state
      setShowPhotoModal(false);
      setSelectedPhoto(null);
      setPhotoPreview(null);

      alert('Profile photo updated successfully!');

    } catch (error) {
      console.error('Photo upload error:', error);

      let errorMessage = 'Error uploading photo. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Upload error: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Improved photo removal function
  const handleRemovePhoto = async () => {
    if (!playerData?.profile_photo_url) {
      alert('No photo to remove');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to remove your profile photo?');
    if (!confirmDelete) return;

    setIsUploadingPhoto(true);

    try {
      console.log('Removing photo...');

      // Extract filename from the URL
      const url = new URL(playerData.profile_photo_url);
      const pathSegments = url.pathname.split('/');
      const fileName = pathSegments[pathSegments.length - 1];

      if (fileName && fileName !== 'undefined') {
        console.log('Deleting file:', fileName);

        // Delete the file from storage
        const { error: deleteError } = await supabase.storage
          .from('profile-photos')
          .remove([fileName]);

        if (deleteError) {
          console.warn('Could not delete file from storage:', deleteError);
        } else {
          console.log('File deleted successfully from storage');
        }
      }

      // Update player record to remove photo URL
      const { data: updateData, error: updateError } = await supabase
        .from('players')
        .update({ profile_photo_url: null })
        .eq('id', playerData.id)
        .select()
        .single();

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log('Database updated successfully');

      setPlayerData(updateData);
      localStorage.setItem('player', JSON.stringify(updateData));
      alert('Profile photo removed successfully!');

    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Error removing photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Improved photo selection with better validation
  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      event.target.value = ''; // Clear the input
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      event.target.value = ''; // Clear the input
      return;
    }

    setSelectedPhoto(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setPhotoPreview(result);
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowPhotoModal(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
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
              <div className="relative mr-6">
                {/* Clickable Photo Area */}
                <div
                  onClick={handlePhotoClick}
                  className="w-20 h-20 rounded-full cursor-pointer hover:opacity-80 transition-opacity relative group"
                >
                  {playerData.profile_photo_url ? (
                    <img
                      src={playerData.profile_photo_url}
                      alt={playerData.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-green-800 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {getInitials(playerData.name)}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{playerData.name}</h3>
                <p className="text-gray-600 capitalize">{playerData.player_role}</p>
                {playerData.profile_photo_url && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={isUploadingPhoto}
                    className="text-sm text-red-600 hover:text-red-800 mt-2 disabled:opacity-50"
                  >
                    Remove photo
                  </button>
                )}
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
                    <option value="Allrounder">Allrounder</option>
                    <option value="Wicketkeeper">Wicketkeeper</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{playerData.player_role}</p>
                )}
              </div>

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
                    <option value="">Select batch</option>
                    <option value="Baroda Cricket Association">Baroda Cricket Association</option>
                    <option value="Delhi Capitals">Delhi Capitals</option>
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
                    <option value="Right Hand">Right Hand</option>
                    <option value="Left Hand">Left Hand</option>
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
                    <option value="Right Arm Fast">Right Arm Fast</option>
                    <option value="Left Arm Fast">Left Arm Fast</option>
                    <option value="Right Arm Medium">Right Arm Medium</option>
                    <option value="Left Arm Medium">Left Arm Medium</option>
                    <option value="Off Spin">Off Spin</option>
                    <option value="Leg Spin">Leg Spin</option>
                    <option value="Left Arm Spin">Left Arm Spin</option>
                    <option value="Chinaman">Chinaman</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{playerData.bowler_type || 'Not specified'}</p>
                )}
              </div>
            </div>

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

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Profile Photo</h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Photo Preview */}
            {photoPreview ? (
              <div className="mb-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            ) : (
              <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Select a photo to preview</p>
              </div>
            )}

            {/* File Input */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePhotoUpload}
                disabled={!selectedPhoto || isUploadingPhoto}
                className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingPhoto ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Photo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}