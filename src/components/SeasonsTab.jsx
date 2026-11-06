import React, { useState } from 'react';
import { Calendar, AlertTriangle, ShieldCheck, Waves, Ship, Droplets, Wind, Sparkles } from 'lucide-react';
import { MONTHS_CALENDAR, ALEXANDRIA_NOWAT } from '../data/seasonsData';

export default function SeasonsTab() {
  const currentMonthIndex = new Date().getMonth(); // 0-based
  const [selectedMonth, setSelectedMonth] = useState(MONTHS_CALENDAR[currentMonthIndex]);
  const [showNowat, setShowNowat] = useState(false);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            تقويم مواسم الصيد الشهرية والنوّات
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تعرف على مواسم حركة الأسماك في البحر المتوسط والأحمر والنيل والترع طوال العام.
          </p>
        </div>

        <button
          onClick={() => setShowNowat(!showNowat)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            showNowat 
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
              : 'bg-slate-950 border border-slate-700 text-amber-300 hover:border-amber-500/50'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>{showNowat ? 'إخفاء جدول النوّات' : 'استعراض جدول نوّات الإسكندرية'}</span>
        </button>
      </div>

      {/* Alexandria Nowat Accordion/View */}
      {showNowat && (
        <div className="bg-slate-900/95 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Wind className="w-5 h-5 text-amber-400" />
                جدول نوّات الإسكندرية والبحر المتوسط الرسمية وتأثيرها على الصيد
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تعتبر النوات من أهم عوامل تحديد حركة البحر الشاطئي وأفضل أوقات كاستينج القاروص بعد انكسار النوة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALEXANDRIA_NOWAT.map((nowa, i) => (
              <div key={i} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold text-sm">{nowa.name}</strong>
                  <span className="text-[11px] px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-800/60 rounded-md">
                    {nowa.days} أيام
                  </span>
                </div>
                <div className="text-cyan-400 font-semibold">{nowa.date}</div>
                <div className="text-slate-400">اتجاه الرياح: <span className="text-slate-200">{nowa.wind}</span></div>
                <div className="text-slate-300 bg-slate-900/60 p-2 rounded-lg text-[11px] leading-relaxed">
                  {nowa.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month Carousel / Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MONTHS_CALENDAR.map((m, idx) => {
          const isSelected = selectedMonth.month === m.month;
          const isCurrent = idx === currentMonthIndex;

          return (
            <button
              key={m.month}
              onClick={() => setSelectedMonth(m)}
              className={`px-3.5 py-3 rounded-2xl text-xs font-bold transition flex flex-col items-center min-w-[90px] shrink-0 relative ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-xl shadow-cyan-500/25'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {isCurrent && (
                <span className={`absolute -top-1.5 px-2 py-0.2 text-[9px] rounded-full font-bold ${
                  isSelected ? 'bg-slate-950 text-cyan-400' : 'bg-cyan-500 text-slate-950'
                }`}>
                  الشهر الحالي
                </span>
              )}
              <span className="text-sm font-extrabold">{m.name.split(' ')[0]}</span>
              <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                {m.season}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Month Details */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs text-cyan-400 font-bold block mb-1">تفاصيل ومواسم شهر:</span>
            <h3 className="text-2xl font-black text-white">{selectedMonth.name} ({selectedMonth.season})</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">تقييم النشاط العام:</span>
            <div className="flex items-center text-amber-400 text-sm">
              {'⭐'.repeat(selectedMonth.marineActivity.rating)}
            </div>
          </div>
        </div>

        {/* Marine Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400" />
            الصيد البحري خلال {selectedMonth.name.split(' ')[0]}:
          </h4>
          <p className="text-xs text-slate-200 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
            {selectedMonth.marineActivity.highlights}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 mb-1">
                <Ship className="w-4 h-4" />
                الصيد من القارب واللنش:
              </span>
              <p className="text-xs text-slate-300">{selectedMonth.marineActivity.boatFishing}</p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <Waves className="w-4 h-4" />
                الصيد من الشاطئ والسيرف:
              </span>
              <p className="text-xs text-slate-300">{selectedMonth.marineActivity.shoreFishing}</p>
            </div>
          </div>
        </div>

        {/* Nile & Canal Details */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-teal-400" />
            الصيد في نهر النيل والترع والبحيرات:
          </h4>
          <p className="text-xs text-slate-200 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
            {selectedMonth.nileActivity.highlights}
          </p>
          <div className="bg-teal-950/30 border border-teal-500/30 p-3 rounded-xl text-teal-200 text-xs">
            <strong>نصيحة المياه العذبة لهذا الشهر:</strong> {selectedMonth.nileActivity.tips}
          </div>
        </div>

        {/* Conservation & Prohibited Species */}
        <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-rose-300 font-bold mb-1">المحظورات وفترات المنع والتكاثر البيئية:</strong>
            <p>{selectedMonth.prohibitedSpecies}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
