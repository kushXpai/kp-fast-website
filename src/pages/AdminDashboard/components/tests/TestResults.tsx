// src/pages/AdminDashboard/components/tests/TestResults.tsx

import React from 'react';

interface TestResultsProps {
  players: { id: string; name: string }[];
  testResults: Record<string, Record<string, string>>;
  onInputChange: (playerId: string, testType: string, attempt: string, value: string) => void;
}

const TestResults: React.FC<TestResultsProps> = ({ players, testResults, onInputChange }) => {
  return (
    <div>
      {players.map((player) => (
        <div key={player.id}>
          <h3>{player.name}</h3>
          {['long_jump_m', 'ten_m_sprint_s', 'twenty_m_sprint_s', 'forty_m_sprint_s', 'run_a_three_s', 'yo_yo_test_level'].map((testType) => (
            <div key={`${player.id}-${testType}`}>
              <label>{testType.replace('_', ' ').replace('m', ' (m)').replace('s', ' (s)').replace('level', ' (level)')}</label>
              {[1, 2, 3].map((attempt) => (
                <input
                  key={`${player.id}-${testType}-${attempt}`}
                  type="number"
                  step="0.01"
                  value={testResults[player.id]?.[`${testType}_attempt${attempt}`] || ''}
                  onChange={(e) => onInputChange(player.id, testType, `attempt${attempt}`, e.target.value)}
                  className="w-16 p-1 border rounded ml-2"
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TestResults;