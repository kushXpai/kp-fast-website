// src/pages/PlayerDashboard/Dashboard.tsx

import { colors } from "../../lib/colors";
import OverviewSection from "./components/dashboard/OverviewSection";
import PlayerStatistics from "./components/dashboard/PlayerStatistics";
import QuickActions from "./components/dashboard/QuickActions";
import PendingPlayerApprovals from "./components/dashboard/PendingPlayerApprovals";
import RecentReports from "./components/dashboard/RecentReports";

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
    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Monitor player health, manage approvals, and track performance metrics</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Daily Report
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Schedule Report
                        </button>
                    </div>
                </div>

                {/* Today's Overview */}
                <OverviewSection />

                {/* Player Statistics */}
                <PlayerStatistics />

                {/* Quick Actions */}
                <QuickActions />

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <PendingPlayerApprovals />
                    </div>
                    {/* <div className="space-y-6">
                        <RecentReports />
                    </div> */}
                </div>
            </div>
        </div>
    );
}