import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import WeatherSolunarTab from './components/WeatherSolunarTab';
import FishGuideTab from './components/FishGuideTab';
import GearGuideTab from './components/GearGuideTab';
import SeasonsTab from './components/SeasonsTab';
import MapTab from './components/MapTab';
import LogbookTab from './components/LogbookTab';
import ShopsTab from './components/ShopsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('weather');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-cairo selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isOnline={isOnline} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'weather' && <WeatherSolunarTab />}
        {activeTab === 'fish' && <FishGuideTab />}
        {activeTab === 'gear' && <GearGuideTab />}
        {activeTab === 'seasons' && <SeasonsTab />}
        {activeTab === 'map' && <MapTab />}
        {activeTab === 'logbook' && <LogbookTab />}
        {activeTab === 'shops' && <ShopsTab />}
      </main>

      {/* Footer for Desktop */}
      <footer className="hidden lg:block border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <p>تطبيق مساعد الصياد © {new Date().getFullYear()} - رفيقك الميداني للصيد البحري والنهري والترع 🎣</p>
        <p className="mt-1 text-[11px] text-slate-600">بيانات الطقس والأقمار الصناعية وحسابات Solunar الفلكية مجانية ومدعومة للعمل أوفلاين</p>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
