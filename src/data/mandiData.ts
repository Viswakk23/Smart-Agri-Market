import { MandiRecord } from '../types';

export const RAW_MANDI_RECORDS: MandiRecord[] = [
  // Tomato Records
  {
    id: 'MND-TOM-01',
    crop: 'Tomato',
    variety: 'Hybrid Desi',
    state: 'Karnataka',
    mandi: 'Kolar Mandi',
    date: '2026-09-04',
    arrivalQty: 1850,
    minPrice: 2200,
    maxPrice: 2850,
    modalPrice: 2600,
    priceChange: 4.8,
    distanceKm: 28,
    transportCostPerQtl: 45
  },
  {
    id: 'MND-TOM-02',
    crop: 'Tomato',
    variety: 'Hybrid Roma',
    state: 'Maharashtra',
    mandi: 'Nashik Mandi (Pimpalgaon)',
    date: '2026-09-04',
    arrivalQty: 2400,
    minPrice: 2100,
    maxPrice: 2700,
    modalPrice: 2480,
    priceChange: -2.3,
    distanceKm: 95,
    transportCostPerQtl: 110
  },
  {
    id: 'MND-TOM-03',
    crop: 'Tomato',
    variety: 'Local Hybrid',
    state: 'Delhi',
    mandi: 'Azadpur APMC',
    date: '2026-09-04',
    arrivalQty: 3200,
    minPrice: 2700,
    maxPrice: 3400,
    modalPrice: 3100,
    priceChange: 6.2,
    distanceKm: 180,
    transportCostPerQtl: 195
  },
  {
    id: 'MND-TOM-04',
    crop: 'Tomato',
    variety: 'Hybrid Desi',
    state: 'Maharashtra',
    mandi: 'Vashi APMC (Navi Mumbai)',
    date: '2026-09-04',
    arrivalQty: 1950,
    minPrice: 2500,
    maxPrice: 3200,
    modalPrice: 2950,
    priceChange: 3.5,
    distanceKm: 140,
    transportCostPerQtl: 155
  },

  // Onion Records
  {
    id: 'MND-ONI-01',
    crop: 'Onion',
    variety: 'Red Garva',
    state: 'Maharashtra',
    mandi: 'Lasalgaon Mandi',
    date: '2026-09-04',
    arrivalQty: 4800,
    minPrice: 1950,
    maxPrice: 2550,
    modalPrice: 2320,
    priceChange: -1.2,
    distanceKm: 42,
    transportCostPerQtl: 60
  },
  {
    id: 'MND-ONI-02',
    crop: 'Onion',
    variety: 'Red Medium',
    state: 'Maharashtra',
    mandi: 'Nashik Mandi',
    date: '2026-09-04',
    arrivalQty: 3900,
    minPrice: 2000,
    maxPrice: 2600,
    modalPrice: 2380,
    priceChange: 1.5,
    distanceKm: 75,
    transportCostPerQtl: 90
  },
  {
    id: 'MND-ONI-03',
    crop: 'Onion',
    variety: 'Red Large',
    state: 'Delhi',
    mandi: 'Azadpur APMC',
    date: '2026-09-04',
    arrivalQty: 4100,
    minPrice: 2500,
    maxPrice: 3150,
    modalPrice: 2890,
    priceChange: 4.1,
    distanceKm: 190,
    transportCostPerQtl: 210
  },
  {
    id: 'MND-ONI-04',
    crop: 'Onion',
    variety: 'Gulabi',
    state: 'Madhya Pradesh',
    mandi: 'Indore Mandi',
    date: '2026-09-04',
    arrivalQty: 2600,
    minPrice: 1850,
    maxPrice: 2400,
    modalPrice: 2180,
    priceChange: -3.0,
    distanceKm: 130,
    transportCostPerQtl: 140
  },

  // Potato Records
  {
    id: 'MND-POT-01',
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    state: 'Uttar Pradesh',
    mandi: 'Agra Mandi',
    date: '2026-09-04',
    arrivalQty: 5200,
    minPrice: 1350,
    maxPrice: 1750,
    modalPrice: 1580,
    priceChange: 0.8,
    distanceKm: 55,
    transportCostPerQtl: 70
  },
  {
    id: 'MND-POT-02',
    crop: 'Potato',
    variety: 'Kufri Pukhraj',
    state: 'Punjab',
    mandi: 'Jalandhar Mandi',
    date: '2026-09-04',
    arrivalQty: 3800,
    minPrice: 1280,
    maxPrice: 1650,
    modalPrice: 1490,
    priceChange: -1.5,
    distanceKm: 110,
    transportCostPerQtl: 125
  },
  {
    id: 'MND-POT-03',
    crop: 'Potato',
    variety: 'Kufri Chandramukhi',
    state: 'West Bengal',
    mandi: 'Hooghly Mandi',
    date: '2026-09-04',
    arrivalQty: 4400,
    minPrice: 1420,
    maxPrice: 1800,
    modalPrice: 1640,
    priceChange: 2.1,
    distanceKm: 160,
    transportCostPerQtl: 175
  },

  // Wheat Records
  {
    id: 'MND-WHT-01',
    crop: 'Wheat',
    variety: 'Sharbati A-Grade',
    state: 'Madhya Pradesh',
    mandi: 'Sehore Mandi',
    date: '2026-09-04',
    arrivalQty: 3100,
    minPrice: 2850,
    maxPrice: 3450,
    modalPrice: 3220,
    priceChange: 1.2,
    distanceKm: 35,
    transportCostPerQtl: 50
  },
  {
    id: 'MND-WHT-02',
    crop: 'Wheat',
    variety: 'HD-2967 (Mill Quality)',
    state: 'Punjab',
    mandi: 'Khanna Mandi',
    date: '2026-09-04',
    arrivalQty: 6200,
    minPrice: 2425,
    maxPrice: 2650,
    modalPrice: 2540,
    priceChange: 0.5,
    distanceKm: 65,
    transportCostPerQtl: 75
  },
  {
    id: 'MND-WHT-03',
    crop: 'Wheat',
    variety: 'Lokwan',
    state: 'Gujarat',
    mandi: 'Rajkot APMC',
    date: '2026-09-04',
    arrivalQty: 2900,
    minPrice: 2600,
    maxPrice: 3100,
    modalPrice: 2880,
    priceChange: 1.8,
    distanceKm: 145,
    transportCostPerQtl: 160
  },

  // Basmati Rice Records
  {
    id: 'MND-RCE-01',
    crop: 'Basmati Rice',
    variety: 'Pusa 1121 Paddy',
    state: 'Haryana',
    mandi: 'Karnal Grain Market',
    date: '2026-09-04',
    arrivalQty: 2800,
    minPrice: 4350,
    maxPrice: 4950,
    modalPrice: 4720,
    priceChange: 3.2,
    distanceKm: 48,
    transportCostPerQtl: 65
  },
  {
    id: 'MND-RCE-02',
    crop: 'Basmati Rice',
    variety: '1509 Basmati',
    state: 'Punjab',
    mandi: 'Amritsar Mandi',
    date: '2026-09-04',
    arrivalQty: 3400,
    minPrice: 3900,
    maxPrice: 4450,
    modalPrice: 4250,
    priceChange: 2.1,
    distanceKm: 120,
    transportCostPerQtl: 135
  },

  // Soybean Records
  {
    id: 'MND-SOY-01',
    crop: 'Soybean',
    variety: 'Yellow Standard (JS 9560)',
    state: 'Madhya Pradesh',
    mandi: 'Indore APMC',
    date: '2026-09-04',
    arrivalQty: 4100,
    minPrice: 4400,
    maxPrice: 4900,
    modalPrice: 4710,
    priceChange: -1.1,
    distanceKm: 40,
    transportCostPerQtl: 55
  },
  {
    id: 'MND-SOY-02',
    crop: 'Soybean',
    variety: 'Yellow Standard',
    state: 'Maharashtra',
    mandi: 'Latur Mandi',
    date: '2026-09-04',
    arrivalQty: 3600,
    minPrice: 4500,
    maxPrice: 4980,
    modalPrice: 4790,
    priceChange: 1.4,
    distanceKm: 85,
    transportCostPerQtl: 95
  },

  // Cotton Records
  {
    id: 'MND-COT-01',
    crop: 'Cotton',
    variety: 'Shankar-6 (Medium Staple)',
    state: 'Gujarat',
    mandi: 'Rajkot APMC',
    date: '2026-09-04',
    arrivalQty: 2100,
    minPrice: 7100,
    maxPrice: 7850,
    modalPrice: 7520,
    priceChange: 2.4,
    distanceKm: 50,
    transportCostPerQtl: 70
  },
  {
    id: 'MND-COT-02',
    crop: 'Cotton',
    variety: 'Bunny BT',
    state: 'Telangana',
    mandi: 'Warangal Cotton Yard',
    date: '2026-09-04',
    arrivalQty: 1850,
    minPrice: 6950,
    maxPrice: 7600,
    modalPrice: 7340,
    priceChange: 0.9,
    distanceKm: 110,
    transportCostPerQtl: 130
  },

  // Mustard Records
  {
    id: 'MND-MUS-01',
    crop: 'Mustard',
    variety: 'Black Bold (42% Oil)',
    state: 'Rajasthan',
    mandi: 'Alwar Mandi',
    date: '2026-09-04',
    arrivalQty: 2900,
    minPrice: 5350,
    maxPrice: 5900,
    modalPrice: 5680,
    priceChange: 1.6,
    distanceKm: 45,
    transportCostPerQtl: 60
  },
  {
    id: 'MND-MUS-02',
    crop: 'Mustard',
    variety: 'Pusa Bold',
    state: 'Haryana',
    mandi: 'Rewari Mandi',
    date: '2026-09-04',
    arrivalQty: 2300,
    minPrice: 5250,
    maxPrice: 5800,
    modalPrice: 5590,
    priceChange: -0.4,
    distanceKm: 90,
    transportCostPerQtl: 105
  }
];

