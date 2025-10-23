import React, { useState } from 'react';
import { GitBranch, PlaySquare, MapPin, BarChart3, Radio, Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Alerts from './components/Alerts';

function App() {
  const [activeSidebarTab, setActiveSidebarTab] = useState('Telematics');
  const [activeSubTab, setActiveSubTab] = useState('Dashboard');

  const sidebarItems = [
    { id: 'Activity', name: 'Activity', icon: GitBranch },
    { id: 'Incidents', name: 'Incidents', icon: PlaySquare },
    { id: 'Geofences', name: 'Geofences', icon: MapPin },
    { id: 'Reports', name: 'Reports', icon: BarChart3 },
    { id: 'Telematics', name: 'Telematics', icon: Radio },
  ];

  const telematicsSubTabs = ['Dashboard', 'Vehicles', 'Alerts'];

  const renderContent = () => {
    if (activeSidebarTab !== 'Telematics') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{activeSidebarTab}</h2>
            <p className="text-gray-500">This section is coming soon</p>
          </div>
        </div>
      );
    }

    switch (activeSubTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Vehicles':
        return <Vehicles />;
      case 'Alerts':
        return <Alerts />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f5f5] text-slate-800 overflow-hidden">
      {/* Sidebar - Nexar Style */}
      <div className="w-[72px] bg-[#5b4b9d] flex flex-col items-center py-4 space-y-2">
        {/* Logo */}
        <div className="mb-4">
          <div className="w-10 h-10 bg-[#5b4b9d] rounded flex items-center justify-center">
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="text-white">
              <path d="M10 0L0 12L7 12L7 24L20 12L13 12L10 0Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Navigation Items */}
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSidebarTab(item.id)}
              className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-colors relative ${
                isActive ? 'bg-[#6d5ba7] text-white' : 'text-white/60 hover:text-white hover:bg-[#6d5ba7]/40'
              }`}
            >
              <Icon className="w-6 h-6 mb-0.5" strokeWidth={1.5} />
              <span className="text-[9px] font-medium">{item.name}</span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r"></div>
              )}
            </button>
          );
        })}

        {/* More button at bottom */}
        <div className="flex-1"></div>
        <button className="w-14 h-14 rounded-lg flex flex-col items-center justify-center text-white/60 hover:text-white hover:bg-[#6d5ba7]/40 transition-colors">
          <Menu className="w-6 h-6 mb-0.5" strokeWidth={1.5} />
          <span className="text-[9px] font-medium">More</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Telematics Sub-Tabs */}
        {activeSidebarTab === 'Telematics' && (
          <div className="bg-white border-b border-gray-200 px-6 flex gap-1">
            {telematicsSubTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeSubTab === tab
                    ? 'text-[#5b4b9d]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeSubTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b4b9d]"></div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-[#f5f5f5] p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
