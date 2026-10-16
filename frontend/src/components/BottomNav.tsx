import React from 'react';
import { Compass, Sprout, DollarSign, CloudSun, History } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';

export const BottomNav: React.FC = () => {
  const { currentTab, setTab, language } = useAppStore();
  const t = translations[language];

  const tabs = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Compass },
    { id: 'recommend', label: t.nav.recommend, icon: Sprout },
    { id: 'expenses', label: t.nav.expenses, icon: DollarSign },
    { id: 'profit', label: t.nav.profit, icon: DollarSign },
    { id: 'weather', label: t.nav.weather, icon: CloudSun },
    { id: 'history', label: t.nav.history, icon: History },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors min-w-[54px] ${
              isActive
                ? 'text-brand-forest dark:text-emerald-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-100 dark:bg-emerald-950/80' : ''}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
