import React, { useState } from 'react';
import { User, MapPin, Sliders, Moon, Volume2, ShieldCheck, Download, Trash2, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';

export const ProfilePage: React.FC = () => {
  const { user, setUser, language, setLanguage, theme, setTheme, reducedMotion, toggleReducedMotion, soundEnabled, toggleSound } = useAppStore();
  const t = translations[language];

  const [name, setName] = useState(user.name);
  const [state, setState] = useState(user.state);
  const [district, setDistrict] = useState(user.district);
  const [landArea, setLandArea] = useState(user.landArea);
  const [landUnit, setLandUnit] = useState(user.landUnit);
  const [soilType, setSoilType] = useState(user.soilType);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setUser({
      name,
      state,
      district,
      landArea,
      landUnit,
      soilType
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-forest text-white text-2xl font-bold flex items-center justify-center font-display">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              {user.district}, {user.state} · Registered Farmer
            </p>
          </div>
        </div>

        <span className="badge-verified">ACTIVE PLOT</span>
      </div>

      {/* Farm Plot Details Form */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
        <h3 className="font-bold text-base text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
          Farm Holding & Land Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Farmer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Primary Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs capitalize"
            >
              <option value="alluvial">Alluvial</option>
              <option value="black">Black Cotton</option>
              <option value="red">Red Soil</option>
              <option value="laterite">Laterite</option>
              <option value="sandy">Sandy Loam</option>
              <option value="clay">Clay Heavy</option>
              <option value="loamy">Loamy</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Holding Size & Unit</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={landArea}
                onChange={(e) => setLandArea(parseFloat(e.target.value) || 1.0)}
                className="flex-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:border-emerald-500"
              />
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">District / Region</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-forest hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : null}
          <span>{savedSuccess ? "Saved Successfully!" : "Update Farm Profile"}</span>
        </button>
      </div>

      {/* Preferences & Accessibility */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-base text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
          System Preferences & Accessibility
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-xs">
            <div>
              <div className="font-bold text-zinc-800 dark:text-zinc-200">Reduce Motion & Heavy 3D</div>
              <div className="text-zinc-500 text-[11px]">Helpful on low-power devices and saves battery</div>
            </div>
            <button
              onClick={toggleReducedMotion}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${reducedMotion ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-xs">
            <div>
              <div className="font-bold text-zinc-800 dark:text-zinc-200">Ambient Farm Audio</div>
              <div className="text-zinc-500 text-[11px]">Procedural gentle rain and soothing birdsong</div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${soundEnabled ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
