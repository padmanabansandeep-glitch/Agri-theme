import React, { useState } from 'react';
import { 
  Sprout, 
  Search, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Sparkles, 
  Globe, 
  User 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { soundEngine } from '../lib/sound';
import { translations, Language } from '../lib/i18n';

interface NavbarProps {
  onOpenCommand: () => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommand, onOpenAssistant }) => {
  const { currentTab, setTab, language, setLanguage, theme, setTheme, soundEnabled, toggleSound, user } = useAppStore();
  const t = translations[language];
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleSoundToggle = () => {
    soundEngine.toggle();
    toggleSound();
  };

  // Easter Egg: Double-click logo switches to golden-hour sunset theme
  const handleLogoDoubleClick = () => {
    setTheme(theme === 'golden' ? 'light' : 'golden');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'crops', label: 'Crops' },
    { id: 'market', label: 'Market' },
    { id: 'weather', label: 'Weather' },
    { id: 'community', label: 'Community' },
    { id: 'about', label: 'About' },
  ];

  const isLight = theme === 'light' || currentTab === 'market' || currentTab === 'community';

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors ${
      isLight 
        ? 'bg-white/95 border-emerald-100 text-zinc-900 shadow-xs' 
        : 'bg-black/60 border-white/10 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Easter Egg */}
        <div 
          onDoubleClick={handleLogoDoubleClick}
          onClick={() => setTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
          title="Double-click for Golden Hour Mode!"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-emerald-200 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-display font-bold text-lg tracking-tight ${
                isLight ? 'text-zinc-900' : 'text-white'
              }`}>
                AgriSmart
              </span>
              <span className={`text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-md border ${
                isLight 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800/40'
              }`}>
                Ultra
              </span>
            </div>
            <p className={`text-[10px] font-sans hidden sm:block ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className={`hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-colors ${
          isLight 
            ? 'bg-zinc-100/90 border border-zinc-200 text-zinc-700 shadow-xs' 
            : 'bg-black/50 border border-white/15 text-zinc-200 shadow-inner'
        }`}>
          {navLinks.map((link) => {
            const isActive = currentTab === link.id || 
              (link.id === 'home' && currentTab === 'dashboard') ||
              (link.id === 'solutions' && (currentTab === 'expenses' || currentTab === 'profit')) ||
              (link.id === 'crops' && (currentTab === 'recommend' || currentTab === 'results')) ||
              (link.id === 'about' && currentTab === 'explainer');
            return (
              <button
                key={link.id}
                onClick={() => setTab(link.id)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  isActive
                    ? (isLight 
                        ? 'bg-emerald-800 text-white font-semibold shadow-xs' 
                        : 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm')
                    : (isLight 
                        ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70' 
                        : 'text-zinc-300 hover:text-white hover:bg-white/10')
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Ask AI Assistant Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-full text-xs font-bold shadow-sm shadow-emerald-700/20 transition-all hover:scale-105"
            title="Ask AgriSmart Multilingual AI Agronomist"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Command Palette Button */}
          <button
            onClick={onOpenCommand}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-xs text-zinc-500 dark:text-zinc-400 hover:border-emerald-500 transition-colors"
            title="Command Palette (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5" />
            <kbd className="font-mono text-[10px]">Ctrl K</kbd>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={soundEnabled ? 'Ambient Farm Audio: Playing' : 'Ambient Farm Audio: Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="uppercase text-[11px] font-mono">{language}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-1 z-50 animate-fadeIn">
                <button
                  onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/50 ${language === 'en' ? 'text-emerald-600' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  <span>English</span>
                  {language === 'en' && <span className="text-emerald-600">✓</span>}
                </button>
                <button
                  onClick={() => { setLanguage('ta'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/50 ${language === 'ta' ? 'text-emerald-600' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  <span>தமிழ் (Tamil)</span>
                  {language === 'ta' && <span className="text-emerald-600">✓</span>}
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/50 ${language === 'hi' ? 'text-emerald-600' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <span className="text-emerald-600">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Guest Badge */}
          <button
            onClick={() => setTab('profile')}
            className="flex items-center gap-1.5 pl-2 pr-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full hover:bg-emerald-100 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-brand-forest text-white text-[11px] font-bold flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-brand-forest dark:text-emerald-300 hidden md:inline">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
