import React, { useState, useMemo } from 'react';
import { StorageFacility } from '../types';
import { RAW_STORAGE_FACILITIES } from '../data/storageData';
import { calculateStorageProfit } from '../utils/profitCalculator';
import { 
  Snowflake, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Calculator, 
  ArrowRight, 
  AlertCircle,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface ColdStorageModuleProps {
  initialCrop?: string;
  onNavigateTab: (tab: ActiveTab, params?: any) => void;
}

export const ColdStorageModule: React.FC<ColdStorageModuleProps> = ({ initialCrop = 'Onion', onNavigateTab }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [lotQuantity, setLotQuantity] = useState<number>(120);
  const [storageWeeks, setStorageWeeks] = useState<number>(4);
  const [selectedFacilityForBooking, setSelectedFacilityForBooking] = useState<StorageFacility | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Baseline prices for calculation
  const cropPrices: Record<string, { current: number; projected: number; spoilagePct: number }> = {
    'Tomato': { current: 2600, projected: 2750, spoilagePct: 4.5 },
    'Onion': { current: 2320, projected: 2680, spoilagePct: 2.0 },
    'Potato': { current: 1580, projected: 1850, spoilagePct: 1.5 },
    'Wheat': { current: 2540, projected: 2710, spoilagePct: 0.5 },
    'Basmati Rice': { current: 4720, projected: 4980, spoilagePct: 0.5 },
    'Soybean': { current: 4710, projected: 4990, spoilagePct: 0.8 },
    'Cotton': { current: 7520, projected: 7800, spoilagePct: 0.2 },
    'Mustard': { current: 5680, projected: 5950, spoilagePct: 0.4 }
  };

  const currentCropPricing = cropPrices[selectedCrop] || { current: 2400, projected: 2650, spoilagePct: 2.0 };

  // Filter facilities that support the selected crop or show all
  const filteredFacilities = useMemo(() => {
    return RAW_STORAGE_FACILITIES.filter(f => 
      f.suitableCrops.some(c => c.toLowerCase().includes(selectedCrop.toLowerCase())) || true
    );
  }, [selectedCrop]);

  const handleBookFacility = (facility: StorageFacility) => {
    setSelectedFacilityForBooking(facility);
    setBookingSuccess(false);
  };

  const confirmBooking = () => {
    setBookingSuccess(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Snowflake className="w-5 h-5 text-emerald-600" />
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Cold Chain & Warehouse Optimization
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Nearby Cold Storage & Profit Optimizer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Find certified controlled-atmosphere warehouses, check real-time available capacity, and evaluate if storage rent beats price depreciation.
          </p>
        </div>

        {/* Global Lot Controls for Profit Evaluation */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Crop:</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              {Object.keys(cropPrices).map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Lot Quantity:</label>
            <div className="flex items-center">
              <input
                type="number"
                min="10"
                value={lotQuantity}
                onChange={(e) => setLotQuantity(Number(e.target.value))}
                className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 ml-1">Qtl</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Duration:</label>
            <select
              value={storageWeeks}
              onChange={(e) => setStorageWeeks(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value={2}>2 Weeks (14 Days)</option>
              <option value={4}>1 Month (4 Weeks)</option>
              <option value={8}>2 Months (8 Weeks)</option>
              <option value={12}>3 Months (12 Weeks)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => {
          // Calculate profit simulation for this specific facility
          const profitResult = calculateStorageProfit({
            crop: selectedCrop,
            quantityQtl: lotQuantity,
            currentPrice: currentCropPricing.current,
            futurePrice: currentCropPricing.projected,
            durationWeeks: storageWeeks,
            costPerQtlMonth: facility.costPerQtlMonth,
            handlingChargePerQtl: facility.handlingChargePerQtl,
            spoilagePct: currentCropPricing.spoilagePct,
            transportPerQtl: 30
          });

          const occupancyPct = Math.round(((facility.totalCapacityMt - facility.availableCapacityMt) / facility.totalCapacityMt) * 100);

          return (
            <div 
              key={facility.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Card Top Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 leading-snug">{facility.name}</span>
                        {facility.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Govt & FSSAI Verified Facility" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{facility.location}, {facility.state} ({facility.distanceKm} km away)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{facility.rating}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className="bg-sky-50 text-sky-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-sky-100">
                      Temp: {facility.tempRange}
                    </span>
                    {facility.humidityControl && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-100">
                        Controlled Atmosphere (CA)
                      </span>
                    )}
                  </div>
                </div>

                {/* Capacity & Pricing Metrics */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Capacity Occupancy:</span>
                      <span className="font-bold text-slate-800">
                        {facility.availableCapacityMt.toLocaleString('en-IN')} MT Available ({facility.totalCapacityMt.toLocaleString('en-IN')} MT Total)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${occupancyPct > 80 ? 'bg-amber-500' : 'bg-emerald-600'}`} 
                        style={{ width: `${occupancyPct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Monthly Rent</span>
                      <strong className="text-sm font-black text-slate-900 font-mono">₹{facility.costPerQtlMonth}</strong>
                      <span className="text-[10px] text-slate-400 block">/ Qtl / Month</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">In/Out Handling</span>
                      <strong className="text-sm font-black text-slate-900 font-mono">₹{facility.handlingChargePerQtl}</strong>
                      <span className="text-[10px] text-slate-400 block">/ Qtl one-time</span>
                    </div>
                  </div>

                  {/* AI Storage vs Sell Profit Evaluation */}
                  <div className={`rounded-xl p-3 border ${
                    profitResult.isProfitableToStore
                      ? 'bg-emerald-50/80 border-emerald-200'
                      : 'bg-rose-50/80 border-rose-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        {profitResult.isProfitableToStore ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-700" />
                        )}
                        <span className={profitResult.isProfitableToStore ? 'text-emerald-900' : 'text-rose-900'}>
                          {profitResult.isProfitableToStore ? 'High Storage Return' : 'Sell Immediately Warning'}
                        </span>
                      </span>

                      <span className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${
                        profitResult.isProfitableToStore
                          ? 'bg-emerald-200 text-emerald-950'
                          : 'bg-rose-200 text-rose-950'
                      }`}>
                        {profitResult.netProfitDiff >= 0 ? `+₹${profitResult.netProfitDiff.toLocaleString('en-IN')}` : `-₹${Math.abs(profitResult.netProfitDiff).toLocaleString('en-IN')}`}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-700 mt-1">
                      {profitResult.isProfitableToStore
                        ? `Storing ${lotQuantity} Qtl for ${storageWeeks} wks yields +₹${profitResult.netProfitDiff.toLocaleString('en-IN')} net gain above today's price after rent & handling.`
                        : `Storage cost (₹${profitResult.storageCostTotal}) exceeds projected price appreciation. Selling today yields better returns.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleBookFacility(facility)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Reserve Storage Space</span>
                </button>
                <a
                  href={`tel:${facility.phone}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-lg transition border border-slate-200"
                  title={`Call ${facility.name}`}
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking / Space Reservation Modal */}
      {selectedFacilityForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedFacilityForBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccess ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Reserve Cold Storage Space
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  {selectedFacilityForBooking.name} ({selectedFacilityForBooking.location})
                </p>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Crop to Store:</span>
                    <strong className="text-slate-800">{selectedCrop}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allocated Quantity:</span>
                    <strong className="text-slate-800">{lotQuantity} Quintals</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <strong className="text-slate-800">{storageWeeks} Weeks ({storageWeeks * 7} Days)</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-slate-500">Monthly Rent:</span>
                    <strong className="text-slate-800 font-mono">₹{selectedFacilityForBooking.costPerQtlMonth}/Qtl</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Total Storage Rent:</span>
                    <strong className="text-emerald-700 font-mono font-bold">
                      ₹{Math.round(lotQuantity * selectedFacilityForBooking.costPerQtlMonth * (storageWeeks / 4.33)).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Name</label>
                    <input 
                      type="text" 
                      defaultValue="Rameshwar Patil" 
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input 
                      type="tel" 
                      defaultValue="+91 98234 11209" 
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" 
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFacilityForBooking(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition shadow-sm"
                  >
                    Confirm Space Token
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Space Allocation Confirmed!</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Your electronic gate-in pass token has been generated. The warehouse supervisor has been notified for intake slot scheduling.
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 font-mono mb-5 text-left space-y-1">
                  <div><strong>Booking Token:</strong> CST-{Math.floor(100000 + Math.random() * 900000)}</div>
                  <div><strong>Facility:</strong> {selectedFacilityForBooking.name}</div>
                  <div><strong>Valid Until:</strong> 2026-09-08 (18:00 IST)</div>
                </div>

                <button
                  onClick={() => setSelectedFacilityForBooking(null)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
