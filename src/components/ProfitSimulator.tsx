import React, { useState, useMemo } from 'react';
import { calculateStorageProfit } from '../utils/profitCalculator';
import { Bar } from 'react-chartjs-2';
import '../utils/chartConfig';
import { 
  Calculator, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Scale, 
  Clock, 
  Percent,
  Sparkles
} from 'lucide-react';

interface ProfitSimulatorProps {
  initialCrop?: string;
  initialFuturePrice?: number;
}

export const ProfitSimulator: React.FC<ProfitSimulatorProps> = ({ initialCrop = 'Onion', initialFuturePrice }) => {
  const [crop, setCrop] = useState<string>(initialCrop);
  const [quantityQtl, setQuantityQtl] = useState<number>(150);
  const [currentPrice, setCurrentPrice] = useState<number>(2320);
  const [futurePrice, setFuturePrice] = useState<number>(initialFuturePrice || 2750);
  const [durationWeeks, setDurationWeeks] = useState<number>(4);
  const [costPerQtlMonth, setCostPerQtlMonth] = useState<number>(75);
  const [handlingChargePerQtl, setHandlingChargePerQtl] = useState<number>(20);
  const [spoilagePct, setSpoilagePct] = useState<number>(2.0);

  // Preset quick updater when crop changes
  const handleCropPreset = (selected: string) => {
    setCrop(selected);
    if (selected === 'Tomato') {
      setCurrentPrice(2600);
      setFuturePrice(2780);
      setDurationWeeks(2);
      setCostPerQtlMonth(85);
      setSpoilagePct(4.0);
    } else if (selected === 'Onion') {
      setCurrentPrice(2320);
      setFuturePrice(2750);
      setDurationWeeks(4);
      setCostPerQtlMonth(75);
      setSpoilagePct(2.0);
    } else if (selected === 'Potato') {
      setCurrentPrice(1580);
      setFuturePrice(1900);
      setDurationWeeks(8);
      setCostPerQtlMonth(60);
      setSpoilagePct(1.5);
    } else if (selected === 'Wheat') {
      setCurrentPrice(2540);
      setFuturePrice(2780);
      setDurationWeeks(8);
      setCostPerQtlMonth(45);
      setSpoilagePct(0.5);
    } else {
      setCurrentPrice(4700);
      setFuturePrice(5100);
      setDurationWeeks(4);
      setCostPerQtlMonth(60);
      setSpoilagePct(1.0);
    }
  };

  // Compute profit simulation
  const result = useMemo(() => {
    return calculateStorageProfit({
      crop,
      quantityQtl,
      currentPrice,
      futurePrice,
      durationWeeks,
      costPerQtlMonth,
      handlingChargePerQtl,
      spoilagePct,
      transportPerQtl: 35
    });
  }, [crop, quantityQtl, currentPrice, futurePrice, durationWeeks, costPerQtlMonth, handlingChargePerQtl, spoilagePct]);

  // Chart Data Comparison
  const chartData = {
    labels: ['Sell Today', `Store & Sell in ${durationWeeks} Wks`],
    datasets: [
      {
        label: 'Gross Crop Revenue (₹)',
        data: [result.grossRevenueToday, result.grossRevenueFuture],
        backgroundColor: '#047857',
        borderRadius: 8
      },
      {
        label: 'Storage, Handling & Spoilage Overhead (₹)',
        data: [0, result.storageCostTotal + result.handlingCostTotal + result.spoilageLossCost],
        backgroundColor: '#f43f5e',
        borderRadius: 8
      },
      {
        label: 'Net In-Hand Realization (₹)',
        data: [result.netRevenueToday, result.netRevenueFuture],
        backgroundColor: '#0284c7',
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 12, font: { size: 11 } }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
        ticks: {
          font: { size: 11 },
          callback: (val: any) => `₹${(val / 1000).toFixed(0)}k`
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12, weight: 'bold' as const } }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-5 h-5 text-emerald-700" />
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            Interactive Scenario Planning
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          Agri Profit Simulator: Sell Today vs Store & Sell Later
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Model dynamic warehousing rents, moisture shrinkage loss, and price spikes to know the exact net rupee gain or risk of holding crops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Input Controls */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Simulation Parameters</h2>
            <span className="text-xs font-semibold text-slate-400">Live Auto-Recalculate</span>
          </div>

          {/* Commodity Preset Quick Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Preset Commodity:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Onion', 'Tomato', 'Potato', 'Wheat'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCropPreset(c)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    crop === c 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-700">Harvest Quantity:</span>
              <span className="text-emerald-700 font-bold">{quantityQtl} Quintals</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={quantityQtl}
              onChange={(e) => setQuantityQtl(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Today's Price Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-700">Today's Mandi Price (Spot):</span>
              <span className="text-slate-900 font-mono font-bold">₹{currentPrice} / Qtl</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="50"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full accent-slate-700 cursor-pointer"
            />
          </div>

          {/* Expected Future Price Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-700">Projected Future Price:</span>
              <span className="text-emerald-700 font-mono font-bold">₹{futurePrice} / Qtl</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="50"
              value={futurePrice}
              onChange={(e) => setFuturePrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Expected Change:</span>
              <span className={futurePrice >= currentPrice ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {futurePrice >= currentPrice ? `+${(((futurePrice - currentPrice) / currentPrice) * 100).toFixed(1)}%` : `${(((futurePrice - currentPrice) / currentPrice) * 100).toFixed(1)}%`}
              </span>
            </div>
          </div>

          {/* Storage Duration Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-700">Storage Holding Duration:</span>
              <span className="text-slate-900 font-bold">{durationWeeks} Weeks ({durationWeeks * 7} Days)</span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="1"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Storage Rent & Spoilage Inputs */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rent (₹/Qtl/Month)</label>
              <input
                type="number"
                value={costPerQtlMonth}
                onChange={(e) => setCostPerQtlMonth(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Drying Loss (%)</label>
              <input
                type="number"
                step="0.5"
                value={spoilagePct}
                onChange={(e) => setSpoilagePct(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Comparative Visual Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Decision Banner */}
          <div className={`rounded-xl p-6 border shadow-sm ${
            result.isProfitableToStore
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {result.isProfitableToStore ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-rose-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold block">
                    {result.isProfitableToStore ? 'Strong Storage Advantage' : 'Immediate Sale Advised'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-0.5">
                    {result.isProfitableToStore
                      ? `Gain +₹${result.netProfitDiff.toLocaleString('en-IN')} (+${result.netProfitDiffPct}%) by Storing`
                      : `Avoid Loss of -₹${Math.abs(result.netProfitDiff).toLocaleString('en-IN')} by Selling Today`}
                  </h3>
                  <p className="text-xs leading-relaxed mt-1 text-slate-700">
                    {result.isProfitableToStore
                      ? `At ₹${futurePrice}/Qtl, your net margin after paying ₹${result.storageCostTotal.toLocaleString('en-IN')} storage rent and absorbing ${result.spoilageLossQtl} Qtl drying weight loss exceeds immediate spot sale.`
                      : `The projected price (₹${futurePrice}/Qtl) does not cover ₹${result.storageCostTotal.toLocaleString('en-IN')} in storage fees and ₹${result.spoilageLossCost.toLocaleString('en-IN')} in drying weight loss. Minimum breakeven selling price is ₹${result.breakevenPrice}/Qtl.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A: Sell Today */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Option A</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  Sell Today
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Harvest Value:</span>
                  <span className="font-mono text-slate-800 font-bold">₹{result.grossRevenueToday.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mandi Road Freight:</span>
                  <span className="font-mono text-slate-600">-₹{(quantityQtl * 35).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage & Handling:</span>
                  <span className="font-mono text-emerald-700">₹0</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <strong className="text-slate-900">Net in Hand Today:</strong>
                  <strong className="text-base font-black text-slate-900 font-mono">
                    ₹{result.netRevenueToday.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            {/* Option B: Store & Sell Later */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Option B</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Store in Warehouse
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Future Sales:</span>
                  <span className="font-mono text-slate-800 font-bold">₹{result.grossRevenueFuture.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage Rent ({durationWeeks} wks):</span>
                  <span className="font-mono text-rose-600">-₹{result.storageCostTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">In/Out Handling:</span>
                  <span className="font-mono text-rose-600">-₹{result.handlingCostTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Weight Shrinkage Loss:</span>
                  <span className="font-mono text-amber-700">-{result.spoilageLossQtl} Qtl</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <strong className="text-emerald-950">Net in Hand Later:</strong>
                  <strong className="text-base font-black text-emerald-700 font-mono">
                    ₹{result.netRevenueFuture.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Bar Chart */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Comparative Revenue, Costs & Net Payout (Bar Chart)
            </h3>
            <div className="h-64 w-full">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Breakeven Price Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Required Breakeven Price</span>
                <span className="text-[11px] text-slate-500">
                  Minimum mandi price required to avoid losing money compared to selling today.
                </span>
              </div>
            </div>
            <span className="text-base font-black font-mono text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
              ₹{result.breakevenPrice} / Qtl
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
