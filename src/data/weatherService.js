// Weather & Marine forecast service with Open-Meteo free API & offline realistic fallback

export const PRESET_LOCATIONS = [
  { id: 'ismailia', name: 'الإسماعيلية (بحيرة التمساح وقناة السويس والترعة)', lat: 30.5965, lng: 32.2715, type: 'marine_canal' },
  { id: 'portsaid', name: 'بورسعيد (البوغاز والقناة والساحل وبحيرة المنزلة)', lat: 31.2653, lng: 32.3019, type: 'marine' },
  { id: 'fayed', name: 'فايد وأبو سلطان (البحيرات المرة - الإسماعيلية)', lat: 30.3256, lng: 32.2994, type: 'marine' },
  { id: 'alex', name: 'الإسكندرية (البحر المتوسط)', lat: 31.2001, lng: 29.9187, type: 'marine' },
  { id: 'suez', name: 'السويس (خليج السويس)', lat: 29.9668, lng: 32.5498, type: 'marine' },
  { id: 'hurghada', name: 'الغردقة (البحر الأحمر)', lat: 27.2579, lng: 33.8116, type: 'marine' },
  { id: 'damietta', name: 'دمياط ورأس البر (مصب النيل)', lat: 31.5147, lng: 31.8344, type: 'marine_nile' },
  { id: 'matrouh', name: 'مرسى مطروح (الساحل الشمالي)', lat: 31.3543, lng: 27.2373, type: 'marine' },
  { id: 'cairo', name: 'القاهرة والجيزة (نهر النيل والترع)', lat: 30.0444, lng: 31.2357, type: 'nile' },
  { id: 'aswan', name: 'أسوان وبحيرة ناصر (النيل العذب)', lat: 24.0889, lng: 32.8998, type: 'nile' },
  { id: 'sharm', name: 'شرم الشيخ (رأس محمد والخليج)', lat: 27.9158, lng: 34.3299, type: 'marine' }
];

export async function fetchLiveWeatherData(location) {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    const current = data.current || {};
    const daily = data.daily || {};

    // Get marine wave data if available
    let waveHeight = 0.8;
    let wavePeriod = 5.2;
    if (location.type !== 'nile') {
      try {
        const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${location.lat}&longitude=${location.lng}&current=wave_height,wave_direction,wave_period&timezone=auto`;
        const marineRes = await fetch(marineUrl);
        if (marineRes.ok) {
          const mData = await marineRes.json();
          waveHeight = mData.current?.wave_height || waveHeight;
          wavePeriod = mData.current?.wave_period || wavePeriod;
        }
      } catch (e) {
        // Fallback wave estimation based on wind speed
        waveHeight = Math.max(0.4, Math.round(((current.wind_speed_10m || 15) / 18) * 10) / 10);
      }
    } else {
      waveHeight = 0.1; // River is calm
      wavePeriod = 0;
    }

    const windSpeed = Math.round(current.wind_speed_10m || 14);
    const windDirDeg = current.wind_direction_10m || 315;

    return {
      isLive: true,
      temperature: Math.round(current.temperature_2m || 24),
      feelsLike: Math.round(current.apparent_temperature || 24),
      humidity: Math.round(current.relative_humidity_2m || 60),
      pressure: Math.round(current.surface_pressure || 1014),
      windSpeed,
      windDirection: getWindDirectionName(windDirDeg),
      windDirDeg,
      waveHeight: Math.round(waveHeight * 10) / 10,
      wavePeriod: Math.round(wavePeriod * 10) / 10,
      seaState: getSeaStateDescription(waveHeight, windSpeed, location.type),
      sunrise: daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1].substring(0, 5) : '06:12',
      sunset: daily.sunset?.[0] ? daily.sunset[0].split('T')[1].substring(0, 5) : '17:28',
      tides: generateTideTimes(new Date())
    };
  } catch (err) {
    // Offline / Fallback realistic simulator
    return getOfflineWeatherData(location);
  }
}

function getWindDirectionName(deg) {
  const directions = [
    'شمالية (بحري)',
    'شمالية شرقية',
    'شرقية',
    'جنوبية شرقية',
    'جنوبية (قبلي)',
    'جنوبية غربية (أزيب)',
    'غربية (غربي)',
    'شمالية غربية (شمالي)'
  ];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

function getSeaStateDescription(wave, wind, type) {
  if (type === 'nile') {
    return 'مياه نيلية هادئة وجريان منتظم 🟢';
  }
  if (wave < 0.6 && wind < 15) return 'هادئ جداً (بحر زي المرآة) 🟢';
  if (wave < 1.2 && wind < 22) return 'خفيف إلى معتدل الموج (مثالي للصيد) 🌊';
  if (wave < 1.8 && wind < 30) return 'متوسط الموج ومتحرك (حذر للقوارب) ⚠️';
  return 'بحر هائج وعالي الموج (ممنوع ركوب البحر) 🚫';
}

function generateTideTimes(date) {
  const day = date.getDate();
  const highHour1 = (day * 0.8 + 3) % 12;
  const lowHour1 = (highHour1 + 6.2) % 12;

  const fmt = (h, isPM) => {
    let hours = Math.floor(h) || 12;
    let mins = Math.floor((h - Math.floor(h)) * 60);
    return `${hours}:${mins < 10 ? '0' : ''}${mins} ${isPM ? 'م' : 'ص'}`;
  };

  return [
    { type: 'مد صاعد (High Tide)', time: fmt(highHour1, false), level: '+0.45 متر' },
    { type: 'جزر هابط (Low Tide)', time: fmt(lowHour1, false), level: '-0.20 متر' },
    { type: 'مد صاعد (High Tide)', time: fmt(highHour1, true), level: '+0.50 متر' },
    { type: 'جزر هابط (Low Tide)', time: fmt(lowHour1, true), level: '-0.15 متر' }
  ];
}

export function getOfflineWeatherData(location) {
  const isMarine = location.type !== 'nile';
  return {
    isLive: false,
    temperature: isMarine ? 23 : 26,
    feelsLike: isMarine ? 22 : 25,
    humidity: isMarine ? 65 : 50,
    pressure: 1016,
    windSpeed: 14,
    windDirection: 'شمالية غربية (شمالي)',
    windDirDeg: 315,
    waveHeight: isMarine ? 0.9 : 0.1,
    wavePeriod: isMarine ? 5.0 : 0,
    seaState: isMarine ? 'خفيف إلى معتدل الموج (مثالي للصيد) 🌊' : 'مياه نيلية هادئة 🟢',
    sunrise: '06:15',
    sunset: '17:30',
    tides: generateTideTimes(new Date())
  };
}
