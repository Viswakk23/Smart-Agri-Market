import { WeatherRecord } from '../types';

export const RAW_WEATHER_RECORDS: WeatherRecord[] = [
  {
    id: 'WTH-01',
    location: 'Kolar & Chikkaballapur',
    state: 'Karnataka',
    date: '2026-09-04',
    tempC: 28,
    humidityPct: 78,
    rainfallMm: 35,
    condition: 'Heavy Rain',
    windSpeedKmh: 18,
    marketRiskImpact: 'High',
    advisory: 'Heavy rainfall warning in tomato belt. Mandi arrivals likely disrupted for 48 hours. Expect short-term price surge (+8-12%). Expedite covered dispatch.'
  },
  {
    id: 'WTH-02',
    location: 'Nashik & Lasalgaon',
    state: 'Maharashtra',
    date: '2026-09-04',
    tempC: 31,
    humidityPct: 62,
    rainfallMm: 4,
    condition: 'Partly Cloudy',
    windSpeedKmh: 12,
    marketRiskImpact: 'Low',
    advisory: 'Favorable harvesting conditions for Kharif onion nursery & early harvest. Mandi operations running at peak capacity.'
  },
  {
    id: 'WTH-03',
    location: 'Azadpur / Delhi NCR',
    state: 'Delhi',
    date: '2026-09-04',
    tempC: 34,
    humidityPct: 68,
    rainfallMm: 0,
    condition: 'Sunny',
    windSpeedKmh: 9,
    marketRiskImpact: 'Low',
    advisory: 'High retail consumer demand. Steady inward freight arrivals from Punjab and Rajasthan.'
  },
  {
    id: 'WTH-04',
    location: 'Khanna & Ludhiana',
    state: 'Punjab',
    date: '2026-09-04',
    tempC: 32,
    humidityPct: 70,
    rainfallMm: 12,
    condition: 'Scattered Showers',
    windSpeedKmh: 14,
    marketRiskImpact: 'Moderate',
    advisory: 'Intermittent showers. Farmers advised to ensure tarpaulin coverage during paddy and grain transport.'
  },
  {
    id: 'WTH-05',
    location: 'Indore & Malwa Belt',
    state: 'Madhya Pradesh',
    date: '2026-09-04',
    tempC: 29,
    humidityPct: 82,
    rainfallMm: 22,
    condition: 'Scattered Showers',
    windSpeedKmh: 16,
    marketRiskImpact: 'Moderate',
    advisory: 'Moisture levels elevated. Check soybean pods before bagging to avoid mandi moisture dockage deductions.'
  },
  {
    id: 'WTH-06',
    location: 'Agra & Western UP',
    state: 'Uttar Pradesh',
    date: '2026-09-04',
    tempC: 33,
    humidityPct: 65,
    rainfallMm: 2,
    condition: 'Sunny',
    windSpeedKmh: 10,
    marketRiskImpact: 'Low',
    advisory: 'Dry conditions suitable for potato cold-storage unstocking and dispatch to eastern states.'
  },
  {
    id: 'WTH-07',
    location: 'Rajkot & Saurashtra',
    state: 'Gujarat',
    date: '2026-09-04',
    tempC: 32,
    humidityPct: 60,
    rainfallMm: 0,
    condition: 'Sunny',
    windSpeedKmh: 15,
    marketRiskImpact: 'Low',
    advisory: 'Excellent clear weather. Cotton ginning yards operating without weather disruptions.'
  }
];

export function generateWeatherCSV(): string {
  const headers = ['id', 'location', 'state', 'date', 'temp_c', 'humidity_pct', 'rainfall_mm', 'condition', 'wind_speed_kmh', 'risk_impact', 'advisory'];
  const rows = RAW_WEATHER_RECORDS.map(r => 
    [r.id, `"${r.location}"`, `"${r.state}"`, r.date, r.tempC, r.humidityPct, r.rainfallMm, `"${r.condition}"`, r.windSpeedKmh, `"${r.marketRiskImpact}"`, `"${r.advisory}"`].join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}
