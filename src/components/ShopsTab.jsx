import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, MapPin, Search, Plus, Star, CheckCircle, ExternalLink } from 'lucide-react';
import { CITIES_LIST, INITIAL_SHOPS } from '../data/shopsData';

export default function ShopsTab() {
  const [shops, setShops] = useState(() => {
    try {
      const saved = localStorage.getItem('mosayed_tackle_shops');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically sync and append new verified initial shops if local list is older
        if (parsed.length < INITIAL_SHOPS.length) {
          const userCustoms = parsed.filter(s => !INITIAL_SHOPS.some(init => init.id === s.id));
          return [...INITIAL_SHOPS, ...userCustoms];
        }
        return parsed;
      }
      return INITIAL_SHOPS;
    } catch {
      return INITIAL_SHOPS;
    }
  });

  const [selectedCity, setSelectedCity] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    city: 'الإسكندرية',
    address: '',
    phone: '',
    specialties: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem('mosayed_tackle_shops', JSON.stringify(shops));
    } catch (e) {
      console.error(e);
    }
  }, [shops]);

  const filteredShops = shops.filter((shop) => {
    const matchesCity = selectedCity === 'الكل' || shop.city === selectedCity;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = 
      shop.name.toLowerCase().includes(q) ||
      shop.address.toLowerCase().includes(q) ||
      shop.city.toLowerCase().includes(q) ||
      shop.specialties.some(s => s.toLowerCase().includes(q));
    return matchesCity && matchesQuery;
  });

  const handleAddShop = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    const newShop = {
      id: 'shop_' + Date.now(),
      name: formData.name,
      city: formData.city,
      address: formData.address,
      phone: formData.phone || 'غير مسجل',
      lat: 31.2,
      lng: 30.0,
      specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : ['معدات وأدوات صيد عامة'],
      verified: false,
      rating: 5.0
    };

    setShops(prev => [newShop, ...prev]);
    setShowAddModal(false);
    setFormData({
      name: '',
      city: 'الإسكندرية',
      address: '',
      phone: '',
      specialties: ''
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header & Search */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-cyan-400" />
              دليل محلات وأماكن بيع أدوات الصيد والطعوم
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              ابحث عن أقرب محل لمعدات الصيد والطعوم الحية (دود بحر، جمبري نطاط، دود أرض) في مدينتك.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن اسم محل أو شارع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shrink-0 shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة متجر</span>
            </button>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {CITIES_LIST.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCity === city
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShops.map((shop) => (
          <div
            key={shop.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                    {shop.name}
                    {shop.verified && (
                      <CheckCircle className="w-4 h-4 text-cyan-400 inline" title="متجر معتمد وموثوق" />
                    )}
                  </h3>
                  <span className="text-xs text-cyan-400 font-semibold block mt-0.5">
                    📍 {shop.city}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-300 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{shop.rating}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-2 mt-3">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>{shop.address}</span>
                </p>

                {shop.phone && shop.phone !== 'غير مسجل' && (
                  <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a href={`tel:${shop.phone}`} className="hover:underline dir-ltr font-mono">
                      {shop.phone}
                    </a>
                  </p>
                )}
              </div>

              {/* Specialties tags */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                {shop.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-850 flex items-center gap-2">
              {shop.phone && shop.phone !== 'غير مسجل' && (
                <a
                  href={`tel:${shop.phone}`}
                  className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>اتصال هاتفي</span>
                </a>
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address + ' ' + shop.city)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>الموقع بالخرائط</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">لم يتم العثور على محلات</h3>
          <p className="text-xs text-slate-500 mt-1">يمكنك إضافة متجرك أو أي محل تعرفه عبر زر "إضافة متجر".</p>
        </div>
      )}

      {/* Add Shop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                إضافة محل أدوات صيد جديد
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddShop} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم المحل أو المتجر:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سنارة الإسكندرية لأدوات الصيد"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المدينة أو المحافظة:</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {CITIES_LIST.filter(c => c !== 'الكل').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">العنوان بالتفصيل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شارع خالد بن الوليد، سيدي بشر"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">رقم الهاتف (اختياري):</label>
                <input
                  type="tel"
                  placeholder="010XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المميزات والطعوم (مفصولة بفواصل):</label>
                <input
                  type="text"
                  placeholder="مثال: طعوم حية، دود إسماعلاوي، صيانة ماكينات"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
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
                  حفظ المتجر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
