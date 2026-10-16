import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  Share2, 
  FileText, 
  Box, 
  LayoutList, 
  HelpCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { postProfitCalc } from '../lib/api';
import { generatePdfReport } from '../lib/exportPdf';
import { ProfitTowers3D } from '../3d/ProfitTowers3D';

export const ProfitPage: React.FC = () => {
  const { language, selectedCrop, user, currentExpenses, setProfit } = useAppStore();
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

  const [profitData, setProfitData] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<'expected' | 'conservative' | 'optimistic'>('expected');
  const [view3D, setView3D] = useState<boolean>(true);

  // Custom editable multipliers
  const [customCost, setCustomCost] = useState<number | undefined>(undefined);
  const [customYield, setCustomYield] = useState<number | undefined>(undefined);
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);

  const loadProfit = async () => {
    try {
      const res = await postProfitCalc({
        crop_id: crop.id,
        land_area: user.landArea,
        land_unit: user.landUnit,
        custom_cost: customCost !== undefined ? customCost : currentExpenses?.total_cost,
        custom_yield_per_acre: customYield,
        custom_price_per_unit: customPrice
      });
      setProfitData(res);
      setProfit(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProfit();
  }, [crop.id, user.landArea, customCost, customYield, customPrice]);

  const currentScenarioData = profitData ? profitData[`${activeScenario}_scenario`] : null;
  const isLoss = currentScenarioData?.is_loss || false;

  // Export PDF Handler
  const handleExportPdf = () => {
    if (!profitData) return;
    const exp = profitData.expected_scenario;
    generatePdfReport({
      cropName: crop.name,
      suitabilityScore: crop.suitability_score || 94,
      state: user.state,
      soilType: user.soilType,
      landArea: user.landArea,
      landUnit: user.landUnit,
      totalCost: profitData.base_cost,
      grossRevenue: exp.gross_revenue,
      netProfit: exp.net_profit,
      profitMargin: exp.profit_margin_pct || 0,
      yieldPerAcre: crop.typical_yield_per_acre,
      yieldUnit: crop.typical_yield_unit,
      pricePerUnit: crop.typical_price_per_unit,
      beYield: profitData.break_even_yield_per_acre,
      bePrice: profitData.break_even_price_per_unit,
      expenses: currentExpenses?.breakdown || []
    });
  };

  // Export CSV Handler
  const handleExportCsv = () => {
    if (!profitData) return;
    const rows = [
      ["Metric", "Value"],
      ["Crop", crop.name],
      ["Area", `${user.landArea} ${user.landUnit}`],
      ["Total Cost", `Rs. ${profitData.base_cost}`],
      ["Expected Gross Revenue", `Rs. ${profitData.expected_scenario.gross_revenue}`],
      ["Expected Net Profit", `Rs. ${profitData.expected_scenario.net_profit}`],
      ["Profit Margin", `${profitData.expected_scenario.profit_margin_pct}%`],
      ["Break-even Yield", `${profitData.break_even_yield_per_acre} ${profitData.yield_unit}/Acre`],
      ["Break-even Price", `Rs. ${profitData.break_even_price_per_unit} / ${profitData.yield_unit}`]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AgriSmart_Profit_${crop.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    if (!profitData) return;
    const msg = `AgriSmart Ultra Plan for ${crop.name} (${user.landArea} ${user.landUnit}): Est. Profit ₹${Math.round(profitData.expected_scenario.net_profit).toLocaleString('en-IN')} with ₹${Math.round(profitData.base_cost).toLocaleString('en-IN')} investment.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-verified">PRODUCTION PROFIT ENGINE</span>
            <span className="text-xs font-mono text-zinc-500">
              {crop.name} · {user.landArea} {user.landUnit}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400">
            {t.profit.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            {t.profit.subtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setView3D(!view3D)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800 text-xs font-bold hover:border-emerald-500 transition-colors"
          >
            <Box className="w-4 h-4 text-emerald-600" />
            <span>{view3D ? t.profit.view2D : t.profit.view3D}</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{t.profit.exportPdf}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors"
            title="Download CSV"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-colors"
            title="Share on WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Scenarios Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: 'conservative', label: t.profit.conservative, tag: 'Worst-case Risk', mult: '0.8x yield, 0.85x price' },
          { key: 'expected', label: t.profit.expected, tag: 'Standard Baseline', mult: '1.0x normal yield & rate' },
          { key: 'optimistic', label: t.profit.optimistic, tag: 'Favorable Market', mult: '1.2x bumper yield & rate' }
        ].map((sc) => {
          const scData = profitData ? profitData[`${sc.key}_scenario`] : null;
          const isCurrent = activeScenario === sc.key;
          const loss = scData?.is_loss;

          return (
            <button
              key={sc.key}
              onClick={() => setActiveScenario(sc.key as any)}
              className={`p-5 rounded-3xl border text-left transition-all ${
                isCurrent
                  ? 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/70 ring-2 ring-emerald-500/20 shadow-md'
                  : 'glass-panel hover:border-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-500 mb-1">
                <span>{sc.tag}</span>
                <span>{sc.mult}</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-2">
                {sc.label}
              </h4>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-mono font-bold ${loss ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  ₹{scData ? Math.round(scData.net_profit).toLocaleString('en-IN') : '—'}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {loss ? t.profit.estimatedLoss : 'Net Profit'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 mt-2">
                Margin: {scData?.profit_margin_pct ? `${scData.profit_margin_pct}%` : 'N/A'} · Yield: {scData?.saleable_yield} {profitData?.yield_unit}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Bento: 3D Profit Towers vs 2D Summary + Break-Evens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual View (3D or 2D) (7 Cols) */}
        <div className="lg:col-span-7">
          {view3D ? (
            <ProfitTowers3D
              expenses={profitData?.base_cost || 45000}
              revenue={currentScenarioData?.gross_revenue || 98000}
              profit={currentScenarioData?.net_profit || 53000}
              isLoss={isLoss}
            />
          ) : (
            <div className="glass-panel rounded-3xl p-6 h-[340px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-4">
                  2D Proportional Financial Breakdown
                </h3>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Total Cultivation Investment</span>
                      <span className="font-bold text-amber-600">₹{Math.round(profitData?.base_cost || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full w-2/3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Gross Saleable Revenue</span>
                      <span className="font-bold text-sky-500">₹{Math.round(currentScenarioData?.gross_revenue || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-sky-400 h-full rounded-full w-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Net Profit After Post-Harvest Losses</span>
                      <span className={`font-bold ${isLoss ? 'text-rose-500' : 'text-emerald-500'}`}>
                        ₹{Math.round(currentScenarioData?.net_profit || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                      <div className={`${isLoss ? 'bg-rose-500' : 'bg-emerald-500'} h-full rounded-full w-4/5`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 font-mono">
                Post-harvest loss deduction applied: {crop.post_harvest_loss_pct || 5}%
              </div>
            </div>
          )}
        </div>

        {/* Break-Even & Safety Indicators (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-2">
              Break-Even Risk Thresholds
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Minimum productivity and market prices required to prevent capital losses.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900">
                <div className="text-[10px] font-mono uppercase text-zinc-500">
                  {t.profit.breakEvenYield}
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {profitData?.break_even_yield_per_acre} {profitData?.yield_unit} / Acre
                </div>
                <span className="text-[10px] text-zinc-400">
                  Expected yield is {crop.typical_yield_per_acre} {crop.typical_yield_unit} (Safety Buffer: {Math.max(0, Math.round(((crop.typical_yield_per_acre - (profitData?.break_even_yield_per_acre || 0)) / crop.typical_yield_per_acre) * 100))}%)
                </span>
              </div>

              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900">
                <div className="text-[10px] font-mono uppercase text-zinc-500">
                  {t.profit.breakEvenPrice}
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  ₹{Math.round(profitData?.break_even_price_per_unit || 0).toLocaleString('en-IN')} / {profitData?.yield_unit}
                </div>
                <span className="text-[10px] text-zinc-400">
                  Benchmark rate is ₹{crop.typical_price_per_unit} / {crop.typical_yield_unit}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl text-[10px] text-zinc-500 mt-4">
            <strong>Formula:</strong> Net Profit = Saleable Yield × Price − Total Cost. Losses labelled in coral red.
          </div>
        </div>
      </div>

      {/* Sensitivity Heatmap (Price x Yield) (5x5 Matrix) */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              {t.profit.sensitivityTitle}
            </h3>
            <p className="text-xs text-zinc-500">
              Stress-testing net profit across market price variations and yield shifts.
            </p>
          </div>
          <span className="badge-verified">25-POINT MATRIX</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-2 text-left text-zinc-400">Yield Δ \ Price Δ</th>
                <th className="p-2 text-rose-500">-20% Price</th>
                <th className="p-2 text-amber-500">-10% Price</th>
                <th className="p-2 font-bold text-zinc-700 dark:text-zinc-200">0% Baseline</th>
                <th className="p-2 text-emerald-500">+10% Price</th>
                <th className="p-2 text-emerald-600">+20% Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {[-20, -10, 0, 10, 20].map((yDelta) => (
                <tr key={yDelta}>
                  <td className="p-2.5 text-left font-bold text-zinc-600 dark:text-zinc-300">
                    {yDelta > 0 ? `+${yDelta}%` : `${yDelta}%`} Yield
                  </td>
                  {[-20, -10, 0, 10, 20].map((pDelta) => {
                    const pt = profitData?.sensitivity_grid?.find(
                      (g: any) => g.yield_change_pct === yDelta && g.price_change_pct === pDelta
                    );
                    const net = pt ? pt.net_profit : 0;
                    const loss = pt ? pt.is_loss : false;
                    return (
                      <td
                        key={pDelta}
                        className={`p-2.5 rounded-lg font-bold transition-colors ${
                          loss
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                            : 'bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        ₹{Math.round(net).toLocaleString('en-IN')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
