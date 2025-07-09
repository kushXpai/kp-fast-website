// src/pages/PlayerDashboard/components/dashboard/PlayerProfileCard.tsx

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

interface PlayerProfileCardProps {
    player?: Player;
    onViewFullProfile?: () => void;
}

// Default props for when this component is accessed as a page
const defaultPlayer: Player = {
    id: "default",
    name: "Default Player",
    mobile_number: "+1234567890",
    username: "defaultuser",
    email: "default@example.com",
    date_of_birth: "1990-01-01",
    batch: "2024",
    batter_type: "Right-handed",
    player_role: "All-rounder",
    bowler_type: "Right-arm medium",
    is_approved: true,
    created_at: new Date().toISOString()
};

export default function PlayerProfileCard({ 
    player = defaultPlayer, 
    onViewFullProfile = () => {} 
}: PlayerProfileCardProps) {
    if (!player) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                        <p className="text-gray-500">Loading player profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    const getInitials = (name: string) => {
        if (!name) return "N/A";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });
        } catch (error) {
            return "Invalid date";
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8">
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Player Profile</h3>
            </div>

            <div className="flex items-center justify-start space-x-6 mb-8">
                {/* Initials Avatar on Left */}
                <div className="w-20 h-20 bg-gradient-to-br from-green-700 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {getInitials(player.name)}
                </div>

                {/* Name, Role, and Batch on Right */}
                <div className="flex flex-col">
                    <h4 className="text-2xl font-bold text-gray-900">{player.name || "Unknown Player"}</h4>
                    <p className="text-lg text-gray-700 font-medium">
                        {player.player_role || "Unknown Role"} | {player.batch || "Unknown Batch"}
                    </p>
                </div>
            </div>

            {/* Profile Content */}
            <div className="text-center">
                {/* Contact Information */}
                <div className="space-y-6 text-left mb-8">
                    {/* Email */}
                    <div className="flex items-center space-x-4">
                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="text-gray-600">{player.email || "No email provided"}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-4">
                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-gray-600">{player.mobile_number || "No phone provided"}</span>
                    </div>

                    {/* Join Date */}
                    <div className="flex items-center space-x-4">
                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600">Joined {formatDate(player.created_at)}</span>
                    </div>
                </div>

                {/* View Full Profile Button */}
                <button
                    onClick={onViewFullProfile}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors text-lg"
                >
                    View Full Profile
                </button>
            </div>
        </div>
    );
}