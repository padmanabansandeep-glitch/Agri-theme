import React, { useState } from 'react';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { FarmHero3D } from '../3d/FarmHero3D';

export const AuthPage: React.FC = () => {
  const { language, setTab, setUser } = useAppStore();
  const t = translations[language];

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('farmer.murugan@tn.agri');
  const [password, setPassword] = useState('agri2026!');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      isGuest: false
    });
    setTab('dashboard');
  };

  const handleGuest = () => {
    setUser({
      name: 'Guest Farmer',
      email: 'guest@agrismart.local',
      isGuest: true
    });
    setTab('dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden glass-panel border border-emerald-100 dark:border-emerald-800 shadow-2xl">
        {/* Left Side: 3D Nature Hero Presentation */}
        <div className="relative p-8 flex flex-col justify-between bg-gradient-to-br from-emerald-600 to-green-800 text-white overflow-hidden min-h-[350px]">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Sprout className="w-6 h-6 text-amber-300" />
              </span>
              <span className="font-display font-bold text-xl">AgriSmart Ultra</span>
            </div>
            <p className="text-xs text-emerald-100 max-w-xs">
              AI-Powered crop recommendation, microclimate analysis, and verified profit modeling.
            </p>
          </div>

          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <FarmHero3D weatherCondition="sunny" timeOfDay="sunset" />
          </div>

          <div className="z-10 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-[11px] border border-white/20">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Hype Transparency</span>
            </div>
            <p className="text-white/80 mt-0.5">
              Strict row-level security and peer-reviewed ICAR agronomy metrics.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
                {mode === 'login' ? 'Farmer Sign In' : 'Create Farm Account'}
              </h2>
              <span className="badge-demo">SIMULATED AUTH</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {mode === 'login' ? 'Access your saved soil tests & profit projections' : 'Start your precision agriculture journey'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Email / Phone</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-forest hover:bg-emerald-800 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'login' ? 'Sign In' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo & Guest Switcher */}
          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <button
              onClick={handleGuest}
              className="w-full py-2.5 rounded-xl border border-dashed border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Continue as Guest (Local Offline Data)</span>
            </button>

            <div className="text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                {mode === 'login' ? "Don't have an account? Register" : "Already registered? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
