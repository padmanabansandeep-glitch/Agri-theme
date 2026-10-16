import React, { useEffect, useState } from 'react';
import { Award, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { fetchSchemes } from '../lib/api';

export const SchemesPage: React.FC = () => {
  const { language, user } = useAppStore();
  const t = translations[language];

  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    fetchSchemes().then(res => setSchemes(res.schemes || []));
  }, []);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-demo">CURATED DATABASE</span>
            <span className="text-xs font-mono text-zinc-500">
              Matched for {user.state} · Small/Marginal Farmer ({user.landArea} {user.landUnit})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400">
            {t.nav.schemes} & Subsidies
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Direct financial support, crop insurance coverage, and micro-irrigation capital subsidies.
          </p>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme: any) => (
          <div
            key={scheme.id}
            className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500 transition-all border border-zinc-200 dark:border-zinc-800"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Verified: {scheme.verified_date}
                </span>
              </div>

              <h3 className="text-base font-bold font-display text-zinc-900 dark:text-white mb-2">
                {language === 'ta' && scheme.tamil_name ? scheme.tamil_name : (language === 'hi' && scheme.hindi_name ? scheme.hindi_name : scheme.name)}
              </h3>

              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 text-xs mb-3">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">Benefit:</span>
                <p className="text-zinc-700 dark:text-zinc-300">{scheme.benefit}</p>
              </div>

              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">Eligibility: </span>
                {scheme.eligibility}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-mono">Official Gov Portal</span>
              <a
                href={scheme.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-forest hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <span>Apply / Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
