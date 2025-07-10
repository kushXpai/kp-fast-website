// src/pages/AdminDashboard/components/analysis/FiltersSection.tsx

import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';

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
  onTeamChange: (team: string) => void;
  onPlayerChange: (player: string) => void;
  onFormTypeChange: (formType: string) => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  teams,
  players,
  formTypes,
  selectedTeam,
  selectedPlayer,
  selectedFormType,
  onTeamChange,
  onPlayerChange,
  onFormTypeChange
}) => {
  // Filter players based on selected team
  const filteredPlayers = selectedTeam 
    ? players.filter(player => {
        console.log('Comparing:', { 
          playerBatch: player.batch, 
          selectedTeam: selectedTeam,
          match: player.batch === selectedTeam,
          playerBatchType: typeof player.batch,
          selectedTeamType: typeof selectedTeam
        });
        return player.batch === selectedTeam;
      })
    : players;

  // Additional debugging
  console.log('=== DEBUGGING FILTERS ===');
  console.log('All players:', players);
  console.log('Selected team:', selectedTeam);
  console.log('Available teams:', teams);
  console.log('Filtered players:', filteredPlayers);
  console.log('Player batches:', players.map(p => ({ name: p.name, batch: p.batch })));
  console.log('========================');

  const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    placeholder, 
    label,
    disabled = false
  }: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    label: string;
    disabled?: boolean;
  }) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
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
        <h3 className="text-lg font-semibold text-gray-900">Select Team, Player & Form</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <CustomSelect
          value={selectedTeam}
          onChange={onTeamChange}
          options={teams}
          placeholder="Select Team"
          label="1. Select Team"
        />

        <CustomSelect
          value={selectedPlayer}
          onChange={onPlayerChange}
          options={filteredPlayers.map(p => p.name)}
          placeholder={selectedTeam ? `Select Player (${filteredPlayers.length} available)` : "Select Team First"}
          label="2. Select Player"
          disabled={!selectedTeam && filteredPlayers.length === 0}
        />

        <CustomSelect
          value={selectedFormType}
          onChange={onFormTypeChange}
          options={formTypes}
          placeholder="Select Form Type"
          label="3. Select Form Type (Required)"
        />
      </div>

      {(selectedTeam || selectedPlayer || selectedFormType) && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
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
          {selectedFormType && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              Form: {selectedFormType}
            </span>
          )}
        </div>
      )}

      {!selectedFormType && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Please select a form type to view data. Team and player selections are optional filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default FiltersSection;