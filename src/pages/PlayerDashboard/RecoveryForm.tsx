// src/pages/PlayerDashboard/RecoveryForm.tsx

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

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

interface RecoveryFormProps {
    player: Player;
}

type RecoveryMethod = 'Ice Bath' | 'Massage' | 'Stretching' | 'Compression Boots' | 'Game Ready' | 'Meditation';
type InjuryStatus = 'Yes' | 'No';

export default function RecoveryForm({ player }: RecoveryFormProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        recoveryMethods: [] as RecoveryMethod[],
        injuryPresent: 'No' as InjuryStatus,
        comments: ""
    });

    const recoveryMethodOptions: RecoveryMethod[] = [
        'Ice Bath', 'Massage', 'Stretching', 'Compression Boots', 'Game Ready', 'Meditation'
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRecoveryMethodToggle = (method: RecoveryMethod) => {
        setFormData(prev => ({
            ...prev,
            recoveryMethods: prev.recoveryMethods.includes(method)
                ? prev.recoveryMethods.filter(m => m !== method)
                : [...prev.recoveryMethods, method]
        }));
    };

    const handleInjuryStatusChange = (status: InjuryStatus) => {
        setFormData(prev => ({
            ...prev,
            injuryPresent: status
        }));
    };

    const handleSubmit = async () => {
        const { date, recoveryMethods, injuryPresent, comments } = formData;

        if (recoveryMethods.length === 0) {
            alert("Please select at least one recovery method.");
            return;
        }

        const { error } = await supabase.from("recovery_forms").insert([
            {
                player_id: player.id,
                date: date || new Date().toISOString().split("T")[0],
                recovery_methods: recoveryMethods,
                injury_present: injuryPresent,
                comments: comments || "",
            }
        ]);

        if (error) {
            console.error("Error inserting recovery form:", error);
            alert("Failed to submit form. Please try again.");
        } else {
            console.log("Form submitted successfully");
            alert("Recovery form submitted!");
            // Reset form
            setFormData({
                date: new Date().toISOString().split("T")[0],
                recoveryMethods: [],
                injuryPresent: 'No',
                comments: ""
            });
        }
    };

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">Recovery Form</h1>
                            <p className="text-gray-600">Track recovery methods used after training or match</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                medium Priority
                            </div>
                            <div className="flex items-center text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">4-6 min</span>
                            </div>
                        </div>
                    </div>

                    {/* Date Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-blue-900 font-medium">Submitting for: Tuesday, July 1, 2025</p>
                                <p className="text-blue-700 text-sm">Make sure all information is accurate for today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    {/* Daily Health Check Section */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <h2 className="text-xl font-semibold text-gray-900">Daily Health Check</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Please provide accurate information about your current status. This data helps our coaching staff monitor your health and performance.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-gray-500 text-sm mt-1">Date of recovery log</p>
                        </div>

                        {/* Recovery Methods Used */}
                        <div className="mt-8">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">Recovery Methods Used</h3>
                            </div>
                            <p className="text-gray-600 mb-4">Select all recovery methods that were used</p>

                            <div className="grid grid-cols-2 gap-4">
                                {recoveryMethodOptions.map((method) => (
                                    <label key={method} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.recoveryMethods.includes(method)}
                                            onChange={() => handleRecoveryMethodToggle(method)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-gray-900">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Injury Present */}
                        <div className="mt-8">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">Injury Present <span className="text-red-500">*</span></h3>
                            </div>
                            <p className="text-gray-600 mb-4">Indicate if there&rsquo;s any injury present</p>

                            <div className="grid grid-cols-2 gap-4">
                                <label
                                    className={`flex items-center justify-center space-x-2 p-4 border rounded-xl cursor-pointer transition-colors ${formData.injuryPresent === 'No'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="injuryPresent"
                                        value="No"
                                        checked={formData.injuryPresent === 'No'}
                                        onChange={() => handleInjuryStatusChange('No')}
                                        className="sr-only"
                                    />
                                    <div className={`w-3 h-3 rounded-full ${formData.injuryPresent === 'No' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <span className="font-medium">No</span>
                                    <div className="text-sm text-gray-600">No injuries present</div>
                                </label>

                                <label
                                    className={`flex items-center justify-center space-x-2 p-4 border rounded-xl cursor-pointer transition-colors ${formData.injuryPresent === 'Yes'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="injuryPresent"
                                        value="Yes"
                                        checked={formData.injuryPresent === 'Yes'}
                                        onChange={() => handleInjuryStatusChange('Yes')}
                                        className="sr-only"
                                    />
                                    <div className={`w-3 h-3 rounded-full ${formData.injuryPresent === 'Yes' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                    <span className="font-medium">Yes</span>
                                    <div className="text-sm text-gray-600">Injury present</div>
                                </label>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="mt-8">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                Comments
                            </label>
                            <textarea
                                value={formData.comments}
                                onChange={(e) => handleInputChange('comments', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Additional notes about recovery or condition..."
                            />
                            <p className="text-gray-500 text-sm mt-1">Any additional notes about your recovery or current condition</p>
                        </div>

                        {/* Recovery Best Practices */}
                        <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-100">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-blue-900">Recovery Best Practices</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                                    <p className="text-blue-800 text-sm">Use multiple recovery methods for optimal results</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                                    <p className="text-blue-800 text-sm">Complete recovery activities within 2 hours post-session</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                                    <p className="text-blue-800 text-sm">Report any injuries or pain immediately to medical staff</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                                    <p className="text-blue-800 text-sm">Consistency in recovery methods improves effectiveness</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                            >
                                Submit Form
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
                            <p className="text-yellow-800 text-sm">
                                <span className="font-medium">Need help?</span> Contact your coach or medical staff if you have any questions about completing this form. For urgent medical concerns, please seek immediate medical attention.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}