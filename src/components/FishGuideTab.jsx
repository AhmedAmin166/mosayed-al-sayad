import React, { useState } from 'react';
import { Search, Fish, Compass, Sparkles, Filter, ChevronDown, ChevronUp, AlertCircle, Bookmark } from 'lucide-react';
import { FISH_DATABASE, FISH_CATEGORIES } from '../data/fishData';

export default function FishGuideTab() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredFish = FISH_DATABASE.filter((fish) => {
    const matchesCat = selectedCategory === 'all' || fish.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = 
      fish.name.toLowerCase().includes(query) ||
      fish.habitat.toLowerCase().includes(query) ||
      fish.bestBaits.natural.toLowerCase().includes(query) ||
      fish.scientificName.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header & Search */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Fish className="w-6 h-6 text-cyan-400" />
              موسوعة ودليل أسماك البحر والنيل والترع
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              تعرّف على بيئة كل سمكة، أفضل الطعوم، مقاسات الصنانير (السنون)، والتكنيك الموصى به لصيدها.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative md:w-80">
            <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن سمكة، طعم، أو طريقة صيد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
          {FISH_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fish Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFish.map((fish) => {
          const isExpanded = expandedId === fish.id;

          return (
            <div
              key={fish.id}
              className={`bg-slate-900/90 border transition rounded-2xl p-5 shadow-lg flex flex-col justify-between ${
                isExpanded ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 inline-block mb-1.5">
                      {fish.badge}
                    </span>
                    <h3 className="text-lg font-extrabold text-white">{fish.name}</h3>
                    <span className="text-xs text-slate-400 italic block">{fish.scientificName}</span>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
                    fish.category === 'marine' 
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : fish.category === 'river'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-teal-950 text-teal-300 border border-teal-800'
                  }`}>
                    {fish.waterType}
                  </span>
                </div>

                {/* Quick Info Grid */}
                <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[11px]">
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      🪝 مقاس السن الموصى به:
                    </span>
                    <span className="text-amber-300 font-mono font-extrabold text-xs">
                      {fish.recommendedGear.hooks}
                    </span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block mb-0.5">🏞️ بيئة التواجد والمأوى:</strong>
                    <span className="text-slate-200">{fish.habitat}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block mb-0.5">🪱 أفضل الطعوم الطبيعية المتوافقة مع السن:</strong>
                    <span className="text-amber-300 font-medium">{fish.bestBaits.natural}</span>
                  </div>
                  {fish.bestBaits.artificial && (
                    <div>
                      <strong className="text-slate-400 block mb-0.5">🎣 أفضل الطعوم الصناعية (اللور):</strong>
                      <span className="text-sky-300 font-medium">{fish.bestBaits.artificial}</span>
                    </div>
                  )}
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 text-xs border-t border-slate-800/80 animate-fadeIn">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <h4 className="font-bold text-cyan-400 mb-1">🛠️ مواصفات العدة الموصى بها:</h4>
                      <p><strong className="text-slate-400">القصبة (البوصة):</strong> <span className="text-slate-200">{fish.recommendedGear.rod}</span></p>
                      <p><strong className="text-slate-400">الماكينة:</strong> <span className="text-slate-200">{fish.recommendedGear.reel}</span></p>
                      <p><strong className="text-slate-400">الخيط والليدر:</strong> <span className="text-slate-200">{fish.recommendedGear.line}</span></p>
                      <p><strong className="text-slate-400">مقاس السنون (الصنارة):</strong> <span className="text-amber-300 font-semibold">{fish.recommendedGear.hooks}</span></p>
                      <p><strong className="text-slate-400">طريقة الصيد:</strong> <span className="text-emerald-300">{fish.recommendedGear.technique}</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                        <strong className="text-slate-400 block mb-1">⏰ الوقت الأفضل:</strong>
                        <span className="text-slate-200 text-[11px]">{fish.bestTime}</span>
                      </div>
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                        <strong className="text-slate-400 block mb-1">📅 موسم الذروة:</strong>
                        <span className="text-slate-200 text-[11px]">{fish.bestSeason}</span>
                      </div>
                    </div>

                    <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-amber-200">
                      <strong className="block text-amber-400 font-bold mb-1">💡 نصيحة الصياد الذهبية:</strong>
                      <p className="text-[11px] leading-relaxed">{fish.tips}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Toggle button */}
              <button
                onClick={() => toggleExpand(fish.id)}
                className="mt-3 w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition"
              >
                {isExpanded ? (
                  <>
                    <span>إخفاء مواصفات العدة والنصائح</span>
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  </>
                ) : (
                  <>
                    <span>عرض مواصفات العدة بالتفصيل والسنون</span>
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {filteredFish.length === 0 && (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
          <Fish className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">لم يتم العثور على نتائج</h3>
          <p className="text-xs text-slate-500 mt-1">جرب البحث بكلمات أخرى أو تغيير التصنيف.</p>
        </div>
      )}
    </div>
  );
}
