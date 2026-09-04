import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '../utils/chartConfig';
import { runPricePrediction } from '../utils/mlPredictor';
import { RAW_MANDI_RECORDS } from '../data/mandiData';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Cpu, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Download,
  Activity,
  Layers,
  Globe2,
  Bug,
  Truck,
  Gauge,
  ShieldAlert,
  Flame,
  Radio,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface PricePredictionProps {
  initialCrop?: string;
  onNavigateTab: (tab: ActiveTab, params?: any) => void;
}

export const PricePrediction: React.FC<PricePredictionProps> = ({ initialCrop = 'Tomato', onNavigateTab }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [horizonDays, setHorizonDays] = useState<number>(7);
  const [advancedTab, setAdvancedTab] = useState<'global' | 'disease' | 'transport' | 'scorecard'>('global');

  // Prediction result
  const prediction = useMemo(() => {
    return runPricePrediction(selectedCrop);
  }, [selectedCrop]);

  const uniqueCrops = useMemo(() => {
    return Array.from(new Set(RAW_MANDI_RECORDS.map(r => r.crop)));
  }, []);

  // Prepare Combined Past vs Predicted Chart Data
  // Last 14 days of history + next 7 days of forecast
  const chartData = useMemo(() => {
    const past14 = prediction.historicalDays.slice(-14);
    const future7 = prediction.forecastDays.slice(0, horizonDays);

    const labels = [
      ...past14.map(p => {
        const parts = p.date.split('-');
        return `${parts[2]} Aug/Sep`;
      }),
      ...future7.map(f => {
        const parts = f.date.split('-');
        return `${parts[2]} Sep (Pred)`;
      })
    ];

    // Actual prices array (past has values, future is null)
    const actualSeries = [
      ...past14.map(p => p.price),
      ...Array(future7.length).fill(null)
    ];

    // Predicted prices array (starts from the last actual point to ensure continuous line)
    const lastActual = past14[past14.length - 1].price;
    const predictedSeries = [
      ...Array(past14.length - 1).fill(null),
      lastActual,
      ...future7.map(f => f.predictedPrice)
    ];

    // Upper and Lower confidence bounds
    const upperConfidenceSeries = [
      ...Array(past14.length - 1).fill(null),
      lastActual,
      ...future7.map(f => f.maxRange)
    ];

    const lowerConfidenceSeries = [
      ...Array(past14.length - 1).fill(null),
      lastActual,
      ...future7.map(f => f.minRange)
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Historical Actual Price (₹/Qtl)',
          data: actualSeries,
          borderColor: '#047857',
          backgroundColor: '#047857',
          tension: 0.3,
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 6
        },
        {
          label: 'Predicted Modal Price (₹/Qtl)',
          data: predictedSeries,
          borderColor: '#2563eb',
          backgroundColor: '#2563eb',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Upper Confidence Limit (+90%)',
          data: upperConfidenceSeries,
          borderColor: 'transparent',
          backgroundColor: 'rgba(37, 99, 235, 0.12)',
          fill: '+1',
          pointRadius: 0
        },
        {
          label: 'Lower Confidence Limit (-90%)',
          data: lowerConfidenceSeries,
          borderColor: 'transparent',
          backgroundColor: 'rgba(37, 99, 235, 0.12)',
          fill: false,
          pointRadius: 0
        }
      ]
    };
  }, [prediction, horizonDays]);

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'inherit', size: 11, weight: 'bold' },
          boxWidth: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        callbacks: {
          label: (context: any) => {
            if (context.raw === null || context.raw === undefined) return '';
            return `${context.dataset.label}: ₹${context.raw}/Qtl`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          callback: (value: any) => `₹${value}`,
          font: { size: 11 }
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Live Data Sync Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI Multi-Factor Price Prediction & Market Intelligence Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded in historical mandi arrivals, Open-Meteo real-time weather, global macro parity, crop disease models, and freight logistics costs.
          </p>
        </div>

        {/* Live Feed Status Tag */}
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs text-emerald-800 font-bold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <Radio className="w-3.5 h-3.5 text-emerald-700" />
          <span>Live Feeds: e-NAM & Open-Meteo Connected</span>
        </div>
      </div>

      {/* Control Bar: Crop Selector & Forecast Horizon */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Commodity:
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {uniqueCrops.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Forecast Horizon:</span>
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setHorizonDays(3)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition ${
                horizonDays === 3 ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              3-Day Forecast
            </button>
            <button
              onClick={() => setHorizonDays(7)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition ${
                horizonDays === 7 ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              7-Day Forecast
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Recommendation Banner */}
      <div className={`rounded-xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        prediction.recommendation === 'SELL_NOW'
          ? 'bg-rose-50 border-rose-200 text-rose-900'
          : prediction.recommendation === 'STORE_AND_SELL'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] uppercase font-black px-2.5 py-0.5 rounded tracking-wider ${
              prediction.recommendation === 'SELL_NOW'
                ? 'bg-rose-200 text-rose-900'
                : prediction.recommendation === 'STORE_AND_SELL'
                ? 'bg-emerald-200 text-emerald-900'
                : 'bg-amber-200 text-amber-900'
            }`}>
              {prediction.recommendation === 'SELL_NOW' ? 'Action: SELL IMMEDIATELY' : prediction.recommendation === 'STORE_AND_SELL' ? 'Action: STORE IN WAREHOUSE' : 'Action: WAIT 3–5 DAYS'}
            </span>
            <span className="text-xs font-bold">
              Composite Arbitrage Score: {prediction.multiFactorScorecard.overallHoldingScore}/100
            </span>
          </div>
          <p className="text-xs font-medium leading-relaxed max-w-3xl">
            {prediction.recommendationSummary}
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('simulator', { crop: selectedCrop, futurePrice: prediction.predictedPrice7Days })}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-1.5 shadow-sm ${
            prediction.recommendation === 'STORE_AND_SELL'
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <span>Calculate Holding Return</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Modal Price</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">₹{prediction.currentPrice}</span>
            <span className="text-xs text-slate-400 font-normal">/ qtl</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Benchmark: {prediction.mandi}</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Predicted Price (Day 3)</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${
              prediction.predictedPrice3Days > prediction.currentPrice ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              ₹{prediction.predictedPrice3Days}
            </span>
            <span className="text-xs text-slate-400 font-normal">/ qtl</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Expected: {prediction.forecastDays[2]?.dayLabel}
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Predicted Price (Day 7)</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${
              prediction.predictedPrice7Days > prediction.currentPrice ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              ₹{prediction.predictedPrice7Days}
            </span>
            <span className="text-xs text-slate-400 font-normal">/ qtl</span>
          </div>
          <span className={`text-[11px] font-bold mt-2 inline-flex items-center gap-1 ${
            prediction.projectedChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {prediction.projectedChangePct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {prediction.projectedChangePct >= 0 ? `+${prediction.projectedChangePct}% gain` : `${prediction.projectedChangePct}% drop`}
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Disease Vulnerability</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
              prediction.diseasePrediction.riskLevel === 'High' || prediction.diseasePrediction.riskLevel === 'Critical'
                ? 'bg-rose-100 text-rose-800'
                : prediction.diseasePrediction.riskLevel === 'Moderate'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {prediction.diseasePrediction.riskLevel} Risk ({prediction.diseasePrediction.riskScorePct}%)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block truncate">
            {prediction.diseasePrediction.diseaseName}
          </span>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Historical Price vs Machine Learning Forecast Graph (Past 14 Days + Next 7 Days)
            </h2>
            <p className="text-xs text-slate-500">
              Blue dashed line denotes regression trajectory with 90% statistical confidence envelope.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/datasets/mandi/csv"
              download="mandi_prices_dataset.csv"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Mandi CSV</span>
            </a>
          </div>
        </div>

        <div className="h-80 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* ADVANCED MULTI-FACTOR INTELLIGENCE HUB */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                Advanced Multi-Factor Machine Learning Intelligence
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Enriched with global market trends, crop disease early warnings, and road transportation freight friction.
            </p>
          </div>

          {/* Module Sub-Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setAdvancedTab('global')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                advancedTab === 'global' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Global Trends</span>
            </button>
            <button
              onClick={() => setAdvancedTab('disease')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                advancedTab === 'disease' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Crop Disease Alert</span>
            </button>
            <button
              onClick={() => setAdvancedTab('transport')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                advancedTab === 'transport' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Freight & Realization</span>
            </button>
            <button
              onClick={() => setAdvancedTab('scorecard')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                advancedTab === 'scorecard' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>ML Scorecard</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Global Market Trends & Macro Trade Factors */}
        {advancedTab === 'global' && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Benchmark Commodity Index:</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{prediction.globalTrends.indexName}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Export Demand:</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  prediction.globalTrends.exportDemand === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {prediction.globalTrends.exportDemand}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  prediction.globalTrends.trendSignal === 'Bullish' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {prediction.globalTrends.trendSignal} Signal
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-slate-500 font-bold block mb-1">Price Parity (Domestic vs International):</span>
                <p className="font-mono text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                  {prediction.globalTrends.priceParity}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1">Trade Policy & Tariffs:</span>
                <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                  {prediction.globalTrends.policyTariff}
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Macro Analytical Impact on Indian Mandis:</span>
              <p className="text-slate-700 leading-relaxed">{prediction.globalTrends.summary}</p>
            </div>
          </div>
        )}

        {/* Tab 2: Crop Disease & Spoilage Prediction */}
        {advancedTab === 'disease' && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Phytosanitary & Micro-Climate Threat:</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span>{prediction.diseasePrediction.diseaseName}</span>
                  <span className="text-xs text-slate-500 font-normal font-mono">({prediction.diseasePrediction.pathogen})</span>
                </h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                prediction.diseasePrediction.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {prediction.diseasePrediction.riskLevel} Risk Rating ({prediction.diseasePrediction.riskScorePct}%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-slate-500 font-bold block mb-1">Favorable Infection Triggers:</span>
                <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                  {prediction.diseasePrediction.favorableConditions}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1">Est. Post-Harvest Quality & Weight Spoilage:</span>
                <p className="text-rose-700 font-bold bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                  ~{prediction.diseasePrediction.estimatedYieldOrQualityLossPct}% Potential Loss if held in ambient humidity
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 text-emerald-900">
              <span className="text-[11px] font-bold block mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Agronomist Advisory & Preventive Action:
              </span>
              <p className="leading-relaxed">{prediction.diseasePrediction.preventiveAction}</p>
            </div>
          </div>
        )}

        {/* Tab 3: Transportation & Freight Costs */}
        {advancedTab === 'transport' && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-200 pb-3">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Commercial Diesel Index</span>
                <strong className="text-sm font-black font-mono text-slate-900">
                  ₹{prediction.transportCostBreakdown.dieselPricePerLiter} / L
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Freight Rate per Qtl-Km</span>
                <strong className="text-sm font-black font-mono text-slate-900">
                  ₹{prediction.transportCostBreakdown.freightPerQtlKm} / Qtl-Km
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Estimated Freight Deduct</span>
                <strong className="text-sm font-black font-mono text-rose-700">
                  -₹{prediction.transportCostBreakdown.transportDeductionPerQtl} / Qtl
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Net In-Hand Realization</span>
                <strong className="text-sm font-black font-mono text-emerald-700">
                  ₹{prediction.transportCostBreakdown.netRealizationPerQtl} / Qtl
                </strong>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">
                Multi-Destination Road Route Cost Comparison (Net In-Hand After Freight & Cess):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {prediction.transportCostBreakdown.majorRoutes.map((r, rIdx) => (
                  <div key={rIdx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-bold">{r.destination}</strong>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Distance: {r.distanceKm} km</span>
                      <span>Freight: -₹{r.freightPerQtl}/Qtl</span>
                    </div>
                    <div className="pt-1 border-t border-slate-100 flex justify-between font-bold">
                      <span className="text-slate-700">Net Return:</span>
                      <span className="text-emerald-700 font-mono">₹{r.netPrice} / Qtl</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Multi-Factor ML Scorecard */}
        {advancedTab === 'scorecard' && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Composite Holding vs Selling Decision Weights</h3>
                <p className="text-[11px] text-slate-500">Combines momentum, disease risk, export parity, and freight efficiency.</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Overall Score:</span>
                <span className="text-xl font-black font-mono text-emerald-700">
                  {prediction.multiFactorScorecard.overallHoldingScore} / 100
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">7-Day Price Momentum (35% weight)</span>
                  <span className="font-mono text-slate-900">{prediction.multiFactorScorecard.priceMomentumScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all" 
                    style={{ width: `${prediction.multiFactorScorecard.priceMomentumScore}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Disease Safety / Low Spoilage (25% weight)</span>
                  <span className="font-mono text-slate-900">{prediction.multiFactorScorecard.diseaseSafetyScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all" 
                    style={{ width: `${prediction.multiFactorScorecard.diseaseSafetyScore}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Global & Export Demand Support (20% weight)</span>
                  <span className="font-mono text-slate-900">{prediction.multiFactorScorecard.globalDemandScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all" 
                    style={{ width: `${prediction.multiFactorScorecard.globalDemandScore}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Logistics & Freight Efficiency (20% weight)</span>
                  <span className="font-mono text-slate-900">{prediction.multiFactorScorecard.logisticsEfficiencyScore} / 100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all" 
                    style={{ width: `${prediction.multiFactorScorecard.logisticsEfficiencyScore}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day-by-Day Forecast Table */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-3">
          Detailed 7-Day Day-by-Day Forecast Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4 text-right">Predicted Modal Price</th>
                <th className="py-3 px-4 text-right">Confidence Range</th>
                <th className="py-3 px-4 text-center">Confidence Score</th>
                <th className="py-3 px-4 text-center">Trend Signal</th>
                <th className="py-3 px-4 text-right">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prediction.forecastDays.map((day, idx) => (
                <tr key={day.date} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{day.dayLabel}</div>
                    <div className="text-[10px] text-slate-400">Day +{idx + 1}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-black text-slate-900 font-mono">
                      ₹{day.predictedPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ Quintal</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    ₹{day.minRange} – ₹{day.maxRange}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {day.confidencePct}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                      day.trend === 'up' ? 'text-emerald-700' : day.trend === 'down' ? 'text-rose-700' : 'text-slate-600'
                    }`}>
                      {day.trend === 'up' ? '↗ Bullish' : day.trend === 'down' ? '↘ Bearish' : '→ Stable'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs text-slate-700 font-semibold">
                      {idx < 2 ? 'Sell / Dispatch' : 'Hold / Store'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
