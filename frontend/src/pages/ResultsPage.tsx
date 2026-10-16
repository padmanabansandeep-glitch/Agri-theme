import React, { useState } from 'react';
import { 
  Sprout, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Sliders, 
  BarChart3, 
  Layers, 
  Check, 
  Sparkles,
  Droplets,
  Calendar,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';

export const ResultsPage: React.FC = () => {
  const { language, setTab, currentRecommendation, selectedCrop, setSelectedCrop, user } = useAppStore();
  const t = translations[language];

  const [compareCrops, setCompareCrops] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [explainCropId, setExplainCropId] = useState<string | null>(null);

  // What-If Sliders state
  const [whatIfRain, setWhatIfRain] = useState<number>(0); // -30% to +30%
  const [whatIfTemp, setWhatIfTemp] = useState<number>(0); // -5 to +5 deg C
  const [whatIfPh, setWhatIfPh] = useState<number>(0); // -1.0 to +1.0

  const crops = currentRecommendation?.recommendations || [];

  // Apply What-If dynamic score modifier
  const modifiedCrops = crops.map((c: any) => {
    let modScore = c.suitability_score;
    if (whatIfRain !== 0) {
      if (c.water_need === 'High' && whatIfRain < 0) modScore -= 8;
      if (c.water_need === 'Low' && whatIfRain < 0) modScore += 4;
    }
    if (whatIfTemp > 2) {
      if (c.optimal_temp_max > 32) modScore += 3;
      else modScore -= 5;
    }
    return {
      ...c,
      dynamic_score: Math.max(20, Math.min(99, modScore))
    };
  }).sort((a: any, b: any) => b.dynamic_score - a.dynamic_score);

  const topCrops = modifiedCrops.slice(0, 5);

  const handleToggleCompare = (id: string) => {
    if (compareCrops.includes(id)) {
      setCompareCrops(compareCrops.filter(c => c !== id));
    } else {
      if (compareCrops.length < 4) {
        setCompareCrops([...compareCrops, id]);
      } else {
        alert("You can compare up to 4 crops simultaneously.");
      }
    }
  };

  const handleSelectPlan = (crop: any) => {
    setSelectedCrop(crop);
    setTab('expenses');
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header & Badges */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-verified">EVALUATED {crops.length} CROPS</span>
            <span className="text-xs font-mono text-zinc-500">
              Confidence {currentRecommendation?.overall_confidence || 92}% ({currentRecommendation?.missing_inputs?.length ? 'Adjusted' : 'Complete'})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400">
            {t.results.topRecommendations}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Ranked by physiological tolerance, rainfall fit, soil texture, and regional profitability.
          </p>
        </div>

        {/* Compare Trigger */}
        <div className="flex items-center gap-3">
          {compareCrops.length > 0 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all shadow-md"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Compare Selected ({compareCrops.length})</span>
            </button>
          )}
          <button
            onClick={() => setTab('recommend')}
            className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Adjust Inputs
          </button>
        </div>
      </div>

      {/* What-If Real-Time Simulation Panel */}
      <div className="glass-panel rounded-3xl p-5 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Sliders className="w-4 h-4" />
            <span>{t.results.whatIfTitle}</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">Drag sliders to watch crop rankings re-sort live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="flex justify-between font-bold mb-1">
              <span className="text-zinc-700 dark:text-zinc-300">Rainfall Variance</span>
              <span className="font-mono text-emerald-600">{whatIfRain > 0 ? `+${whatIfRain}%` : `${whatIfRain}%`}</span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              value={whatIfRain}
              onChange={(e) => setWhatIfRain(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>-30% Drought</span>
              <span>Baseline Normal</span>
              <span>+30% Excess</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold mb-1">
              <span className="text-zinc-700 dark:text-zinc-300">Temperature Offset</span>
              <span className="font-mono text-emerald-600">{whatIfTemp > 0 ? `+${whatIfTemp}°C` : `${whatIfTemp}°C`}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              value={whatIfTemp}
              onChange={(e) => setWhatIfTemp(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>-5°C Cooler</span>
              <span>Normal</span>
              <span>+5°C Heatwave</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold mb-1">
              <span className="text-zinc-700 dark:text-zinc-300">Soil pH Shift</span>
              <span className="font-mono text-emerald-600">{whatIfPh > 0 ? `+${whatIfPh.toFixed(1)}` : `${whatIfPh.toFixed(1)}`}</span>
            </div>
            <input
              type="range"
              min="-1.5"
              max="1.5"
              step="0.1"
              value={whatIfPh}
              onChange={(e) => setWhatIfPh(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>More Acidic</span>
              <span>Current</span>
              <span>More Alkaline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Crop Cards List */}
      <div className="space-y-4">
        {topCrops.map((crop: any, index: number) => {
          const isSelected = compareCrops.includes(crop.id);
          const isExpanded = explainCropId === crop.id;
          const score = crop.dynamic_score;

          return (
            <div
              key={crop.id}
              className={`glass-panel rounded-3xl p-6 transition-all border ${
                index === 0
                  ? 'border-emerald-500/80 ring-2 ring-emerald-500/10'
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Crop Identity & Score Radial Gauge */}
                <div className="flex items-center gap-4">
                  {/* Animated Radial Score Gauge */}
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-zinc-200 dark:text-zinc-800"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={163}
                        strokeDashoffset={163 - (163 * score) / 100}
                        strokeLinecap="round"
                        className={`transition-all duration-700 ${
                          score >= 85 ? 'text-emerald-600' : (score >= 70 ? 'text-amber-500' : 'text-blue-500')
                        }`}
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white">
                        {score}
                      </span>
                      <span className="text-[8px] uppercase text-zinc-400">Score</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      {index === 0 && (
                        <span className="badge-verified">#1 HIGHEST FIT</span>
                      )}
                      <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                        {crop.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white">
                      {language === 'ta' ? crop.tamil_name : (language === 'hi' ? crop.hindi_name : crop.name)}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {crop.duration_days} Days Duration · {crop.sowing_window} Sowing · {crop.water_need} Water
                    </p>
                  </div>
                </div>

                {/* Economic Snapshot */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Typical Cost</div>
                    <div className="font-bold text-zinc-800 dark:text-zinc-200">₹{(crop.typical_cost_per_acre * user.landArea).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Est. Yield</div>
                    <div className="font-bold text-zinc-800 dark:text-zinc-200">{crop.typical_yield_per_acre * user.landArea} {crop.typical_yield_unit}</div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[10px] text-zinc-400 uppercase">Est. Rate</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">₹{crop.typical_price_per_unit} / {crop.typical_yield_unit}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleCompare(crop.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                    title="Add to Comparison"
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : '+ Compare'}
                  </button>

                  <button
                    onClick={() => setExplainCropId(isExpanded ? null : crop.id)}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {isExpanded ? 'Hide Factors' : 'Explain Why'}
                  </button>

                  <button
                    onClick={() => handleSelectPlan(crop)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-forest hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 hover:scale-105 transition-all"
                  >
                    <span>{t.results.planExpenses}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Reasons & Risk Details Accordion */}
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.results.whySuits}</span>
                  </div>
                  <ul className="space-y-1 text-zinc-600 dark:text-zinc-300">
                    {crop.reasons?.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t.results.risks}</span>
                  </div>
                  <ul className="space-y-1 text-zinc-600 dark:text-zinc-300">
                    {crop.risks?.map((rk: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{rk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Explainability Breakdown Panel (Expanded) */}
              {isExpanded && crop.factor_breakdown && (
                <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-fadeIn">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3 font-mono">
                    Factor Breakdown & Scoring Weights (ICAR Multi-Criteria Model)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">Soil Match (25%)</div>
                      <div className="font-bold text-emerald-600 text-sm">{crop.factor_breakdown.soil_match}%</div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">Temperature (20%)</div>
                      <div className="font-bold text-emerald-600 text-sm">{crop.factor_breakdown.temperature_fit}%</div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">Water / Rainfall (20%)</div>
                      <div className="font-bold text-emerald-600 text-sm">{crop.factor_breakdown.water_fit}%</div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">pH Tolerance (12%)</div>
                      <div className="font-bold text-emerald-600 text-sm">{crop.factor_breakdown.ph_fit}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compare Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-emerald-100 dark:border-emerald-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold font-display text-lg text-brand-forest dark:text-emerald-400">
                Side-by-Side Crop Comparison
              </h3>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="p-3 text-zinc-500 font-mono">Metric</th>
                    {compareCrops.map(cid => {
                      const c = crops.find((x: any) => x.id === cid);
                      return (
                        <th key={cid} className="p-3 font-bold text-brand-forest dark:text-emerald-400 font-display text-sm">
                          {c?.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
                  <tr>
                    <td className="p-3 text-zinc-500">Suitability Score</td>
                    {compareCrops.map(cid => {
                      const c = crops.find((x: any) => x.id === cid);
                      return <td key={cid} className="p-3 font-bold text-emerald-600">{c?.suitability_score}%</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-500">Est. Investment</td>
                    {compareCrops.map(cid => {
                      const c = crops.find((x: any) => x.id === cid);
                      return <td key={cid} className="p-3">₹{(c?.typical_cost_per_acre * user.landArea).toLocaleString('en-IN')}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-500">Expected Yield</td>
                    {compareCrops.map(cid => {
                      const c = crops.find((x: any) => x.id === cid);
                      return <td key={cid} className="p-3">{c?.typical_yield_per_acre * user.landArea} {c?.typical_yield_unit}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-500">Duration (Days)</td>
                    {compareCrops.map(cid => {
                      const c = crops.find((x: any) => x.id === cid);
                      return <td key={cid} className="p-3">{c?.duration_days} days</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-500">Water Requirement</td>
                    {compareCrops.map(cid => {
                      const c = crops.find((x: any) => x.id === cid);
                      return <td key={cid} className="p-3">{c?.water_need}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
