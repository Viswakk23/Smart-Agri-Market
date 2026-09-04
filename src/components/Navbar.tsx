import React from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Snowflake, 
  Store, 
  Calculator, 
  Bot, 
  Database,
  CloudSun,
  ShieldCheck
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'prediction' | 'storage' | 'marketplace' | 'simulator' | 'assistant' | 'datasets';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  onSelectTab?: (tab: ActiveTab) => void;
  weatherSummary?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onSelectTab, weatherSummary }) => {
  const handleSelectTab = (tab: ActiveTab) => {
    if (setActiveTab) setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Farmer Dashboard', icon: Sprout },
    { id: 'prediction', label: 'Price Prediction', icon: TrendingUp },
    { id: 'storage', label: 'Cold Storage', icon: Snowflake },
    { id: 'marketplace', label: 'Buyer Marketplace', icon: Store },
    { id: 'simulator', label: 'Profit Simulator', icon: Calculator },
    { id: 'assistant', label: 'AI Agri Assistant', icon: Bot },
    { id: 'datasets', label: 'Datasets & CSV', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner with live Mandi Ticker */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5 whitespace-nowrap uppercase tracking-widest text-[10px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ● LIVE MANDI TICKER:
          </span>
          <span className="whitespace-nowrap font-medium text-slate-200">Tomato (Kolar) <strong className="text-emerald-400">₹2,600</strong> <span className="text-emerald-400 font-bold">+4.8%</span></span>
          <span className="text-slate-700">|</span>
          <span className="whitespace-nowrap font-medium text-slate-200">Onion (Lasalgaon) <strong className="text-emerald-400">₹2,320</strong> <span className="text-rose-400 font-bold">-1.2%</span></span>
          <span className="text-slate-700">|</span>
          <span className="whitespace-nowrap font-medium text-slate-200">Wheat (Khanna) <strong className="text-emerald-400">₹2,540</strong> <span className="text-emerald-400 font-bold">+0.5%</span></span>
          <span className="text-slate-700">|</span>
          <span className="whitespace-nowrap font-medium text-slate-200">Soybean (Indore) <strong className="text-emerald-400">₹4,710</strong> <span className="text-emerald-400 font-bold">+1.4%</span></span>
          <span className="text-slate-700">|</span>
          <span className="whitespace-nowrap font-medium text-slate-200">Cotton (Rajkot) <strong className="text-emerald-400">₹7,520</strong> <span className="text-emerald-400 font-bold">+2.4%</span></span>
        </div>

        <div className="flex items-center gap-4 whitespace-nowrap text-slate-400 text-xs">
          <div className="flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>Monsoon Advisory Active</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Govt Agmarknet Grounded</span>
          </div>
        </div>
      </div>

      {/* Main Header & Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            onClick={() => handleSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">AgriIntel Pro</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Kisan Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5 hidden sm:block">Market Intelligence & Trading</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Live Badge, User Info & Quick Action Button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Live Market Data</span>
            </div>

            <div className="hidden xl:flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-sm font-bold leading-none text-slate-900">Vikram Singh</p>
                <p className="text-xs text-slate-500">Karnal Sector 4</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700 shadow-xs">
                VS
              </div>
            </div>

            <button
              id="header-ai-quick-btn"
              onClick={() => handleSelectTab('assistant')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scroll */}
        <div className="flex md:hidden overflow-x-auto no-scrollbar py-2 border-t border-slate-200 gap-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
