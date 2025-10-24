import React, { useState } from 'react';
import { Menu, Wrench } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Alerts from './components/Alerts';
import ChatBot from './components/ChatBot';
import { generateFleetMetrics, generateVehicleData } from './data/dummyData';

// Import icon images
import activityIcon from '../icons/activity.png';
import incidentsIcon from '../icons/incidents.png';
import geofencesIcon from '../icons/geofences.png';
import reportsIcon from '../icons/reports.png';
import nexarLogo from '../icons/nexar.png';

function App() {
  const [activeSidebarTab, setActiveSidebarTab] = useState('Telematics');
  const [activeSubTab, setActiveSubTab] = useState('Dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const sidebarItems = [
    { id: 'Activity', name: 'Activity', icon: activityIcon, isImage: true },
    { id: 'Incidents', name: 'Incidents', icon: incidentsIcon, isImage: true },
    { id: 'Geofences', name: 'Geofences', icon: geofencesIcon, isImage: true },
    { id: 'Reports', name: 'Reports', icon: reportsIcon, isImage: true },
    { id: 'Telematics', name: 'Telematics', icon: Wrench, isImage: false },
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
        return <Dashboard isChatOpen={isChatOpen} />;
      case 'Vehicles':
        return <Vehicles />;
      case 'Alerts':
        return <Alerts />;
      default:
        return <Dashboard isChatOpen={isChatOpen} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f5f5] text-slate-800 overflow-hidden">
      {/* Sidebar - Nexar Style */}
      <div className="w-[72px] bg-[#5b4b9d] flex flex-col items-center py-4 space-y-2">
        {/* Logo */}
        <div className="mb-4">
          <img 
            src={nexarLogo} 
            alt="Nexar Logo" 
            className="w-6 h-6 object-contain"
          />
        </div>

        {/* Navigation Items */}
        {sidebarItems.map((item) => {
          const isActive = activeSidebarTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSidebarTab(item.id)}
              className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-colors relative ${
                isActive ? 'bg-[#6d5ba7] text-white' : 'text-white/60 hover:text-white hover:bg-[#6d5ba7]/40'
              }`}
            >
              {item.isImage ? (
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className={`w-6 h-6 mb-0.5 object-contain ${!isActive ? 'opacity-60' : 'opacity-100'}`}
                />
              ) : (
                <Icon className="w-6 h-6 mb-0.5" strokeWidth={1.5} />
              )}
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
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{
          marginRight: isChatOpen ? 'calc(33.333% + 0px)' : '0'
        }}
      >
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

      {/* AI Chatbot - Available across all pages */}
      {activeSidebarTab === 'Telematics' && (
        <ChatBot 
          fleetData={generateFleetMetrics()}
          vehicleData={generateVehicleData()}
          currentPage={activeSubTab}
          onOpenChange={setIsChatOpen}
        />
      )}
    </div>
  );
}

export default App;
