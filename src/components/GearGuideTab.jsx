import React, { useState } from 'react';
import { 
  Wrench, Anchor, HelpCircle, Layers, Check, 
  Info, Sparkles, Link2, Search, ArrowRight, 
  Fish, Filter, ChevronDown, ChevronUp 
} from 'lucide-react';
import { 
  FISHING_TECHNIQUES, HOOK_SIZE_GUIDE, 
  BAIT_ENCYCLOPEDIA, HOOK_BAIT_FISH_MATRIX 
} from '../data/gearGuideData';

export default function GearGuideTab() {
  const [activeSubTab, setActiveSubTab] = useState('matrix'); // Default to the new matrix linker
  const [selectedTech, setSelectedTech] = useState(FISHING_TECHNIQUES[0]);
  
  // Interactive Matcher state
  const [matcherMode, setMatcherMode] = useState('hook'); // 'hook' | 'fish' | 'bait'
  const [selectedHookItem, setSelectedHookItem] = useState(HOOK_BAIT_FISH_MATRIX[1]); // #8-#6 by default
  const [matrixFilterEnv, setMatrixFilterEnv] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique fish names from matrix
  const allFishNames = Array.from(new Set(HOOK_BAIT_FISH_MATRIX.flatMap(m => m.targetFish)));
  const [selectedFishQuery, setSelectedFishQuery] = useState(allFishNames[0]);

  // Extract all unique baits from matrix
  const allBaits = Array.from(new Set(HOOK_BAIT_FISH_MATRIX.flatMap(m => m.baits.map(b => b.name))));
  const [selectedBaitQuery, setSelectedBaitQuery] = useState(allBaits[0]);

  // Filter matrix items
  const filteredMatrix = HOOK_BAIT_FISH_MATRIX.filter(item => {
    const matchesEnv = matrixFilterEnv === 'all' || 
      item.environments.some(e => e.includes(matrixFilterEnv === 'marine' ? 'بحري' : matrixFilterEnv === 'river' ? 'نهري' : 'ترع'));
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      item.hookSize.toLowerCase().includes(q) ||
      item.hookType.toLowerCase().includes(q) ||
      item.targetFish.some(f => f.toLowerCase().includes(q)) ||
      item.baits.some(b => b.name.toLowerCase().includes(q));
    return matchesEnv && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Sub Tabs Selector */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'matrix'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>رابط السنون والطعوم والأسماك 🔗</span>
          </button>

          <button
            onClick={() => setActiveSubTab('techniques')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'techniques'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Anchor className="w-4 h-4" />
            <span>أساليب وتكنيكات الصيد والعدة</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hooks')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'hooks'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>دليل مقاسات الصنانير (السنون)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('baits')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'baits'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>موسوعة الطعوم وطرق التطعيم</span>
          </button>
        </div>
      </div>

      {/* ================= SubTab: Matrix & Matcher (Main Requested Feature) ================= */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          {/* Hero Interactive Matcher Engine */}
          <div className="bg-gradient-to-br from-slate-900 via-sky-950/60 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 block mb-1">
                  ⚡ محرك التوفيق الذكي (Hook, Bait & Fish Matcher):
                </span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Link2 className="w-6 h-6 text-cyan-400" />
                  حاسبة الربط بين مقاس السن، الطعم المناسب، والسمكة المستهدفة
                </h3>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setMatcherMode('hook')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    matcherMode === 'hook' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  اختر بمقاس السن
                </button>
                <button
                  onClick={() => setMatcherMode('fish')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    matcherMode === 'fish' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  اختر بنوع السمكة
                </button>
                <button
                  onClick={() => setMatcherMode('bait')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    matcherMode === 'bait' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  اختر بنوع الطعم
                </button>
              </div>
            </div>

            {/* Mode 1: By Hook Size */}
            {matcherMode === 'hook' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    🎯 اختر مقاس السن المتوفر في علبتك:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {HOOK_BAIT_FISH_MATRIX.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedHookItem(item)}
                        className={`p-3 rounded-xl border text-center transition ${
                          selectedHookItem.id === item.id
                            ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-base font-extrabold font-mono">{item.hookSize}</div>
                        <div className="text-[10px] mt-0.5 opacity-90 truncate">{item.targetFish[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Match Result Display */}
                <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div>
                      <span className="text-xs text-amber-300 font-bold">نوع وخامة السن الموصى بها:</span>
                      <h4 className="text-lg font-black text-white">{selectedHookItem.hookType}</h4>
                    </div>
                    <div className="text-left">
                      <span className="text-xs text-slate-400 block">سُمك شعر الترميل المثالي:</span>
                      <span className="text-sm font-extrabold text-cyan-400 font-mono">{selectedHookItem.recommendedLeader}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Baits for this hook */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        الطعوم المتوافقة وطريقة التطعيم الصحيحة:
                      </h5>
                      <div className="space-y-2">
                        {selectedHookItem.baits.map((b, i) => (
                          <div key={i} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
                            <strong className="text-white block mb-0.5 font-bold">🪱 {b.name}</strong>
                            <span className="text-slate-300 text-[11px] leading-relaxed block">{b.method}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fish targeted with this hook */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Fish className="w-4 h-4" />
                        الأسماك المستهدفة بهذا المقاس:
                      </h5>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {selectedHookItem.targetFish.map((f, i) => (
                            <span key={i} className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded-lg font-bold text-xs">
                              🐟 {f}
                            </span>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                          <strong className="text-slate-400">طريقة الصيد:</strong> {selectedHookItem.technique}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          <strong className="text-slate-400">البيئة:</strong> {selectedHookItem.environments.join(' • ')}
                        </div>
                      </div>

                      <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs">
                        <strong className="text-amber-400 block font-bold mb-1">💡 نصيحة الصياد لهذا السن:</strong>
                        <p className="leading-relaxed">{selectedHookItem.proTip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: By Target Fish */}
            {matcherMode === 'fish' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    🐟 اختر السمكة التي ترغب في صيدها الآن:
                  </label>
                  <select
                    value={selectedFishQuery}
                    onChange={(e) => setSelectedFishQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
                  >
                    {allFishNames.map((fishName) => (
                      <option key={fishName} value={fishName}>
                        {fishName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show which hooks match this fish */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-cyan-400">
                    أفضل خيارات السنون والطعوم لصيد ({selectedFishQuery}):
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HOOK_BAIT_FISH_MATRIX.filter(item => 
                      item.targetFish.some(f => f.includes(selectedFishQuery) || selectedFishQuery.includes(f))
                    ).map((matchItem) => (
                      <div key={matchItem.id} className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div>
                            <span className="text-xs text-slate-400">مقاس السن:</span>
                            <div className="text-lg font-black text-cyan-300 font-mono">{matchItem.hookSize}</div>
                          </div>
                          <span className="text-xs text-amber-300 font-mono font-bold bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                            ترميل: {matchItem.recommendedLeader}
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <p><strong className="text-slate-400">شكل وخامة السن:</strong> <span className="text-slate-200">{matchItem.hookType}</span></p>
                          <p><strong className="text-slate-400">طريقة الصيد:</strong> <span className="text-emerald-300">{matchItem.technique}</span></p>
                        </div>

                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                          <strong className="text-amber-400 block mb-1">🪱 الطعوم الأكثر فاعلية:</strong>
                          <ul className="space-y-1 list-disc list-inside text-slate-300 text-[11px]">
                            {matchItem.baits.map((b, i) => (
                              <li key={i}><span className="text-white font-bold">{b.name}</span>: {b.method}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: By Bait Type */}
            {matcherMode === 'bait' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    🪱 اختر الطعم المتوفر لديك الآن في العلبة:
                  </label>
                  <select
                    value={selectedBaitQuery}
                    onChange={(e) => setSelectedBaitQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
                  >
                    {allBaits.map((baitName) => (
                      <option key={baitName} value={baitName}>
                        {baitName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-cyan-400">
                    مقاسات السنون المناسبة لطعم ({selectedBaitQuery}) والأسماك التي يمكن صيدها:
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HOOK_BAIT_FISH_MATRIX.filter(item => 
                      item.baits.some(b => b.name.includes(selectedBaitQuery) || selectedBaitQuery.includes(b.name))
                    ).map((matchItem) => (
                      <div key={matchItem.id} className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-amber-300 font-mono">{matchItem.hookSize}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                              {matchItem.hookType.split('(')[0]}
                            </span>
                          </div>
                          <span className="text-xs text-cyan-400 font-mono">
                            {matchItem.recommendedLeader}
                          </span>
                        </div>

                        {/* Hooking advice */}
                        {matchItem.baits.filter(b => b.name.includes(selectedBaitQuery) || selectedBaitQuery.includes(b.name)).map((b, i) => (
                          <div key={i} className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
                            <strong className="text-cyan-400 block mb-0.5">طريقة الشك على مقاس {matchItem.hookSize}:</strong>
                            <p className="text-slate-200 text-[11px] leading-relaxed">{b.method}</p>
                          </div>
                        ))}

                        <div>
                          <strong className="text-xs text-slate-400 block mb-1">🐟 الأسماك المستهدفة:</strong>
                          <div className="flex flex-wrap gap-1">
                            {matchItem.targetFish.map((f, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Linking Matrix Table & Filter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  جدول مصفوفة الربط الشاملة (السن + الطعم + السمكة)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  استعرض وقارن بين مقاسات الصنانير وخيوط الترميل وأنواع الطعوم الطبيعية لكل سمكة.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث بسن أو سمكة أو طعم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-48"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setMatrixFilterEnv('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${matrixFilterEnv === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setMatrixFilterEnv('marine')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${matrixFilterEnv === 'marine' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    بحري
                  </button>
                  <button
                    onClick={() => setMatrixFilterEnv('river')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${matrixFilterEnv === 'river' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    نهري
                  </button>
                </div>
              </div>
            </div>

            {/* Matrix Cards */}
            <div className="space-y-4">
              {filteredMatrix.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition rounded-2xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-cyan-300 font-mono bg-cyan-950/80 px-3.5 py-1 rounded-xl border border-cyan-800 shadow-md">
                        {item.hookSize}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{item.hookType}</h4>
                        <span className="text-xs text-slate-400">البيئة: {item.environments.join(' • ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">سُمك الترميل الموصى به:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 border border-slate-800 font-mono text-xs font-bold">
                        {item.recommendedLeader}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Baits */}
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-2">
                      <strong className="text-amber-400 block font-bold">🪱 الطعوم وطرق التطعيم:</strong>
                      <div className="space-y-1.5">
                        {item.baits.map((b, i) => (
                          <div key={i} className="text-slate-300 text-[11px] leading-relaxed">
                            <span className="text-white font-bold">{b.name}:</span> {b.method}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fish & Technique */}
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-2">
                      <strong className="text-emerald-400 block font-bold">🐟 الأسماك المستهدفة وطريقة الصيد:</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {item.targetFish.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-800 text-[11px] font-semibold">
                            {f}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-300 pt-1.5 border-t border-slate-800">
                        <strong className="text-slate-400">التكنيك:</strong> {item.technique}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-200/90 bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl">
                    <strong className="text-amber-400">💡 سر الصياد:</strong> {item.proTip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SubTab 2: Techniques ================= */}
      {activeSubTab === 'techniques' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {FISHING_TECHNIQUES.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setSelectedTech(tech)}
                className={`p-3 rounded-xl border text-center transition ${
                  selectedTech.id === tech.id
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{tech.name.split('(')[0]}</div>
                <div className="text-[10px] text-slate-400 mt-1">{tech.id.includes('boat') || tech.id.includes('jig') ? 'بحري وعر' : tech.id.includes('nile') ? 'نهري' : 'شاطئ/كاستينج'}</div>
              </button>
            ))}
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-cyan-400 font-bold block mb-1">تفاصيل العدة والتكنيك الموصى به:</span>
                <h3 className="text-xl font-black text-white">{selectedTech.name}</h3>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-400 block">البيئة المستهدفة:</span>
                <span className="text-xs font-semibold text-emerald-400">{selectedTech.targetEnvironment}</span>
              </div>
            </div>

            <div className="text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-400">🐟 الأسماك المستهدفة:</strong>{' '}
              <span className="text-amber-300 font-bold">{selectedTech.targetFish}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  مواصفات القصبة (البوصة):
                </h4>
                <div className="space-y-1 text-xs">
                  <p><span className="text-slate-400">الطول:</span> <strong className="text-slate-200">{selectedTech.rod.length}</strong></p>
                  <p><span className="text-slate-400">الأكشن وقوة الرمي:</span> <span className="text-slate-300">{selectedTech.rod.action}</span></p>
                  <p><span className="text-slate-400">الخامة:</span> <span className="text-slate-300">{selectedTech.rod.material}</span></p>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  مواصفات الماكينة:
                </h4>
                <div className="space-y-1 text-xs">
                  <p><span className="text-slate-400">النوع:</span> <strong className="text-slate-200">{selectedTech.reel.type}</strong></p>
                  <p><span className="text-slate-400">المقاس والحلة:</span> <span className="text-slate-300">{selectedTech.reel.size}</span></p>
                  <p><span className="text-slate-400">قوة الفرامل (الدراج):</span> <span className="text-slate-300">{selectedTech.reel.drag}</span></p>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  الخيط والليدر (الشوك):
                </h4>
                <div className="space-y-1 text-xs">
                  <p><span className="text-slate-400">الخيط الأساسي:</span> <strong className="text-slate-200">{selectedTech.line.main}</strong></p>
                  <p><span className="text-slate-400">الليدر أو الشوك:</span> <span className="text-slate-300">{selectedTech.line.shockLeader}</span></p>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  الأرمة والصنانير (السنون):
                </h4>
                <div className="space-y-1 text-xs">
                  <p><span className="text-slate-400">تركيب الأرمة:</span> <span className="text-slate-300">{selectedTech.terminalTackle.rig}</span></p>
                  <p><span className="text-slate-400">مقاس السنون الموصى بها:</span> <strong className="text-amber-300 font-bold">{selectedTech.terminalTackle.hooks}</strong></p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div>
                <strong className="text-xs text-slate-400 block mb-1">🪱 الطعوم الأكثر فعالية مع هذه الطريقة:</strong>
                <span className="text-xs text-emerald-300 font-semibold">{selectedTech.bestBaits}</span>
              </div>
              <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs">
                <strong className="text-amber-400 block font-bold mb-1">💡 السر الذهبي للصياد:</strong>
                <p className="leading-relaxed">{selectedTech.goldenTip}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SubTab 3: Hook Guide ================= */}
      {activeSubTab === 'hooks' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              جدول مقاسات الصنانير (السنون) وتطبيقاتها السريعة
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              قاعدة ذهبية: الأرقام المفردة العادية (#10، #8) كلما كَبُر الرقم صَغُر حجم السن، أما المقاسات التي تحتوي على صفر (#0/1، #0/2) فكلما كبر الرقم كَبُر حجم السن.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-bold">مقاس السن</th>
                  <th className="py-3 px-4 font-bold">الاستخدام والأسماك المناسبة</th>
                  <th className="py-3 px-4 font-bold">الصلابة والتحمل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {HOOK_SIZE_GUIDE.map((hook, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-extrabold text-cyan-300 font-mono text-sm">{hook.size}</td>
                    <td className="py-3 px-4 text-slate-200">{hook.usage}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-amber-300 font-medium">
                        {hook.strength}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SubTab 4: Baits Encyclopedia ================= */}
      {activeSubTab === 'baits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BAIT_ENCYCLOPEDIA.map((bait, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white">{bait.name}</h4>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {bait.type}
                </span>
              </div>

              <div className="text-xs space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p><strong className="text-slate-400">الأسماك المستهدفة:</strong> <span className="text-amber-300 font-semibold">{bait.target}</span></p>
                <p><strong className="text-slate-400">طريقة الحفظ والتخزين:</strong> <span className="text-slate-200">{bait.storage}</span></p>
                <p><strong className="text-slate-400">طريقة التدكيك والتطعيم:</strong> <span className="text-emerald-300 font-medium">{bait.hookingMethod}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
