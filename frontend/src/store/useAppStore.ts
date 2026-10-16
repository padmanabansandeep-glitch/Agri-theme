import { useState, useEffect } from 'react';
import { Language } from '../lib/i18n';

export interface AppUser {
  name: string;
  email: string;
  isGuest: boolean;
  state: string;
  district: string;
  landArea: number;
  landUnit: string;
  soilType: string;
}

export interface AppState {
  currentTab: string;
  language: Language;
  theme: 'light' | 'dark' | 'golden';
  soundEnabled: boolean;
  reducedMotion: boolean;
  user: AppUser;
  currentRecommendation: any | null;
  selectedCrop: any | null;
  currentExpenses: any | null;
  currentProfit: any | null;
  wizardDraft: any;
  historyList: any[];
}

const STORAGE_KEY = 'agrismart_app_state_v1';

const defaultState: AppState = {
  currentTab: 'dashboard',
  language: 'en',
  theme: 'light',
  soundEnabled: false,
  reducedMotion: false,
  user: {
    name: 'Murugan Farmer',
    email: 'murugan@cauvery.agri',
    isGuest: false,
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    landArea: 2.5,
    landUnit: 'acres',
    soilType: 'alluvial'
  },
  currentRecommendation: null,
  selectedCrop: null,
  currentExpenses: null,
  currentProfit: null,
  wizardDraft: {
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    soil_type: 'alluvial',
    ph: 6.5,
    nitrogen: 120,
    phosphorus: 45,
    potassium: 160,
    soil_moisture: 60,
    temperature: 29,
    rainfall: 1100,
    humidity: 72,
    land_area: 2.5,
    land_unit: 'acres',
    irrigation_available: true,
    water_source: 'Canal / Borewell',
    farming_type: 'Conventional',
    budget: 65000,
    preferred_season: 'Kharif',
    preferred_category: 'All'
  },
  historyList: []
};

let globalState: AppState = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch (e) {}
  return defaultState;
})();

const listeners = new Set<() => void>();

function notify() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
  } catch (e) {}
  listeners.forEach(fn => fn());
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const fn = () => setState({ ...globalState });
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  const setTab = (tab: string) => {
    globalState.currentTab = tab;
    notify();
  };

  const setLanguage = (lang: Language) => {
    globalState.language = lang;
    notify();
  };

  const setTheme = (theme: 'light' | 'dark' | 'golden') => {
    globalState.theme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    notify();
  };

  const toggleSound = () => {
    globalState.soundEnabled = !globalState.soundEnabled;
    notify();
  };

  const toggleReducedMotion = () => {
    globalState.reducedMotion = !globalState.reducedMotion;
    notify();
  };

  const setUser = (user: Partial<AppUser>) => {
    globalState.user = { ...globalState.user, ...user };
    notify();
  };

  const setRecommendation = (data: any) => {
    globalState.currentRecommendation = data;
    if (data?.recommendations?.length > 0) {
      globalState.selectedCrop = data.recommendations[0];
    }
    notify();
  };

  const setSelectedCrop = (crop: any) => {
    globalState.selectedCrop = crop;
    notify();
  };

  const setExpenses = (expenses: any) => {
    globalState.currentExpenses = expenses;
    notify();
  };

  const setProfit = (profit: any) => {
    globalState.currentProfit = profit;
    notify();
  };

  const updateWizardDraft = (draft: Partial<any>) => {
    globalState.wizardDraft = { ...globalState.wizardDraft, ...draft };
    notify();
  };

  const addHistory = (item: any) => {
    const record = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      created_at: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...item
    };
    globalState.historyList = [record, ...globalState.historyList];
    notify();
  };

  const removeHistory = (id: string) => {
    globalState.historyList = globalState.historyList.filter(h => h.id !== id);
    notify();
  };

  return {
    ...state,
    setTab,
    setLanguage,
    setTheme,
    toggleSound,
    toggleReducedMotion,
    setUser,
    setRecommendation,
    setSelectedCrop,
    setExpenses,
    setProfit,
    updateWizardDraft,
    addHistory,
    removeHistory
  };
}
