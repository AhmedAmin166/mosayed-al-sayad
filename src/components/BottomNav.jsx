import React from 'react';
import { 
  Sun, Fish, Wrench, Calendar, 
  MapPin, BookOpen, ShoppingBag 
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'weather', label: 'الطقس والذروة', icon: Sun },
    { id: 'fish', label: 'الأسماك', icon: Fish },
    { id: 'gear', label: 'العدة', icon: Wrench },
    { id: 'seasons', label: 'المواسم', icon: Calendar },
    { id: 'map', label: 'الخريطة', icon: MapPin },
    { id: 'logbook', label: 'السجل', icon: BookOpen },
    { id: 'shops', label: 'المحلات', icon: ShoppingBag }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-[0_-5px_25px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-cyan-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] mt-1 font-bold tracking-tight ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
