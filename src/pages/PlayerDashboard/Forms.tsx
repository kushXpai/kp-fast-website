// src/pages/PlayerDashboard/Forms.tsx

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

interface FormsProps {
  player: Player;
  onNavigate: (tabId: string) => void; // Add this prop for navigation
}

export default function Forms({ onNavigate }: FormsProps) {
  return (
    <div className="flex-1 p-7 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-4xl font-semibold text-gray-800 mb-2">Daily Forms</p>
          <p className="text-xl text-gray-600">
            Complete your daily health tracking forms to maintain optimal performance
          </p>
        </div>

        {/* Health Forms Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hydration Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Hydration Form</h3>
                    <p className="text-sm text-gray-500">3-4 min • Health</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Track fluid balance before and after training</p>
              <button
                onClick={() => onNavigate('hydration-form')}
                className="w-full text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-between bg-green-800 hover:bg-green-900"
              >
                <span>Start Form</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Wellness Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Wellness Form</h3>
                    <p className="text-sm text-gray-500">4-5 min • Health</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Assess how you are feeling overall</p>
              <button
                onClick={() => onNavigate('wellness-form')}
                className="w-full text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-between bg-green-800 hover:bg-green-900"
              >
                <span>Start Form</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Recovery Forms Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recovery Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recovery Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recovery Form</h3>
                    <p className="text-sm text-gray-500">4-6 min • Recovery</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Track recovery methods used after training or match</p>
              <button
                onClick={() => onNavigate('recovery-form')}
                className="w-full text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-between bg-green-800 hover:bg-green-900"
              >
                <span>Start Form</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Forms Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monitoring Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Monitoring Form</h3>
                    <p className="text-sm text-gray-500">5-7 min • Performance</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Track the details of training or match sessions</p>
              <button
                onClick={() => onNavigate('monitoring-form')}
                className="w-full text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-between bg-green-800 hover:bg-green-900"
              >
                <span>Start Form</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Daily Form Tips */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900">Daily Form Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-blue-800 text-sm">Complete forms at the same time each day</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-blue-800 text-sm">Be honest and accurate with your responses</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-blue-800 text-sm">Use the comments section for additional context</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-blue-800 text-sm">Forms reset daily at midnight</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-blue-800 text-sm">Your data helps coaches track your progress</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-blue-800 text-sm">Contact medical staff for urgent concerns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}