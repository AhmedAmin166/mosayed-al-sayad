import React from 'react';
import { Fish, Anchor, Compass, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isOnline }) {
  const tabs = [
    { id: 'weather', label: 'الطقس والذروة' },
    { id: 'fish', label: 'دليل الأسماك' },
    { id: 'gear', label: 'العدة والطعوم' },
    { id: 'seasons', label: 'مواسم الصيد' },
    { id: 'map', label: 'الخريطة والـ GPS' },
    { id: 'logbook', label: 'سجل الصيد' },
    { id: 'shops', label: 'محلات الصيد' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('weather')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <Fish className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>مساعد الصياد</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-normal">
                  بحر ونيل وترع
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                الرفيق الذكي للصيد والمد والطقس ونقاط الـ GPS
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Online/Offline Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              isOnline 
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-950/50 border-amber-500/30 text-amber-400'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">متصل بالطقس الحي</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">وضع الصيد أوفلاين</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
