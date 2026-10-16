import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Bell, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  CheckCircle2
} from 'lucide-react';

interface CommodityPrice {
  id: string;
  name: string;
  category: 'cereals' | 'oilseeds' | 'vegetables' | 'commercial';
  market: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  trend: string;
  trendDirection: 'up' | 'down';
  mspBenchmark: number | null;
  dailyArrivals: number;
  historical7d: number[];
}

export const MarketPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [alertSubscribed, setAlertSubscribed] = useState<boolean>(false);
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);

  // Mandi Transport Calculator State
  const [calcCrop, setCalcCrop] = useState<string>('paddy');
  const [calcQuantity, setCalcQuantity] = useState<number>(30); // in Quintals
  const [userLocation, setUserLocation] = useState<string>('Thanjavur');

  const commodities: CommodityPrice[] = [
    {
      id: 'paddy',
      name: 'Paddy (Common - CO 51)',
      category: 'cereals',
      market: 'Thanjavur APMC',
      state: 'Tamil Nadu',
      modalPrice: 2350,
      minPrice: 2280,
      maxPrice: 2420,
      unit: '₹ / Quintal',
      trend: '+2.4%',
      trendDirection: 'up',
      mspBenchmark: 2203,
      dailyArrivals: 4200,
      historical7d: [2290, 2300, 2310, 2320, 2335, 2340, 2350]
    },
    {
      id: 'maize',
      name: 'Maize (Yellow Hybrid)',
      category: 'cereals',
      market: 'Pollachi Mandi',
      state: 'Tamil Nadu',
      modalPrice: 2180,
      minPrice: 2100,
      maxPrice: 2250,
      unit: '₹ / Quintal',
      trend: '-1.3%',
      trendDirection: 'down',
      mspBenchmark: 2090,
      dailyArrivals: 3100,
      historical7d: [2240, 2230, 2220, 2205, 2190, 2195, 2180]
    },
    {
      id: 'groundnut',
      name: 'Groundnut Pods (TMV 7)',
      category: 'oilseeds',
      market: 'Erode Regulated Market',
      state: 'Tamil Nadu',
      modalPrice: 5600,
      minPrice: 5350,
      maxPrice: 5850,
      unit: '₹ / Quintal',
      trend: '+3.4%',
      trendDirection: 'up',
      mspBenchmark: 6377,
      dailyArrivals: 1850,
      historical7d: [5400, 5420, 5460, 5500, 5520, 5570, 5600]
    },
    {
      id: 'wheat',
      name: 'Wheat (Sharbati High Grade)',
      category: 'cereals',
      market: 'Khanna Mandi',
      state: 'Punjab',
      modalPrice: 2420,
      minPrice: 2350,
      maxPrice: 2490,
      unit: '₹ / Quintal',
      trend: '+1.6%',
      trendDirection: 'up',
      mspBenchmark: 2275,
      dailyArrivals: 8500,
      historical7d: [2380, 2390, 2395, 2400, 2410, 2415, 2420]
    },
    {
      id: 'cotton',
      name: 'Cotton (Long Staple Hybrid)',
      category: 'commercial',
      market: 'Rajkot APMC',
      state: 'Gujarat',
      modalPrice: 7250,
      minPrice: 6900,
      maxPrice: 7480,
      unit: '₹ / Quintal',
      trend: '+1.8%',
      trendDirection: 'up',
      mspBenchmark: 7020,
      dailyArrivals: 5400,
      historical7d: [7100, 7120, 7150, 7180, 7200, 7220, 7250]
    },
    {
      id: 'sugarcane',
      name: 'Sugarcane (FRP Mill Rate)',
      category: 'commercial',
      market: 'Coimbatore District Mill',
      state: 'Tamil Nadu',
      modalPrice: 340,
      minPrice: 325,
      maxPrice: 355,
      unit: '₹ / Quintal',
      trend: '+1.2%',
      trendDirection: 'up',
      mspBenchmark: 315,
      dailyArrivals: 12500,
      historical7d: [335, 335, 336, 338, 338, 340, 340]
    },
    {
      id: 'turmeric',
      name: 'Turmeric (Salem/Erode Finger)',
      category: 'commercial',
      market: 'Salem APMC',
      state: 'Tamil Nadu',
      modalPrice: 8450,
      minPrice: 7800,
      maxPrice: 9100,
      unit: '₹ / Quintal',
      trend: '+5.6%',
      trendDirection: 'up',
      mspBenchmark: null,
      dailyArrivals: 1200,
      historical7d: [8000, 8050, 8150, 8200, 8300, 8380, 8450]
    },
    {
      id: 'soybean',
      name: 'Soybean (Yellow)',
      category: 'oilseeds',
      market: 'Indore Mandi',
      state: 'Madhya Pradesh',
      modalPrice: 4720,
      minPrice: 4500,
      maxPrice: 4900,
      unit: '₹ / Quintal',
      trend: '+1.1%',
      trendDirection: 'up',
      mspBenchmark: 4600,
      dailyArrivals: 6200,
      historical7d: [4660, 4680, 4690, 4700, 4705, 4710, 4720]
    },
    {
      id: 'tomato',
      name: 'Tomato (Hybrid Red)',
      category: 'vegetables',
      market: 'Kolar APMC',
      state: 'Karnataka',
      modalPrice: 1650,
      minPrice: 1250,
      maxPrice: 1950,
      unit: '₹ / Quintal',
      trend: '-4.2%',
      trendDirection: 'down',
      mspBenchmark: null,
      dailyArrivals: 9800,
      historical7d: [1800, 1780, 1740, 1720, 1690, 1660, 1650]
    },
    {
      id: 'onion',
      name: 'Red Onion (Nashik Quality)',
      category: 'vegetables',
      market: 'Lasalgaon Mandi',
      state: 'Maharashtra',
      modalPrice: 2050,
      minPrice: 1750,
      maxPrice: 2350,
      unit: '₹ / Quintal',
      trend: '+3.8%',
      trendDirection: 'up',
      mspBenchmark: null,
      dailyArrivals: 14200,
      historical7d: [1950, 1960, 1990, 2010, 2020, 2040, 2050]
    },
    {
      id: 'banana',
      name: 'Banana (Poovan / Grand Naine)',
      category: 'vegetables',
      market: 'Tiruchirappalli APMC',
      state: 'Tamil Nadu',
      modalPrice: 1950,
      minPrice: 1700,
      maxPrice: 2150,
      unit: '₹ / Quintal',
      trend: '+0.9%',
      trendDirection: 'up',
      mspBenchmark: null,
      dailyArrivals: 3400,
      historical7d: [1920, 1925, 1930, 1935, 1940, 1945, 1950]
    }
  ];

  // Filtering logic
  const filteredCommodities = commodities.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.market.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'All' || item.state === selectedState;
    return matchesCategory && matchesQuery && matchesState;
  });

  const handleSubscribeAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setAlertSubscribed(true);
    }, 1200);
  };

  // Nearby Mandi Net Realization Calculator for Paddy
  const mandiComparison = [
    {
      mandi: 'Thanjavur APMC',
      distanceKm: 18,
      quotedPrice: 2350,
      transportRatePerQtl: 45,
      netRealization: 2350 - 45,
      isBest: true,
      handlingFee: 15
    },
    {
      mandi: 'Tiruchirappalli APMC',
      distanceKm: 54,
      quotedPrice: 2410,
      transportRatePerQtl: 125,
      netRealization: 2410 - 125,
      isBest: false,
      handlingFee: 20
    },
    {
      mandi: 'Kumbakonam Regulated Market',
      distanceKm: 38,
      quotedPrice: 2340,
      transportRatePerQtl: 85,
      netRealization: 2340 - 85,
      isBest: false,
      handlingFee: 15
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#f4f7f4] text-zinc-800 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ===================================================================== */}
        {/* LIGHT THEME HERO TITLE & MARKET PULSE HEADER                          */}
        {/* ===================================================================== */}
        <div className="bg-gradient-to-r from-emerald-50 via-white to-green-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300/60 flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Live APMC Mandi Stream
                </span>
                <span className="text-zinc-500 text-xs font-mono">Updated: Today, 11:30 AM</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-display">
                Mandi Commodity Market Intelligence
              </h1>
              <p className="text-sm text-zinc-600 mt-2 max-w-2xl leading-relaxed">
                Real-time APMC wholesale price feeds, MSP benchmark tracking, regional freight deductions, and AI-powered harvest sale timing.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setAlertSubscribed(!alertSubscribed)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Bell className="w-4 h-4 text-emerald-200" />
                <span>{alertSubscribed ? 'Alerts Active (SMS/WhatsApp)' : 'Set Price Alert'}</span>
              </button>
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-zinc-200 text-xs font-mono text-zinc-700 shadow-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Live Refresh: 15m</span>
              </div>
            </div>
          </div>

          {/* Top 4 Market Highlight Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-100">
            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="text-[11px] text-zinc-500 font-medium">Top Gainer Today</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-700 font-display mt-0.5">
                Turmeric (+5.6%)
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5 font-mono">₹8,450 / Qtl · Salem APMC</div>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="text-[11px] text-zinc-500 font-medium">Benchmark Crop (Paddy)</div>
              <div className="text-lg sm:text-xl font-bold text-zinc-900 font-display mt-0.5">
                ₹2,350 <span className="text-emerald-700 text-xs font-mono">(+2.4%)</span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5 font-mono font-medium">+₹147 over Govt MSP</div>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="text-[11px] text-zinc-500 font-medium">Total State Mandi Arrivals</div>
              <div className="text-lg sm:text-xl font-bold text-zinc-900 font-display mt-0.5">
                48,250 <span className="text-zinc-500 text-xs font-normal">Qtl</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5 font-mono">Across 14 Districts</div>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="text-[11px] text-zinc-500 font-medium">AI Sale Recommendation</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-800 font-display mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                HOLD Paddy
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Price forecast rising next week</div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* LIGHT THEME FILTERS & SEARCH BAR                                      */}
        {/* ===================================================================== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-zinc-200/80 shadow-sm">
          
          {/* Category Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Commodities' },
              { id: 'cereals', label: 'Cereals & Grains' },
              { id: 'oilseeds', label: 'Oilseeds' },
              { id: 'commercial', label: 'Commercial & Spices' },
              { id: 'vegetables', label: 'Vegetables & Fruits' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & State Filter Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop or APMC mandi..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 rounded-full px-3 py-1.5 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="All">All States</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Punjab">Punjab</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
            </select>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* COMMODITY CARDS (LIGHT THEME)                                         */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCommodities.map((item) => {
            const isAboveMsp = item.mspBenchmark ? item.modalPrice >= item.mspBenchmark : null;
            return (
              <div 
                key={item.id}
                className="bg-white hover:border-emerald-500/80 border border-zinc-200/90 rounded-3xl p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Name, Location, and Trend */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 group-hover:text-emerald-700 transition-colors font-display">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item.market}, {item.state}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-0.5 ${
                      item.trendDirection === 'up'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.trendDirection === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {item.trend}
                    </span>
                  </div>

                  {/* Price Box */}
                  <div className="mt-5 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/70">
                    <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                      Modal Wholesale Rate (APMC)
                    </div>
                    <div className="text-2xl font-extrabold text-zinc-900 font-mono mt-1 flex items-baseline gap-1.5">
                      <span>₹{item.modalPrice.toLocaleString()}</span>
                      <span className="text-xs text-zinc-500 font-sans font-normal">/ Quintal</span>
                    </div>

                    {/* Min & Max Price Range */}
                    <div className="flex items-center justify-between text-xs text-zinc-600 mt-3 pt-2.5 border-t border-emerald-100/60 font-mono">
                      <span>Min: ₹{item.minPrice.toLocaleString()}</span>
                      <span className="text-zinc-300">|</span>
                      <span>Max: ₹{item.maxPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* MSP Benchmark Tag */}
                  {item.mspBenchmark && (
                    <div className="mt-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px]">
                      <span className="text-zinc-500">Govt MSP Benchmark:</span>
                      <span className="font-mono font-bold text-zinc-800">₹{item.mspBenchmark.toLocaleString()}</span>
                      <span className={`text-[10px] font-bold ${isAboveMsp ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isAboveMsp ? '✓ Above MSP' : '⚠ Below MSP'}
                      </span>
                    </div>
                  )}

                  {/* Mini 7-Day Trend Visualizer */}
                  <div className="mt-4 pt-3 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1.5 font-mono">
                      <span>7-Day Price Movement</span>
                      <span className="text-zinc-600">Arrivals: {item.dailyArrivals.toLocaleString()} Qtl</span>
                    </div>
                    <div className="h-6 flex items-end gap-1.5">
                      {item.historical7d.map((val, idx) => {
                        const min = Math.min(...item.historical7d);
                        const max = Math.max(...item.historical7d);
                        const range = max - min || 1;
                        const pct = 20 + ((val - min) / range) * 80;
                        return (
                          <div 
                            key={idx}
                            style={{ height: `${pct}%` }}
                            className={`flex-1 rounded-sm transition-all ${
                              idx === 6 
                                ? 'bg-emerald-600' 
                                : 'bg-emerald-200 hover:bg-emerald-300'
                            }`}
                            title={`Day ${idx + 1}: ₹${val}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Row */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 font-mono">Verified APMC Feed</span>
                  <button 
                    onClick={() => setAlertSubscribed(true)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    Track Crop
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* MANDI FREIGHT & NET PROFIT OPTIMIZER (LIGHT THEME)                    */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-white via-emerald-50/30 to-green-50/40 p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-sm">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono uppercase font-bold">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              Nearest Mandi Net Return Optimizer
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display">
              Calculate True Take-Home Profit After Transport
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Higher mandi rates in farther cities don't always yield more profit. We deduct regional vehicle freight and APMC cess to show you the market that puts the highest cheque into your account.
            </p>

            {/* Inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">Your Farm District</label>
                <input 
                  type="text"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">Commodity</label>
                  <select 
                    value={calcCrop}
                    onChange={(e) => setCalcCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 shadow-xs"
                  >
                    <option value="paddy">Paddy (Rice)</option>
                    <option value="maize">Maize</option>
                    <option value="groundnut">Groundnut</option>
                    <option value="turmeric">Turmeric</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">Harvest Quantity (Qtl)</label>
                  <input 
                    type="number"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 font-mono shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-3">
            <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider font-mono">
              Net Payout Comparison for {calcQuantity} Quintals
            </div>

            {mandiComparison.map((mandi, idx) => {
              const totalGross = mandi.quotedPrice * calcQuantity;
              const totalFreight = (mandi.transportRatePerQtl + mandi.handlingFee) * calcQuantity;
              const totalNet = totalGross - totalFreight;

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    mandi.isBest
                      ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                      : 'bg-white border-zinc-200 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-zinc-900 font-display">{mandi.mandi}</h4>
                      {mandi.isBest && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase">
                          Best Net Return
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-600 mt-1 flex items-center gap-3 font-mono">
                      <span>Distance: {mandi.distanceKm} km</span>
                      <span>Mandi Rate: ₹{mandi.quotedPrice}/Qtl</span>
                      <span>Freight & Fees: -₹{mandi.transportRatePerQtl + mandi.handlingFee}/Qtl</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100">
                    <div className="text-[10px] text-zinc-500 uppercase font-mono">Net Take-Home</div>
                    <div className="text-lg font-bold text-emerald-800 font-mono">
                      ₹{totalNet.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      (₹{mandi.netRealization}/Qtl net)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* DIRECT BUYER INQUIRY & SMS ALERT (LIGHT THEME)                        */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SMS / WhatsApp Price Alert Card */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider font-mono mb-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                Price Fluctuation Alert
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">
                Get Daily APMC Rates on WhatsApp
              </h3>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Receive free morning APMC closing prices and harvest surge alerts for your favorite crops directly on your phone.
              </p>

              <form onSubmit={handleSubscribeAlert} className="mt-4 space-y-3">
                <input 
                  type="tel"
                  placeholder="Enter 10-digit mobile number (+91)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribe for Free Daily Updates</span>
                </button>
                {alertSuccess && (
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 animate-fadeIn">
                    ✓ Subscribed! You will receive morning rate cards.
                  </div>
                )}
              </form>
            </div>
            <div className="text-[10px] text-zinc-500 mt-4">
              Zero spam. Verified mandi APMC agricultural price notifications only.
            </div>
          </div>

          {/* Direct Wholesale Buyers & FPOs */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider font-mono mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Institutional Buyers
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">
                Sell Direct to Certified Mills & FPOs
              </h3>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Bypass middlemen fees. Connect with verified wholesale buyers looking for farm-gate harvest lots.
              </p>

              <div className="space-y-2.5 mt-4">
                {[
                  { name: 'Cauvery Delta Rice Mill Cluster', crops: 'Paddy CO 51, BPT', demand: '250 Tonnes', verified: true },
                  { name: 'Kongu Agro Oilseed Processing FPO', crops: 'Groundnut TMV 7, Sesame', demand: '80 Tonnes', verified: true },
                  { name: 'Tamil Nadu Organic Growers Consortium', crops: 'Pulses, Millets', demand: '40 Tonnes', verified: true }
                ].map((buyer, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <span>{buyer.name}</span>
                        <span className="text-[10px] text-emerald-700 font-bold">✓ Verified</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                        Seeking: {buyer.crops} · Qty: {buyer.demand}
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Connecting with ${buyer.name}... Mandi coordinator will contact you shortly.`)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 mt-4">
              All buyers registered under National Agriculture Market (e-NAM) protocol.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
