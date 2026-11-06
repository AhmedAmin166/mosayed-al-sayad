import React, { useState, useEffect } from 'react';
import { 
  Wind, Waves, Compass, Sun, Moon, ArrowUpRight, 
  RefreshCw, CheckCircle, AlertTriangle, ShieldAlert,
  Ship, Anchor, Fish, Droplets, Gauge, Info
} from 'lucide-react';
import { PRESET_LOCATIONS, fetchLiveWeatherData, getOfflineWeatherData } from '../data/weatherService';
import { calculateSolunarDay } from '../data/solunarEngine';

export default function WeatherSolunarTab() {
  const [selectedLoc, setSelectedLoc] = useState(PRESET_LOCATIONS[0]);
  const [weather, setWeather] = useState(getOfflineWeatherData(PRESET_LOCATIONS[0]));
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async (loc) => {
    setLoading(true);
    try {
      const data = await fetchLiveWeatherData(loc);
      setWeather(data);
    } catch (e) {
      setWeather(getOfflineWeatherData(loc));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedLoc);
  }, [selectedLoc]);

  const dateObj = new Date(selectedDate);
  const solunar = calculateSolunarDay(dateObj, weather, selectedLoc);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Top Bar: Location Selector & Date */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold text-cyan-400 block mb-1">
              📍 اختر موقع أو مدينة الصيد:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedLoc.id}
                onChange={(e) => {
                  const loc = PRESET_LOCATIONS.find(l => l.id === e.target.value);
                  if (loc) {
                    setSelectedLoc(loc);
                    setWeather(getOfflineWeatherData(loc));
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
              >
                {PRESET_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => loadData(selectedLoc)}
                disabled={loading}
                title="تحديث البيانات الحية"
                className="p-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 rounded-xl transition flex items-center justify-center shrink-0"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="md:w-64">
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              📅 تاريخ رحلة الصيد:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {weather.isLive && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            بيانات الطقس وحركة الرياح متصلة لحظياً ومباشرة عبر الأقمار الصناعية (Live Open-Meteo)
          </div>
        )}
      </div>

      {/* Hero Solunar & Day Assessment Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border border-sky-800/40 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Score & Rating */}
          <div className="text-center lg:text-right space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur bg-slate-900/60 border-cyan-500/30 text-cyan-300">
              <Fish className="w-4 h-4 text-cyan-400" />
              مؤشر فرصة الصيد وحركة السمك
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="relative flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#1e293b"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#06b6d4"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - solunar.overallScore / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{solunar.overallScore}%</span>
                  <span className="text-[10px] text-cyan-300">نشاط الأسماك</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100">
                  تقييم اليوم في {selectedLoc.name.split(' ')[0]}
                </h3>
                <span className={`inline-block mt-1 px-3 py-1 rounded-xl text-xs font-bold border ${solunar.ratingColor}`}>
                  {solunar.ratingText}
                </span>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-xs">
                  محسوب ديناميكياً وفق طقس {selectedLoc.name.split(' ')[0]} والضغط الجوي وسرعة الرياح والأمواج وجاذبية القمر.
                </p>
              </div>
            </div>
          </div>

          {/* Moon Details */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block font-medium">طور القمر الحالي:</span>
              <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <span>{solunar.moon.icon}</span>
                <span>{solunar.moon.name}</span>
              </h4>
              <p className="text-xs text-slate-300">
                نسبة الإضاءة: <strong className="text-amber-200">{solunar.moon.illumination}%</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                عمر القمر: {solunar.moon.age} يوم من الشهر القمري
              </p>
            </div>
            <div className="text-4xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              {solunar.moon.icon}
            </div>
          </div>

          {/* Quick Sun & Sea Highlights */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 mb-1">
                <Sun className="w-4 h-4" />
                <span>الشروق / الغروب</span>
              </div>
              <div className="text-sm font-bold text-slate-200">{weather.sunrise} ص</div>
              <div className="text-xs text-slate-400">{weather.sunset} م</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-400 mb-1">
                <Waves className="w-4 h-4" />
                <span>حالة المياه</span>
              </div>
              <div className="text-sm font-bold text-slate-200">{weather.waveHeight} متر</div>
              <div className="text-xs text-slate-400">{weather.wavePeriod > 0 ? `${weather.wavePeriod} ثانية` : 'مياه راكدة/نهرية'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Environmental Analysis & Active Fish Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              🔬 أسباب نسبة نشاط الأسماك ({solunar.overallScore}%) في {selectedLoc.name.split(' ')[0]}:
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold self-start sm:self-auto">
            مؤشر حي متكيف مع ظروف الموقع
          </span>
        </div>

        {/* 4 Environmental factors cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pressure */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-indigo-400" />
                الضغط ({weather.pressure} hPa)
              </span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${solunar.factors.pressure.mod >= 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'}`}>
                {solunar.factors.pressure.mod >= 0 ? `+${solunar.factors.pressure.mod}%` : `${solunar.factors.pressure.mod}%`}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {solunar.factors.pressure.desc}
            </p>
          </div>

          {/* Wind */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-400" />
                الرياح ({weather.windSpeed} كم/س)
              </span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${solunar.factors.wind.mod >= 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'}`}>
                {solunar.factors.wind.mod >= 0 ? `+${solunar.factors.wind.mod}%` : `${solunar.factors.wind.mod}%`}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {solunar.factors.wind.desc}
            </p>
          </div>

          {/* Waves */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-teal-400" />
                المياه ({weather.waveHeight}م)
              </span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${solunar.factors.wave.mod >= 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'}`}>
                {solunar.factors.wave.mod >= 0 ? `+${solunar.factors.wave.mod}%` : `${solunar.factors.wave.mod}%`}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {solunar.factors.wave.desc}
            </p>
          </div>

          {/* Temperature */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                الحرارة ({weather.temperature}°م)
              </span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${solunar.factors.temperature.mod >= 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'}`}>
                {solunar.factors.temperature.mod >= 0 ? `+${solunar.factors.temperature.mod}%` : `${solunar.factors.temperature.mod}%`}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {solunar.factors.temperature.desc}
            </p>
          </div>
        </div>

        {/* Active Species in this location */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-2.5">
          <div className="flex items-center gap-2">
            <Fish className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300">
              الأسماك الأكثر نشاطاً وضاربة اليوم في {selectedLoc.name.split(' ')[0]}:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {solunar.activeSpecies.map((fishName, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-xl bg-cyan-950/70 text-cyan-200 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {fishName}
              </span>
            ))}
          </div>

          {solunar.locationNote && (
            <p className="text-xs text-slate-300 pt-1 leading-relaxed border-t border-slate-800/60">
              📌 <strong>طبيعة مياه الموقع:</strong> {solunar.locationNote}
            </p>
          )}
        </div>
      </div>

      {/* Shore vs Boat vs Nile Recommendation Cards */}
      <div>
        <h3 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Anchor className="w-5 h-5 text-cyan-400" />
          تحديد أفضلية الصيد اليوم (من الشط أم اللنش أم النيل والترع):
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Boat Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-sky-400" />
                <h4 className="font-bold text-sm text-slate-100">الصيد من القارب / اللنش</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                تسقيط وجيجينج
              </span>
            </div>
            <div className="text-sm font-bold text-cyan-300 mb-2">
              {solunar.recommendations.boat.status}
            </div>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
              {solunar.recommendations.boat.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          {/* Shore Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-slate-100">الصيد من الشاطئ / الصخور</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                سيرف وكاستينج
              </span>
            </div>
            <div className="text-sm font-bold text-emerald-300 mb-2">
              {solunar.recommendations.shore.status}
            </div>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
              {solunar.recommendations.shore.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          {/* Nile & Canal Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-teal-400" />
                <h4 className="font-bold text-sm text-slate-100">صيد النيل وفروعه والترع</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                غماز وحداف
              </span>
            </div>
            <div className="text-sm font-bold text-teal-300 mb-2">
              {solunar.recommendations.nile.status}
            </div>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
              {solunar.recommendations.nile.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Solunar Feeding Peak Periods */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Fish className="w-5 h-5 text-amber-400" />
          فترات الذروة والتغذية الدقيقة للأسماك في {selectedLoc.name.split(' ')[0]} (ساعات الضربة):
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          محسوبة فلكياً ومعدلة جغرافياً لخط طول {selectedLoc.name.split(' ')[0]}؛ احرص على أن تكون طعومك في الماء وجاهزة خلالها.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {solunar.periods.map((period, idx) => (
            <div 
              key={idx} 
              className={`p-3.5 rounded-xl border transition ${
                idx < 2 
                  ? 'bg-amber-950/20 border-amber-500/40' 
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-bold ${idx < 2 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {period.type}
                </span>
                <span className="text-xs">{period.intensity}</span>
              </div>
              <div className="text-base font-extrabold text-white my-1 tracking-wide font-mono">
                {period.time}
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                {period.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Weather & Marine Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Temp */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">درجة الحرارة</span>
            <div className="text-lg font-bold text-white">{weather.temperature}°م</div>
            <span className="text-[11px] text-slate-400">محسوسة: {weather.feelsLike}°م</span>
          </div>
        </div>

        {/* Wind */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">سرعة الرياح</span>
            <div className="text-lg font-bold text-white">{weather.windSpeed} كم/س</div>
            <span className="text-[11px] text-cyan-400 font-medium">{weather.windDirection}</span>
          </div>
        </div>

        {/* Sea State */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">حالة البحر</span>
            <div className="text-xs font-bold text-white leading-snug">{weather.seaState}</div>
            <span className="text-[11px] text-slate-400">ارتفاع: {weather.waveHeight}م</span>
          </div>
        </div>

        {/* Pressure & Humidity */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">الضغط الجوي والرطوبة</span>
            <div className="text-lg font-bold text-white">{weather.pressure} hPa</div>
            <span className="text-[11px] text-slate-400">الرطوبة: {weather.humidity}%</span>
          </div>
        </div>
      </div>

      {/* Tides Table (المد والجزر) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          حركة المد والجزر المتوقعة (Tide Chart):
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {weather.tides.map((tide, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-xl border text-center ${
                tide.type.includes('High') || tide.type.includes('مد')
                  ? 'bg-sky-950/40 border-sky-600/30'
                  : 'bg-slate-950/50 border-slate-800'
              }`}
            >
              <span className="text-xs text-slate-300 block mb-1 font-semibold">{tide.type}</span>
              <div className="text-base font-bold text-white font-mono">{tide.time}</div>
              <span className="text-xs text-cyan-400">{tide.level}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 mt-2.5">
          💡 <strong>نصيحة الصياد:</strong> أكثر الأسماك الشاطئية كالدنيس والقاروص تنشط أثناء اندفاع مياه المد الصاعد (High Tide) نحو الشاطئ بحثاً عن القشريات في الرمال.
        </p>
      </div>
    </div>
  );
}
