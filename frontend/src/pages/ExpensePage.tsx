import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ArrowRight, 
  PieChart as PieIcon, 
  BarChart3, 
  Sparkles, 
  Save, 
  Check, 
  AlertCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { postExpenseCalc } from '../lib/api';

export const ExpensePage: React.FC = () => {
  const { language, setTab, selectedCrop, user, setExpenses, addHistory } = useAppStore();
  const t = translations[language];

  const crop = selectedCrop || {
    id: 'paddy',
    name: 'Paddy (Rice)',
    tamil_name: 'நெல்',
    hindi_name: 'धान',
    typical_cost_per_acre: 24500,
    typical_yield_per_acre: 26,
    typical_yield_unit: 'Quintals',
    typical_price_per_unit: 2203,
    post_harvest_loss_pct: 7.5
  };

  const [expensesData, setExpensesData] = useState<any>(null);
  const [customInputs, setCustomInputs] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'bars' | 'donut'>('bars');
  const [isSaved, setIsSaved] = useState(false);

  const loadExpenses = async (custom?: Record<string, number>) => {
    try {
      const res = await postExpenseCalc({
        crop_id: crop.id,
        land_area: user.landArea,
        land_unit: user.landUnit,
        farming_type: 'Conventional',
        custom_expenses: custom
      });
      setExpensesData(res);
      setExpenses(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [crop.id, user.landArea]);

  const handleInputChange = (catId: string, val: number) => {
    const updated = { ...customInputs, [catId]: val };
    setCustomInputs(updated);
    loadExpenses(updated);
  };

  const handleSavePlan = () => {
    addHistory({
      cropName: crop.name,
      state: user.state,
      landArea: user.landArea,
      landUnit: user.landUnit,
      totalCost: expensesData?.total_cost || 0,
      breakdown: expensesData?.breakdown || []
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const categories = expensesData?.breakdown || [];
  const totalCost = expensesData?.total_cost || 0;
  const costPerAcre = expensesData?.cost_per_acre || 0;
  const biggestDriver = expensesData?.biggest_driver || {
    category_name: 'Chemical Fertilizers',
    cost: 8500,
    percentage: 16.5,
    tip: 'Explore cooperative pooling to purchase wholesale fertilizers at subsidized rates.'
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-verified">13-POINT AGRO COST ENGINE</span>
            <span className="text-xs font-mono text-zinc-500">
              For {user.landArea} {user.landUnit} · {crop.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400">
            {t.expenses.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            {t.expenses.subtitle}
          </p>
        </div>

        {/* Total Cost Display */}
        <div className="flex items-center gap-4 bg-emerald-50/80 dark:bg-emerald-950/50 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
              {t.expenses.totalCost}
            </div>
            <div className="text-2xl font-mono font-bold text-brand-forest dark:text-emerald-300">
              ₹{Math.round(totalCost).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              ₹{Math.round(costPerAcre).toLocaleString('en-IN')} / Acre
            </div>
          </div>
          <button
            onClick={handleSavePlan}
            className={`p-3 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 text-zinc-700 dark:text-zinc-200'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4 text-emerald-600" />}
            <span className="hidden sm:inline">{isSaved ? 'Saved!' : 'Save Plan'}</span>
          </button>
        </div>
      </div>

      {/* Primary Cost Driver Insight Alert */}
      <div className="glass-panel rounded-3xl p-5 border-l-4 border-l-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex-shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 uppercase">
                {t.expenses.biggestDriver}
              </span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {biggestDriver.category_name} ({biggestDriver.percentage}%)
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              {biggestDriver.tip}
            </p>
          </div>
        </div>

        <button
          onClick={() => setTab('profit')}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-forest hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0"
        >
          <span>Proceed to Profit Projections</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content: 13 Categories Form + Visual Share Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 13 Cost Categories Editable Table (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Editable Cultivation Inputs
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              Inline editable for local precision
            </span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {categories.map((cat: any, idx: number) => (
              <div
                key={cat.category_id}
                className="flex items-center justify-between p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {cat.category_name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      {cat.percentage}% of budget
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-mono">₹</span>
                  <input
                    type="number"
                    value={Math.round(cat.cost)}
                    onChange={(e) => handleInputChange(cat.category_id, parseFloat(e.target.value) || 0)}
                    className="w-24 p-1.5 text-right font-mono text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Share Chart & Breakdown (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Cost Distribution (% Share)
              </h3>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setViewMode('bars')}
                  className={`p-1 rounded ${viewMode === 'bars' ? 'bg-white dark:bg-zinc-700 shadow-sm font-bold' : ''}`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('donut')}
                  className={`p-1 rounded ${viewMode === 'donut' ? 'bg-white dark:bg-zinc-700 shadow-sm font-bold' : ''}`}
                >
                  <PieIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Horizontal Bar Share Visualizer */}
            <div className="space-y-3 mt-4">
              {categories.slice(0, 8).map((cat: any) => (
                <div key={cat.category_id} className="text-xs">
                  <div className="flex justify-between font-mono mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[200px]">{cat.category_name}</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, cat.percentage * 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900 mt-6 text-[11px] text-zinc-500">
            <strong>Subsidies & Rebates:</strong> Fertilizers & seed components can be subsidized under SMAM & Soil Health Card recommendations. Check the Government Schemes page.
          </div>
        </div>
      </div>
    </div>
  );
};
