import React from 'react';
import { X, CheckCircle, Info } from 'lucide-react';

interface JarTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSoil: (soilType: string) => void;
}

export const JarTestModal: React.FC<JarTestModalProps> = ({ isOpen, onClose, onSelectSoil }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: "Collect Soil Sample",
      desc: "Dig 6-8 inches deep to avoid surface debris. Fill a clear glass mason jar 1/3 full with dry, crushed soil."
    },
    {
      num: 2,
      title: "Add Water & Detergent",
      desc: "Fill jar with clean water leaving 1 inch headspace. Add 1 teaspoon liquid dish soap to disperse soil particles."
    },
    {
      num: 3,
      title: "Shake Vigourously",
      desc: "Fasten lid tightly and shake vigorously for 3 full minutes so all soil aggregates dissolve."
    },
    {
      num: 4,
      title: "Observe 3 Settling Horizons",
      desc: "Place on a flat shelf undisturbed: Sand settles in 1 minute; Silt settles in 2 hours; Clay settles in 48 hours."
    }
  ];

  const outcomes = [
    { type: 'alluvial', label: 'Alluvial / Riverine', desc: 'Balanced sand + silt bands with rich organic matter layer at top.' },
    { type: 'black', label: 'Black Cotton (Regur)', desc: 'Thick dark clay layer (>40%) that swells when wet and shrinks when dry.' },
    { type: 'red', label: 'Red / Sandy Loam', desc: 'High sand (>60%) with red iron oxide tinge, quick 1-minute settling.' },
    { type: 'laterite', label: 'Laterite (Hard Soil)', desc: 'Porous, coarse particles with orange-brown clay residue.' },
    { type: 'loamy', label: 'Loamy (Garden Ideal)', desc: 'Ideal 40% sand, 40% silt, 20% clay proportions.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-100 dark:border-emerald-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏺</span>
            <div>
              <h3 className="text-xl font-bold font-display text-brand-forest dark:text-emerald-400">
                DIY Field Jar Test Guide
              </h3>
              <p className="text-xs text-zinc-500">Quick field method to determine your soil texture without lab equipment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
          {steps.map(s => (
            <div key={s.num} className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {s.num}
                </span>
                <h5 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{s.title}</h5>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 pl-7">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Visual Jar Diagram */}
        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 mb-6 flex items-center gap-4">
          <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <strong>Pro-tip:</strong> Measure the thickness of each layer with a ruler:
            <span className="font-mono ml-1 font-semibold">(Clay Height ÷ Total Height) × 100 = % Clay</span>.
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div>
          <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300 mb-2">
            Match your jar result to select soil type:
          </h4>
          <div className="space-y-2">
            {outcomes.map(o => (
              <button
                key={o.type}
                onClick={() => {
                  onSelectSoil(o.type);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-sm text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {o.label}
                  </div>
                  <div className="text-xs text-zinc-500">{o.desc}</div>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
