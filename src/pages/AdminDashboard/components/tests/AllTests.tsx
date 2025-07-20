// src/pages/AdminDashboard/components/tests/AllTests.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Select from './Select';

interface Test {
  id: string;
  test_date: string;
  player_id: string;
}

interface TestResult {
  id: string;
  test_date: string;
  player_id: string;
  long_jump_m: number | null;
  ten_m_sprint_s: number | null;
  twenty_m_sprint_s: number | null;
  forty_m_sprint_s: number | null;
  run_a_three_s: number | null;
  yo_yo_test_level: number | null;
  players: { name: string } | null;
}

const AllTests = () => {
  const [testDates, setTestDates] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('Delhi Capitals');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedTestResults, setSelectedTestResults] = useState<TestResult[] | null>(null);

  // Fetch unique test dates for the selected batch
  useEffect(() => {
    const fetchTestDates = async () => {
      const { data: playerIds, error: playerError } = await supabase
        .from('players')
        .select('id')
        .eq('batch', selectedBatch);
      
      if (playerError) {
        console.error('Error fetching player IDs:', playerError);
        return;
      }
      
      const playerIdList = playerIds?.map(p => p.id) || [];
      
      if (playerIdList.length === 0) {
        setTestDates([]);
        return;
      }

      const { data, error } = await supabase
        .from('tests')
        .select('test_date')
        .in('player_id', playerIdList)
        .order('test_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching test dates:', error);
      } else {
        // Get unique test dates
        const uniqueDates = [...new Set(data?.map(test => test.test_date) || [])];
        setTestDates(uniqueDates);
      }
    };
    fetchTestDates();
  }, [selectedBatch]);

  const fetchTestResultsByDate = async (testDate: string) => {
    const { data: playerIds, error: playerError } = await supabase
      .from('players')
      .select('id')
      .eq('batch', selectedBatch);
    
    if (playerError) {
      console.error('Error fetching player IDs:', playerError);
      return;
    }
    
    const playerIdList = playerIds?.map(p => p.id) || [];

    const { data, error } = await supabase
      .from('tests')
      .select(`
        id,
        test_date,
        player_id,
        long_jump_m,
        ten_m_sprint_s,
        twenty_m_sprint_s,
        forty_m_sprint_s,
        run_a_three_s,
        yo_yo_test_level,
        players(name)
      `)
      .eq('test_date', testDate)
      .in('player_id', playerIdList)
      .order('players(name)', { ascending: true });
    
    if (error) {
      console.error('Error fetching test results:', error);
    } else {
      const formattedData = data?.map((item: any) => ({
        ...item,
        players: item.players ? { name: item.players.name } : null,
      }));
      setSelectedTestResults(formattedData as TestResult[]);
    }
  };

  // Filter test dates based on date filter
  const filteredTestDates = testDates.filter(date => {
    if (!dateFilter) return true;
    return date.includes(dateFilter);
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
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
              value={selectedBatch}
              onChange={setSelectedBatch}
              options={['Baroda Cricket Association', 'Delhi Capitals']}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Filter by Test Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Test Dates List */}
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Available Test Dates ({filteredTestDates.length})</h3>
        {filteredTestDates.length === 0 ? (
          <p className="text-gray-500 p-4">No tests found for the selected batch.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto border rounded">
            {filteredTestDates.map(date => (
              <div 
                key={date} 
                className="p-3 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => fetchTestResultsByDate(date)}
              >
                <div>
                  <div className="font-medium">Test Date: {formatDate(date)}</div>
                  <div className="text-sm text-gray-600">{selectedBatch}</div>
                </div>
                <div className="text-blue-600 text-sm">View All Results →</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Test Results for All Players */}
      {selectedTestResults && selectedTestResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            Test Results - {formatDate(selectedTestResults[0].test_date)} - All Players ({selectedTestResults.length} players)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border-b">Player Name</th>
                  <th className="p-3 text-left border-b">Long Jump (m)</th>
                  <th className="p-3 text-left border-b">10m Sprint (s)</th>
                  <th className="p-3 text-left border-b">20m Sprint (s)</th>
                  <th className="p-3 text-left border-b">40m Sprint (s)</th>
                  <th className="p-3 text-left border-b">Run A Three (s)</th>
                  <th className="p-3 text-left border-b">YoYo Test (level)</th>
                </tr>
              </thead>
              <tbody>
                {selectedTestResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-medium">
                      {result.players?.name || '-'}
                    </td>
                    <td className="p-3 border-b">{result.long_jump_m || '-'}</td>
                    <td className="p-3 border-b">{result.ten_m_sprint_s || '-'}</td>
                    <td className="p-3 border-b">{result.twenty_m_sprint_s || '-'}</td>
                    <td className="p-3 border-b">{result.forty_m_sprint_s || '-'}</td>
                    <td className="p-3 border-b">{result.run_a_three_s || '-'}</td>
                    <td className="p-3 border-b">{result.yo_yo_test_level || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTests;