import { StorageCalculationResult } from '../types';

export interface ProfitSimulationParams {
  crop: string;
  quantityQtl: number;
  currentPrice: number;
  futurePrice: number;
  durationWeeks: number;
  costPerQtlMonth: number;
  handlingChargePerQtl: number;
  spoilagePct: number;
  transportPerQtl?: number;
}

export function calculateStorageProfit(params: ProfitSimulationParams): StorageCalculationResult {
  const {
    quantityQtl,
    currentPrice,
    futurePrice,
    durationWeeks,
    costPerQtlMonth,
    handlingChargePerQtl,
    spoilagePct,
    transportPerQtl = 30
  } = params;

  // 1. Sell Today
  const grossRevenueToday = Math.round(quantityQtl * currentPrice);
  const transportToday = Math.round(quantityQtl * transportPerQtl);
  const netRevenueToday = grossRevenueToday - transportToday;

  // 2. Store & Sell Later
  const months = durationWeeks / 4.33;
  const storageCostTotal = Math.round(quantityQtl * costPerQtlMonth * months);
  const handlingCostTotal = Math.round(quantityQtl * handlingChargePerQtl);

  const spoilageLossQtl = Number(((quantityQtl * spoilagePct) / 100).toFixed(2));
  const saleableQuantityQtl = Math.max(0, quantityQtl - spoilageLossQtl);
  const spoilageLossCost = Math.round(spoilageLossQtl * futurePrice);

  const grossRevenueFuture = Math.round(saleableQuantityQtl * futurePrice);
  const transportFuture = Math.round(saleableQuantityQtl * transportPerQtl);
  const netRevenueFuture = grossRevenueFuture - storageCostTotal - handlingCostTotal - transportFuture;

  const netProfitDiff = netRevenueFuture - netRevenueToday;
  const netProfitDiffPct = Number(((netProfitDiff / netRevenueToday) * 100).toFixed(1));

  // Breakeven price calculation:
  // (SaleableQty * P_breakeven) - storage - handling - transportFuture = netRevenueToday
  // P_breakeven = (netRevenueToday + storage + handling + transportFuture) / SaleableQty
  const breakevenPrice = saleableQuantityQtl > 0 
    ? Math.round((netRevenueToday + storageCostTotal + handlingCostTotal + transportFuture) / saleableQuantityQtl)
    : 0;

  const isProfitableToStore = netProfitDiff > 0;
  const recommendationAction = isProfitableToStore ? 'STORE_AND_SELL' : 'SELL_IMMEDIATELY';

  return {
    currentPrice,
    futurePrice,
    quantityQtl,
    durationWeeks,
    grossRevenueToday,
    grossRevenueFuture,
    storageCostTotal,
    handlingCostTotal,
    spoilageLossQtl,
    spoilageLossCost,
    netRevenueToday,
    netRevenueFuture,
    netProfitDiff,
    netProfitDiffPct,
    isProfitableToStore,
    breakevenPrice,
    recommendationAction
  };
}
