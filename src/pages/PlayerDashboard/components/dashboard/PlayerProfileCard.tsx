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
    player: Player;
    onViewFullProfile: () => void;
}

export default function PlayerProfileCard({ player, onViewFullProfile }: PlayerProfileCardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'batsman':
            case 'batter':
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 5.5L18 8l-7 7-2.5-2.5L15.5 5.5zm-1.41 1.41L9.5 11.5l1 1 4.59-4.59-1-1zM7 18c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                    </svg>
                );
            case 'bowler':
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="4" />
                    </svg>
                );
            case 'allrounder':
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                );
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
                    <h4 className="text-2xl font-bold text-gray-900">{player.name}</h4>
                    <p className="text-lg text-gray-700 font-medium">{player.player_role} | {player.batch}</p>
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
                        <span className="text-gray-600">{player.email}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-4">
                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-gray-600">{player.mobile_number}</span>
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