import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Users, Video, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import ProgramDetailsPopup from './components/programs/ProgramDetailsPopup';

// Types based on updated database schema
type FitnessCategoryEnum =
  | 'Strength Training'
  | 'Cardio'
  | 'Flexibility'
  | 'Weight Loss'
  | 'Muscle Building'
  | 'Endurance'
  | 'Rehabilitation'
  | 'Sports Specific'
  | 'General Fitness';

type BatchEnum = 'Baroda Cricket Association' | 'Delhi Capitals';

interface Program {
  id: string;
  title: string;
  category: FitnessCategoryEnum;
  description: string;
  youtube_video_urls: string[];
  created_at: string;
  updated_at: string;
  program_assignments?: { batch?: BatchEnum; player_id?: string; players?: { name: string } }[];
}

interface Player {
  id: string;
  name: string;
  batch: BatchEnum;
}

interface ProgramFormData {
  title: string;
  category: FitnessCategoryEnum | '';
  description: string;
  youtube_video_urls: string[];
  assignmentType: 'batch' | 'players' | '';
  selectedBatch: BatchEnum | '';
  selectedPlayers: string[];
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    category: '',
    description: '',
    youtube_video_urls: [''],
    assignmentType: '',
    selectedBatch: '',
    selectedPlayers: []
  });

  const categories: FitnessCategoryEnum[] = [
    'Strength Training',
    'Cardio',
    'Flexibility',
    'Weight Loss',
    'Muscle Building',
    'Endurance',
    'Rehabilitation',
    'Sports Specific',
    'General Fitness'
  ];

  const batches: BatchEnum[] = ['Baroda Cricket Association', 'Delhi Capitals'];

  // Fetch programs and players
  useEffect(() => {
    fetchPrograms();
    fetchPlayers();
  }, []);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select(`
          *,
          program_assignments (
            batch,
            player_id,
            players (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching programs:', error);
        alert('Failed to load programs. Please try again.');
        return;
      }

      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      alert('Failed to load programs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id, name, batch')
        .order('name');

      if (error) {
        console.error('Error fetching players:', error);
        return;
      }

      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleInputChange = (field: keyof ProgramFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.youtube_video_urls];
    newUrls[index] = value;
    setFormData(prev => ({
      ...prev,
      youtube_video_urls: newUrls
    }));
  };

  const addVideoUrl = () => {
    setFormData(prev => ({
      ...prev,
      youtube_video_urls: [...prev.youtube_video_urls, '']
    }));
  };

  const removeVideoUrl = (index: number) => {
    const newUrls = formData.youtube_video_urls.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      youtube_video_urls: newUrls.length > 0 ? newUrls : ['']
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.title || !formData.category || !formData.description || !formData.assignmentType) {
      alert('Please fill in all required fields');
      return;
    }
    if (formData.assignmentType === 'batch' && !formData.selectedBatch) {
      alert('Please select a batch');
      return;
    }
    if (formData.assignmentType === 'players' && formData.selectedPlayers.length === 0) {
      alert('Please select at least one player');
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty video URLs
      const videoUrls = formData.youtube_video_urls.filter(url => url.trim() !== '');

      // Insert program
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .insert([{
          title: formData.title,
          category: formData.category as FitnessCategoryEnum,
          description: formData.description,
          youtube_video_urls: videoUrls
        }])
        .select()
        .single();

      if (programError) {
        console.error('Error creating program:', programError);
        alert('Failed to create program. Please try again.');
        return;
      }

      // Insert assignments
      if (formData.assignmentType === 'batch') {
        const { error: assignmentError } = await supabase
          .from('program_assignments')
          .insert([{
            program_id: programData.id,
            batch: formData.selectedBatch
          }]);

        if (assignmentError) {
          console.error('Error creating assignment:', assignmentError);
          alert('Failed to create assignment. Please try again.');
          return;
        }
      } else {
        const assignments = formData.selectedPlayers.map(playerId => ({
          program_id: programData.id,
          player_id: playerId
        }));

        const { error: assignmentError } = await supabase
          .from('program_assignments')
          .insert(assignments);

        if (assignmentError) {
          console.error('Error creating assignments:', assignmentError);
          alert('Failed to create assignments. Please try again.');
          return;
        }
      }

      // Update local state
      setPrograms(prev => [{ ...programData, program_assignments: [] }, ...prev]);
      setIsCreateModalOpen(false);
      resetForm();
      alert('Program created successfully!');
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      youtube_video_urls: [''],
      assignmentType: '',
      selectedBatch: '',
      selectedPlayers: []
    });
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    resetForm();
  };

  // Filter programs based on search and filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'All Teams' || 
                        program.program_assignments?.some(a => a.batch === selectedTeam);
    const matchesCategory = selectedCategory === 'All Categories' || program.category === selectedCategory;
    
    return matchesSearch && matchesTeam && matchesCategory;
  });

  // Calculate stats
  const totalPrograms = programs.length;
  const teamsStats = programs.reduce((acc, program) => {
    program.program_assignments?.forEach(a => {
      if (a.batch) {
        acc[a.batch] = (acc[a.batch] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);
  const teamsCovered = Object.keys(teamsStats).length;
  const programsWithVideos = programs.filter(p => p.youtube_video_urls.length > 0).length;
  const createdToday = programs.filter(p => {
    const today = new Date().toDateString();
    return new Date(p.created_at).toDateString() === today;
  }).length;

  return (
    <div className="min-h-screen text-black bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fitness Programs</h1>
            <p className="text-gray-600 mt-1">Create and manage fitness programs for teams or players</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Create Program
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{totalPrograms}</p>
              </div>
              <div className="text-blue-500">
                <Filter size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Teams Covered</p>
                <p className="text-2xl font-bold text-gray-900">{teamsCovered}</p>
              </div>
              <div className="text-blue-600">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Videos</p>
                <p className="text-2xl font-bold text-gray-900">{programsWithVideos}</p>
              </div>
              <div className="text-orange-500">
                <Video size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Created Today</p>
                <p className="text-2xl font-bold text-gray-900">{createdToday}</p>
              </div>
              <div className="text-green-500">
                <Calendar size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-500" />
            <h2 className="text-lg font-semibold">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="All Teams">All Teams</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="All Categories">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Programs List */}
        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading programs...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Filter size={48} className="mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {programs.length === 0 ? 'No Programs Found' : 'No Matching Programs'}
              </h3>
              <p className="text-gray-600 mb-6">
                {programs.length === 0 
                  ? 'Start by creating your first fitness program.' 
                  : 'Try adjusting your search criteria or filters.'}
              </p>
              {programs.length === 0 && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  Create First Program
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Programs ({filteredPrograms.length})
                </h3>
                <button
                  onClick={fetchPrograms}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Refresh
                </button>
              </div>
              <div className="grid gap-4">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedProgram(program)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{program.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                        <div className="flex gap-4 mt-3">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {program.category}
                          </span>
                          {program.program_assignments?.map((assignment, index) => (
                            <span
                              key={index}
                              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                            >
                              {assignment.batch || assignment.players?.name || 'Unknown'}
                            </span>
                          ))}
                          {program.youtube_video_urls.length > 0 && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded flex items-center gap-1">
                              <Video size={12} />
                              {program.youtube_video_urls.length} video{program.youtube_video_urls.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Created: {new Date(program.created_at).toLocaleDateString()}</p>
                        <p>Updated: {new Date(program.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Program Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Create New Fitness Program</h2>
                    <p className="text-sm text-gray-600 mt-1">Create a fitness program and assign it to a team or players</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter program title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={isSubmitting}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.assignmentType}
                    onChange={(e) => handleInputChange('assignmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Select assignment type</option>
                    <option value="batch">Entire Batch</option>
                    <option value="players">Specific Players</option>
                  </select>
                </div>

                {formData.assignmentType === 'batch' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Batch <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.selectedBatch}
                      onChange={(e) => handleInputChange('selectedBatch', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={isSubmitting}
                    >
                      <option value="">Select team</option>
                      {batches.map(batch => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.assignmentType === 'players' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Players <span className="text-red-500">*</span>
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {players.map(player => (
                        <div key={player.id} className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            checked={formData.selectedPlayers.includes(player.id)}
                            onChange={(e) => {
                              const newSelected = e.target.checked
                                ? [...formData.selectedPlayers, player.id]
                                : formData.selectedPlayers.filter(id => id !== player.id);
                              handleInputChange('selectedPlayers', newSelected);
                            }}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            disabled={isSubmitting}
                          />
                          <span>{player.name} ({player.batch})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the fitness program, exercises, goals, etc."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video URLs (Optional)
                  </label>
                  {formData.youtube_video_urls.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isSubmitting}
                      />
                      {formData.youtube_video_urls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVideoUrl(index)}
                          className="px-3 py-2 text-red-500 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                          disabled={isSubmitting}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVideoUrl}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1 mt-2"
                    disabled={isSubmitting}
                  >
                    <Plus size={16} />
                    Add Another Video
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Add multiple YouTube links for comprehensive tutorials</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Program'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Program Details Popup */}
      {selectedProgram && (
        <ProgramDetailsPopup
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
};

export default Programs;