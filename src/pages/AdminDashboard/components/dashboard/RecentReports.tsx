// src/pages/AdminDashboard/components/dashboard/RecentReports.tsx

export default function RecentReports() {
    const reports = [
        {
            title: "Weekly Wellness Summary",
            type: "Wellness Report",
            timeAgo: "30 minutes ago",
            status: "completed"
        },
        {
            title: "Team Performance Analysis",
            type: "Performance Report",
            timeAgo: "2 hours ago",
            status: "completed"
        },
        {
            title: "Recovery Trends Report",
            type: "Recovery Report",
            timeAgo: "1 day ago",
            status: "completed"
        }
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="text-blue-500 mr-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View All Reports
                </button>
            </div>

            <div className="space-y-4">
                {reports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                            <div className="text-xs text-gray-500">{report.type}</div>
                            <div className="text-xs text-gray-400">
                                Generated {report.timeAgo}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {report.status}
                            </span>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}