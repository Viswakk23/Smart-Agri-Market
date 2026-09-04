export interface MandiRecord {
  id: string;
  crop: string;
  variety: string;
  state: string;
  mandi: string;
  date: string;
  arrivalQty: number; // in Quintals
  minPrice: number;   // ₹/Quintal
  maxPrice: number;   // ₹/Quintal
  modalPrice: number; // ₹/Quintal
  priceChange: number; // % change from yesterday
  distanceKm?: number; // distance from farmer's base
  transportCostPerQtl?: number; // estimated transport cost
}

export interface WeatherRecord {
  id: string;
  location: string;
  state: string;
  date: string;
  tempC: number;
  humidityPct: number;
  rainfallMm: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Heavy Rain' | 'Scattered Showers' | 'Foggy';
  windSpeedKmh: number;
  marketRiskImpact: 'Low' | 'Moderate' | 'High';
  advisory: string;
}

export interface StorageFacility {
  id: string;
  name: string;
  location: string;
  state: string;
  distanceKm: number;
  totalCapacityMt: number;
  availableCapacityMt: number;
  tempRange: string;
  humidityControl: boolean;
  costPerQtlMonth: number; // ₹
  handlingChargePerQtl: number; // ₹
  rating: number;
  reviewsCount: number;
  verified: boolean;
  phone: string;
  suitableCrops: string[];
}

export interface BuyerVerification {
  fssaiNumber: string;
  fssaiVerified: boolean;
  gstinNumber: string;
  gstinVerified: boolean;
  apedaNumber?: string;
  apedaVerified?: boolean;
  wdraCompliant: boolean;
  kycStatus: 'Verified' | 'Pending Audit' | 'Government Backed';
  verificationDate: string;
  tier: 'Enterprise Gold' | 'Tier-1 Processor' | 'Verified Institutional Buyer' | 'Export Hub';
}

export interface BuyerReview {
  id: string;
  buyerId: string;
  farmerName: string;
  farmerLocation: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  tradeCrop: string;
  quantityQtl: number;
  paymentPunctualityRating: number; // 1 to 5
  weighmentFairnessRating: number;  // 1 to 5
  qualityAcceptanceRating: number;  // 1 to 5
  verifiedTrade: boolean;
}

export interface BuyerRequirement {
  id: string;
  buyerName: string;
  company: string;
  category: 'Corporate Aggregator' | 'Supermarket Chain' | 'Food Processor' | 'Exporter' | 'Wholesale Trader';
  location: string;
  state: string;
  crop: string;
  variety: string;
  demandQty: number; // Quintals
  targetPrice: number; // ₹/Quintal
  paymentTerms: string;
  verified: boolean;
  rating: number;
  urgent: boolean;
  phone?: string;
  email?: string;
  annualVolumeMt?: number;
  escrowSuccessRatePct?: number;
  verificationDetails?: BuyerVerification;
  certificationsAccepted?: string[];
  reviewsCount?: number;
  reviews?: BuyerReview[];
}

export interface CropListing {
  id: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  variety: string;
  quantityQtl: number;
  expectedPrice: number;
  location: string;
  state: string;
  harvestDate: string;
  qualityGrade: 'Grade A+' | 'Grade A' | 'Grade B' | 'Export Grade';
  certifications?: string[]; // e.g. ['India Organic / NPOP', 'GlobalGAP', 'FSSAI']
  moisturePct: number;
  storageType: 'On Farm (Ambient)' | 'Cold Storage' | 'Packhouse';
  status: 'Available' | 'Negotiating' | 'Sold';
  offersCount: number;
}

export interface PredictionDay {
  date: string;
  dayLabel: string;
  predictedPrice: number;
  minRange: number;
  maxRange: number;
  confidencePct: number;
  trend: 'up' | 'down' | 'steady';
}

export interface GlobalTrendFactor {
  indexName: string;
  priceParity: string;
  exportDemand: 'High' | 'Moderate' | 'Low' | 'Restricted';
  policyTariff: string;
  trendSignal: 'Bullish' | 'Neutral' | 'Bearish';
  summary: string;
}

export interface CropDiseasePrediction {
  diseaseName: string;
  pathogen: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScorePct: number;
  favorableConditions: string;
  estimatedYieldOrQualityLossPct: number;
  preventiveAction: string;
}

export interface TransportCostBreakdown {
  dieselPricePerLiter: number;
  freightPerQtlKm: number;
  avgDistanceKm: number;
  transportDeductionPerQtl: number;
  tollCessPerQtl: number;
  netRealizationPerQtl: number;
  majorRoutes: { destination: string; distanceKm: number; freightPerQtl: number; netPrice: number }[];
}

export interface MultiFactorScorecard {
  priceMomentumScore: number; // 0-100
  diseaseSafetyScore: number; // 0-100 (100 = low disease risk, safe to hold)
  globalDemandScore: number;  // 0-100
  logisticsEfficiencyScore: number; // 0-100
  overallHoldingScore: number; // 0-100 (>55 suggests hold/store, <45 suggests sell immediately)
}

export interface CropPredictionResult {
  crop: string;
  mandi: string;
  currentPrice: number;
  predictedPrice3Days: number;
  predictedPrice7Days: number;
  projectedChangePct: number;
  trendDirection: 'Bullish' | 'Bearish' | 'Neutral';
  confidenceScore: number;
  historicalDays: { date: string; price: number; arrivals: number }[];
  forecastDays: PredictionDay[];
  keyFactors: {
    factor: string;
    impact: string;
    description: string;
    positive: boolean;
  }[];
  recommendation: 'SELL_NOW' | 'STORE_AND_SELL' | 'WAIT_SHORT_TERM';
  recommendationSummary: string;
  // Advanced ML Enriched Modules
  globalTrends: GlobalTrendFactor;
  diseasePrediction: CropDiseasePrediction;
  transportCostBreakdown: TransportCostBreakdown;
  multiFactorScorecard: MultiFactorScorecard;
}

export interface RealtimeWeatherFeed {
  location: string;
  state: string;
  temperatureC: number;
  humidityPct: number;
  rainfallMm: number;
  windSpeedKmh: number;
  soilMoisturePct: number;
  condition: string;
  source: string;
  syncedAt: string;
  advisory: string;
  marketRiskImpact: 'Low' | 'Moderate' | 'High';
}

export type LiveWeatherFeed = RealtimeWeatherFeed;

export interface LiveMandiTick {
  mandi: string;
  crop: string;
  modalPrice: number;
  priceSpread: string;
  volumeQtl: number;
  trend: 'up' | 'down' | 'stable';
}

export interface StorageCalculationResult {
  currentPrice: number;
  futurePrice: number;
  quantityQtl: number;
  durationWeeks: number;
  grossRevenueToday: number;
  grossRevenueFuture: number;
  storageCostTotal: number;
  handlingCostTotal: number;
  spoilageLossQtl: number;
  spoilageLossCost: number;
  netRevenueToday: number;
  netRevenueFuture: number;
  netProfitDiff: number; // Future net - Today net
  netProfitDiffPct: number;
  isProfitableToStore: boolean;
  breakevenPrice: number;
  recommendationAction: 'STORE_AND_SELL' | 'SELL_IMMEDIATELY';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  dataCard?: {
    type: 'price_forecast' | 'storage_comparison' | 'mandi_alert';
    title: string;
    details: Record<string, string | number>;
  };
}
