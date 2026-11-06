import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Plus, Trash2, Crosshair, Download, 
  Upload, Layers, Anchor, Compass, Info, Check
} from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet default marker icons issue in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PRESET_SPOTS = [
  // الإسماعيلية
  {
    id: 'spot_ismailia_1',
    name: 'كوبري نمرة 6 والمعدية (قناة السويس - الإسماعيلية)',
    category: 'قناة ملاحية وصخور شاطئية',
    type: 'marine',
    lat: 30.5895,
    lng: 32.2790,
    depth: '8 - 22 متر',
    description: 'أشهر نقاط صيد الدنيس والقاروص وبوري القناة الفاخر بالدود الإسماعلاوي والجمبري الحي.'
  },
  {
    id: 'spot_ismailia_2',
    name: 'بحيرة التمساح وشاطئ الفيروز والتعاون (الإسماعيلية)',
    category: 'بحيرة شاطئية هادئة',
    type: 'marine',
    lat: 30.5750,
    lng: 32.2900,
    depth: '3 - 10 أمتار',
    description: 'صيد السيجان (البطاطا) والدنيس والقاروص فجراً بالغماز أو الحداف الخفيف.'
  },
  {
    id: 'spot_ismailia_3',
    name: 'البحيرات المرة وفايد وأبو سلطان (الإسماعيلية)',
    category: 'بحيرات مرة مفتوحة',
    type: 'marine',
    lat: 30.3260,
    lng: 32.3020,
    depth: '5 - 16 متر',
    description: 'مرعى خصب للدنيس المعرم والسيجان والوقار بالدود الإسماعلاوي الطازج.'
  },
  {
    id: 'spot_ismailia_4',
    name: 'ترعة الإسماعيلية العذبة',
    category: 'ترعة مياه عذبة رئيسية',
    type: 'canal',
    lat: 30.6010,
    lng: 32.2610,
    depth: '3 - 6 أمتار',
    description: 'صيد بلطي نيلي عريض بالريم والغماز الحساس، وقراميط وحنش ليلاً بالدود.'
  },

  // بورسعيد
  {
    id: 'spot_portsaid_1',
    name: 'بوغاز الجميل واللسان الجديد (بورسعيد)',
    category: 'بوغاز ومصب بحري',
    type: 'marine',
    lat: 31.2820,
    lng: 32.2510,
    depth: '4 - 12 متر',
    description: 'ذروة صيد القاروص واللوت بالسيرف كاستينج واللورات الطافية بعد النوات.'
  },
  {
    id: 'spot_portsaid_2',
    name: 'ممشى ديليسبس ورصيف ميناء بورسعيد',
    category: 'أرصفة موانئ وقناة',
    type: 'marine',
    lat: 31.2640,
    lng: 32.3060,
    depth: '10 - 18 متر',
    description: 'كاستينج وتسقيط للدنيس والوقار واللوت بالجمبري النطاط وسردين القناة.'
  },
  {
    id: 'spot_portsaid_3',
    name: 'كوبري النصر وتفريعة بورفؤاد (بورسعيد)',
    category: 'قناة وتفريعة مائية',
    type: 'marine',
    lat: 31.2450,
    lng: 32.3180,
    depth: '12 - 24 متر',
    description: 'تيار مائي غني بالأسماك المهاجرة، كاستينج سريع على الباراكودا واللوت والقاروص.'
  },
  {
    id: 'spot_portsaid_4',
    name: 'بحيرة المنزلة وبواغيز بورسعيد',
    category: 'بحيرة شاطئية وبواغيز',
    type: 'canal',
    lat: 31.2200,
    lng: 32.2100,
    depth: '1.5 - 4 أمتار',
    description: 'جنة صيد الشبار (البلطي الأخضر) والبوري بالغماز والعجينة ودود الأرض.'
  },

  // باقي المناطق
  {
    id: 'spot_1',
    name: 'وعر الأنفوشي ورأس التين (الإسكندرية)',
    category: 'وعر بحري صخري',
    type: 'marine',
    lat: 31.2185,
    lng: 29.8785,
    depth: '12 - 25 متر',
    description: 'وعر صخري ممتاز للوقار والدنيس واللوت ليلاً.'
  },
  {
    id: 'spot_2',
    name: 'بوغاز ومصب النيل (رأس البر ودمياط)',
    category: 'مصب نهري وبوغاز',
    type: 'marine_nile',
    lat: 31.5285,
    lng: 31.8395,
    depth: '5 - 15 متر',
    description: 'التقاء مياه النيل العذب بالبحر، جنة القاروص واللوت والبلطي الكبير.'
  },
  {
    id: 'spot_4',
    name: 'مكمن قشر بياض (كوبري روض الفرج / النيل بالقاهرة)',
    category: 'مجرى نهري عميق',
    type: 'river',
    lat: 30.0880,
    lng: 31.2285,
    depth: '8 - 14 متر',
    description: 'دومات مائية خلف القواعد الخرسانية ممتازة لكاستينج قشر البياض فجراً.'
  },
  {
    id: 'spot_6',
    name: 'وعر الجزر وجبال الغردقة (البحر الأحمر)',
    category: 'شعاب مرجانية ووعر عميق',
    type: 'marine',
    lat: 27.2450,
    lng: 33.8850,
    depth: '30 - 70 متر',
    description: 'سلو جيجينج وتسقيط للوقار والكنعد والتونة.'
  }
];

