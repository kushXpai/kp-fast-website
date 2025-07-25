// src/pages/PlayerDashboard/Programs.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { Search, Filter, Calendar, Video, Play, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import Image from 'next/image';

// Types based on your database schema
type FitnessCategoryEnum =
    | 'Strength Training'
    | 'Cardio'
    | 'Flexibility'
    | 'Weight Loss'
    | 'Muscle Building'
    | 'Endurance'
    | 'Rehabilitation'
    | 'Sports Specific'
    | 'General Fitness';

type BatchEnum = 'Baroda Cricket Association' | 'Delhi Capitals';

interface Program {
    id: string;
    title: string;
    category: FitnessCategoryEnum;
    batch: BatchEnum;
    description: string;
    youtube_video_urls: string[];
    created_at: string;
    updated_at: string;
}

interface PlayerProgramsProps {
    playerBatch?: BatchEnum; // This should be passed from parent component or context
}

const Programs: React.FC<PlayerProgramsProps> = ({ playerBatch = 'Baroda Cricket Association'}) => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const categories: FitnessCategoryEnum[] = [
        'Strength Training',
        'Cardio',
        'Flexibility',
        'Weight Loss',
        'Muscle Building',
        'Endurance',
        'Rehabilitation',
        'Sports Specific',
        'General Fitness'
    ];

    // Fetch programs from database for player's team
    const fetchPrograms = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('programs')
                .select('*')
                .eq('batch', playerBatch)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching programs:', error);
                return;
            }

            setPrograms(data || []);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setIsLoading(false);
        }
    }, [playerBatch]);

    useEffect(() => {
        fetchPrograms();
    }, [playerBatch, fetchPrograms]);

    const getYouTubeVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const getYouTubeThumbnail = (url: string) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    const openYouTubeVideo = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Filter programs based on search and category
    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || program.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Calculate stats
    const totalPrograms = programs.length;
    const categoriesCount = [...new Set(programs.map(p => p.category))].length;
    const programsWithVideos = programs.filter(p => p.youtube_video_urls.length > 0).length;
    const recentPrograms = programs.filter(p => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(p.created_at) > weekAgo;
    }).length;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen text-black bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Training Programs</h1>
                    <p className="text-gray-600 mt-1">
                        Fitness programs assigned to {playerBatch}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Programs</p>
                                <p className="text-2xl font-bold text-gray-900">{totalPrograms}</p>
                            </div>
                            <div className="text-blue-500">
                                <BookOpen size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{categoriesCount}</p>
                            </div>
                            <div className="text-green-600">
                                <Filter size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">With Videos</p>
                                <p className="text-2xl font-bold text-gray-900">{programsWithVideos}</p>
                            </div>
                            <div className="text-orange-500">
                                <Video size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">New This Week</p>
                                <p className="text-2xl font-bold text-gray-900">{recentPrograms}</p>
                            </div>
                            <div className="text-purple-500">
                                <Calendar size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Search size={20} className="text-gray-500" />
                        <h2 className="text-lg font-semibold">Search & Filter Programs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="All Categories">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Programs List */}
                <div className="bg-white rounded-lg shadow-sm">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading your programs...</p>
                        </div>
                    ) : filteredPrograms.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <BookOpen size={48} className="mx-auto mb-4" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {programs.length === 0 ? 'No Programs Available' : 'No Matching Programs'}
                            </h3>
                            <p className="text-gray-600">
                                {programs.length === 0
                                    ? 'Your coach hasn\'t assigned any programs yet. Check back later!'
                                    : 'Try adjusting your search criteria or filters.'}
                            </p>
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Available Programs ({filteredPrograms.length})
                                </h3>
                                <button
                                    onClick={fetchPrograms}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Refresh
                                </button>
                            </div>
                            <div className="grid gap-4">
                                {filteredPrograms.map((program) => (
                                    <div
                                        key={program.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => setSelectedProgram(program)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900">{program.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{program.description}</p>
                                                <div className="flex gap-4 mt-3">
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {program.category}
                                                    </span>
                                                    {program.youtube_video_urls.length > 0 && (
                                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center gap-1">
                                                            <Play size={12} />
                                                            {program.youtube_video_urls.length} video{program.youtube_video_urls.length > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right text-sm text-gray-500">
                                                <p>Added: {formatDate(program.created_at)}</p>
                                                {program.updated_at !== program.created_at && (
                                                    <p>Updated: {formatDate(program.updated_at)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Program Details Modal */}
            {selectedProgram && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProgram.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {selectedProgram.category}
                                        </span>
                                        <span>{formatDate(selectedProgram.created_at)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProgram(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Training Videos Section */}
                            {selectedProgram.youtube_video_urls && selectedProgram.youtube_video_urls.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Training Videos ({selectedProgram.youtube_video_urls.length})
                                    </h3>

                                    {/* Video Preview Thumbnails */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        {selectedProgram.youtube_video_urls.map((url, index) => (
                                            <div key={index} className="text-center">
                                                <span className="text-sm text-gray-500 mb-2 block">
                                                    Video {index + 1}
                                                </span>
                                                <div
                                                    className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => openYouTubeVideo(url)}
                                                >
                                                    <Image
                                                        src={getYouTubeThumbnail(url) || '/api/placeholder/320/180'}
                                                        alt={`Video ${index + 1} thumbnail`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/api/placeholder/320/180';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                                        <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors">
                                                            <Play size={20} fill="white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Program Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedProgram.description}</p>
                                </div>
                            </div>

                            {/* Program Info */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">Program Category</h4>
                                    <p className="text-blue-700">{selectedProgram.category}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-900 mb-2">Assigned Team</h4>
                                    <p className="text-green-700">{selectedProgram.batch}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Last updated: {formatDate(selectedProgram.updated_at)}
                                </p>
                                <button
                                    onClick={() => setSelectedProgram(null)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programs;