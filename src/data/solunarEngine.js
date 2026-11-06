// Solunar Theory & Environmental Engine for Mosayed Al-Sayad

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

export function calculateSolunarDay(date = new Date(), weatherOrWind = 14, waveOrLocation = 0.8, possibleLoc = null) {
  let weather = {};
  let location = {};

  if (typeof weatherOrWind === 'object' && weatherOrWind !== null) {
    weather = weatherOrWind;
    location = waveOrLocation || {};
  } else {
    weather = {
      windSpeed: typeof weatherOrWind === 'number' ? weatherOrWind : 14,
      waveHeight: typeof waveOrLocation === 'number' ? waveOrLocation : 0.8,
      pressure: 1014,
      temperature: 24,
      windDirection: 'شمالية غربية (شمالي)'
    };
    location = possibleLoc || {};
  }

  const moon = getMoonPhase(date);

  // 1. Moon Astronomical Base (Range: ~48 - 74)
  const moonBase = Math.round(50 * moon.solunarMultiplier);

  // 2. Longitude offset calculation for Egyptian coordinates
  // Meridian 31.23°E (Cairo). Each degree of longitude is approx 4 minutes of time shift.
  const locLng = typeof location.lng === 'number' ? location.lng : 31.23;
  const lngOffsetHours = (locLng - 31.23) * (4 / 60);

  const baseHour = ((date.getDate() * 0.82 + (date.getMonth() + 1) * 1.5) + lngOffsetHours + 24) % 24;

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

  // 3. Environmental Modifiers based on Location & Weather
  const locType = location.type || 'marine';
  const isMarine = locType === 'marine' || locType === 'marine_canal' || locType === 'marine_nile';
  const isNile = locType === 'nile';
  const isCanal = locType === 'marine_canal';

  const windSpeed = typeof weather.windSpeed === 'number' ? weather.windSpeed : 14;
  const waveHeight = typeof weather.waveHeight === 'number' ? weather.waveHeight : (isNile ? 0.1 : 0.8);
  const pressure = typeof weather.pressure === 'number' ? weather.pressure : 1014;
  const temp = typeof weather.temperature === 'number' ? weather.temperature : 24;
  const windDir = weather.windDirection || '';

  // --- Factor A: Atmospheric Pressure (الضغط الجوي وتأثيره على كيس العوم) ---
  let pressureMod = 0;
  let pressureTitle = '';
  let pressureDesc = '';
  if (pressure >= 1013 && pressure <= 1018) {
    pressureMod = +6;
    pressureTitle = 'مثالي ومستقر';
    pressureDesc = `الضغط الجوي (${pressure} hPa) في نطاق الراحة المثالي؛ يحفز كيس العوم على فتح الشهية والأكل بنهم (+6%).`;
  } else if (pressure > 1018 && pressure <= 1022) {
    pressureMod = +2;
    pressureTitle = 'مرتفع معتدل';
    pressureDesc = `الضغط الجوي (${pressure} hPa) مستقر وجيد؛ حركة الأسماك طبيعية في مختلف الأعماق (+2%).`;
  } else if (pressure > 1022) {
    pressureMod = -5;
    pressureTitle = 'مرتفع جداً';
    pressureDesc = `ضغط مرتفع (${pressure} hPa) يجعل الأسماك تتجه للقاع مع خمول نسبي في المطاردة (-5%).`;
  } else if (pressure >= 1009 && pressure < 1013) {
    pressureMod = +4;
    pressureTitle = 'هبوط محفز';
    pressureDesc = `هبوط طفيف للضغط (${pressure} hPa) يسبق تغير الجو ويستثير الأسماك للهجوم والتغذية السريعة (+4%).`;
  } else {
    pressureMod = -12;
    pressureTitle = 'منخفض حاد';
    pressureDesc = `منخفض جوي حاد (${pressure} hPa)؛ حركة الأسماك حذرة جداً وتبحث عن الملاذات الهادئة (-12%).`;
  }

  // --- Factor B: Wind Speed & Direction (سرعة واتجاه الرياح) ---
  let windMod = 0;
  let windTitle = '';
  let windDesc = '';
  if (isMarine) {
    if (windSpeed >= 8 && windSpeed <= 18) {
      windMod = +7;
      windTitle = 'رياح صيد ممتازة';
      windDesc = `رياح معتدلة (${windSpeed} كم/س) تحرك المياه وتكسر حدة الرؤية وتنشط المفترسات السطحية والقاع (+7%).`;
    } else if (windSpeed < 8) {
      windMod = -3;
      windTitle = 'هدوء زائد وصفاء مياه';
      windDesc = `هدوء الرياح (${windSpeed} كم/س) وصفاء الماء يرفع حذر الأسماك الكبيرة من الخيوط (-3%).`;
    } else if (windSpeed <= 26) {
      windMod = -2;
      windTitle = 'رياح نشطة متموجة';
      windDesc = `رياح نشطة (${windSpeed} كم/س)؛ ممتازة للسيرف كاستينج والأوزان الثقيلة ولكن تصعب الكاستينج الخفيف (-2%).`;
    } else {
      windMod = -16;
      windTitle = 'رياح عاصفة قوية';
      windDesc = `رياح عاصفة (${windSpeed} كم/س) تقلب الرمل وتثير الطين في القاع وتعيق التثبيت (-16%).`;
    }

    if (windDir.includes('شمال') || windDir.includes('بحري')) {
      windMod += 3;
      windDesc += ' | رياح بحرية شمالية تنعش التيارات وتدفع الأسماك للشاطئ (+3%).';
    } else if (windDir.includes('جنوب') || windDir.includes('قبلي') || windDir.includes('أزيب')) {
      windMod -= 4;
      windDesc += ' | رياح قبلي/أزيب حارة أو مغبرة تقلل من إقبال الأسماك (-4%).';
    }
  } else {
    // Nile & Canals
    if (windSpeed <= 12) {
      windMod = +7;
      windTitle = 'هواء هادئ ومثالي';
      windDesc = `رياح هادئة (${windSpeed} كم/س)؛ مثالية جداً لحساسية الغماز والريم وحداف النيل والترع (+7%).`;
    } else if (windSpeed <= 20) {
      windMod = -1;
      windTitle = 'هواء متحرك';
      windDesc = `تموج خفيف على سطح النيل؛ يفضل استخدام ثقل أكبر لضبط حساسية الغماز (-1%).`;
    } else {
      windMod = -10;
      windTitle = 'هواء شديد بالنيل';
      windDesc = `رياح قوية (${windSpeed} كم/س) تجر الغماز والخيط بعيداً عن مأوى السمك (-10%).`;
    }
  }

  // --- Factor C: Waves & Sea State (الأمواج وحالة الماء) ---
  let waveMod = 0;
  let waveTitle = '';
  let waveDesc = '';
  if (isMarine) {
    if (waveHeight >= 0.5 && waveHeight <= 1.2) {
      waveMod = +8;
      waveTitle = 'موج صيد نموذجي';
      waveDesc = `موج حي ومعتدل (${waveHeight}م) يفرز الدود والجمبري وسرطانات الشاطئ وينشط الدنيس والقاروص (+8%).`;
    } else if (waveHeight < 0.4) {
      waveMod = -2;
      waveTitle = 'مياه هادئة راكدة';
      waveDesc = `موج هادئ جداً (${waveHeight}م)؛ يتطلب خيوطاً ناعمة ورميات طويلة بعيدة عن الشاطئ (-2%).`;
    } else if (waveHeight <= 1.8) {
      waveMod = +1;
      waveTitle = 'موج عالي ومتحرك';
      waveDesc = `بحر متموج ومتحرك (${waveHeight}م)؛ ممتاز للمياس وقاروص الرمل مع الانتباه للسلامة على الصخور (+1%).`;
    } else {
      waveMod = -15;
      waveTitle = 'بحر هائج عالي الموج';
      waveDesc = `أمواج تفوق ${waveHeight}م؛ جرف شديد للرصاص وعكرات بحرية توقف سحب الأسماك (-15%).`;
    }
  } else {
    // Fresh water / Nile: calm water is the natural baseline
    waveMod = +5;
    waveTitle = 'تيار نيلي منتظم';
    waveDesc = 'مياه جارية منتظمة بدون أمواج بحرية، بيئة مستقرة ومثالية للبلطي وقشر البياض (+5%).';
  }

  // --- Factor D: Temperature (درجة الحرارة) ---
  let tempMod = 0;
  let tempTitle = '';
  let tempDesc = '';
  if (temp >= 19 && temp <= 27) {
    tempMod = +5;
    tempTitle = 'حرارة مثالية للتغذية';
    tempDesc = `درجة حرارة ${temp}°م تنشط الأيض والهضم لدى الأسماك وتجعلها جائعة وتبحث عن الطعم (+5%).`;
  } else if (temp > 27 && temp <= 32) {
    tempMod = +2;
    tempTitle = 'جو دافئ نشط';
    tempDesc = `حرارة ${temp}°م؛ تكون أوقات الفجر، والمغرب، وأول الليل هي الأغزر صيداً (+2%).`;
  } else if (temp > 32) {
    tempMod = -6;
    tempTitle = 'حرارة مرتفعة';
    tempDesc = `حرارة شديدة (${temp}°م) تقلل الأكسجين في المياه السطحية؛ الأسماك تتجه للظلال والأعماق (-6%).`;
  } else if (temp >= 14 && temp < 19) {
    tempMod = -2;
    tempTitle = 'جو مائل للبرودة';
    tempDesc = `برودة ${temp}°م؛ استخدم خيوطاً أرفع وطعوماً حية طبيعية مغرية (-2%).`;
  } else {
    tempMod = -8;
    tempTitle = 'صقيع وبرد شديد';
    tempDesc = `انخفاض الحرارة إلى ${temp}°م يبطئ حركة الأسماك ويلزمها السكون في الحفر والوعر العميق (-8%).`;
  }

  // --- Factor E: Location Identity, Target Species & Environment Bonus ---
  let locationBonus = 0;
  let locationNote = '';
  let activeSpecies = [];

  const locId = location.id || '';
  if (locId === 'ismailia' || locId === 'fayed') {
    locationBonus = +4;
    locationNote = 'مياه قناة السويس والبحيرات المرة: وفرة الجمبري النطاط وتيارات الملاحة وحركة السفن تدفع المغذيات باستمرار، مما ينشط الدنيس والبطاطا واللوت والسهلية.';
    activeSpecies = ['دنيس القناة الحبة الفضية', 'بطاطا فايد والبحيرات', 'السهلية المبطرخة', 'لوت الكيلو 6', 'بوري التمساح', 'جمبري ونطاط'];
  } else if (locId === 'alex' || locId === 'matrouh') {
    locationBonus = (waveHeight >= 0.5 && waveHeight <= 1.3) ? +5 : -2;
    locationNote = 'الساحل الشمالي والمتوسط: نشاط الصيد يعتمد على تكسر الموج الرملي والصخري (الوعر واللسان)، وتنشط أسماك القاروص والدنيس والمياس.';
    activeSpecies = ['قاروص الشاطئ والسيرف', 'دنيس عريض (مرموز)', 'مياس الكاستينج', 'شراغيش المكس والدخيلة', 'مرجان ووقار'];
  } else if (locId === 'portsaid' || locId === 'damietta') {
    locationBonus = +4;
    locationNote = 'منطقة التقاء البواغيز وبحيرة المنزلة ورأس البر بمصب النيل: أغنى مناطق الأسماك المفترسة بالبلح والدود الإسماعيلاوي.';
    activeSpecies = ['قاروص البوغاز والغاطس', 'لوت مصب رأس البر', 'شخرم المنزلة', 'دنيس وطوبار', 'كابوريا وسيبيا'];
  } else if (locId === 'suez' || locId === 'hurghada' || locId === 'sharm') {
    locationBonus = (windSpeed <= 18) ? +5 : -4;
    locationNote = 'البحر الأحمر وخليج السويس: بيئة شعاب ومياه عميقة غنية بالأسماك الفاخرة؛ يعتمد الصيد بشدة على هدوء الرياح للخروج للتسقيط والجيجينج.';
    activeSpecies = ['شعور صخري وقمر', 'ناجل وشريف البحر الأحمر', 'بهار ووقار أحمر', 'باراكودا وتونة جيجينج', 'كشر وبياض صخري'];
  } else if (locId === 'cairo' || locId === 'aswan') {
    locationBonus = (temp >= 18 && temp <= 30) ? +4 : 0;
    locationNote = locId === 'aswan'
      ? 'بحيرة ناصر وأسوان: أعماق مياه عذبة عملاقة ومثالية للأسماك الضخمة المفترسة كساموس قشر البياض والبلطي النيلي الكبير.'
      : 'نيل القاهرة والجيزة: مناطق هادئة (المنيل، البحر الأعظم، الزمالك، ومآخذ الري) تشهد نشاطاً ليلياً ممتازاً بالريم ودود الأرض.';
    activeSpecies = ['بلطي نيلي حبة عريضة', 'قشر بياض (ساموس)', 'قراميط الحداف الليلي', 'شلباية وبني الحجر', 'حنش النيل (تعبان)'];
  } else {
    activeSpecies = ['دنيس', 'قاروص', 'بلطي', 'بوري'];
  }

  // 4. Calculate Final Overall Score (Dynamic & Location-dependent)
  let baseScore = moonBase + pressureMod + windMod + waveMod + tempMod + locationBonus;
  if (baseScore > 98) baseScore = 98;
  if (baseScore < 35) baseScore = 35;
  let overallScore = Math.round(baseScore);

  // Rating text & styling
  let ratingText = '';
  let ratingColor = '';
  const locShortName = location.name ? location.name.split(' ')[0] : 'هذا الموقع';

  if (overallScore >= 85) {
    ratingText = `يوم صيد استثنائي في ${locShortName} (نشاط وتغذية ممتازة 🌟)`;
    ratingColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
  } else if (overallScore >= 70) {
    ratingText = `يوم صيد واعد وناجح في ${locShortName} (نشاط قوي 👍)`;
    ratingColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';
  } else if (overallScore >= 55) {
    ratingText = `نشاط متوسط في ${locShortName} (يتطلب طعماً مميزاً ⚖️)`;
    ratingColor = 'text-amber-400 bg-amber-950/60 border-amber-500/30';
  } else {
    ratingText = `حركة سمك هادئة في ${locShortName} (ركز على أوقات الذروة ⚠️)`;
    ratingColor = 'text-rose-400 bg-rose-950/60 border-rose-500/30';
  }

  // 5. Evaluation: Shore vs Boat vs Nile/Canal
  const boatConditions = [];
  const shoreConditions = [];
  const nileConditions = [];

  let boatRecommendation = '';
  let shoreRecommendation = '';
  let nileRecommendation = '';

  // Boat evaluation
  if (windSpeed > 28 || waveHeight > 2.0) {
    boatRecommendation = 'خطر وغير موصى به إطلاقاً 🚫';
    boatConditions.push(`أمواج تفوق ${waveHeight}م ورياح ${windSpeed} كم/س تجعل خروج اللنش غير آمن.`);
  } else if (windSpeed > 20 || waveHeight > 1.4) {
    boatRecommendation = 'متوسط إلى حذر ⚠️';
    boatConditions.push('البحر متموج، يتطلب قوارب كبيرة وخبرة في التثبيت فوق الوعر أو الجيجينج الثقيل.');
  } else {
    boatRecommendation = 'مثالي جداً للصيد من اللنش ⛵';
    boatConditions.push(`البحر هادئ والموج خفيف (${waveHeight}م)، مثالي للتسقيط الدقيق والجيجينج المريح.`);
  }

  // Shore evaluation
  if (windSpeed < 22 && waveHeight >= 0.5 && waveHeight <= 1.3) {
    shoreRecommendation = 'مثالي للصيد من الشاطئ والسيرف 🏖️';
    shoreConditions.push('تكسر الموج الخفيف يفرز الدود والصدف ويجلب الدنيس والقاروص للبحث عن القشريات على خط الشاطئ.');
  } else if (waveHeight > 2.0) {
    shoreRecommendation = 'صعب من الصخور والشاطئ ⚠️';
    shoreConditions.push('الأمواج قوية وتجرف الرصاص وخيوط السيرف كاستينج باتجاه الشاطئ مع رذاذ كثيف.');
  } else {
    shoreRecommendation = 'جيد ومناسب لكاستينج الفجر 🌅';
    shoreConditions.push('الهدوء يستلزم استخدام خيوط ناعمة ورميات سيرف طويلة (Long Cast) لتفادي حذر الأسماك.');
  }

  // Nile & Canals
  if (isNile || locId === 'cairo' || locId === 'aswan') {
    if (overallScore >= 75) {
      nileRecommendation = 'ممتاز جداً للبلطي وقشر البياض 🌿';
      nileConditions.push('نشاط عالي للأسماك النيلية؛ طعم الريم والعجين ودود الأرض سيعطي نتائج قوية.');
    } else {
      nileRecommendation = 'جيد للحداف الليلي والترع 🌙';
      nileConditions.push('ركز على القراميط بالمصران أو الحنش بالدود في المياه الراكدة والهادئة.');
    }
  } else if (isCanal) {
    nileRecommendation = 'مناسب جداً للترعة الحلوة وقنوات الإسماعيلية 🌾';
    nileConditions.push('المياه العذبة في الترع تعطي نشاطاً ممتازاً للبلطي بالريم والدود عند هدوء الهواء.');
  } else {
    nileRecommendation = 'صيد نهري بديل ممتاز عند ارتفاع أمواج البحر 🌊';
    nileConditions.push('إذا كان البحر عالي الموج، فالترع وفروع النيل القريبة توفر مياهاً هادئة وآمنة.');
  }

  return {
    moon,
    overallScore,
    ratingText,
    ratingColor,
    locationBonus,
    locationNote,
    activeSpecies,
    factors: {
      moon: {
        score: moonBase,
        multiplier: moon.solunarMultiplier,
        icon: moon.icon,
        name: moon.name,
        desc: `عامل الجاذبية القمرية (${moon.name}) يمنح أساس نشاط ${moonBase}%`
      },
      pressure: {
        value: pressure,
        mod: pressureMod,
        title: pressureTitle,
        desc: pressureDesc
      },
      wind: {
        speed: windSpeed,
        dir: windDir,
        mod: windMod,
        title: windTitle,
        desc: windDesc
      },
      wave: {
        height: waveHeight,
        mod: waveMod,
        title: waveTitle,
        desc: waveDesc
      },
      temperature: {
        value: temp,
        mod: tempMod,
        title: tempTitle,
        desc: tempDesc
      }
    },
    periods: [
      {
        type: 'فترة رئيسية أولى (Major 1)',
        time: `${formatHour(major1Start)} - ${formatHour(major1End)}`,
        desc: `أعلى ذروة نشاط وتغذية للأسماك في ${locShortName} (القمر فوق الرأس مباشرة)`,
        intensity: '⭐⭐⭐⭐⭐'
      },
      {
        type: 'فترة رئيسية ثانية (Major 2)',
        time: `${formatHour(major2Start)} - ${formatHour(major2End)}`,
        desc: 'ذروة نشاط قوية جداً (القمر في النظير المقابل تحت الأرض)',
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
