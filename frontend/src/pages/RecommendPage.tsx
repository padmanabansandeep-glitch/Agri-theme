import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Layers, 
  CloudSun, 
  Sliders, 
  CheckCircle, 
  Mic, 
  MicOff, 
  Navigation, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Sprout
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { postRecommend, fetchWeather } from '../lib/api';
import { JarTestModal } from '../components/JarTestModal';

export const RecommendPage: React.FC = () => {
  const { language, setTab, wizardDraft, updateWizardDraft, setRecommendation } = useAppStore();
  const t = translations[language];

  const [currentStep, setCurrentStep] = useState(1);
  const [isJarTestOpen, setIsJarTestOpen] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcMessageIndex, setCalcMessageIndex] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const calcMessages = [
    "Analyzing soil texture & horizon depth...",
    "Retrieving regional rainfall normal & temperature...",
    "Evaluating physiological temperature thresholds...",
    "Scoring 30+ ICAR & TNAU crops with trapezoidal engine...",
    "Computing factor breakdown & confidence ratings..."
  ];

  // 7 Soil Types with rich descriptions and textures
  const soilTypes = [
    { id: 'alluvial', name: 'Alluvial', desc: 'River basin soil rich in potash and humus. High moisture retention.', icon: '🌊', color: 'from-amber-600 to-yellow-700' },
    { id: 'black', name: 'Black Cotton', desc: 'Regur soil rich in clay and calcium carbonate. Retains moisture for long periods.', icon: '🌑', color: 'from-zinc-800 to-zinc-900' },
    { id: 'red', name: 'Red Soil', desc: 'Porous and friable with high iron content. Highly responsive to irrigation.', icon: '🧱', color: 'from-red-600 to-rose-800' },
    { id: 'laterite', name: 'Laterite', desc: 'Formed by intense leaching in heavy rainfall. Acidic and porous.', icon: '🏜️', color: 'from-orange-700 to-amber-800' },
    { id: 'sandy', name: 'Sandy Loam', desc: 'Coarse texture, excellent drainage and quick root aeration.', icon: '🏖️', color: 'from-yellow-500 to-amber-600' },
    { id: 'clay', name: 'Clay Heavy', desc: 'Dense particles with very high water retention capacity.', icon: '🏺', color: 'from-stone-600 to-stone-800' },
    { id: 'loamy', name: 'Loamy Garden', desc: 'The agricultural gold standard. Balanced silt, sand, and clay mix.', icon: '🌱', color: 'from-emerald-700 to-green-900' }
  ];

  // Dynamic Confidence Meter Calculation
  const calculateConfidence = () => {
    let conf = 100;
    if (!wizardDraft.ph) conf -= 12;
    if (!wizardDraft.nitrogen && !wizardDraft.phosphorus && !wizardDraft.potassium) conf -= 10;
    if (!wizardDraft.rainfall) conf -= 15;
    if (!wizardDraft.temperature) conf -= 10;
    if (!wizardDraft.humidity) conf -= 5;
    return Math.max(45, conf);
  };

  const confidenceScore = calculateConfidence();

  // GPS Auto Detection
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const w = await fetchWeather(latitude, longitude);
          if (w?.current) {
            updateWizardDraft({
              temperature: Math.round(w.current.temperature_2m),
              humidity: Math.round(w.current.relative_humidity_2m),
              rainfall: Math.round(w.daily?.precipitation_sum?.[0] ? w.daily.precipitation_sum[0] * 30 : 950)
            });
          }
        } catch (e) {}
        setIsGpsLoading(false);
      },
      () => {
        setIsGpsLoading(false);
        alert("Unable to retrieve GPS coordinates. Default state coords loaded.");
      }
    );
  };

  // Voice Input Helper
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : (language === 'hi' ? 'hi-IN' : 'en-IN');
    recognition.onstart = () => setIsVoiceActive(true);
    recognition.onend = () => setIsVoiceActive(false);
    recognition.onerror = () => setIsVoiceActive(false);

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript.toLowerCase();
      // Match keywords in voice
      if (text.includes('acre') || text.includes('ஏக்கர்') || text.includes('एकड़')) {
        const match = text.match(/\d+(\.\d+)?/);
        if (match) updateWizardDraft({ land_area: parseFloat(match[0]) });
      }
      if (text.includes('organic') || text.includes('இயற்கை') || text.includes('जैविक')) {
        updateWizardDraft({ farming_type: 'Organic' });
      }
      if (text.includes('black') || text.includes('கரிசல்') || text.includes('काली')) {
        updateWizardDraft({ soil_type: 'black' });
      } else if (text.includes('red') || text.includes('செம்மண்') || text.includes('लाल')) {
        updateWizardDraft({ soil_type: 'red' });
      } else if (text.includes('alluvial') || text.includes('வண்டல்') || text.includes('जलोढ़')) {
        updateWizardDraft({ soil_type: 'alluvial' });
      }
    };
    recognition.start();
  };

  // Submit Recommendation
  const handleSubmit = async () => {
    setIsCalculating(true);
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % calcMessages.length;
      setCalcMessageIndex(msgIdx);
    }, 450);

    try {
      const res = await postRecommend(wizardDraft);
      clearInterval(interval);
      setIsCalculating(false);
      setRecommendation(res);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTab('results');
    } catch (e) {
      clearInterval(interval);
      setIsCalculating(false);
      alert("Failed to reach recommendation engine. Please check inputs.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Wizard Header & Stepper Progress */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="badge-verified">TRANSPARENT SCORING ENGINE</span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-forest dark:text-emerald-400 mt-1">
              Crop Recommendation Wizard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              Provide soil and climate metrics to compute agronomic suitability.
            </p>
          </div>

          {/* Dynamic Confidence Meter */}
          <div className="flex items-center gap-3 bg-emerald-50/80 dark:bg-emerald-950/50 px-4 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
                {t.wizard.confidenceLabel}
              </div>
              <div className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {confidenceScore}% ({confidenceScore >= 85 ? 'High' : 'Moderate'})
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-xs text-emerald-600 dark:text-emerald-400">
              {confidenceScore}%
            </div>
          </div>
        </div>

        {/* 5-Step Visual Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { step: 1, label: t.wizard.step1, icon: MapPin },
            { step: 2, label: t.wizard.step2, icon: Layers },
            { step: 3, label: t.wizard.step3, icon: CloudSun },
            { step: 4, label: t.wizard.step4, icon: Sliders },
            { step: 5, label: t.wizard.step5, icon: CheckCircle },
          ].map(s => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`flex flex-col items-center p-2 rounded-2xl text-center transition-all ${
                  isCurrent
                    ? 'bg-brand-forest text-white shadow-md'
                    : isCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-semibold hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Input Floating Trigger */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={toggleVoiceInput}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
            isVoiceActive
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-emerald-500'
          }`}
        >
          {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600" />}
          <span>{isVoiceActive ? t.wizard.voiceActive : t.wizard.voiceStart}</span>
        </button>
        <span className="text-[11px] text-zinc-400 font-mono">Draft Auto-Saved locally</span>
      </div>

      {/* Step Content */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        {/* STEP 1: Location & Geography */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                {t.wizard.locationTitle}
              </h3>
              <button
                onClick={handleDetectGps}
                disabled={isGpsLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-200 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isGpsLoading ? t.wizard.gpsFetching : t.wizard.useGps}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">State / Region</label>
                <select
                  value={wizardDraft.state}
                  onChange={(e) => updateWizardDraft({ state: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">District / Taluk</label>
                <input
                  type="text"
                  value={wizardDraft.district}
                  onChange={(e) => updateWizardDraft({ district: e.target.value })}
                  placeholder="e.g. Thanjavur, Ludhiana, Pune"
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="text-xs text-zinc-600 dark:text-zinc-300">
                Location enables automatic retrieval of agro-climatic normal rainfall, solar insolation, and nearby APMC mandi commodity prices.
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Soil Health & Nutrients */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                {t.wizard.soilTitle}
              </h3>
              <button
                onClick={() => setIsJarTestOpen(true)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{t.wizard.jarTestBtn}</span>
              </button>
            </div>

            {/* Visual 7-Soil Selectable Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {soilTypes.map(s => {
                const isSelected = wizardDraft.soil_type === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => updateWizardDraft({ soil_type: s.id })}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{s.name}</div>
                    <div className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{s.desc}</div>
                    {isSelected && (
                      <CheckCircle className="absolute top-2.5 right-2.5 w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Optional Nutrients & pH Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex justify-between">
                  <span>Soil pH Value</span>
                  <span className="font-mono text-emerald-600">{wizardDraft.ph?.toFixed(1) || '6.5'}</span>
                </label>
                <input
                  type="range"
                  min="4.0"
                  max="9.5"
                  step="0.1"
                  value={wizardDraft.ph || 6.5}
                  onChange={(e) => updateWizardDraft({ ph: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 mt-2"
                />
                <span className="text-[10px] text-zinc-400">Optimal crop range: 6.0 - 7.5</span>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex justify-between">
                  <span>Soil Moisture %</span>
                  <span className="font-mono text-emerald-600">{wizardDraft.soil_moisture || 55}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={wizardDraft.soil_moisture || 55}
                  onChange={(e) => updateWizardDraft({ soil_moisture: parseInt(e.target.value) })}
                  className="w-full accent-emerald-600 mt-2"
                />
                <span className="text-[10px] text-zinc-400">Based on recent rain or irrigation</span>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Soil Health Card No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SHC-2024-TN-4891"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs mt-1.5 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Weather & Climate */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              {t.wizard.weatherTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Avg Temperature (°C)</label>
                <input
                  type="number"
                  value={wizardDraft.temperature || 28}
                  onChange={(e) => updateWizardDraft({ temperature: parseFloat(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Expected Seasonal Rain (mm)</label>
                <input
                  type="number"
                  value={wizardDraft.rainfall || 1000}
                  onChange={(e) => updateWizardDraft({ rainfall: parseFloat(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Relative Humidity (%)</label>
                <input
                  type="number"
                  value={wizardDraft.humidity || 70}
                  onChange={(e) => updateWizardDraft({ humidity: parseFloat(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900 text-xs text-zinc-600 dark:text-zinc-300">
              <strong>Agro-Climatic Rule:</strong> If local rainfall is deficient but irrigation is available, the engine adjusts water stress scores so suitable high-value crops are not penalized.
            </div>
          </div>
        )}

        {/* STEP 4: Preferences & Budget */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              {t.wizard.preferencesTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Land Area</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    step="0.1"
                    value={wizardDraft.land_area}
                    onChange={(e) => updateWizardDraft({ land_area: parseFloat(e.target.value) || 1.0 })}
                    className="flex-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={wizardDraft.land_unit}
                    onChange={(e) => updateWizardDraft({ land_unit: e.target.value })}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                  >
                    <option value="acres">{t.common.acres}</option>
                    <option value="hectares">{t.common.hectares}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Cultivation Budget (₹)</label>
                <input
                  type="number"
                  value={wizardDraft.budget || 50000}
                  onChange={(e) => updateWizardDraft({ budget: parseFloat(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Farming Method</label>
                <select
                  value={wizardDraft.farming_type}
                  onChange={(e) => updateWizardDraft({ farming_type: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm mt-1"
                >
                  <option value="Conventional">Conventional Chemical + Organic</option>
                  <option value="Organic">100% Certified Organic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Target Season</label>
                <select
                  value={wizardDraft.preferred_season}
                  onChange={(e) => updateWizardDraft({ preferred_season: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm mt-1"
                >
                  <option value="All">All Seasons</option>
                  <option value="Kharif">Kharif (Monsoon / Autumn)</option>
                  <option value="Rabi">Rabi (Winter / Spring)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Category Filter</label>
                <select
                  value={wizardDraft.preferred_category}
                  onChange={(e) => updateWizardDraft({ preferred_category: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm mt-1"
                >
                  <option value="All">All Categories (Cereals, Pulses, Cash crops...)</option>
                  <option value="Cereal">Cereals (Paddy, Wheat, Maize, Millets)</option>
                  <option value="Pulses">Pulses (Chickpea, Black Gram, Green Gram)</option>
                  <option value="Commercial">Commercial / Cash Crops (Cotton, Sugarcane)</option>
                  <option value="Vegetable">Vegetables (Tomato, Onion, Chilli)</option>
                  <option value="Oilseeds">Oilseeds (Groundnut, Mustard, Soybean)</option>
                  <option value="Plantation">Plantation / Spices (Tea, Coffee, Cardamom)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Confirm */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              {t.wizard.reviewTitle}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900 text-xs font-mono">
              <div>
                <span className="text-zinc-400 uppercase text-[10px]">Location</span>
                <div className="font-bold text-zinc-800 dark:text-zinc-200">{wizardDraft.state}</div>
              </div>
              <div>
                <span className="text-zinc-400 uppercase text-[10px]">Soil Type</span>
                <div className="font-bold text-zinc-800 dark:text-zinc-200 capitalize">{wizardDraft.soil_type}</div>
              </div>
              <div>
                <span className="text-zinc-400 uppercase text-[10px]">Plot Area</span>
                <div className="font-bold text-zinc-800 dark:text-zinc-200">{wizardDraft.land_area} {wizardDraft.land_unit}</div>
              </div>
              <div>
                <span className="text-zinc-400 uppercase text-[10px]">Budget</span>
                <div className="font-bold text-zinc-800 dark:text-zinc-200">₹{wizardDraft.budget?.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Zero Hype Guarantee:</strong> Recommendations are calculated transparently using ICAR and State Agricultural University agronomic parameters.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-forest hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isCalculating}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-900/20 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-brand-gold animate-spin" />
              <span>{t.wizard.submitBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Calculating Progress Modal */}
      {isCalculating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-emerald-100 dark:border-emerald-800">
            <div className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center">
              <span className="w-16 h-16 rounded-full border-4 border-emerald-200 dark:border-emerald-950 border-t-emerald-600 animate-spin absolute" />
              <Sprout className="w-7 h-7 text-emerald-600 animate-bounce" />
            </div>
            <h3 className="font-bold font-display text-lg text-zinc-900 dark:text-white">
              Evaluating Agro-Climatic Fit
            </h3>
            <p className="text-xs text-zinc-500 mt-2 min-h-[36px] font-mono">
              {calcMessages[calcMessageIndex]}
            </p>
          </div>
        </div>
      )}

      {/* DIY Field Jar Test Modal */}
      <JarTestModal
        isOpen={isJarTestOpen}
        onClose={() => setIsJarTestOpen(false)}
        onSelectSoil={(s) => updateWizardDraft({ soil_type: s })}
      />
    </div>
  );
};
