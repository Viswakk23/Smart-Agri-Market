import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { PricePrediction } from './components/PricePrediction';
import { ColdStorageModule } from './components/ColdStorageModule';
import { BuyerMarketplace } from './components/BuyerMarketplace';
import { ProfitSimulator } from './components/ProfitSimulator';
import { AiAssistant } from './components/AiAssistant';
import { RAW_MANDI_RECORDS } from './data/mandiData';
import { RAW_WEATHER_RECORDS } from './data/weatherData';
import { CloudRain, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [navParams, setNavParams] = useState<{ crop?: string; futurePrice?: number }>({
    crop: 'Tomato'
  });

  const handleNavigateTab = (tab: ActiveTab, params?: { crop?: string; futurePrice?: number }) => {
    if (params) {
      setNavParams(params);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Live Ticker & Weather Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Agmarknet Feed
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 overflow-x-auto text-[11px] text-slate-300">
            {RAW_MANDI_RECORDS.slice(0, 5).map(record => (
              <span key={record.id} className="inline-flex items-center gap-1.5 shrink-0">
                <span className="font-semibold text-white">{record.crop} ({record.mandi}):</span>
                <span className="font-mono text-emerald-400 font-bold">₹{record.modalPrice}</span>
                <span className={`text-[10px] font-bold ${record.priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {record.priceChange >= 0 ? `+${record.priceChange}%` : `${record.priceChange}%`}
                </span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 text-amber-300 text-[11px]">
            <CloudRain className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-xs sm:max-w-md">
              {RAW_WEATHER_RECORDS[0].location} ({RAW_WEATHER_RECORDS[0].condition}): {RAW_WEATHER_RECORDS[0].advisory}
            </span>
          </div>
        </div>
      </div>

      {/* Main App Navbar */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Primary Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <FarmerDashboard onNavigateTab={handleNavigateTab} />
        )}

        {activeTab === 'prediction' && (
          <PricePrediction 
            initialCrop={navParams.crop || 'Tomato'} 
            onNavigateTab={handleNavigateTab} 
          />
        )}

        {activeTab === 'storage' && (
          <ColdStorageModule 
            initialCrop={navParams.crop || 'Onion'} 
            onNavigateTab={handleNavigateTab} 
          />
        )}

        {activeTab === 'marketplace' && (
          <BuyerMarketplace />
        )}

        {activeTab === 'simulator' && (
          <ProfitSimulator 
            initialCrop={navParams.crop || 'Onion'} 
            initialFuturePrice={navParams.futurePrice} 
          />
        )}

        {activeTab === 'assistant' && (
          <AiAssistant />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <span className="text-emerald-500 animate-pulse">● LIVE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>AgriIntel Pro Market Intelligence &amp; Trading Platform &copy; 2026</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>NCDEX: Wheat -0.2%</span>
            <span className="text-slate-700">|</span>
            <span>USD/INR: 83.12</span>
            <span className="text-slate-700">|</span>
            <span>Agmarknet Real-time Grounded</span>
            <span className="text-slate-700">|</span>
            <span>WDRA Certified Cold Chains</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
