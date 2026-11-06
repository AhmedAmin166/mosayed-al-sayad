import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Trash2, Award, Calendar, 
  MapPin, Scale, Ruler, Sparkles, Download, 
  Camera, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_LOGS = [
  {
    id: 'log_1',
    fishName: 'قاروص (Sea Bass)',
    weight: 3.8,
    length: 68,
    date: '2026-10-25',
    location: 'شاطئ رأس الحكمة - مطروح',
    waterType: 'بحري',
    bait: 'جمبري نطاط حي',
    technique: 'كاستينج فجراً',
    notes: 'الضربة كانت الساعة 5:30 فجراً في أول ضوء مع ريم البحر الهادئ.'
  },
  {
    id: 'log_2',
    fishName: 'دنيس معرم (Gilthead)',
    weight: 2.1,
    length: 44,
    date: '2026-10-18',
    location: 'الإسكندرية - صخور لوران',
    waterType: 'بحري',
    bait: 'دود إسماعلاوي مدكك',
    technique: 'سيرف كاستينج مع المد الصاعد',
    notes: 'سمكة قوية جداً تم صيدها بسن شينو كربوني مقاس 4.'
  },
  {
    id: 'log_3',
    fishName: 'قشر بياض نيلي (Nile Perch)',
    weight: 6.5,
    length: 82,
    date: '2026-09-30',
    location: 'نهر النيل - أسوان',
    waterType: 'نهري',
    bait: 'لور رابالا ديب دايفر 12 سم',
    technique: 'سبينينج بجوار الدومات',
    notes: 'معركة استمرت ربع ساعة! قشر بياض ملكي بلون برونزي مبهر.'
  }
];

