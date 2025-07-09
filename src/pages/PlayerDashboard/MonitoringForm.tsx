// src/pages/PlayerDashboard/MonitoringForm.tsx

import { useState, useEffect } from "react";
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

interface MonitoringFormProps {
    player: Player;
}

const RPE_SCALE = {
    1: "Nothing",
    2: "Very Easy",
    3: "Easy",
    4: "Comfortable",
    5: "Somewhat Difficult",
    6: "Difficult",
    7: "Hard",
    8: "Very Hard",
    9: "Extremely Hard",
    10: "Maximal/Exhaustion",
};

export default function MonitoringForm({ player }: MonitoringFormProps) {
    const [formData, setFormData] = useState({
        sessionNumber: "",
        date: new Date().toISOString().split("T")[0],
        sessionType: "",
        sessionDuration: "90",
        sessionIntensity: "5",
        ballsBowled: "",
        comments: ""
    });

    useEffect(() => {
        // Load draft if exists
        const draft = localStorage.getItem('monitoring_form_draft');
        if (draft) {
            try {
                const draftData = JSON.parse(draft);
                setFormData(prev => ({ ...prev, ...draftData }));
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        const { sessionNumber, date, sessionType, sessionDuration, sessionIntensity, ballsBowled, comments } = formData;

        if (!(Number(sessionNumber) >= 1 && Number(sessionNumber) <= 5)) {
            alert("Please select a valid session number between 1 and 5.");
            return;
        }

        const { error } = await supabase.from("monitoring_forms").insert([
            {
                player_id: player.id,
                session_number: parseInt(sessionNumber) || 1,
                date: date || new Date().toISOString().split("T")[0],
                session_type: sessionType || "Training",
                session_duration: parseInt(sessionDuration) || 90,
                session_intensity: sessionIntensity || "5",
                balls_bowled: ballsBowled ? parseInt(ballsBowled) : null,
                comments: comments || "",
            }
        ]);

        if (error) {
            console.error("Error inserting monitoring form:", error);
            alert("Failed to submit form. Please try again.");
        } else {
            console.log("Form submitted successfully");
            alert("Monitoring form submitted!");
            // Reset form
            setFormData({
                sessionNumber: "",
                date: new Date().toISOString().split("T")[0],
                sessionType: "",
                sessionDuration: "90",
                sessionIntensity: "5",
                ballsBowled: "",
                comments: ""
            });
            // Clear draft
            localStorage.removeItem('monitoring_form_draft');
        }
    };

    const getCurrentIntensityLabel = () => {
        const intensity = parseInt(formData.sessionIntensity);
        return RPE_SCALE[intensity as keyof typeof RPE_SCALE] || "Moderate";
    };

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">Monitoring Form</h1>
                            <p className="text-gray-600">Track the details of training or match sessions</p>
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
                                <p className="text-blue-900 font-medium">Submitting for: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                            <h2 className="text-xl font-semibold text-gray-900">Session Details</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Please provide accurate information about your training session. This data helps our coaching staff monitor your performance and progress.
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
                            <p className="text-gray-500 text-sm mt-1">Date of the session</p>
                        </div>

                        {/* Session Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Session Number <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.sessionNumber}
                                onChange={(e) => handleInputChange('sessionNumber', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select session number</option>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            <p className="text-gray-500 text-sm mt-1">Pick the session number for today (1 to 5 max)</p>
                        </div>


                        {/* Session Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Session Type <span className="text-red-500">*</span>
                            </label>
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
                            <p className="text-gray-500 text-sm mt-1">Type of training or session conducted</p>
                        </div>

                        {/* Session Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Session Duration (minutes) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.sessionDuration}
                                    onChange={(e) => handleInputChange('sessionDuration', e.target.value)}
                                    className="w-full px-4 py-3 pr-20 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="90"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">minutes</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Total time spent in the session</p>
                        </div>

                        {/* Session Intensity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                                Session Intensity <span className="text-red-500">*</span>
                            </label>
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Rate the intensity of your session</span>
                                    <span className="text-lg font-semibold text-blue-600">
                                        {formData.sessionIntensity}/10 - {getCurrentIntensityLabel()}
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="1"
                                        value={formData.sessionIntensity}
                                        onChange={(e) => handleInputChange('sessionIntensity', e.target.value)}
                                        className="w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>1 - Nothing</span>
                                        <span>5 - Moderate</span>
                                        <span>10 - Maximum</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Balls Bowled */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                                </svg>
                                Balls Bowled (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.ballsBowled}
                                    onChange={(e) => handleInputChange('ballsBowled', e.target.value)}
                                    className="w-full px-4 py-3 pr-16 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">balls</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Number of balls bowled (for bowlers only)</p>
                        </div>

                        {/* Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <svg className="w-4 h-4 inline mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Comments
                            </label>
                            <textarea
                                value={formData.comments}
                                onChange={(e) => handleInputChange('comments', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Free-form notes or insights about the session..."
                            />
                            <p className="text-gray-500 text-sm mt-1">Add any insights, observations, or notes about this session</p>
                        </div>
                    </div>

                    {/* Session Monitoring Tips */}
                    <div className="bg-orange-50 rounded-xl p-6 mt-8 border border-orange-100">
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-semibold text-orange-900">Session Monitoring Tips</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                                <p className="text-orange-800 text-sm">Rate intensity based on your perceived exertion</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                                <p className="text-orange-800 text-sm">Be specific about session type for better tracking</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                                <p className="text-orange-800 text-sm">Include coach feedback details in comments</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                                <p className="text-orange-800 text-sm">Track match performance honestly for improvement</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Submit Form</span>
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
                        <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-yellow-800 text-sm">
                                    <span className="font-medium">Need help?</span> Contact your coach or medical staff if you have any questions about completing this form. For urgent medical concerns, please seek immediate medical attention.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}