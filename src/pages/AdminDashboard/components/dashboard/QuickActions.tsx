// src/pages/AdminDashboard/components/dashboard/QuickActions.tsx

import { colors } from "../../../../lib/colors";

export default function QuickActions() {
    const actions = [
        {
            title: "Player Analytics",
            description: "View detailed performance and wellness analytics",
            icon: "chart",
            color: "bg-blue-500",
            iconBg: "bg-blue-100"
        },
        {
            title: "Manage Players",
            description: "Add, edit, and organize player groups",
            icon: "users",
            color: "bg-green-500",
            iconBg: "bg-green-100"
        },
        {
            title: "Generate Reports",
            description: "Create and download performance reports",
            icon: "document",
            color: "bg-orange-500",
            iconBg: "bg-orange-100"
        },
        {
            title: "Theme Settings",
            description: "Customize website appearance and branding",
            icon: "settings",
            color: "bg-purple-500",
            iconBg: "bg-purple-100"
        }
    ];

    const getIcon = (iconName: string) => {
        const icons = {
            chart: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            users: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
            document: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            settings: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        };
        return icons[iconName as keyof typeof icons];
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-lg ${action.iconBg} text-${action.color.split('-')[1]}-600`}>
                                {getIcon(action.icon)}
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{action.title}</div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}