export default function MapTab() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [spots, setSpots] = useState(() => {
    try {
      const saved = localStorage.getItem('mosayed_user_spots');
      return saved ? JSON.parse(saved) : PRESET_SPOTS;
    } catch {
      return PRESET_SPOTS;
    }
  });

  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // New spot form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'وعر بحري صخري',
    type: 'marine',
    lat: '',
    lng: '',
    depth: '',
    description: ''
  });

  // Save spots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mosayed_user_spots', JSON.stringify(spots));
    } catch (e) {
      console.error(e);
    }
  }, [spots]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [30.5, 31.0],
        zoom: 7,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Create a layer group for markers
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Allow clicking on map to set coordinates in modal
      map.on('click', (e) => {
        setFormData(prev => ({
          ...prev,
          lat: e.latlng.lat.toFixed(5),
          lng: e.latlng.lng.toFixed(5)
        }));
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when spots or filterType change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = spots.filter(s => filterType === 'all' || s.type === filterType || (filterType === 'custom' && s.isCustom));

    filtered.forEach((spot) => {
      const markerColor = spot.isCustom ? '#f59e0b' : spot.type === 'river' ? '#10b981' : spot.type === 'canal' ? '#14b8a6' : '#0ea5e9';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: ${markerColor}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Cairo', sans-serif; text-align: right; direction: rtl; min-width: 200px;">
          <h4 style="font-weight: 800; font-size: 14px; margin: 0 0 4px 0; color: #0284c7;">${spot.name}</h4>
          <span style="font-size: 11px; padding: 2px 8px; background: #082f49; color: #38bdf8; border-radius: 12px; display: inline-block; margin-bottom: 6px;">
            ${spot.category}
          </span>
          <p style="font-size: 11px; margin: 4px 0; color: #94a3b8;"><strong>العمق:</strong> ${spot.depth || 'غير محدد'}</p>
          <p style="font-size: 11px; margin: 4px 0; color: #cbd5e1; line-height: 1.4;">${spot.description || ''}</p>
          <p style="font-size: 10px; margin: 6px 0 0 0; color: #64748b; font-family: monospace;">الإحداثيات: ${spot.lat}, ${spot.lng}</p>
        </div>
      `;

      marker.bindPopup(popupContent, { className: 'custom-popup' });
      marker.addTo(markersLayerRef.current);
    });
  }, [spots, filterType]);

  // Current GPS Position
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('الـ GPS غير مدعوم على هذا المتصفح');
      return;
    }

    setGpsLoading(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData(prev => ({
          ...prev,
          lat: latitude.toFixed(5),
          lng: longitude.toFixed(5)
        }));

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 13);

          L.popup()
            .setLatLng([latitude, longitude])
            .setContent('<div style="direction:rtl; font-family: Cairo; text-align:center;"><b>موقعك الحالي الآن 📍</b></div>')
            .openOn(mapInstanceRef.current);
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError('تعذر تحديد الموقع، يرجى منح الإذن للوصول للموقع.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAddSpot = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lat || !formData.lng) return;

    const newSpot = {
      id: 'spot_' + Date.now(),
      name: formData.name,
      category: formData.category,
      type: formData.type,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      depth: formData.depth,
      description: formData.description,
      isCustom: true
    };

    setSpots(prev => [newSpot, ...prev]);
    setShowAddModal(false);

    // Pan map to new spot
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([newSpot.lat, newSpot.lng], 12);
    }

    setFormData({
      name: '',
      category: 'وعر بحري صخري',
      type: 'marine',
      lat: '',
      lng: '',
      depth: '',
      description: ''
    });
  };

  const handleDeleteSpot = (id) => {
    setSpots(prev => prev.filter(s => s.id !== id));
  };

  // Export JSON backup
  const handleExportSpots = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(spots, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `mosayed_spots_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            خريطة نقاط الصيد والأماكن السرية (GPS Waypoints)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            سجل أماكن الوعر والمراعي ومصبات الترع بالـ GPS واحتفظ بإحداثياتها بسرية تامة على جهازك.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة نقطة صيد جديدة</span>
          </button>

          <button
            onClick={handleGetGPS}
            disabled={gpsLoading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition border border-slate-700"
          >
            <Crosshair className={`w-4 h-4 text-cyan-400 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>موقعي بالـ GPS</span>
          </button>

          <button
            onClick={handleExportSpots}
            title="تصدير نقاطك احتياطياً"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 px-4 py-2 rounded-xl text-xs">
          {gpsError}
        </div>
      )}

      {/* Filter Pills & City Jumpers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-slate-400 text-xs font-semibold ml-1">تصفية:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${filterType === 'all' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
          >
            الكل ({spots.length})
          </button>
          <button
            onClick={() => setFilterType('marine')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${filterType === 'marine' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
          >
            البحر والوعور
          </button>
          <button
            onClick={() => setFilterType('river')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${filterType === 'river' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
          >
            النيل والكباري
          </button>
          <button
            onClick={() => setFilterType('canal')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${filterType === 'canal' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
          >
            الترع والبحيرات
          </button>
          <button
            onClick={() => setFilterType('custom')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${filterType === 'custom' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
          >
            نقاطي الخاصة ⭐ ({spots.filter(s => s.isCustom).length})
          </button>
        </div>

        {/* Quick Zoom to City */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
          <span className="text-[11px] text-slate-500">انتقال سريع:</span>
          <button
            onClick={() => mapInstanceRef.current?.setView([30.5895, 32.2790], 12)}
            className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg text-[11px] font-bold hover:bg-cyan-900 transition"
          >
            📍 الإسماعيلية
          </button>
          <button
            onClick={() => mapInstanceRef.current?.setView([31.2640, 32.3060], 12)}
            className="px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-lg text-[11px] font-bold hover:bg-sky-900 transition"
          >
            📍 بورسعيد
          </button>
          <button
            onClick={() => mapInstanceRef.current?.setView([29.9668, 32.5498], 12)}
            className="px-2.5 py-1 bg-slate-900 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-bold hover:bg-slate-800 transition"
          >
            📍 السويس
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[450px] md:h-[550px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* Saved Waypoints List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          قائمة النقاط المسجلة على الخريطة:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {spots.map((spot) => (
            <div 
              key={spot.id} 
              className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-slate-100">{spot.name}</h4>
                  {spot.isCustom && (
                    <button
                      onClick={() => handleDeleteSpot(spot.id)}
                      title="حذف النقطة"
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-cyan-400 border border-slate-800 inline-block mb-2 font-medium">
                  {spot.category}
                </span>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{spot.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span>العمق: {spot.depth || 'غير محدد'}</span>
                <button
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([spot.lat, spot.lng], 13);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }
                  }}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  عرض في الخريطة ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Spot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                تسجيل نقطة صيد سرية جديدة
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSpot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم النقطة أو الموقع:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: وعر الوقار - شمال الميناء"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نوع المياه:</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="marine">صيد بحري (مالح)</option>
                    <option value="river">صيد نهري (النيل)</option>
                    <option value="canal">صيد ترع ومصارف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">طبيعة المكان:</label>
                  <input
                    type="text"
                    placeholder="مثال: وعر صخري / مرعى / رملي"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">خط العرض (Latitude):</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="31.2000"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">خط الطول (Longitude):</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="29.9000"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGetGPS}
                  className="text-cyan-400 hover:underline text-[11px] font-bold flex items-center gap-1"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  التقاط إحداثيات موقعي الحالي بالـ GPS
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">العمق (اختياري):</label>
                <input
                  type="text"
                  placeholder="مثال: 15 متر أو 3 قامات"
                  value={formData.depth}
                  onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ملاحظات الصياد وسر المكان:</label>
                <textarea
                  rows="2"
                  placeholder="مثال: يضرب الوقار في الجزر على السردين بعد العصر..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  حفظ النقطة على الخريطة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
