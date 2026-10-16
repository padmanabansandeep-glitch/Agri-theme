import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  FileText, 
  Share2, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { generatePdfReport } from '../lib/exportPdf';

export const HistoryPage: React.FC = () => {
  const { language, setTab, historyList, removeHistory, setSelectedCrop, user } = useAppStore();
  const t = translations[language];

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Default mock history if none saved yet
  const displayList = historyList.length > 0 ? historyList : [
    {
      id: 'demo-plan-1',
      cropName: 'Paddy (Rice)',
      created_at: 'Oct 14, 2026',
      state: 'Tamil Nadu',
      landArea: 2.5,
      landUnit: 'acres',
      totalCost: 61250,
      expectedRevenue: 128875,
      netProfit: 67625
    },
    {
      id: 'demo-plan-2',
      cropName: 'Turmeric',
      created_at: 'Oct 10, 2026',
      state: 'Tamil Nadu',
      landArea: 1.0,
      landUnit: 'acres',
      totalCost: 62000,
      expectedRevenue: 168000,
      netProfit: 106000
    }
  ];

  const handleDownloadPdf = (plan: any) => {
    generatePdfReport({
      cropName: plan.cropName,
      suitabilityScore: 92,
      state: plan.state || user.state,
      soilType: user.soilType,
      landArea: plan.landArea || user.landArea,
      landUnit: plan.landUnit || user.landUnit,
      totalCost: plan.totalCost,
      grossRevenue: plan.expectedRevenue || plan.totalCost * 2,
      netProfit: plan.netProfit || plan.totalCost,
      profitMargin: 52.4,
      yieldPerAcre: 24,
      yieldUnit: 'Quintals',
      pricePerUnit: 2200,
      beYield: 11.2,
      bePrice: 1020,
      expenses: plan.breakdown || []
    });
    setToastMessage(`Downloaded PDF report for ${plan.cropName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    removeHistory(id);
    setToastMessage("Plan removed from saved history.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-verified">LOCAL & CLOUD STORED</span>
            <span className="text-xs font-mono text-zinc-500">
              {displayList.length} Cultivation Plans
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400">
            {t.nav.history} & Export Hub
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Reopen, compare, export PDF dossiers, and share agronomic plans.
          </p>
        </div>

        <button
          onClick={() => setTab('recommend')}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-forest hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition-all shadow-md"
        >
          <Sparkles className="w-4 h-4 text-brand-gold" />
          <span>New Recommendation</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl flex items-center justify-between animate-fadeIn shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Saved Records Cards List */}
      <div className="space-y-4">
        {displayList.map((plan: any) => (
          <div
            key={plan.id}
            className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-2xl flex-shrink-0">
                🌾
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-base text-zinc-900 dark:text-white font-display">
                    {plan.cropName}
                  </span>
                  <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                    {plan.landArea} {plan.landUnit}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Created {plan.created_at} · {plan.state}
                </div>
              </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-zinc-400">Total Investment</span>
                <div className="font-bold text-zinc-800 dark:text-zinc-200">
                  ₹{Math.round(plan.totalCost).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400">Est. Net Profit</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{Math.round(plan.netProfit || plan.totalCost).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadPdf(plan)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                title="Download PDF Dossier"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Report</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCrop({ id: plan.cropName.toLowerCase(), name: plan.cropName });
                  setTab('expenses');
                }}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                title="Reopen Plan"
              >
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(plan.id)}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-rose-50 hover:text-rose-600 text-zinc-400 transition-colors"
                title="Delete Plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
