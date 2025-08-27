// src/pages/AdminDashboard/components/tests/AllTests.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Select from './Select';
import { exportToPDF } from '@/utils/pdfExport';

interface TestResult {
  id: string;
  test_date: string;
  player_id: string;
  long_jump_m: number | null;
  long_jump_m_attempt1: number | null;
  long_jump_m_attempt2: number | null;
  long_jump_m_attempt3: number | null;
  ten_m_sprint_s: number | null;
  ten_m_sprint_s_attempt1: number | null;
  ten_m_sprint_s_attempt2: number | null;
  ten_m_sprint_s_attempt3: number | null;
  twenty_m_sprint_s: number | null;
  twenty_m_sprint_s_attempt1: number | null;
  twenty_m_sprint_s_attempt2: number | null;
  twenty_m_sprint_s_attempt3: number | null;
  forty_m_sprint_s: number | null;
  forty_m_sprint_s_attempt1: number | null;
  forty_m_sprint_s_attempt2: number | null;
  forty_m_sprint_s_attempt3: number | null;
  run_a_three_s: number | null;
  run_a_three_s_attempt1: number | null;
  run_a_three_s_attempt2: number | null;
  run_a_three_s_attempt3: number | null;
  yo_yo_test_level: number | null;
  yo_yo_test_level_attempt1: number | null;
  yo_yo_test_level_attempt2: number | null;
  yo_yo_test_level_attempt3: number | null;
  created_at: string | null;
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
        long_jump_m_attempt1,
        long_jump_m_attempt2,
        long_jump_m_attempt3,
        ten_m_sprint_s,
        ten_m_sprint_s_attempt1,
        ten_m_sprint_s_attempt2,
        ten_m_sprint_s_attempt3,
        twenty_m_sprint_s,
        twenty_m_sprint_s_attempt1,
        twenty_m_sprint_s_attempt2,
        twenty_m_sprint_s_attempt3,
        forty_m_sprint_s,
        forty_m_sprint_s_attempt1,
        forty_m_sprint_s_attempt2,
        forty_m_sprint_s_attempt3,
        run_a_three_s,
        run_a_three_s_attempt1,
        run_a_three_s_attempt2,
        run_a_three_s_attempt3,
        yo_yo_test_level,
        yo_yo_test_level_attempt1,
        yo_yo_test_level_attempt2,
        yo_yo_test_level_attempt3,
        created_at,
        players(name)
      `)
      .eq('test_date', testDate)
      .in('player_id', playerIdList)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching test results:', error);
      console.log('Query details:', {
        testDate,
        playerIdList,
        selectedBatch
      });
    } else {
      console.log('Raw data from Supabase:', data);
      
      // Transform the data to match our TestResult interface
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData: TestResult[] = data?.map((item: any) => ({
        id: item.id,
        test_date: item.test_date,
        player_id: item.player_id,
        long_jump_m: item.long_jump_m,
        long_jump_m_attempt1: item.long_jump_m_attempt1,
        long_jump_m_attempt2: item.long_jump_m_attempt2,
        long_jump_m_attempt3: item.long_jump_m_attempt3,
        ten_m_sprint_s: item.ten_m_sprint_s,
        ten_m_sprint_s_attempt1: item.ten_m_sprint_s_attempt1,
        ten_m_sprint_s_attempt2: item.ten_m_sprint_s_attempt2,
        ten_m_sprint_s_attempt3: item.ten_m_sprint_s_attempt3,
        twenty_m_sprint_s: item.twenty_m_sprint_s,
        twenty_m_sprint_s_attempt1: item.twenty_m_sprint_s_attempt1,
        twenty_m_sprint_s_attempt2: item.twenty_m_sprint_s_attempt2,
        twenty_m_sprint_s_attempt3: item.twenty_m_sprint_s_attempt3,
        forty_m_sprint_s: item.forty_m_sprint_s,
        forty_m_sprint_s_attempt1: item.forty_m_sprint_s_attempt1,
        forty_m_sprint_s_attempt2: item.forty_m_sprint_s_attempt2,
        forty_m_sprint_s_attempt3: item.forty_m_sprint_s_attempt3,
        run_a_three_s: item.run_a_three_s,
        run_a_three_s_attempt1: item.run_a_three_s_attempt1,
        run_a_three_s_attempt2: item.run_a_three_s_attempt2,
        run_a_three_s_attempt3: item.run_a_three_s_attempt3,
        yo_yo_test_level: item.yo_yo_test_level,
        yo_yo_test_level_attempt1: item.yo_yo_test_level_attempt1,
        yo_yo_test_level_attempt2: item.yo_yo_test_level_attempt2,
        yo_yo_test_level_attempt3: item.yo_yo_test_level_attempt3,
        created_at: item.created_at,
        players: item.players ? { name: item.players.name } : null
      })) || [];

      console.log('Transformed data:', transformedData);
      setSelectedTestResults(transformedData);
    }
  };

  const handleExportSelectedResults = () => {
    if (!selectedTestResults || selectedTestResults.length === 0) {
      alert('No test results selected to export.');
      return;
    }

    try {
      exportToPDF(selectedTestResults, selectedBatch, selectedTestResults[0].test_date);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error generating PDF. Please try again.');
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              Test Results - {formatDate(selectedTestResults[0].test_date)} - All Players ({selectedTestResults.length} players)
            </h3>
            <button
              onClick={handleExportSelectedResults}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
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
                      {result.players?.name || 'Unknown Player'}
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