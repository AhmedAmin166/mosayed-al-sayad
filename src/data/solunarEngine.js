// Solunar Theory & Moon Phase Calculator for Mosayed Al-Sayad

export function getMoonPhase(date = new Date()) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }

  let a = Math.floor(year / 100);
  let b = Math.floor(a / 4);
  let c = 2 - a + b;
  let e = Math.floor(365.25 * (year + 4716));
  let f = Math.floor(30.6001 * (month + 1));
  let jd = c + day + e + f - 1524.5;

  let daysSinceNewMoon = jd - 2451549.5;
  let newMoons = daysSinceNewMoon / 29.53058770576;
  let phaseFraction = newMoons - Math.floor(newMoons);
  let age = phaseFraction * 29.53;

  let phaseName = '';
  let illumination = Math.round((0.5 * (1 - Math.cos(2 * Math.PI * phaseFraction))) * 100);
  let icon = '🌕';
  let solunarMultiplier = 1.0;

  if (age < 1.84566) {
    phaseName = 'محاق (New Moon)';
    icon = '🌑';
    solunarMultiplier = 1.45; // New moon is top tier fishing
  } else if (age < 5.53699) {
    phaseName = 'هلال متزايد (Waxing Crescent)';
    icon = '🌒';
    solunarMultiplier = 1.15;
  } else if (age < 9.22831) {
    phaseName = 'تربيع أول (First Quarter)';
    icon = '🌓';
    solunarMultiplier = 0.95;
  } else if (age < 12.91963) {
    phaseName = 'أحدب متزايد (Waxing Gibbous)';
    icon = '🌔';
    solunarMultiplier = 1.25;
  } else if (age < 16.61096) {
    phaseName = 'بدر مكتمل (Full Moon)';
    icon = '🌕';
    solunarMultiplier = 1.5; // Full moon is peak tier
  } else if (age < 20.30228) {
    phaseName = 'أحدب متناقص (Waning Gibbous)';
    icon = '🌖';
    solunarMultiplier = 1.2;
  } else if (age < 23.99361) {
    phaseName = 'تربيع ثانٍ (Last Quarter)';
    icon = '🌗';
    solunarMultiplier = 0.9;
  } else if (age < 27.68493) {
    phaseName = 'هلال متناقص (Waning Crescent)';
    icon = '🌘';
    solunarMultiplier = 1.1;
  } else {
    phaseName = 'محاق (New Moon)';
    icon = '🌑';
    solunarMultiplier = 1.45;
  }

  return {
    age: Math.round(age * 10) / 10,
    fraction: phaseFraction,
    name: phaseName,
    illumination,
    icon,
    solunarMultiplier
  };
}

