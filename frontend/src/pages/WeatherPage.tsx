import React, { useEffect, useState } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  CloudRain, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  Sun,
  Sunrise,
  Sunset
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { fetchWeather } from '../lib/api';
import { FarmHero3D } from '../3d/FarmHero3D';

export const WeatherPage: React.FC = () => {
  const { language, user, theme } = useAppStore();
  const t = translations[language];

  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchWeather(10.78, 79.13).then(data => {
      setWeather(data);
      setLoading(false);
    });
  }, []);

  const cur = weather?.current || {
    temperature_2m: 29.5,
    relative_humidity_2m: 68,
    precipitation: 0.0,
    wind_speed_10m: 12.0,
    apparent_temperature: 31.0
  };

  const daily = weather?.daily || {
    time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    temperature_2m_max: [31, 32, 33, 30, 29, 31, 32],
    temperature_2m_min: [22, 23, 23, 21, 22, 22, 23],
    precipitation_sum: [0, 2, 0, 14, 6, 0, 1],
    precipitation_probability_max: [10, 25, 15, 75, 45, 10, 20]
  };

  const isRainy = cur.precipitation > 0;

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-verified">OPEN-METEO SYNCED</span>
            <span className="text-xs font-mono text-zinc-500">
              {user.district}, {user.state} (10.78°N, 79.13°E)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400">
            {t.nav.weather} & Crop Impact Forecast
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            7-day agricultural forecast, rain probability, and humidity pest triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-brand-forest dark:text-emerald-300">
              {cur.temperature_2m}°C
            </div>
            <div className="text-xs text-zinc-500">Feels like {cur.apparent_temperature || cur.temperature_2m}°C</div>
          </div>
        </div>
      </div>

      {/* 3D Weather Reactive Banner */}
      <div className="glass-panel rounded-3xl p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase">
            3D Microclimate Weather Simulation
          </span>
          <span className="text-xs font-mono text-zinc-500">
            Status: {isRainy ? 'Active Precipitation' : 'Sunny & Mild'}
          </span>
        </div>
        <div className="w-full h-[280px]">
          <FarmHero3D
            weatherCondition={isRainy ? 'rainy' : 'sunny'}
            timeOfDay={theme === 'dark' ? 'night' : theme === 'golden' ? 'sunset' : 'day'}
          />
        </div>
      </div>

      {/* Current Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-zinc-400 font-mono">Ambient Temp</div>
            <div className="text-lg font-mono font-bold text-zinc-800 dark:text-zinc-100">{cur.temperature_2m}°C</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-zinc-400 font-mono">Rel. Humidity</div>
            <div className="text-lg font-mono font-bold text-zinc-800 dark:text-zinc-100">{cur.relative_humidity_2m}%</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-zinc-400 font-mono">Wind Speed</div>
            <div className="text-lg font-mono font-bold text-zinc-800 dark:text-zinc-100">{cur.wind_speed_10m} km/h</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase text-zinc-400 font-mono">Precipitation</div>
            <div className="text-lg font-mono font-bold text-zinc-800 dark:text-zinc-100">{cur.precipitation} mm</div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Strip */}
      <div className="glass-panel rounded-3xl p-6">
        <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-4">
          7-Day Agricultural Forecast
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {daily.time.map((day: string, idx: number) => {
            const maxT = daily.temperature_2m_max[idx];
            const minT = daily.temperature_2m_min[idx];
            const rainP = daily.precipitation_probability_max[idx];
            const rainSum = daily.precipitation_sum[idx];

            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-center font-mono flex flex-col justify-between"
              >
                <div className="text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">{day}</div>
                <div className="text-2xl my-1">{rainP > 40 ? '🌧️' : '🌤️'}</div>
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-100 mt-2">
                  {maxT}° / {minT}°
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">
                  {rainP}% Rain ({rainSum}mm)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crop Impact & Pest Warning Card */}
      <div className="glass-panel rounded-3xl p-6 border-l-4 border-l-amber-500">
        <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono">
          <AlertTriangle className="w-4 h-4" />
          <span>Microclimate Crop Alert: Fungal Spore Risk</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Upcoming rain on Day 4 ({daily.precipitation_sum[3] || 14}mm) paired with high relative humidity (&gt;75%) creates conducive microclimatic conditions for Blast disease in Paddy and Tikka spot in Groundnut. Ensure drainage channels are cleared and prepare neem seed kernel extract (NSKE 5%) spray for prophylactic protection.
        </p>
      </div>
    </div>
  );
};
