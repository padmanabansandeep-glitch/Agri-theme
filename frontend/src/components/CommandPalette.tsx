import React, { useState, useEffect } from 'react';
import { Search, Compass, DollarSign, CloudSun, History, Award, RefreshCw, BookOpen, Sun, Moon, Volume2, Globe } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { setTab, setLanguage, setTheme, toggleSound } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'dashboard', name: 'Go to Farmer Dashboard', category: 'Navigation', icon: Compass, action: () => setTab('dashboard') },
    { id: 'recommend', name: 'Start New Crop Recommendation', category: 'Navigation', icon: Compass, action: () => setTab('recommend') },
    { id: 'expenses', name: 'Open 13-Point Expense Calculator', category: 'Navigation', icon: DollarSign, action: () => setTab('expenses') },
    { id: 'profit', name: 'View Profit & Sensitivity Analysis', category: 'Navigation', icon: DollarSign, action: () => setTab('profit') },
    { id: 'weather', name: 'Check Local Agro-Weather & Forecast', category: 'Navigation', icon: CloudSun, action: () => setTab('weather') },
    { id: 'history', name: 'Open Saved Plans & PDF Reports', category: 'Navigation', icon: History, action: () => setTab('history') },
    { id: 'schemes', name: 'Explore Government Agricultural Schemes', category: 'Navigation', icon: Award, action: () => setTab('schemes') },
    { id: 'rotation', name: 'Plan Crop Rotation & Soil Fertility', category: 'Navigation', icon: RefreshCw, action: () => setTab('rotation') },
    { id: 'explainer', name: 'How AgriSmart Works (Transparency)', category: 'Navigation', icon: BookOpen, action: () => setTab('explainer') },
    { id: 'lang-en', name: 'Switch Language to English', category: 'Language', icon: Globe, action: () => setLanguage('en') },
    { id: 'lang-ta', name: 'Switch Language to தமிழ் (Tamil)', category: 'Language', icon: Globe, action: () => setLanguage('ta') },
    { id: 'lang-hi', name: 'Switch Language to हिन्दी (Hindi)', category: 'Language', icon: Globe, action: () => setLanguage('hi') },
    { id: 'theme-light', name: 'Switch to Sunrise Farm Theme (Light)', category: 'Theme', icon: Sun, action: () => setTheme('light') },
    { id: 'theme-dark', name: 'Switch to Night Farm Theme (Dark)', category: 'Theme', icon: Moon, action: () => setTheme('dark') },
    { id: 'theme-golden', name: 'Switch to Golden Hour Theme', category: 'Theme', icon: Sun, action: () => setTheme('golden') },
    { id: 'sound-toggle', name: 'Toggle Ambient Farm Audio (Birdsong & Rain)', category: 'Preferences', icon: Volume2, action: () => toggleSound() },
  ];

  const filtered = commands.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-800 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to page... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 font-sans"
          />
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
