// src/pages/PlayerDashboard/WellnessForm.tsx

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

interface WellnessFormProps {
    player: Player;
}

type WellnessRating = '1' | '2' | '3' | '4' | '5';
type MenstrualCycle = 'Yes' | 'No';

export default function WellnessForm({ player }: WellnessFormProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        sleepQuality: '' as WellnessRating,
        physicalReadiness: '' as WellnessRating,
        mood: '' as WellnessRating,
        mentalAlertness: '' as WellnessRating,
        muscleSoreness: '' as WellnessRating,
        menstrualCycle: '' as MenstrualCycle,
        comments: ""
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        const { date, sleepQuality, physicalReadiness, mood, mentalAlertness, muscleSoreness, menstrualCycle, comments } = formData;

        const { error } = await supabase.from("wellness_forms").insert([
            {
                player_id: player.id,
                date: date || new Date().toISOString().split("T")[0],
                sleep_quality: sleepQuality,
                physical_readiness: physicalReadiness,
                mood: mood,
                mental_alertness: mentalAlertness,
                muscle_soreness: muscleSoreness,
                menstrual_cycle: menstrualCycle,
                comments: comments || "",
            }
        ]);

        if (error) {
            console.error("Error inserting wellness form:", error);
            alert("Failed to submit form. Please try again.");
        } else {
            console.log("Form submitted successfully");
            alert("Wellness form submitted!");
        }
    };

    const RatingButton = ({ 
        value, 
        currentValue, 
        onChange, 
        label, 
        description 
    }: { 
        value: WellnessRating; 
        currentValue: WellnessRating; 
        onChange: (value: WellnessRating) => void;
        label: string;
        description: string;
    }) => (
        <button
            type="button"
            onClick={() => onChange(value)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                currentValue === value
                    ? 'bg-blue-50 border-blue-500 text-blue-900'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
        >
            <div className="text-center">
                <div className="text-2xl font-bold mb-1">{value}</div>
                <div className="text-sm font-medium mb-1">{label}</div>
                <div className="text-xs text-gray-600">{description}</div>
            </div>
        </button>
    );

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">Wellness Form</h1>
                            <p className="text-gray-600">Assess how you are feeling overall</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">2-3 min</span>
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
                    <div className="space-y-8">
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
                            <p className="text-gray-500 text-sm mt-1">Date of this wellness entry</p>
                        </div>

                        {/* Sleep Quality */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Sleep Quality <span className="text-red-500">*</span>
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-4">How would you rate the quality of your sleep?</p>
                            <div className="grid grid-cols-5 gap-3">
                                <RatingButton
                                    value="1"
                                    currentValue={formData.sleepQuality}
                                    onChange={(value) => handleInputChange('sleepQuality', value)}
                                    label="Very poor"
                                    description="barely slept"
                                />
                                <RatingButton
                                    value="2"
                                    currentValue={formData.sleepQuality}
                                    onChange={(value) => handleInputChange('sleepQuality', value)}
                                    label="Poor"
                                    description="woke up often"
                                />
                                <RatingButton
                                    value="3"
                                    currentValue={formData.sleepQuality}
                                    onChange={(value) => handleInputChange('sleepQuality', value)}
                                    label="Average"
                                    description="slept okay"
                                />
                                <RatingButton
                                    value="4"
                                    currentValue={formData.sleepQuality}
                                    onChange={(value) => handleInputChange('sleepQuality', value)}
                                    label="Good"
                                    description="slept well"
                                />
                                <RatingButton
                                    value="5"
                                    currentValue={formData.sleepQuality}
                                    onChange={(value) => handleInputChange('sleepQuality', value)}
                                    label="Excellent"
                                    description="deep, uninterrupted sleep"
                                />
                            </div>
                        </div>

                        {/* Physical Readiness */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Physical Readiness <span className="text-red-500">*</span>
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-4">How physically ready do you feel for today&rsquo;s session?</p>
                            <div className="grid grid-cols-5 gap-3">
                                <RatingButton
                                    value="1"
                                    currentValue={formData.physicalReadiness}
                                    onChange={(value) => handleInputChange('physicalReadiness', value)}
                                    label="Extremely tired"
                                    description="very low energy"
                                />
                                <RatingButton
                                    value="2"
                                    currentValue={formData.physicalReadiness}
                                    onChange={(value) => handleInputChange('physicalReadiness', value)}
                                    label="Tired"
                                    description="below average energy"
                                />
                                <RatingButton
                                    value="3"
                                    currentValue={formData.physicalReadiness}
                                    onChange={(value) => handleInputChange('physicalReadiness', value)}
                                    label="Neutral"
                                    description="neither tired nor energized"
                                />
                                <RatingButton
                                    value="4"
                                    currentValue={formData.physicalReadiness}
                                    onChange={(value) => handleInputChange('physicalReadiness', value)}
                                    label="Ready"
                                    description="feel prepared"
                                />
                                <RatingButton
                                    value="5"
                                    currentValue={formData.physicalReadiness}
                                    onChange={(value) => handleInputChange('physicalReadiness', value)}
                                    label="Fully ready"
                                    description="energized and strong"
                                />
                            </div>
                        </div>

                        {/* Mood */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Mood <span className="text-red-500">*</span>
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-4">How is your mood today?</p>
                            <div className="grid grid-cols-5 gap-3">
                                <RatingButton
                                    value="1"
                                    currentValue={formData.mood}
                                    onChange={(value) => handleInputChange('mood', value)}
                                    label="Very low"
                                    description="sad, demotivated"
                                />
                                <RatingButton
                                    value="2"
                                    currentValue={formData.mood}
                                    onChange={(value) => handleInputChange('mood', value)}
                                    label="Low"
                                    description="a little off"
                                />
                                <RatingButton
                                    value="3"
                                    currentValue={formData.mood}
                                    onChange={(value) => handleInputChange('mood', value)}
                                    label="Neutral"
                                    description="okay"
                                />
                                <RatingButton
                                    value="4"
                                    currentValue={formData.mood}
                                    onChange={(value) => handleInputChange('mood', value)}
                                    label="Good"
                                    description="positive"
                                />
                                <RatingButton
                                    value="5"
                                    currentValue={formData.mood}
                                    onChange={(value) => handleInputChange('mood', value)}
                                    label="Great"
                                    description="happy and motivated"
                                />
                            </div>
                        </div>

                        {/* Mental Alertness */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Mental Alertness <span className="text-red-500">*</span>
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-4">How mentally sharp or alert are you feeling right now?</p>
                            <div className="grid grid-cols-5 gap-3">
                                <RatingButton
                                    value="1"
                                    currentValue={formData.mentalAlertness}
                                    onChange={(value) => handleInputChange('mentalAlertness', value)}
                                    label="Very dull"
                                    description="foggy, distracted"
                                />
                                <RatingButton
                                    value="2"
                                    currentValue={formData.mentalAlertness}
                                    onChange={(value) => handleInputChange('mentalAlertness', value)}
                                    label="Dull"
                                    description="somewhat unfocused"
                                />
                                <RatingButton
                                    value="3"
                                    currentValue={formData.mentalAlertness}
                                    onChange={(value) => handleInputChange('mentalAlertness', value)}
                                    label="Average"
                                    description="normal"
                                />
                                <RatingButton
                                    value="4"
                                    currentValue={formData.mentalAlertness}
                                    onChange={(value) => handleInputChange('mentalAlertness', value)}
                                    label="Focused"
                                    description="clear and sharp"
                                />
                                <RatingButton
                                    value="5"
                                    currentValue={formData.mentalAlertness}
                                    onChange={(value) => handleInputChange('mentalAlertness', value)}
                                    label="Very sharp"
                                    description="highly focused, mentally ready"
                                />
                            </div>
                        </div>

                        {/* Muscle Soreness */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Muscle Soreness <span className="text-red-500">*</span>
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-4">How sore do your muscles feel?</p>
                            <div className="grid grid-cols-5 gap-3">
                                <RatingButton
                                    value="1"
                                    currentValue={formData.muscleSoreness}
                                    onChange={(value) => handleInputChange('muscleSoreness', value)}
                                    label="No soreness"
                                    description=""
                                />
                                <RatingButton
                                    value="2"
                                    currentValue={formData.muscleSoreness}
                                    onChange={(value) => handleInputChange('muscleSoreness', value)}
                                    label="Slight tightness"
                                    description=""
                                />
                                <RatingButton
                                    value="3"
                                    currentValue={formData.muscleSoreness}
                                    onChange={(value) => handleInputChange('muscleSoreness', value)}
                                    label="Moderate soreness"
                                    description="affects some movement"
                                />
                                <RatingButton
                                    value="4"
                                    currentValue={formData.muscleSoreness}
                                    onChange={(value) => handleInputChange('muscleSoreness', value)}
                                    label="Sore"
                                    description="painful, may affect training"
                                />
                                <RatingButton
                                    value="5"
                                    currentValue={formData.muscleSoreness}
                                    onChange={(value) => handleInputChange('muscleSoreness', value)}
                                    label="Very sore"
                                    description=""
                                />
                            </div>
                        </div>

                        {/* Menstrual Cycle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-4">
                                Menstrual Cycle (Optional)
                            </label>
                            <p className="text-gray-600 text-sm mb-4">For female athletes</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('menstrualCycle', 'Yes')}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                        formData.menstrualCycle === 'Yes'
                                            ? 'bg-blue-50 border-blue-500 text-blue-900'
                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="text-center font-medium">Yes</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('menstrualCycle', 'No')}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                        formData.menstrualCycle === 'No'
                                            ? 'bg-blue-50 border-blue-500 text-blue-900'
                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="text-center font-medium">No</div>
                                </button>
                            </div>
                        </div>

                        {/* Comments */}
                        <div>
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
                                placeholder="Any other details about your wellness today..."
                            />
                            <p className="text-gray-500 text-sm mt-1">Free-text field for any other details about your wellness</p>
                        </div>
                    </div>

                    {/* Wellness Assessment Tips */}
                    <div className="bg-purple-50 rounded-xl p-6 mt-8 border border-purple-100">
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-purple-900">Wellness Assessment Tips</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                                <p className="text-purple-800 text-sm">Be honest about how you feel - there are no wrong answers</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                                <p className="text-purple-800 text-sm">Consider your overall state right now, not just this moment</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                                <p className="text-purple-800 text-sm">Your responses help coaches optimize training loads</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                                <p className="text-purple-800 text-sm">Track patterns over time for better insights</p>
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