// Historical 30-day time series data generator for simulation & ML models
export function getHistoricalTimeSeries(cropName: string): { date: string; price: number; arrivals: number }[] {
  const basePrices: Record<string, number> = {
    'Tomato': 2100,
    'Onion': 2050,
    'Potato': 1420,
    'Wheat': 2480,
    'Basmati Rice': 4300,
    'Soybean': 4550,
    'Cotton': 7100,
    'Mustard': 5350
  };

  const basePrice = basePrices[cropName] || 2500;
  const history: { date: string; price: number; arrivals: number }[] = [];

  const today = new Date(2026, 8, 4); // 2026-09-04

  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Seeded wave pattern + slight upward trend
    const cycle = Math.sin((30 - i) * 0.35) * (basePrice * 0.08);
    const noise = (Math.cos((30 - i) * 1.1) * 0.03 + (30 - i) * 0.003) * basePrice;
    const price = Math.round(basePrice + cycle + noise);
    const arrivals = Math.round(2500 + Math.cos((30 - i) * 0.4) * 800 + ((30 - i) % 7 === 0 ? -900 : 200));

    history.push({
      date: dateStr,
      price,
      arrivals
    });
  }

  return history;
}

export function generateMandiCSV(): string {
  const headers = ['id', 'crop', 'variety', 'state', 'mandi', 'date', 'arrival_qty_qtl', 'min_price', 'max_price', 'modal_price', 'price_change_pct'];
  const rows = RAW_MANDI_RECORDS.map(r => 
    [r.id, `"${r.crop}"`, `"${r.variety}"`, `"${r.state}"`, `"${r.mandi}"`, r.date, r.arrivalQty, r.minPrice, r.maxPrice, r.modalPrice, r.priceChange].join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}
