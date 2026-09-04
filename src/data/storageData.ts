import { StorageFacility } from '../types';

export const RAW_STORAGE_FACILITIES: StorageFacility[] = [
  {
    id: 'STR-001',
    name: 'MahaAgro Controlled Atmosphere Cold Hub',
    location: 'Dindori Road, Nashik',
    state: 'Maharashtra',
    distanceKm: 18,
    totalCapacityMt: 12000,
    availableCapacityMt: 3450,
    tempRange: '0°C to 4°C',
    humidityControl: true,
    costPerQtlMonth: 75,
    handlingChargePerQtl: 20,
    rating: 4.8,
    reviewsCount: 142,
    verified: true,
    phone: '+91 98220 44123',
    suitableCrops: ['Onion', 'Grapes', 'Pomegranate', 'Tomato']
  },
  {
    id: 'STR-002',
    name: 'Kisan Fresh Cold Logistics & Warehousing',
    location: 'NH-75, Kolar Industrial Area',
    state: 'Karnataka',
    distanceKm: 14,
    totalCapacityMt: 8500,
    availableCapacityMt: 1900,
    tempRange: '4°C to 12°C',
    humidityControl: true,
    costPerQtlMonth: 85,
    handlingChargePerQtl: 25,
    rating: 4.6,
    reviewsCount: 98,
    verified: true,
    phone: '+91 97410 88290',
    suitableCrops: ['Tomato', 'Capsicum', 'Mango', 'Green Chillies']
  },
  {
    id: 'STR-003',
    name: 'Shree Ram Mega Agro Cold Storage',
    location: 'Khandari, Agra',
    state: 'Uttar Pradesh',
    distanceKm: 24,
    totalCapacityMt: 25000,
    availableCapacityMt: 6800,
    tempRange: '2°C to 4°C',
    humidityControl: true,
    costPerQtlMonth: 60,
    handlingChargePerQtl: 15,
    rating: 4.9,
    reviewsCount: 310,
    verified: true,
    phone: '+91 94120 77319',
    suitableCrops: ['Potato', 'Carrot', 'Garlic']
  },
  {
    id: 'STR-004',
    name: 'Punjab Agri Logistics Dry & Cold Terminal',
    location: 'GT Road, Khanna Bypass',
    state: 'Punjab',
    distanceKm: 12,
    totalCapacityMt: 18000,
    availableCapacityMt: 4200,
    tempRange: '10°C to 15°C (Climate Dry)',
    humidityControl: false,
    costPerQtlMonth: 45,
    handlingChargePerQtl: 12,
    rating: 4.7,
    reviewsCount: 185,
    verified: true,
    phone: '+91 98140 33812',
    suitableCrops: ['Wheat', 'Basmati Rice', 'Maize', 'Mustard']
  },
  {
    id: 'STR-005',
    name: 'Vashi Cold Chain & Export Pre-Cooling Hub',
    location: 'Turbhe MIDC, Navi Mumbai',
    state: 'Maharashtra',
    distanceKm: 42,
    totalCapacityMt: 15000,
    availableCapacityMt: 2100,
    tempRange: '-2°C to 8°C',
    humidityControl: true,
    costPerQtlMonth: 110,
    handlingChargePerQtl: 30,
    rating: 4.9,
    reviewsCount: 220,
    verified: true,
    phone: '+91 98201 99401',
    suitableCrops: ['Tomato', 'Onion', 'Exotic Vegetables', 'Fruits']
  },
  {
    id: 'STR-006',
    name: 'Malwa Agri Vault Silos & Cold Rooms',
    location: 'Sanwer Road, Indore',
    state: 'Madhya Pradesh',
    distanceKm: 22,
    totalCapacityMt: 14000,
    availableCapacityMt: 5100,
    tempRange: '5°C to 12°C',
    humidityControl: true,
    costPerQtlMonth: 55,
    handlingChargePerQtl: 18,
    rating: 4.5,
    reviewsCount: 114,
    verified: true,
    phone: '+91 98930 66254',
    suitableCrops: ['Soybean', 'Wheat', 'Garlic', 'Potato']
  }
];

export function generateStorageCSV(): string {
  const headers = ['id', 'name', 'location', 'state', 'distance_km', 'total_capacity_mt', 'available_capacity_mt', 'temp_range', 'humidity_control', 'cost_per_qtl_month', 'handling_charge_per_qtl', 'rating', 'phone', 'suitable_crops'];
  const rows = RAW_STORAGE_FACILITIES.map(f => 
    [f.id, `"${f.name}"`, `"${f.location}"`, `"${f.state}"`, f.distanceKm, f.totalCapacityMt, f.availableCapacityMt, `"${f.tempRange}"`, f.humidityControl, f.costPerQtlMonth, f.handlingChargePerQtl, f.rating, `"${f.phone}"`, `"${f.suitableCrops.join(';')}"`].join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}
