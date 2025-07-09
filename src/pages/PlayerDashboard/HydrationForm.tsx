// src/pages/PlayerDashboard/HydrationForm.tsx

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

interface HydrationFormProps {
    player: Player;
}

export default function HydrationForm({ player }: HydrationFormProps) {
    const [formData, setFormData] = useState({
        sessionType: "",
        sessionNumber: "",
        date: new Date().toISOString().split("T")[0],
        preSessionWeight: "",
        postSessionWeight: "",
        liquidConsumed: "",
        urinationOutput: "",
        comments: ""
    });


    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        const { sessionType, date, sessionNumber, preSessionWeight, postSessionWeight, liquidConsumed, urinationOutput, comments } = formData;

        const { error } = await supabase.from("hydration_forms").insert([
            {
                player_id: player.id,
                session_type: sessionType || "training",
                date: date || new Date().toISOString().split("T")[0],
                session_number: sessionNumber || 1,
                pre_session_weight: parseFloat(preSessionWeight) || 0,
                post_session_weight: parseFloat(postSessionWeight) || 0,
                liquid_consumed: parseInt(liquidConsumed) || 0,
                urination_output: parseInt(urinationOutput) || 0,
                comments: comments || "",
            }
        ]);

        if (error) {
            console.error("Error inserting hydration form:", error);
            alert("Failed to submit form. Please try again.");
        } else {
            console.log("Form submitted successfully");
            alert("Hydration form submitted!");
        }

    };

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">Hydration Form</h1>
                            <p className="text-gray-600">Track fluid balance before and after training</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">1-2 min</span>
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
                                <p className="text-blue-900 font-medium">Submitting for: Monday, June 30, 2025</p>
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
                        {/* Session Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Session Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={formData.sessionNumber}
                                onChange={(e) => handleInputChange("sessionNumber", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="1"
                            />
                            <p className="text-gray-500 text-sm mt-1">Which session of the day is this? (1st, 2nd, etc.)</p>
                        </div>


                        {/* Session Type */}
                        <select
                            value={formData.sessionType}
                            onChange={(e) => handleInputChange('sessionType', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select session type</option>
                            <option value="Training">Training</option>
                            <option value="Gym">Gym</option>
                            <option value="Match">Match</option>
                            <option value="Conditioning">Conditioning</option>
                        </select>


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
                            <p className="text-gray-500 text-sm mt-1">Select the date when this session took place</p>
                        </div>


                        {/* Pre-Session Weight */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                                </svg>
                                Pre-Session Weight (kg) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.preSessionWeight}
                                    onChange={(e) => handleInputChange('preSessionWeight', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="70.5"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Enter your weight before the training session</p>
                        </div>

                        {/* Post-Session Weight */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                                </svg>
                                Post-Session Weight (kg) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.postSessionWeight}
                                    onChange={(e) => handleInputChange('postSessionWeight', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="69.8"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Enter your weight after the training session</p>
                        </div>

                        {/* Liquid Consumed */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Liquid Consumed (ml) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.liquidConsumed}
                                    onChange={(e) => handleInputChange('liquidConsumed', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="1500"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">ml</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Total water or fluid intake during the session</p>
                        </div>

                        {/* Urination Output */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Urination Output (ml) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.urinationOutput}
                                    onChange={(e) => handleInputChange('urinationOutput', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="400"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">ml</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Estimated urine output in milliliters during the session</p>
                        </div>

                        {/* Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Comments</label>
                            <textarea
                                value={formData.comments}
                                onChange={(e) => handleInputChange('comments', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Any additional notes about your hydration during this session..."
                            />
                            <p className="text-gray-500 text-sm mt-1">Optional: Add any relevant notes about your hydration experience</p>
                        </div>
                    </div>

                    {/* Hydration Monitoring Tips */}
                    <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-100">
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-semibold text-blue-900">Hydration Monitoring Tips</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                                <p className="text-blue-800 text-sm">Weigh yourself immediately before and after training</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                                <p className="text-blue-800 text-sm">Track all fluids consumed during the session</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                                <p className="text-blue-800 text-sm">Monitor urine output to assess fluid balance</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                                <p className="text-blue-800 text-sm">Weight loss &gt;2% indicates significant dehydration</p>
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
    );
}