export function calculateSolunarDay(date = new Date(), windSpeedKmh = 14, waveHeightMeters = 0.8) {
  const moon = getMoonPhase(date);

  // Approximate solar and lunar transit times based on day
  const baseHour = (date.getDate() * 0.8 + date.getMonth() * 1.5) % 24;

  const formatHour = (h) => {
    let normalized = (h + 24) % 24;
    let hours = Math.floor(normalized);
    let minutes = Math.floor((normalized - hours) * 60);
    let period = hours >= 12 ? 'م' : 'ص';
    let displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  };

  const major1Start = (baseHour + 11.5) % 24;
  const major1End = (major1Start + 2) % 24;

  const major2Start = (baseHour + 23.5) % 24;
  const major2End = (major2Start + 2) % 24;

  const minor1Start = (baseHour + 5.5) % 24;
  const minor1End = (minor1Start + 1.2) % 24;

  const minor2Start = (baseHour + 17.5) % 24;
  const minor2End = (minor2Start + 1.2) % 24;

  // Calculate overall day score (0-100)
  let baseScore = 65 * moon.solunarMultiplier;
  if (baseScore > 98) baseScore = 98;
  if (baseScore < 40) baseScore = 40;
  let overallScore = Math.round(baseScore);

  // Rating label
  let ratingText = '';
  let ratingColor = '';
  if (overallScore >= 85) {
    ratingText = 'يوم صيد استثنائي (ممتاز جداً 🌟)';
    ratingColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
  } else if (overallScore >= 70) {
    ratingText = 'يوم صيد جيد جداً (نشاط واعد 👍)';
    ratingColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';
  } else if (overallScore >= 55) {
    ratingText = 'يوم صيد متوسط (يتطلب طعماً مميزاً ⚖️)';
    ratingColor = 'text-amber-400 bg-amber-950/60 border-amber-500/30';
  } else {
    ratingText = 'يوم صيد ضعيف (حركة السمك بطيئة ⚠️)';
    ratingColor = 'text-rose-400 bg-rose-950/60 border-rose-500/30';
  }

  // Evaluation: Shore vs Boat vs Nile/Canal
  const boatConditions = [];
  const shoreConditions = [];
  const nileConditions = [];

  let boatRecommendation = '';
  let shoreRecommendation = '';
  let nileRecommendation = '';

  // Boat evaluation
  if (windSpeedKmh > 30 || waveHeightMeters > 2.0) {
    boatRecommendation = 'خطر وغير موصى به إطلاقاً 🚫';
    boatConditions.push('أمواج عالية تفوق 2 متر ورياح عاصفة تجعل خروج اللنش غير آمن.');
  } else if (windSpeedKmh > 20 || waveHeightMeters > 1.4) {
    boatRecommendation = 'متوسط إلى حذر ⚠️';
    boatConditions.push('البحر متموج، يتطلب قوارب كبيرة وخبرة في التثبيت فوق الوعر.');
  } else {
    boatRecommendation = 'مثالي جداً للصيد من اللنش ⛵';
    boatConditions.push('البحر هادئ والموج خفيف يسمح بالتسقيط الدقيق والجيجينج المريح.');
  }

  // Shore evaluation
  if (windSpeedKmh < 22 && waveHeightMeters >= 0.5 && waveHeightMeters <= 1.3) {
    shoreRecommendation = 'مثالي للصيد من الشاطئ والسيرف 🏖️';
    shoreConditions.push('تكسر الموج الخفيف يجلب الدنيس والقاروص للبحث عن القشريات على خط الشاطئ.');
  } else if (waveHeightMeters > 2.0) {
    shoreRecommendation = 'صعب من الصخور والشاطئ ⚠️';
    shoreConditions.push('الأمواج قوية وتجرف الرصاص وخيوط السيرف كاستينج باتجاه الشاطئ.');
  } else {
    shoreRecommendation = 'جيد ومناسب لكاستينج الفجر 🌅';
    shoreConditions.push('الهدوء التام يستلزم خيوط ناعمة واستخدام رميات طويلة (Long Cast).');
  }

  // Nile & Canals
  if (overallScore >= 75) {
    nileRecommendation = 'ممتاز جداً للبلطي وقشر البياض 🌿';
    nileConditions.push('نشاط عالي للأسماك النيلية تحت تأثير الجاذبية القمرية، استغل طعم الريم والعجين.');
  } else {
    nileRecommendation = 'جيد للحداف الليلي والترع 🌙';
    nileConditions.push('ركز على القراميط بالمصران أو الحنش بالدود في المياه الراكدة والهادئة.');
  }

  return {
    moon,
    overallScore,
    ratingText,
    ratingColor,
    periods: [
      {
        type: 'فترة رئيسية أولى (Major 1)',
        time: `${formatHour(major1Start)} - ${formatHour(major1End)}`,
        desc: 'أعلى ذروة نشاط وتغذية للأسماك (القمر فوق الرأس مباشرة)',
        intensity: '⭐⭐⭐⭐⭐'
      },
      {
        type: 'فترة رئيسية ثانية (Major 2)',
        time: `${formatHour(major2Start)} - ${formatHour(major2End)}`,
        desc: 'ذروة نشاط قوية جداً (القمر في النظير المقابل)',
        intensity: '⭐⭐⭐⭐'
      },
      {
        type: 'فترة ثانوية أولى (Minor 1)',
        time: `${formatHour(minor1Start)} - ${formatHour(minor1End)}`,
        desc: 'نشاط متوسط إلى عالي (وقت طلوع القمر)',
        intensity: '⭐⭐⭐'
      },
      {
        type: 'فترة ثانوية ثانية (Minor 2)',
        time: `${formatHour(minor2Start)} - ${formatHour(minor2End)}`,
        desc: 'نشاط متوسط (وقت غروب القمر)',
        intensity: '⭐⭐⭐'
      }
    ],
    recommendations: {
      boat: { status: boatRecommendation, details: boatConditions },
      shore: { status: shoreRecommendation, details: shoreConditions },
      nile: { status: nileRecommendation, details: nileConditions }
    }
  };
}
