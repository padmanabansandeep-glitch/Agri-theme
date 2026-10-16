import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Database, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';

export const ExplainerPage: React.FC = () => {
  const { language } = useAppStore();
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-verified">ALGORITHMIC INTEGRITY</span>
          <span className="text-xs font-mono text-zinc-500">Peer-Reviewed Agronomy Rules</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400">
          How AgriSmart Recommends Crops
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          A completely transparent look into our scoring engine, mathematical formulas, and data provenance.
        </p>
      </div>

      {/* Core Principle 1: Trapezoidal Membership Functions */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-brand-forest dark:text-emerald-400 font-bold">
          <Cpu className="w-6 h-6" />
          <h3 className="text-lg font-display">1. Trapezoidal Fuzzy Membership Scoring</h3>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Living crops do not react to environmental factors in binary (yes/no) terms. A crop has an absolute survival range <span className="font-mono text-xs">[Min, Max]</span> and a sweet-spot <span className="font-mono text-xs">[Optimal Min, Optimal Max]</span>. AgriSmart computes continuous trapezoidal membership scores:
        </p>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs space-y-1">
          <div>• If Value &lt; Min: Score penalizes rapidly (15% to 50%)</div>
          <div>• If Min ≤ Value &lt; Optimal Min: Linear climb 50% → 100%</div>
          <div>• If Optimal Min ≤ Value ≤ Optimal Max: Peak score = 100%</div>
          <div>• If Optimal Max &lt; Value ≤ Max: Linear decline 100% → 50%</div>
          <div>• If Value &gt; Max: Heat/cold/water stress penalty applies</div>
        </div>
      </div>

      {/* Core Principle 2: Factor Weights */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-brand-forest dark:text-emerald-400 font-bold">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="text-lg font-display">2. Multi-Criteria Agronomic Weights</h3>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Suitability is synthesized using weighted summation reflecting practical Indian farming constraints:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">25%</span>
            <div className="text-zinc-500 mt-1">Soil Texture Match</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">20%</span>
            <div className="text-zinc-500 mt-1">Temperature Fit</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">20%</span>
            <div className="text-zinc-500 mt-1">Rainfall & Water</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">12%</span>
            <div className="text-zinc-500 mt-1">Soil pH Tolerance</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">10%</span>
            <div className="text-zinc-500 mt-1">Cropping Season</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">8%</span>
            <div className="text-zinc-500 mt-1">Relative Humidity</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">5%</span>
            <div className="text-zinc-500 mt-1">Farmer Budget Fit</div>
          </div>
        </div>
      </div>

      {/* Core Principle 3: Data Provenance */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-brand-forest dark:text-emerald-400 font-bold">
          <Database className="w-6 h-6" />
          <h3 className="text-lg font-display">3. Strict Data Provenance & Separation</h3>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          We strictly segregate verified scientific research data from demonstration feeds:
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="badge-verified">VERIFIED SOURCE</span>
            <span className="text-zinc-600 dark:text-zinc-300">
              Crop parameters sourced directly from ICAR (Indian Council of Agricultural Research) and TNAU (Tamil Nadu Agricultural University) Agritech Portal.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-demo">DEMO DATA</span>
            <span className="text-zinc-600 dark:text-zinc-300">
              Sample APMC mandi benchmark prices and historical price trends kept in dedicated demo directories.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
