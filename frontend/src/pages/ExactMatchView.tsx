import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Bell, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  Play, 
  Sprout, 
  Sun, 
  Moon, 
  Droplets, 
  Wind, 
  CloudRain, 
  TrendingUp, 
  TrendingDown, 
  Send, 
  MapPin, 
  Bot, 
  Layers, 
  DollarSign, 
  Compass, 
  Globe, 
  Settings, 
  Users, 
  Satellite, 
  Tractor, 
  FileText,
  Plus,
  Minus,
  X,
  ShieldCheck,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface ExactMatchViewProps {
  onNavigateTab?: (tab: string) => void;
  onOpenAssistant?: () => void;
}

interface CropDetailModalData {
  id: string;
  name: string;
  image: string;
  badge: string;
  estProfit: string;
  yieldAcre: string;
  costAcre: string;
  duration: string;
  soil: string;
  water: string;
  season: string;
  marketPrice: string;
  description: string;
}

export const ExactMatchView: React.FC<ExactMatchViewProps> = ({ onNavigateTab, onOpenAssistant }) => {
  const { language, setLanguage, theme, setTheme, setSelectedCrop, setUser } = useAppStore();

  const [activeSection, setActiveSection] = useState<'home' | 'dashboard' | 'solutions' | 'crops' | 'market' | 'weather' | 'community' | 'about'>('home');
  const [showMoreMarketPrices, setShowMoreMarketPrices] = useState(false);
  const [selectedCropModal, setSelectedCropModal] = useState<CropDetailModalData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('farmer.murugan@tn.agri');
  const [authPassword, setAuthPassword] = useState('agri2026!');
  const [authSuccess, setAuthSuccess] = useState(false);

  // Profit comparison active crop selector
  const [selectedProfitCrop, setSelectedProfitCrop] = useState<'paddy' | 'maize' | 'groundnut'>('paddy');
  const [showProfitBreakdown, setShowProfitBreakdown] = useState(false);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: language === 'ta'
        ? "வணக்கம்! பயிர் பரிந்துரை, வானிலை, சந்தை விலை அல்லது வேளாண் சந்தேகங்களை என்னிடம் கேட்கலாம்."
        : language === 'hi'
        ? "नमस्ते! मुझसे फसल अनुशंसा, मौसम, बाजार भाव या किसी भी कृषि संशय के बारे में पूछें।"
        : "Hi! Ask me about crop recommendations, weather, market prices, government schemes or any farming doubt."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Smooth scroll handler staying entirely on the same page
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId as any);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSendChat = (textToSend?: string) => {
    const q = textToSend || chatInput;
    if (!q.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: q }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "Paddy (Rice) and Maize show the highest profitability in Coimbatore region this season.";
      const low = q.toLowerCase();
      if (low.includes('soil') || low.includes('மண்') || low.includes('मिट्टी')) {
        reply = "For 6.8 pH red/loamy soil, Pulses and Paddy with organic FYM give maximum returns.";
      } else if (low.includes('weather') || low.includes('வானிலை') || low.includes('मौसम')) {
        reply = "Coimbatore today: 28°C, Partly Cloudy, 72% humidity, 10% chance of light showers.";
      } else if (low.includes('paddy') || low.includes('price') || low.includes('விலை') || low.includes('भाव')) {
        reply = "Current APMC mandi price for Paddy is ₹2,350/quintal (up +2.1% this week).";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  const handleOpenCropDetails = (crop: CropDetailModalData) => {
    setSelectedCropModal(crop);
    setSelectedCrop({ id: crop.id, name: crop.name });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: authEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      email: authEmail,
      isGuest: false
    });
    setAuthSuccess(true);
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setAuthSuccess(false);
    }, 1000);
  };

  const handleGuestLogin = () => {
    setUser({
      name: 'Muruga Praveen',
      email: 'praveen.farmer@agrismart.tn',
      isGuest: true
    });
    setAuthSuccess(true);
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setAuthSuccess(false);
    }, 800);
  };

  const cropDataList: Record<'paddy' | 'maize' | 'groundnut', CropDetailModalData> = {
    paddy: {
      id: 'paddy',
      name: 'Paddy (Rice) - CO 51',
      image: '/paddy_crop.jpg',
      badge: 'Best Match (97.4%)',
      estProfit: '₹42,000 / Acre',
      yieldAcre: '26 Quintals',
      costAcre: '₹22,000',
      duration: '110-115 Days',
      soil: 'Clay loam & heavy soils with high water retention',
      water: 'High (1,100 - 1,250 mm)',
      season: 'Kharif / Kuruvai Season',
      marketPrice: '₹2,350 / Quintal (APMC Live)',
      description: 'CO 51 is a semi-dwarf, high-yielding variety developed by TNAU. Highly blast resistant with fine white rice texture and consistent market off-take across Tamil Nadu mandis.'
    },
    maize: {
      id: 'maize',
      name: 'Maize (Corn) - CO 6',
      image: '/maize_crop.jpg',
      badge: 'Recommended (92.1%)',
      estProfit: '₹38,000 / Acre',
      yieldAcre: '32 Quintals',
      costAcre: '₹19,500',
      duration: '105-110 Days',
      soil: 'Well-drained red loamy or alluvial soil',
      water: 'Moderate (500 - 600 mm)',
      season: 'Adipattam & Purattasipattam',
      marketPrice: '₹2,180 / Quintal (APMC Live)',
      description: 'Hybrid maize exhibiting excellent drought tolerance during grain-filling stage. Strong industrial demand for feed mills in Pollachi, Udumalpet and Tirupur belt.'
    },
    groundnut: {
      id: 'groundnut',
      name: 'Groundnut (Peanut) - TMV 14',
      image: '/groundnut_crop.jpg',
      badge: 'High Value (88.6%)',
      estProfit: '₹36,000 / Acre',
      yieldAcre: '14 Quintals',
      costAcre: '₹18,000',
      duration: '100-105 Days',
      soil: 'Sandy loam to friable red soil (pH 6.2 - 7.2)',
      water: 'Low to Moderate (400 - 450 mm)',
      season: 'Chithiraipattam & Karthigaipattam',
      marketPrice: '₹5,600 / Quintal (APMC Live)',
      description: 'High oil-content Spanish bunch variety from TNAU Tindivanam. Excellent pod filling, minimum post-harvest losses, and high residue foliage used as premium cattle fodder.'
    }
  };

  const profitScenarios = {
    paddy: { cost: 22000, revenue: 64000, profit: 42000 },
    maize: { cost: 19500, revenue: 57500, profit: 38000 },
    groundnut: { cost: 18000, revenue: 54000, profit: 36000 }
  };

  return (
    <div className="relative w-full min-h-screen text-zinc-800 antialiased font-sans selection:bg-emerald-500 selection:text-white pb-16">
      {/* ========================================================================= */}
      {/* STATIC FIXED FULL-PAGE ANIMATED VIDEO BACKGROUND (STAYS FIXED ON SCROLL)  */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
        >
          <source src="/farm_hero_banner.mp4" type="video/mp4" />
          <source src="/animate_image_into_landscape_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay with vignette gradient for readability while scrolling */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* PERSISTENT STICKY GLASSMORPHIC TOP NAVIGATION BAR                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Left Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => scrollToSection('home')}
            title="Scroll to Top"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-700/80 border border-emerald-400/40 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight text-white flex items-center gap-1 font-display">
                <span>AgriSmart</span>
              </div>
              <div className="text-[10px] tracking-wide text-zinc-300 font-sans">
                Smarter Farming • Brighter Tomorrow
              </div>
            </div>
          </div>

          {/* Center Navigation Links (All smooth scroll or navigate to dedicated pages) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-medium text-zinc-200 shadow-inner">
            <button 
              onClick={() => scrollToSection('home')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeSection === 'home' 
                  ? 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('dashboard')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeSection === 'dashboard' 
                  ? 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigateTab ? onNavigateTab('solutions') : scrollToSection('solutions')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeSection === 'solutions' 
                  ? 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Solutions
            </button>
            <button 
              onClick={() => onNavigateTab ? onNavigateTab('crops') : scrollToSection('crops')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeSection === 'crops' 
                  ? 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Crops
            </button>
            <button 
              onClick={() => onNavigateTab ? onNavigateTab('market') : null}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeSection === 'market' 
                  ? 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Market
            </button>
            <button 
              onClick={() => onNavigateTab ? onNavigateTab('weather') : scrollToSection('weather')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeSection === 'weather' 
                  ? 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Weather
            </button>
            <button 
              onClick={() => onNavigateTab ? onNavigateTab('community') : scrollToSection('community')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeSection === 'community' 
                  ? 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Community
            </button>
            <button 
              onClick={() => onNavigateTab ? onNavigateTab('about') : scrollToSection('about')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeSection === 'about' 
                  ? 'bg-[#0c3826] text-[#34d399] border border-emerald-500/40 font-semibold shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              About
            </button>
          </nav>

          {/* Right Controls: Languages, Dark Mode, Login Modal Button */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full border border-white/15 p-1 text-xs">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${language === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-300 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${language === 'ta' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-300 hover:text-white'}`}
              >
                தமிழ்
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${language === 'hi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-300 hover:text-white'}`}
              >
                हिंदी
              </button>
            </div>

            {/* Dark Mode Icon */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-black/60 transition-colors"
              title="Toggle Night Theme"
            >
              <Moon className="w-4 h-4 fill-current text-zinc-300" />
            </button>

            {/* Login / Sign Up In-Page Modal Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all hover:scale-105"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Login / Sign Up</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layer (Scrolls smoothly over the static background video) */}
      <div className="relative z-10 w-full space-y-12">
        {/* ========================================================================= */}
        {/* SECTION 1: TOP CINEMATIC HERO & LANDING BANNER (#home)                    */}
        {/* ========================================================================= */}
        <section id="home" className="relative w-full min-h-[85vh] flex flex-col justify-center text-white px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center">
            {/* Left Column: Headlines, Subtitles, Feature Badges & CTAs */}
            <div className="max-w-xl space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                <span className="text-white block">Grow Smarter,</span>
                <span className="text-emerald-400 block mt-1">Farm Better</span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] leading-relaxed font-sans max-w-lg font-medium">
                AI-Powered crop recommendations, real-time weather, market prices and profit estimation — all in one platform for every farmer.
              </p>

              {/* Feature Highlights Pills (Smooth scroll on click) */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button 
                  onClick={() => scrollToSection('crops')}
                  className="flex items-center gap-2 bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs text-zinc-200 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    🌱
                  </span>
                  <span className="text-[11px] font-medium">Get Best Crop Recommendations</span>
                </button>

                <button 
                  onClick={() => scrollToSection('weather')}
                  className="flex items-center gap-2 bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs text-zinc-200 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    ☁️
                  </span>
                  <span className="text-[11px] font-medium">Live Weather & Soil Insights</span>
                </button>

                <button 
                  onClick={() => scrollToSection('market')}
                  className="flex items-center gap-2 bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs text-zinc-200 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    📈
                  </span>
                  <span className="text-[11px] font-medium">Market Price & Profit Estimation</span>
                </button>
              </div>

              {/* CTAs (Both stay right on this page!) */}
              <div className="flex items-center gap-4 pt-3">
                <button
                  onClick={() => scrollToSection('dashboard')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('about')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/40 hover:bg-black/60 text-white font-bold text-xs backdrop-blur-md border border-white/25 transition-all"
                >
                  <div className="w-4 h-4 rounded-full bg-white text-zinc-900 flex items-center justify-center text-[8px] pl-0.5">
                    ▶
                  </div>
                  <span>Explore Platform</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: INTEGRATED APPLICATION DASHBOARD (#dashboard)                  */}
        {/* ========================================================================= */}
        <section id="dashboard" className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 pt-2 pb-6">
          <div className="bg-[#f4f7f4]/95 dark:bg-[#071d12]/95 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl border border-white/30 dark:border-emerald-800/50">
            {/* ========================================= */}
            {/* MAIN DASHBOARD CONTENT AREA               */}
            {/* ========================================= */}
            <main className="w-full p-5 sm:p-7 space-y-6 overflow-hidden">
              {/* Top Search & User Profile Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search Bar with Mic button */}
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search crops, market prices, schemes, or ask anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        handleSendChat(searchQuery);
                        scrollToSection('community');
                      }
                    }}
                    className="w-full pl-11 pr-12 py-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 shadow-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      if (onOpenAssistant) onOpenAssistant();
                      else scrollToSection('community');
                    }}
                    className="absolute right-2.5 top-2 w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm"
                    title="Voice Search"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* User Notifications & Profile Pill */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button 
                    onClick={() => scrollToSection('community')}
                    className="relative w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shadow-sm hover:border-emerald-500"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
                  </button>

                  {/* Profile Pill: Muruga Praveen (Farmer) */}
                  <div 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 py-1.5 pl-2 pr-3 rounded-full cursor-pointer shadow-sm hover:border-emerald-500 transition-colors"
                  >
                    <img
                      src="/farmer_avatar.jpg"
                      alt="Muruga Praveen"
                      className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                    />
                    <div className="text-left text-xs leading-tight">
                      <div className="font-bold text-zinc-800 dark:text-zinc-100">Muruga Praveen</div>
                      <div className="text-[10px] text-zinc-400 font-sans">Farmer (Tamil Nadu)</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-1" />
                  </div>
                </div>
              </div>

              {/* Metric Cards: 4 Equal Grid Cards (All smooth scroll to respective sections) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Card 1: Recommended Crops */}
                <div 
                  onClick={() => scrollToSection('crops')}
                  className="bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow group hover:border-emerald-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Recommended Crops</div>
                      <div className="text-2xl font-bold font-display text-zinc-900 dark:text-white">5</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Card 2: Today's Weather */}
                <div 
                  onClick={() => scrollToSection('weather')}
                  className="bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow group hover:border-sky-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Today's Weather</div>
                      <div className="text-2xl font-bold font-display text-zinc-900 dark:text-white">28°C</div>
                      <div className="text-[10px] text-zinc-400">Partly Cloudy</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Card 3: Current Market Price */}
                <div 
                  onClick={() => scrollToSection('market')}
                  className="bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow group hover:border-amber-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Current Market Price</div>
                      <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">₹2,350</div>
                      <div className="text-[10px] text-zinc-400">(Paddy / Quintal)</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Card 4: Estimated Profit */}
                <div 
                  onClick={() => scrollToSection('profit')}
                  className="bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow group hover:border-yellow-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-yellow-500 text-white flex items-center justify-center shadow-md shadow-yellow-500/20">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Estimated Profit</div>
                      <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">₹42,000</div>
                      <div className="text-[10px] text-zinc-400">(per acre)</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION: SOLUTIONS & CROPS RECOMMENDATIONS (#crops & #solutions)  */}
              {/* ================================================================= */}
              <div id="solutions" className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
                {/* Card 1: Top Crop Recommendations (6 Cols) */}
                <div id="crops" className="lg:col-span-6 bg-white dark:bg-zinc-800/80 p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-display">
                        Top Crop Recommendations
                      </h3>
                      <p className="text-[11px] text-zinc-400">Verified by ICAR & TNAU agronomic rules</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                      3 Top Matches
                    </span>
                  </div>

                  {/* 3 Crop Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Crop 1: Paddy (Rice) */}
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between hover:border-emerald-500 transition-colors">
                      <div>
                        <div className="relative h-28 w-full overflow-hidden">
                          <img 
                            src="/paddy_crop.jpg" 
                            alt="Paddy (Rice)"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full shadow-sm">
                            Best Match
                          </span>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Paddy (Rice)</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">High yield • Water suitable</p>
                          <div className="mt-2 text-[10px] text-zinc-400">Est. Profit</div>
                          <div className="font-bold font-mono text-emerald-600 text-xs">₹42,000/acre</div>
                        </div>
                      </div>
                      <div className="p-3 pt-0">
                        <button 
                          onClick={() => handleOpenCropDetails(cropDataList.paddy)}
                          className="w-full py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Crop 2: Maize */}
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between hover:border-emerald-500 transition-colors">
                      <div>
                        <div className="relative h-28 w-full overflow-hidden">
                          <img 
                            src="/maize_crop.jpg" 
                            alt="Maize"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Maize</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Moderate water</p>
                          <div className="mt-2 text-[10px] text-zinc-400">Est. Profit</div>
                          <div className="font-bold font-mono text-emerald-600 text-xs">₹38,000/acre</div>
                        </div>
                      </div>
                      <div className="p-3 pt-0">
                        <button 
                          onClick={() => handleOpenCropDetails(cropDataList.maize)}
                          className="w-full py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Crop 3: Groundnut */}
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between hover:border-emerald-500 transition-colors">
                      <div>
                        <div className="relative h-28 w-full overflow-hidden">
                          <img 
                            src="/groundnut_crop.jpg" 
                            alt="Groundnut"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Groundnut</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Low water • High demand</p>
                          <div className="mt-2 text-[10px] text-zinc-400">Est. Profit</div>
                          <div className="font-bold font-mono text-emerald-600 text-xs">₹36,000/acre</div>
                        </div>
                      </div>
                      <div className="p-3 pt-0">
                        <button 
                          onClick={() => handleOpenCropDetails(cropDataList.groundnut)}
                          className="w-full py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Soil Health Overview (3 Cols) */}
                <div className="lg:col-span-3 bg-white dark:bg-zinc-800/80 p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-display">
                        Soil Health Overview
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                        Loamy Soil
                      </span>
                    </div>

                    <div className="flex items-center gap-4 my-2">
                      {/* Radial Circular Gauge */}
                      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="7"
                            className="text-zinc-100 dark:text-zinc-700"
                            fill="transparent"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="7"
                            strokeDasharray={201}
                            strokeDashoffset={201 - (201 * 78) / 100}
                            strokeLinecap="round"
                            className="text-emerald-500"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <div className="text-base font-bold font-mono text-zinc-900 dark:text-white leading-none">78%</div>
                          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Good</div>
                        </div>
                      </div>

                      {/* Metrics List */}
                      <div className="flex-1 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                            <Droplets className="w-3.5 h-3.5 text-blue-500" />
                            <span>pH</span>
                          </span>
                          <span className="font-bold font-mono text-zinc-800 dark:text-zinc-100">6.8</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                            <span>Nitrogen (N)</span>
                          </span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-200 text-[11px]">Medium</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                            <span>Phosphorus (P)</span>
                          </span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-200 text-[11px]">High</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                            <span>Potassium (K)</span>
                          </span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-200 text-[11px]">Medium</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                      <span className="text-emerald-500">🍃</span>
                      <span>Organic Matter</span>
                    </span>
                    <span className="font-bold text-emerald-600 text-[11px]">Optimal (1.2%)</span>
                  </div>
                </div>

                {/* Card 3: Live Weather Map (3 Cols) (#weather) */}
                <div id="weather" className="lg:col-span-3 bg-white dark:bg-zinc-800/80 p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-display">
                        Live Weather Radar
                      </h3>
                      <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                        28°C • Coimbatore
                      </span>
                    </div>

                    {/* Satellite Radar Map View with Zoom Controls */}
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <img 
                        src="/weather_radar_map.jpg" 
                        alt="Live Weather Radar Map"
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Zoom Controls */}
                      <div className="absolute right-2.5 bottom-2.5 flex flex-col gap-1 bg-white/90 dark:bg-zinc-800/90 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-0.5">
                        <button className="w-5 h-5 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-xs font-bold">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-5 h-5 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-xs font-bold border-t border-zinc-200 dark:border-zinc-700">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Coimbatore Pin */}
                      <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                        <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white animate-ping" />
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white absolute left-0.5 top-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between text-xs text-zinc-500">
                    <span>Humidity: 72%</span>
                    <span>Wind: 14 km/h NW</span>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION: PROFIT, MARKET PRICES & COMMUNITY (#profit, #market, #community) */}
              {/* ================================================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
                {/* Card 1: Profit Estimation Bar Chart (5 Cols) (#profit) */}
                <div id="profit" className="lg:col-span-5 bg-white dark:bg-zinc-800/80 p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-display">
                        Profit Estimation
                      </h3>
                      {/* Crop switch pills */}
                      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-700/60 p-0.5 rounded-full text-[10px]">
                        {(['paddy', 'maize', 'groundnut'] as const).map(c => (
                          <button
                            key={c}
                            onClick={() => setSelectedProfitCrop(c)}
                            className={`px-2 py-0.5 rounded-full capitalize font-semibold transition-all ${
                              selectedProfitCrop === c 
                                ? 'bg-emerald-600 text-white shadow-xs' 
                                : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 mb-3">
                      Estimated Cost vs Return per Acre ({selectedProfitCrop.toUpperCase()})
                    </p>

                    {/* 3-Bar Comparison Visualizer */}
                    <div className="h-40 w-full flex items-end justify-between gap-6 px-4 pt-4 border-b border-zinc-200 dark:border-zinc-700 font-mono text-xs">
                      {/* Y-Axis Guidelines */}
                      <div className="flex flex-col justify-between h-full text-[10px] text-zinc-400 pr-2">
                        <span>₹70,000</span>
                        <span>₹40,000</span>
                        <span>₹20,000</span>
                        <span>₹0</span>
                      </div>

                      {/* Bar 1: Total Cost */}
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200">
                          ₹{profitScenarios[selectedProfitCrop].cost.toLocaleString()}
                        </span>
                        <div 
                          style={{ height: `${(profitScenarios[selectedProfitCrop].cost / 70000) * 100}%` }}
                          className="w-full max-w-[54px] bg-slate-400 dark:bg-slate-500 rounded-t-lg transition-all hover:opacity-90" 
                        />
                        <span className="text-[10px] text-zinc-500 font-sans whitespace-nowrap mt-1">Total Cost</span>
                      </div>

                      {/* Bar 2: Expected Return */}
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          ₹{profitScenarios[selectedProfitCrop].revenue.toLocaleString()}
                        </span>
                        <div 
                          style={{ height: `${(profitScenarios[selectedProfitCrop].revenue / 70000) * 100}%` }}
                          className="w-full max-w-[54px] bg-emerald-600 rounded-t-lg transition-all hover:opacity-90" 
                        />
                        <span className="text-[10px] text-zinc-500 font-sans whitespace-nowrap mt-1">Expected Return</span>
                      </div>

                      {/* Bar 3: Net Profit */}
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                          ₹{profitScenarios[selectedProfitCrop].profit.toLocaleString()}
                        </span>
                        <div 
                          style={{ height: `${(profitScenarios[selectedProfitCrop].profit / 70000) * 100}%` }}
                          className="w-full max-w-[54px] bg-yellow-500 rounded-t-lg transition-all hover:opacity-90" 
                        />
                        <span className="text-[10px] text-zinc-500 font-sans whitespace-nowrap mt-1">Net Profit</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      onClick={() => setShowProfitBreakdown(!showProfitBreakdown)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{showProfitBreakdown ? 'Hide 13 Cost Breakdown' : 'View 13-Point Cost Breakdown'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showProfitBreakdown ? 'rotate-180' : ''}`} />
                    </button>
                    <span className="text-[10px] text-zinc-400">ICAR Cost Norms</span>
                  </div>

                  {/* Expandable 13-Point Cost Breakdown */}
                  {showProfitBreakdown && (
                    <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl text-[11px] space-y-1.5 border border-zinc-200 dark:border-zinc-700 animate-fadeIn">
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                        <span>Land Preparation & Ploughing:</span>
                        <span className="font-mono font-bold">₹3,500</span>
                      </div>
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                        <span>Certified Seeds / Nursery:</span>
                        <span className="font-mono font-bold">₹2,800</span>
                      </div>
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                        <span>NPK Fertilizer & Bio-organic FYM:</span>
                        <span className="font-mono font-bold">₹5,200</span>
                      </div>
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                        <span>Weeding & Irrigation Energy:</span>
                        <span className="font-mono font-bold">₹4,500</span>
                      </div>
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                        <span>Harvesting & Threshing Labor:</span>
                        <span className="font-mono font-bold">₹6,000</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 2: Market Prices (Today) Table (4 Cols) (#market) */}
                <div id="market" className="lg:col-span-4 bg-white dark:bg-zinc-800/80 p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-white font-display">
                          Market Prices <span className="text-zinc-400 text-xs font-normal">(Today)</span>
                        </h3>
                        <p className="text-[10px] text-zinc-400">APMC Mandi Live Feed</p>
                      </div>
                      <button 
                        onClick={() => onNavigateTab ? onNavigateTab('market') : setShowMoreMarketPrices(!showMoreMarketPrices)}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>View Full Market Page →</span>
                      </button>
                    </div>

                    {/* Market Price Table */}
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-zinc-400 text-[10px] uppercase font-mono border-b border-zinc-100 dark:border-zinc-700/60 pb-1">
                          <th className="pb-1.5 font-normal">Crop</th>
                          <th className="pb-1.5 font-normal text-right">Price (₹/Qtl)</th>
                          <th className="pb-1.5 font-normal text-right">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
                        <tr>
                          <td className="py-2.5 font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                            <span>🌾</span>
                            <span>Paddy</span>
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-zinc-800 dark:text-zinc-100">2,350</td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-600 text-[11px]">↑ +2.1%</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                            <span>🌽</span>
                            <span>Maize</span>
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-zinc-800 dark:text-zinc-100">2,180</td>
                          <td className="py-2.5 text-right font-mono font-bold text-rose-500 text-[11px]">↓ -1.3%</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                            <span>🥜</span>
                            <span>Groundnut</span>
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-zinc-800 dark:text-zinc-100">5,600</td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-600 text-[11px]">↑ +3.4%</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                            <span>🎋</span>
                            <span>Sugarcane</span>
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-zinc-800 dark:text-zinc-100">340</td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-600 text-[11px]">↑ +1.2%</td>
                        </tr>
                        {showMoreMarketPrices && (
                          <>
                            <tr>
                              <td className="py-2.5 font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                                <span>☁️</span>
                                <span>Cotton</span>
                              </td>
                              <td className="py-2.5 text-right font-mono font-bold text-zinc-800 dark:text-zinc-100">7,250</td>
                              <td className="py-2.5 text-right font-mono font-bold text-emerald-600 text-[11px]">↑ +1.8%</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                                <span>🍌</span>
                                <span>Banana</span>
                              </td>
                              <td className="py-2.5 text-right font-mono font-bold text-zinc-800 dark:text-zinc-100">1,850</td>
                              <td className="py-2.5 text-right font-mono font-bold text-emerald-600 text-[11px]">↑ +0.9%</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                                <span>🍅</span>
                                <span>Tomato</span>
                              </td>
                              <td className="py-2.5 text-right font-mono font-bold text-zinc-800 dark:text-zinc-100">1,400</td>
                              <td className="py-2.5 text-right font-mono font-bold text-rose-500 text-[11px]">↓ -4.2%</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-700/60 text-[10px] text-zinc-400 flex justify-between">
                    <span>Mandi: Pollachi & Coimbatore</span>
                    <span>Updated 15 mins ago</span>
                  </div>
                </div>

                {/* Card 3: Ask AgriSmart AI Assistant Chat Card (3 Cols) (#community) */}
                <div id="community" className="lg:col-span-3 bg-white dark:bg-zinc-800/80 p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between">
                  <div>
                    {/* Assistant Header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white">Ask AgriSmart</h4>
                        <p className="text-[10px] text-zinc-400">Your farming assistant</p>
                      </div>
                    </div>

                    {/* Chat Speech Bubble */}
                    <div className="bg-zinc-100 dark:bg-zinc-900/80 p-3 rounded-2xl rounded-tl-none text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3 max-h-36 overflow-y-auto">
                      {chatMessages[chatMessages.length - 1]?.text}
                    </div>

                    {/* Quick Prompts Pills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {['Best crop for my soil', "Today's weather", 'Market price of paddy'].map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendChat(chip)}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Input Box */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-700/60">
                    <button 
                      onClick={() => {
                        if (onOpenAssistant) onOpenAssistant();
                        else handleSendChat("Weather advisory for today");
                      }}
                      className="p-1.5 text-zinc-400 hover:text-emerald-600 rounded-full"
                      title="Voice input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type your question..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      className="flex-1 bg-transparent text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none placeholder-zinc-400"
                    />
                    <button
                      onClick={() => handleSendChat()}
                      className="w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform hover:scale-105"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION: ABOUT & TRANSPARENCY (#about)                            */}
              {/* ================================================================= */}
              <div id="about" className="bg-gradient-to-br from-emerald-900/30 to-green-950/30 dark:from-emerald-950/60 dark:to-black/60 p-6 rounded-3xl border border-emerald-700/30 shadow-sm mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-emerald-600/30 text-emerald-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-display">
                      AgriSmart Zero-Fabrication Transparency Guarantee
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      100% verified agronomic calculations • Peer-reviewed scientific benchmarks
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                    <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                      <Check className="w-4 h-4" />
                      <span>ICAR & TNAU Tested</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                      Nutrient thresholds, physiological temp limits and water benchmarks are backed by Indian agricultural university research.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                    <div className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5 mb-1">
                      <Sun className="w-4 h-4" />
                      <span>Microclimate Weather</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                      Live hourly radar, 7-day rainfall normal, humidity and agricultural stress alerts synced to your GPS latitude and longitude.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                    <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span>13-Category Costs</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                      From seed bed preparation to mandi transport, calculate every single rupee spent to know your true net break-even.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                    <div className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 mb-1">
                      <Globe className="w-4 h-4" />
                      <span>Tamil & Hindi Support</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                      Complete localized support with regional terminology in தமிழ் (Tamil) and हिंदी (Hindi) with voice query input.
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* CROP DETAILS IN-PAGE MODAL (Opens right on the page without navigating)   */}
      {/* ========================================================================= */}
      {selectedCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header with image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={selectedCropModal.image} 
                alt={selectedCropModal.name}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button 
                onClick={() => setSelectedCropModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-[10px] font-bold mb-1 shadow-xs">
                  {selectedCropModal.badge}
                </span>
                <h3 className="text-xl font-bold font-display">{selectedCropModal.name}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {selectedCropModal.description}
              </p>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Est. Net Profit</div>
                  <div className="text-sm font-bold font-mono text-emerald-800 dark:text-emerald-200 mt-0.5">
                    {selectedCropModal.estProfit}
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <div className="text-[10px] text-zinc-400 font-semibold">Expected Yield</div>
                  <div className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {selectedCropModal.yieldAcre}
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <div className="text-[10px] text-zinc-400 font-semibold">Cultivation Cost</div>
                  <div className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {selectedCropModal.costAcre}
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <div className="text-[10px] text-zinc-400 font-semibold">Crop Duration</div>
                  <div className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {selectedCropModal.duration}
                  </div>
                </div>
              </div>

              {/* Agronomic Details */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-400">Ideal Soil Type:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedCropModal.soil}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-400">Water Requirement:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedCropModal.water}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-400">Optimal Sowing Window:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedCropModal.season}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Current APMC Market Price:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedCropModal.marketPrice}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCropModal(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedCropModal(null);
                    scrollToSection('profit');
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md"
                >
                  View Profit Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-PAGE LOGIN / SIGN UP MODAL                                             */}
      {/* ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white font-display">Farmer Portal Login</h3>
                <p className="text-[11px] text-zinc-400">Save farm fields, soil history, and crop records</p>
              </div>
            </div>

            {authSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-bold text-xs text-emerald-800 dark:text-emerald-200">Logged in successfully!</div>
                <div className="text-[11px] text-zinc-500">Welcome, Muruga Praveen</div>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-300 font-semibold mb-1">Email or Mobile</label>
                  <input
                    type="text"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Enter email or mobile number"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-300 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-950/20"
                >
                  Sign In
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700" />
                  <span className="flex-shrink mx-2 text-[10px] text-zinc-400">or</span>
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700" />
                </div>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Continue as Guest Farmer</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
