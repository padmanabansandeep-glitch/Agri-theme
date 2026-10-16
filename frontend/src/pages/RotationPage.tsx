import React, { useState } from 'react';
import { RefreshCw, ArrowRight, ShieldCheck, Sprout, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';

export const RotationPage: React.FC = () => {
  const { language, user } = useAppStore();
  const t = translations[language];

  const [selectedBaseCrop, setSelectedBaseCrop] = useState('paddy');

  const rotationPlans: Record<string, any> = {
    paddy: {
      current: 'Paddy (Rice) - Heavy Nitrogen & Water Feeder',
      season1: { crop: 'Black Gram / Green Gram (Pulses)', benefit: 'Fixes 35-50 kg/ha atmospheric nitrogen in root nodules. Zero fertilizer needed.' },
      season2: { crop: 'Sesame (Gingelly) / Groundnut', benefit: 'Low water requirement, deep taproot breaks hard pan, high market value.' },
      season3: { crop: 'Sunnhemp (Green Manure)', benefit: 'Adds 15 tonnes organic matter per acre prior to next paddy cycle.' }
    },
    wheat: {
      current: 'Wheat - Rabi Cereal',
      season1: { crop: 'Green Gram (Moong) - Zaid Short Duration', benefit: 'Quick 65-day crop providing immediate cash flow and nitrogen replenishment.' },
      season2: { crop: 'Maize / Soybean - Kharif', benefit: 'Maintains balanced soil organic carbon and breaks weed cycles.' }
    },
    cotton: {
      current: 'Cotton - Long Duration Cash Crop',
      season1: { crop: 'Chickpea (Gram) / Mustard', benefit: 'Suppresses pink bollworm carryover and restores subsoil potassium availability.' },
      season2: { crop: 'Sorghum (Jowar) / Millets', benefit: 'Provides heavy biomass fodder and mitigates nematode build-up.' }
    }
  };

  const plan = rotationPlans[selectedBaseCrop] || rotationPlans.paddy;

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-verified">AGRONOMIC ROTATION ENGINE</span>
            <span className="text-xs font-mono text-zinc-500">
              Soil Regeneration & Nutrient Cycling
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400">
            {t.nav.rotation} & Soil Health Sequence
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Break pest cycles, fix atmospheric nitrogen naturally, and maintain soil microbiome vitality.
          </p>
        </div>

        {/* Base Crop Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Base Crop:</span>
          <select
            value={selectedBaseCrop}
            onChange={(e) => setSelectedBaseCrop(e.target.value)}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold focus:outline-none focus:border-emerald-500"
          >
            <option value="paddy">Paddy (Rice)</option>
            <option value="wheat">Wheat</option>
            <option value="cotton">Cotton</option>
          </select>
        </div>
      </div>

      {/* Rotation Timeline */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-6">
          Multi-Season Sequence for: <span className="text-emerald-600">{plan.current}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                Season 1 (Post-Harvest)
              </span>
              <h4 className="font-bold font-display text-base text-zinc-900 dark:text-white mt-2">
                {plan.season1.crop}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2">
                {plan.season1.benefit}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>Fixes Biological Nitrogen</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                Season 2 (Summer / Zaid)
              </span>
              <h4 className="font-bold font-display text-base text-zinc-900 dark:text-white mt-2">
                {plan.season2.crop}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2">
                {plan.season2.benefit}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mt-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>Mitigates Pest Build-up</span>
            </div>
          </div>

          {plan.season3 && (
            <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-800 dark:text-blue-300 font-bold bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded">
                  Season 3 (Pre-Monsoon)
                </span>
                <h4 className="font-bold font-display text-base text-zinc-900 dark:text-white mt-2">
                  {plan.season3.crop}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2">
                  {plan.season3.benefit}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold mt-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>Restores Organic Humus</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
