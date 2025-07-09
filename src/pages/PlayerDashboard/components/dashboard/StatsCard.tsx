// src/pages/PlayerDashboard/components/dashboard/StatsCard.tsx

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

interface StatsCardProps {
    player: Player;
    onViewFullProfile: () => void;
}

export default function StatsCard({ player, onViewFullProfile }: StatsCardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">85%</div>
                    <div className="text-sm text-gray-600 mb-1">Weekly Average</div>
                    <div className="text-xs text-gray-500">Form Completion</div>
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
                    <div className="text-sm text-gray-600 mb-1">Current Streak</div>
                    <div className="text-xs text-gray-500">Days Active</div>
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-1">9.2</div>
                    <div className="text-sm text-gray-600 mb-1">Performance</div>
                    <div className="text-xs text-gray-500">Average Rating</div>
                </div>
            </div>
        </div>
    );
}