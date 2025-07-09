// src/pages/PlayerDashboard/Dashboard.tsx

import { colors } from "../../lib/colors";
import PlayerProfileCard from "./components/dashboard/PlayerProfileCard";
import RecentSubmissionsCard from "./components/dashboard/RecentSubmissionsCard";

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

interface DashboardProps {
    player: Player;
    onNavigate: (tabId: string) => void;
}

export default function Dashboard({ player, onNavigate }: DashboardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // const formatDate = (dateString: string) => {
    //     return new Date(dateString).toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric'
    //     });
    // };

    const handleViewFullProfile = () => {
        onNavigate('history');
    };

    return (
        <div className="flex-1 bg-gray-50">
            {/* Mobile Layout */}
            <div className="block lg:hidden">
                <div className="p-4 space-y-4">
                    {/* Welcome Header - Mobile */}
                    <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)` }}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            >
                                {getInitials(player.name)}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-1">Welcome back, {player.name}!</h2>
                                <p className="text-blue-100 text-sm">Last activity: Today, 9:30 AM</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm mb-2">Today&rsquo;s Progress</p>
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 h-3 bg-white bg-opacity-20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: '75%',
                                            background: `linear-gradient(90deg, ${colors.accent[500]} 0%, ${colors.accent[400]} 100%)`
                                        }}
                                    ></div>
                                </div>
                                <span className="text-white font-semibold">75%</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-2"></div>

                    {/* Stats - Mobile */}
                    {/* <StatsCard
                        player={player}
                        onViewFullProfile={() => onNavigate('profile')}
                    /> */}

                    <div className="h-2"></div>

                    {/* Daily Health Forms - Mobile Cards */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 px-2">Daily Health Forms</h3>

                        {/* Hydration Form */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">Hydration Form</h4>
                                        <p className="text-sm text-gray-600">Track fluid balance before and after training</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">high</span>
                            </div>
                            <button
                                onClick={() => onNavigate('hydration-form')}
                                className="w-full bg-green-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-900 transition-colors flex items-center justify-between">
                                <span>Start Form</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Wellness Form */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">Wellness Form</h4>
                                        <p className="text-sm text-gray-600">Assess how you are feeling overall</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">high</span>
                            </div>
                            <button onClick={() => onNavigate('wellness-form')} className="w-full bg-green-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-900 transition-colors flex items-center justify-between">
                                <span>Start Form</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Recovery Form */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">Recovery Form</h4>
                                        <p className="text-sm text-gray-600">Track recovery methods used after training or match</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">medium</span>
                            </div>
                            <button onClick={() => onNavigate('recovery-form')} className="w-full bg-green-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-900 transition-colors flex items-center justify-between">
                                <span>Start Form</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Monitoring Form */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">Monitoring Form</h4>
                                        <p className="text-sm text-gray-600">Track the details of training or match sessions</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">medium</span>
                            </div>
                            <button onClick={() => onNavigate('monitoring-form')} className="w-full bg-green-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-900 transition-colors flex items-center justify-between">
                                <span>Start Form</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="h-2"></div>

                    {/* Recent Submissions - Mobile */}
                    <div className="lg:col-span-1 xl:col-span-2">
                        <RecentSubmissionsCard
                            player={player}
                            onViewFullProfile={handleViewFullProfile}
                            onNavigate={onNavigate}
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block p-6">
                <div className="rounded-2xl p-8 text-white mb-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)` }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            >
                                {getInitials(player.name)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-1">Welcome back, {player.name}!</h2>
                                <p className="text-blue-100 text-lg">Last activity: Today, 9:30 AM</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100 text-sm mb-2">Today&rsquo;s Progress</p>
                            <div className="flex items-center space-x-3">
                                <div className="w-24 h-3 bg-white bg-opacity-20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: '75%',
                                            background: `linear-gradient(90deg, ${colors.accent[500]} 0%, ${colors.accent[400]} 100%)`
                                        }}
                                    ></div>
                                </div>
                                <span className="text-white font-semibold text-lg">75%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        {/* <StatsCard
                            player={player}
                            onViewFullProfile={() => onNavigate('profile')}
                        /> */}

                        {/* Daily Health Forms */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Daily Health Forms</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Hydration Form */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Hydration Form</h4>
                                                <p className="text-sm text-gray-600">Track fluid balance before and after training</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">high</span>
                                    </div>
                                    <button onClick={() => onNavigate('hydration-form')} className="w-full bg-green-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-900 transition-colors">
                                        Start Form
                                    </button>
                                </div>

                                {/* Wellness Form */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Wellness Form</h4>
                                                <p className="text-sm text-gray-600">Assess how you are feeling overall</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">high</span>
                                    </div>
                                    <button onClick={() => onNavigate('wellness-form')} className="w-full bg-green-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-900 transition-colors">
                                        Start Form
                                    </button>
                                </div>

                                {/* Recovery Form */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Recovery Form</h4>
                                                <p className="text-sm text-gray-600">Track recovery methods used after training or match</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">medium</span>
                                    </div>
                                    <button onClick={() => onNavigate('recovery-form')} className="w-full bg-green-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-900 transition-colors">
                                        Start Form
                                    </button>
                                </div>

                                {/* Monitoring Form */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Monitoring Form</h4>
                                                <p className="text-sm text-gray-600">Track the details of training or match sessions</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">medium</span>
                                    </div>
                                    <button onClick={() => onNavigate('monitoring-form')} className="w-full bg-green-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-900 transition-colors">
                                        Start Form
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Submissions */}
                        <div className="lg:col-span-1 xl:col-span-2">
                            <RecentSubmissionsCard
                                player={player}
                                onViewFullProfile={handleViewFullProfile}
                                onNavigate={onNavigate}
                            />
                        </div>

                        {/* Player Profile Card */}
                        <PlayerProfileCard
                            player={player}
                            onViewFullProfile={() => onNavigate('profile')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}