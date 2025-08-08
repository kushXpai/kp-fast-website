import React from 'react';
import { ChevronDown, Filter, Calendar } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  batch: string;
}

interface FiltersSectionProps {
  teams: string[];
  players: Player[];
  formTypes: string[];
  selectedTeam: string;
  selectedPlayer: string;
  selectedFormType: string;
  dateRange: string;
  onTeamChange: (team: string) => void;
  onPlayerChange: (player: string) => void;
  onFormTypeChange: (formType: string) => void;
  onDateRangeChange: (range: string) => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  teams = [],
  players = [],
  formTypes = [],
  selectedTeam,
  selectedPlayer,
  selectedFormType,
  dateRange,
  onTeamChange,
  onPlayerChange,
  onFormTypeChange,
  onDateRangeChange
}) => {
  // New state for selection type
  const [selectionType, setSelectionType] = React.useState<'team' | 'player' | ''>('');

  // Handle selection type change
  const handleSelectionTypeChange = (type: 'team' | 'player' | '') => {
    setSelectionType(type);
    // Clear previous selections when switching type
    onTeamChange('');
    onPlayerChange('');
    onFormTypeChange('');
  };

  // Filter players based on selected team when selection type is team
  const filteredPlayers = selectionType === 'team' && selectedTeam
    ? players.filter(player => String(player.batch) === String(selectedTeam))
    : players;

  // Debug logs
  console.log('=== DEBUGGING NEW FILTERS ===');
  console.log('Selection type:', selectionType);
  console.log('Teams:', teams);
  console.log('All players:', players);
  console.log('Selected team:', selectedTeam);
  console.log('Filtered players:', filteredPlayers);
  console.log('Date range:', dateRange);
  console.log('Form types:', formTypes);
  console.log('==============================');

  const CustomSelect = ({
    value,
    onChange,
    options,
    placeholder,
    label,
    disabled = false,
    stepNumber
  }: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    label: string;
    disabled?: boolean;
    stepNumber: number;
  }) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <span className="inline-flex items-center">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${
            disabled ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'
          }`}>
            {stepNumber}
          </span>
          {label}
        </span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => {
            console.log(`Selected ${label}:`, e.target.value);
            onChange(e.target.value);
          }}
          disabled={disabled}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Filter Data</h3>
      </div>

      <div className="space-y-4">
        {/* Step 1: Choose Team or Player */}
        <div className="grid grid-cols-1 gap-4">
          <CustomSelect
            stepNumber={1}
            value={selectionType}
            onChange={(value) => handleSelectionTypeChange(value as 'team' | 'player' | '')}
            options={['team', 'player']}
            placeholder="Choose Analysis Type"
            label="Select Analysis Type"
          />
        </div>

        {/* Step 2: Select Team or Player based on selection type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectionType === 'team' && (
            <CustomSelect
              stepNumber={2}
              value={selectedTeam}
              onChange={onTeamChange}
              options={teams}
              placeholder="Choose Team"
              label="Select Team"
            />
          )}

          {selectionType === 'player' && (
            <CustomSelect
              stepNumber={2}
              value={selectedPlayer}
              onChange={onPlayerChange}
              options={players.map(p => p.name)}
              placeholder="Choose Player"
              label="Select Player"
            />
          )}

          {/* Step 3: Date Selection */}
          {selectionType && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="inline-flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 bg-blue-500 text-white">
                    3
                  </span>
                  Select Date
                </span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange}
                  onChange={(e) => {
                    console.log('Date changed:', e.target.value);
                    onDateRangeChange(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  placeholder="Select a date"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Form Type */}
        {selectionType && (selectedTeam || selectedPlayer) && (
          <div className="grid grid-cols-1 gap-4">
            <CustomSelect
              stepNumber={4}
              value={selectedFormType}
              onChange={onFormTypeChange}
              options={formTypes}
              placeholder="Choose Form Type"
              label="Select Form Type (Required)"
            />
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectionType || selectedTeam || selectedPlayer || selectedFormType || dateRange) && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          {selectionType && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Type: {selectionType === 'team' ? 'Team Analysis' : 'Player Analysis'}
            </span>
          )}
          {selectedTeam && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Team: {selectedTeam}
            </span>
          )}
          {selectedPlayer && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Player: {selectedPlayer}
            </span>
          )}
          {dateRange && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              Date: {new Date(dateRange).toLocaleDateString()}
            </span>
          )}
          {selectedFormType && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              Form: {selectedFormType}
            </span>
          )}
        </div>
      )}

      {/* Instructions */}
      {!selectionType && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Filter className="w-5 h-5 text-blue-400 mt-0.5" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Get Started</h4>
              <p className="text-sm text-blue-700 mt-1">
                Choose whether you want to analyze data for an entire team or an individual player to begin filtering.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectionType && !selectedTeam && !selectedPlayer && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Next Step:</strong> Select a {selectionType} to continue.
          </p>
        </div>
      )}

      {(selectedTeam || selectedPlayer) && !selectedFormType && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Final Step:</strong> Select a form type to view the data.
          </p>
        </div>
      )}
    </div>
  );
};

export default FiltersSection;