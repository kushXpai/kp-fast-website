// src/pages/AdminDashboard/Tests.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Select from './components/tests/Select';
import AllTests from './components/tests/AllTests';
import { exportCreateTabToPDF } from '@/utils/pdfExport';
import React from 'react';

export default function Tests() {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTeam, setSelectedTeam] = useState('Delhi Capitals');
  const [testDate, setTestDate] = useState('07/19/2025');
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
  const [testResults, setTestResults] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('id, name')
        .eq('batch', selectedTeam);
      if (error) console.error(error);
      else setPlayers(data || []);
    };
    fetchPlayers();
  }, [selectedTeam]);

  const handleInputChange = (playerId: string, testType: string, attempt: number, value: string) => {
    setTestResults(prev => {
      const newResults = {
        ...prev,
        [playerId]: {
          ...prev[playerId],
          [`${testType}_attempt${attempt}`]: value,
        },
      };
      
      // Auto-calculate average for the specific test type
      if (['long_jump_m', 'ten_m_sprint_s', 'twenty_m_sprint_s', 'forty_m_sprint_s', 'run_a_three_s', 'yo_yo_test_level'].includes(testType)) {
        const attempt1 = parseFloat(newResults[playerId]?.[`${testType}_attempt1`] || '0') || 0;
        const attempt2 = parseFloat(newResults[playerId]?.[`${testType}_attempt2`] || '0') || 0;
        const attempt3 = parseFloat(newResults[playerId]?.[`${testType}_attempt3`] || '0') || 0;
        
        const validAttempts = [attempt1, attempt2, attempt3].filter(val => val > 0);
        const average = validAttempts.length > 0 ? validAttempts.reduce((sum, val) => sum + val, 0) / validAttempts.length : 0;
        
        newResults[playerId] = {
          ...newResults[playerId],
          [`${testType}_average`]: average.toFixed(2),
        };
      }
      return newResults;
    });
  };

  const handleExportPDF = () => {
    try {
      exportCreateTabToPDF(players, testResults, selectedTeam, testDate);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleSubmit = async () => {
    const results = Object.entries(testResults)
      .filter(([, results]) => Object.keys(results).length > 0)
      .map(([playerId, results]) => ({
        player_id: playerId,
        test_date: testDate,
        // Long Jump
        long_jump_m: parseFloat(results.long_jump_m_average || '0') || null,
        long_jump_m_attempt1: parseFloat(results.long_jump_m_attempt1 || '0') || null,
        long_jump_m_attempt2: parseFloat(results.long_jump_m_attempt2 || '0') || null,
        long_jump_m_attempt3: parseFloat(results.long_jump_m_attempt3 || '0') || null,
        // 10m Sprint
        ten_m_sprint_s: parseFloat(results.ten_m_sprint_s_average || '0') || null,
        ten_m_sprint_s_attempt1: parseFloat(results.ten_m_sprint_s_attempt1 || '0') || null,
        ten_m_sprint_s_attempt2: parseFloat(results.ten_m_sprint_s_attempt2 || '0') || null,
        ten_m_sprint_s_attempt3: parseFloat(results.ten_m_sprint_s_attempt3 || '0') || null,
        // 20m Sprint
        twenty_m_sprint_s: parseFloat(results.twenty_m_sprint_s_average || '0') || null,
        twenty_m_sprint_s_attempt1: parseFloat(results.twenty_m_sprint_s_attempt1 || '0') || null,
        twenty_m_sprint_s_attempt2: parseFloat(results.twenty_m_sprint_s_attempt2 || '0') || null,
        twenty_m_sprint_s_attempt3: parseFloat(results.twenty_m_sprint_s_attempt3 || '0') || null,
        // 40m Sprint
        forty_m_sprint_s: parseFloat(results.forty_m_sprint_s_average || '0') || null,
        forty_m_sprint_s_attempt1: parseFloat(results.forty_m_sprint_s_attempt1 || '0') || null,
        forty_m_sprint_s_attempt2: parseFloat(results.forty_m_sprint_s_attempt2 || '0') || null,
        forty_m_sprint_s_attempt3: parseFloat(results.forty_m_sprint_s_attempt3 || '0') || null,
        // Run A Three
        run_a_three_s: parseFloat(results.run_a_three_s_average || '0') || null,
        run_a_three_s_attempt1: parseFloat(results.run_a_three_s_attempt1 || '0') || null,
        run_a_three_s_attempt2: parseFloat(results.run_a_three_s_attempt2 || '0') || null,
        run_a_three_s_attempt3: parseFloat(results.run_a_three_s_attempt3 || '0') || null,
        // YoYo Test (integers)
        yo_yo_test_level: parseInt(results.yo_yo_test_level_average || '0') || null,
        yo_yo_test_level_attempt1: parseInt(results.yo_yo_test_level_attempt1 || '0') || null,
        yo_yo_test_level_attempt2: parseInt(results.yo_yo_test_level_attempt2 || '0') || null,
        yo_yo_test_level_attempt3: parseInt(results.yo_yo_test_level_attempt3 || '0') || null,
      }));

    if (results.length === 0) {
      alert('Please enter at least one test result before saving.');
      return;
    }

    console.log('Saving test results:', results);

    const { error } = await supabase.from('tests').insert(results);
    if (error) {
      console.error('Error saving tests:', error);
      alert(`Error saving tests: ${error.message}`);
    } else {
      alert('Tests saved successfully!');
      setTestResults({});
    }
  };

  const completedTests = Object.values(testResults).reduce((count, playerResults) => {
    return count + Object.keys(playerResults).filter(key => key.includes('_average')).length;
  }, 0);

  const totalPossibleTests = players.length * 6;
  const completionRate = totalPossibleTests > 0 ? Math.round((completedTests / totalPossibleTests) * 100) : 0;

  return (
    <div className="p-6 text-black bg-gray-50 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Fitness Tests</h1>
          <p className="text-gray-600 text-sm">Record and track player fitness test results</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'create' && (
            <button 
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors" 
              onClick={handleSubmit}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Tests
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-2xl font-semibold text-gray-900">{players.length}</p>
              <p className="text-sm text-gray-600">Total Players</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-2xl font-semibold text-gray-900">6</p>
              <p className="text-sm text-gray-600">Test Categories</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-2xl font-semibold text-gray-900">{completedTests}/{totalPossibleTests}</p>
              <p className="text-sm text-gray-600">Tests Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'create' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Create Test
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'view' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('view')}
            >
              View Results
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'create' ? (
            <div>
              {/* Filters Section */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Search & Filters</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">1. Select Team</label>
                    <Select
                      label=""
                      value={selectedTeam}
                      onChange={setSelectedTeam}
                      options={['Delhi Capitals', 'Baroda Cricket Association']}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">2. Test Date</label>
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Test Results Table */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Fitness Test Results - {selectedTeam} ({players.length} players)
                </h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                          Player
                        </th>
                        {[
                          'Long Jump (m)', 
                          '10m Sprint (s)', 
                          '20m Sprint (s)', 
                          '40m Sprint (s)', 
                          'Run A Three (s)', 
                          'YoYo Test (level)'
                        ].map((testName) => (
                          <th key={testName} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="border-b border-gray-300 pb-1 mb-1">{testName}</div>
                            <div className="flex justify-center space-x-1">
                              <span className="text-xs">Attempt 1</span>
                              <span className="text-xs">Attempt 2</span>
                              <span className="text-xs">Attempt 3</span>
                              <span className="text-xs font-bold">Average</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {players.map((player) => (
                        <tr key={player.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                                {player.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{player.name}</div>
                            </div>
                          </td>
                          {['long_jump_m', 'ten_m_sprint_s', 'twenty_m_sprint_s', 'forty_m_sprint_s', 'run_a_three_s', 'yo_yo_test_level'].map((testType) => (
                            <td key={`${player.id}-${testType}`} className="px-2 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3].map((attempt) => (
                                  <input
                                    key={`${player.id}-${testType}-${attempt}`}
                                    type="number"
                                    step="0.01"
                                    value={testResults[player.id]?.[`${testType}_attempt${attempt}`] || ''}
                                    onChange={(e) => handleInputChange(player.id, testType, attempt, e.target.value)}
                                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-center"
                                    placeholder="0.00"
                                  />
                                ))}
                                <span className="w-16 text-xs font-medium text-center text-gray-700 bg-gray-50 px-2 py-1 rounded">
                                  {testResults[player.id]?.[`${testType}_average`] || '-'}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <AllTests />
          )}
        </div>
      </div>
    </div>
  );
}