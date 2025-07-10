// src/pages/AdminDashboard/components/programs/ProgramDetailsPopup.tsx

import React from 'react';
import { X, Play } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  category: string;
  batch: string;
  description: string;
  youtube_video_urls: string[];
  created_at: string;
  updated_at: string;
}

interface ProgramDetailsPopupProps {
  program: Program;
  onClose: () => void;
}

const ProgramDetailsPopup: React.FC<ProgramDetailsPopupProps> = ({ program, onClose }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {program.category}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {program.batch}
                </span>
                <span>{formatDate(program.created_at)}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Training Videos Section */}
          {program.youtube_video_urls && program.youtube_video_urls.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Training Videos ({program.youtube_video_urls.length})
              </h3>
              
              {/* Video Preview Thumbnails */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {program.youtube_video_urls.map((url, index) => (
                  <div key={index} className="text-center">
                    <span className="text-sm text-gray-500 mb-2 block">
                      Video {index + 1}
                    </span>
                    <div 
                      className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openYouTubeVideo(url)}
                    >
                      <img
                        src={getYouTubeThumbnail(url) || '/api/placeholder/320/180'}
                        alt={`Video ${index + 1} thumbnail`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors">
                          <Play size={16} fill="white" />
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
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{program.description}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsPopup;