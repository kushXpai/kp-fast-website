// src/pages/AdminDashboard/index.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dashboard from './Dashboard';
import PendingApprovals from './PendingApprovals';

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

// Navigation Component
type NavigationProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  player: Player | null;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const Navigation = ({ activeTab, onTabChange, player, onLogout, isOpen, onClose }: NavigationProps) => {


  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 z-30 w-64 bg-white min-h-screen border-r border-gray-200 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">KP FAST</h1>
                <p className="text-sm text-gray-500">Admin Portal</p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-4 pb-6">
          {[
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              )
            },
            {
              id: 'pending-approvals',
              label: 'Pending Approvals',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              )
            },
            {
              id: 'programs',
              label: 'Programs',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11zm2 0a1 1 0 100 2h.01a1 1 0 100-2H13zm-4-2a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11zm2 0a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" />
                </svg>
              )
            },
            {
              id: 'tests',
              label: 'Tests',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              )
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mb-1 ${activeTab === tab.id
                ? 'bg-green-800 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full text-xl bg-orange-500 text-white hover:bg-red-800 text-center px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

// Mobile Header Component
type MobileHeaderProps = {
  onMenuClick: () => void;
  player: Player | null;
};

const MobileHeader = ({ onMenuClick, player }: MobileHeaderProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-gray-900">KP FAST</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">
            {player ? getInitials(player.name) : 'A'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function AdminDashboard() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        const parsedAdmin = JSON.parse(adminData);
        setPlayer(parsedAdmin);
      } else {
        // No admin data found, redirect to login
        router.push('/Admin/Login');
        return;
      }
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.push('/Admin/Login');
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/Admin/Login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'pending-approvals') {
    setActiveTab('pending-approvals');
  }
  };

  const renderContent = () => {
    if (!player) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard player={player} onNavigate={setActiveTab} />;
      case 'players':
        return <PendingApprovals player={player} onNavigate={handleTabChange} />;
      case 'pending-approvals':
        return <PendingApprovals player={player} onNavigate={handleTabChange} />;
      case 'programs':
        return <div>Programs Component</div>;
      case 'tests':
        return <div>Tests Component</div>;
      default:
        return <Dashboard player={player} onNavigate={setActiveTab} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return null; // This will be handled by the redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={toggleSidebar} player={player} />

      {/* Sidebar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        player={player}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main content area */}
      <div className="lg:ml-64">
        <div className="lg:p-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}