export default function LogbookTab() {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('mosayed_catch_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fishName: '',
    weight: '',
    length: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    waterType: 'بحري',
    bait: '',
    technique: '',
    notes: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem('mosayed_catch_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  // Statistics
  const totalCatches = logs.length;
  const totalWeight = logs.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);
  const maxWeightFish = logs.reduce((max, item) => {
    const w = parseFloat(item.weight) || 0;
    return w > (parseFloat(max?.weight) || 0) ? item : max;
  }, logs[0] || null);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!formData.fishName) return;

    const newLog = {
      id: 'log_' + Date.now(),
      fishName: formData.fishName,
      weight: parseFloat(formData.weight) || 0,
      length: parseFloat(formData.length) || 0,
      date: formData.date,
      location: formData.location || 'غير محدد',
      waterType: formData.waterType,
      bait: formData.bait || 'غير محدد',
      technique: formData.technique || 'غير محدد',
      notes: formData.notes || ''
    };

    setLogs(prev => [newLog, ...prev]);
    setShowAddModal(false);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    // Reset form
    setFormData({
      fishName: '',
      weight: '',
      length: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      waterType: 'بحري',
      bait: '',
      technique: '',
      notes: ''
    });
  };

  const handleDeleteLog = (id) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `mosayed_catches_logbook_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header & Stats */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            دفتر ويوميات الصيد وسجل الحصيلة
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            وثّق صيدك المميز بالأوزان والأطوال، والطعوم المستخدمة، واحتفظ بإحصائياتك الشخصية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل صيد جديد 🎣</span>
          </button>

          <button
            onClick={handleExportLogs}
            title="تصدير السجل احتياطياً"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
          <span className="text-xs text-slate-400 block mb-1">إجمالي الأسماك الموثقة</span>
          <div className="text-2xl font-black text-white">{totalCatches}</div>
          <span className="text-[10px] text-cyan-400">سمكة مسجلة</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
          <span className="text-xs text-slate-400 block mb-1">الرقم القياسي (أكبر وزن)</span>
          <div className="text-2xl font-black text-amber-400">
            {maxWeightFish?.weight ? `${maxWeightFish.weight} كجم` : '--'}
          </div>
          <span className="text-[10px] text-slate-300 truncate block px-2">
            {maxWeightFish?.fishName || 'لا توجد بيانات'}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
          <span className="text-xs text-slate-400 block mb-1">إجمالي وزن الصيد</span>
          <div className="text-2xl font-black text-emerald-400">
            {totalWeight.toFixed(1)} كجم
          </div>
          <span className="text-[10px] text-emerald-300">حصيلة كل الرحلات</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
          <span className="text-xs text-slate-400 block mb-1">الرتبة والخبرة</span>
          <div className="text-base font-black text-cyan-300 flex items-center justify-center gap-1 mt-1">
            <Award className="w-5 h-5 text-amber-400" />
            <span>صياد محترف 🎖️</span>
          </div>
          <span className="text-[10px] text-slate-400">مستوى السجل</span>
        </div>
      </div>

      {/* Catches List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-200">سجل الرحلات والطرائد:</h3>

        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  log.waterType === 'بحري'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {log.waterType}
                </span>
                <h4 className="text-lg font-black text-white">{log.fishName}</h4>
              </div>

              {/* Tags: weight, length, date, location */}
              <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                {log.weight > 0 && (
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Scale className="w-3.5 h-3.5" />
                    {log.weight} كجم
                  </span>
                )}
                {log.length > 0 && (
                  <span className="flex items-center gap-1 text-cyan-300 font-bold">
                    <Ruler className="w-3.5 h-3.5" />
                    {log.length} سم
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {log.date}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {log.location}
                </span>
              </div>

              <div className="text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <p><strong className="text-slate-400">الطعم المستخدم:</strong> <span className="text-slate-200 font-medium">{log.bait}</span></p>
                <p><strong className="text-slate-400">طريقة الصيد والعدة:</strong> <span className="text-slate-200">{log.technique}</span></p>
                {log.notes && (
                  <p className="text-slate-300 italic pt-1 border-t border-slate-900 mt-1">
                    "{log.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex md:flex-col items-center justify-between gap-2 border-t md:border-t-0 md:border-r border-slate-800 pt-3 md:pt-0 md:pr-4">
              <button
                onClick={() => handleDeleteLog(log.id)}
                className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-slate-800 transition"
                title="حذف هذا السجل"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">سجلك فارغ حالياً</h3>
            <p className="text-xs text-slate-500 mt-1">ابدأ بتوثيق أول حصيلة صيد عبر زر "تسجيل صيد جديد".</p>
          </div>
        )}
      </div>

      {/* Add Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                توثيق صيد جديد في السجل
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم السمكة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قاروص / دنيس / وقار / قشر بياض"
                  value={formData.fishName}
                  onChange={(e) => setFormData({ ...formData, fishName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الوزن (كيلوجرام):</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الطول (سنتيمتر):</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="55"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نوع المياه:</label>
                  <select
                    value={formData.waterType}
                    onChange={(e) => setFormData({ ...formData, waterType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="بحري">صيد بحري (مالح)</option>
                    <option value="نهري">صيد نهري (عذب)</option>
                    <option value="ترع وبحيرات">ترع ومصارف وبحيرات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تاريخ الصيد:</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المكان أو الشاطئ:</label>
                <input
                  type="text"
                  placeholder="مثال: بحري - الإسكندرية أو كوبري روض الفرج"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الطعم المستخدم:</label>
                  <input
                    type="text"
                    placeholder="مثال: جمبري حي / دود / لور 10 سم"
                    value={formData.bait}
                    onChange={(e) => setFormData({ ...formData, bait: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">طريقة الصيد:</label>
                  <input
                    type="text"
                    placeholder="مثال: كاستينج / تسقيط / سيرف"
                    value={formData.technique}
                    onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ملاحظات وذكريات الرحلة:</label>
                <textarea
                  rows="2"
                  placeholder="اكتب ملاحظاتك عن الطقس أو تفاصيل المعركة مع السمكة..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  حفظ الصيد في السجل 🎉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
