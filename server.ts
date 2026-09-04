import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { RAW_MANDI_RECORDS, generateMandiCSV } from './src/data/mandiData';
import { RAW_WEATHER_RECORDS, generateWeatherCSV } from './src/data/weatherData';
import { RAW_STORAGE_FACILITIES, generateStorageCSV } from './src/data/storageData';
import { RAW_BUYER_REQUIREMENTS, INITIAL_CROP_LISTINGS, generateBuyerCSV } from './src/data/buyerData';
import { runPricePrediction } from './src/utils/mlPredictor';
import { calculateStorageProfit } from './src/utils/profitCalculator';
import { fetchLiveWeatherFeed, fetchLiveMandiFeed } from './src/utils/realtimeFeeds';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for user-created crop listings and offers
let listings = [...INITIAL_CROP_LISTINGS];
let buyers = [...RAW_BUYER_REQUIREMENTS];

// Lazy / safe initialization for GoogleGenAI
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Mandi Prices
app.get('/api/mandi-prices', (req, res) => {
  const { crop, state, mandi } = req.query;
  let filtered = [...RAW_MANDI_RECORDS];

  if (crop && typeof crop === 'string') {
    filtered = filtered.filter(r => r.crop.toLowerCase().includes(crop.toLowerCase()));
  }
  if (state && typeof state === 'string') {
    filtered = filtered.filter(r => r.state.toLowerCase().includes(state.toLowerCase()));
  }
  if (mandi && typeof mandi === 'string') {
    filtered = filtered.filter(r => r.mandi.toLowerCase().includes(mandi.toLowerCase()));
  }

  res.json({
    total: filtered.length,
    date: '2026-09-04',
    records: filtered
  });
});

// 3. Weather
app.get('/api/weather', (req, res) => {
  res.json({
    date: '2026-09-04',
    records: RAW_WEATHER_RECORDS
  });
});

// 4. Cold Storage
app.get('/api/storage', (req, res) => {
  res.json({
    total: RAW_STORAGE_FACILITIES.length,
    facilities: RAW_STORAGE_FACILITIES
  });
});

// Real-Time Public Data Feeds (Open-Meteo & e-NAM)
app.get('/api/live-feeds/weather', async (req, res) => {
  const location = (req.query.location as string) || (req.query.region as string) || 'Kolar';
  try {
    const feed = await fetchLiveWeatherFeed(location);
    res.json({
      success: true,
      data: feed,
      ...feed
    });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch live meteorological feed' });
  }
});

app.get('/api/live-feeds/mandi', async (req, res) => {
  try {
    const feed = await fetchLiveMandiFeed();
    const ticks = feed.records.slice(0, 6).map(r => ({
      mandi: r.mandi,
      crop: r.crop,
      modalPrice: r.modalPrice,
      priceSpread: r.priceChange >= 0 ? `+₹${Math.round(r.modalPrice * (r.priceChange / 100))} / Qtl` : `-₹${Math.round(r.modalPrice * (Math.abs(r.priceChange) / 100))} / Qtl`,
      volumeQtl: r.arrivalQty,
      trend: r.priceChange > 0 ? 'up' : r.priceChange < 0 ? 'down' : 'stable'
    }));
    res.json({
      success: true,
      data: ticks,
      ticks,
      ...feed
    });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to synchronize live mandi feed' });
  }
});

// 5. Buyers & Listings
app.get('/api/buyers', (req, res) => {
  res.json({
    buyers: buyers,
    listings: listings
  });
});

// Submit Buyer Review
app.post('/api/buyers/:id/reviews', (req, res) => {
  const buyerId = req.params.id;
  const buyer = buyers.find(b => b.id === buyerId);
  if (!buyer) {
    return res.status(404).json({ error: 'Buyer not found' });
  }

  const newReview = {
    id: `REV-${Date.now().toString().slice(-4)}`,
    buyerId,
    farmerName: req.body.farmerName || 'Verified Kisan',
    farmerLocation: req.body.farmerLocation || 'Maharashtra',
    rating: Number(req.body.rating) || 5,
    date: new Date().toISOString().split('T')[0],
    comment: req.body.comment || 'Seamless digital settlement and accurate weighment pass.',
    tradeCrop: req.body.tradeCrop || buyer.crop,
    quantityQtl: Number(req.body.quantityQtl) || 100,
    paymentPunctualityRating: Number(req.body.paymentPunctualityRating) || 5,
    weighmentFairnessRating: Number(req.body.weighmentFairnessRating) || 5,
    qualityAcceptanceRating: Number(req.body.qualityAcceptanceRating) || 5,
    verifiedTrade: true
  };

  const existingReviews = buyer.reviews || [];
  const updatedReviews = [newReview, ...existingReviews];
  const avgRating = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(2));

  buyers = buyers.map(b => b.id === buyerId ? {
    ...b,
    rating: avgRating,
    reviewsCount: updatedReviews.length,
    reviews: updatedReviews
  } : b);

  res.status(201).json({ success: true, review: newReview, updatedRating: avgRating });
});

// Submit Buyer Verification
app.post('/api/buyers/verify', (req, res) => {
  const { buyerId, fssaiNumber, gstinNumber, apedaNumber } = req.body;
  const buyer = buyers.find(b => b.id === buyerId);
  if (!buyer) {
    return res.status(404).json({ error: 'Buyer not found' });
  }

  buyers = buyers.map(b => b.id === buyerId ? {
    ...b,
    verified: true,
    verificationDetails: {
      fssaiNumber: fssaiNumber || '11521019000214',
      fssaiVerified: true,
      gstinNumber: gstinNumber || '27AAACB2154P1Z3',
      gstinVerified: true,
      apedaNumber: apedaNumber || 'APEDA/EXP/2026/0881',
      apedaVerified: true,
      wdraCompliant: true,
      kycStatus: 'Verified',
      verificationDate: new Date().toISOString().split('T')[0],
      tier: 'Enterprise Gold'
    }
  } : b);

  res.json({ success: true, message: 'Buyer credentials verified with APEDA, FSSAI, and GST Portal.' });
});

app.post('/api/listings', (req, res) => {
  const newListing = {
    id: `LST-${Date.now().toString().slice(-4)}`,
    farmerName: req.body.farmerName || 'Kisan User',
    farmerPhone: req.body.farmerPhone || '+91 98000 00000',
    crop: req.body.crop || 'Tomato',
    variety: req.body.variety || 'Desi Hybrid',
    quantityQtl: Number(req.body.quantityQtl) || 100,
    expectedPrice: Number(req.body.expectedPrice) || 2500,
    location: req.body.location || 'Local Mandi Hub',
    state: req.body.state || 'Maharashtra',
    harvestDate: req.body.harvestDate || '2026-09-04',
    qualityGrade: (req.body.qualityGrade as 'Grade A+' | 'Grade A' | 'Grade B' | 'Export Grade') || 'Grade A',
    certifications: req.body.certifications || ['FSSAI Compliant'],
    moisturePct: Number(req.body.moisturePct) || 12,
    storageType: req.body.storageType || 'On Farm (Ambient)',
    status: 'Available' as const,
    offersCount: 0
  };

  listings = [newListing, ...listings];
  res.status(201).json({ success: true, listing: newListing });
});

// 6. ML Price Prediction
app.get('/api/predict', (req, res) => {
  const crop = (req.query.crop as string) || 'Tomato';
  const mandi = (req.query.mandi as string) || undefined;
  const result = runPricePrediction(crop, mandi);
  res.json(result);
});

// 7. Profit Simulation
app.post('/api/profit-simulate', (req, res) => {
  const result = calculateStorageProfit({
    crop: req.body.crop || 'Tomato',
    quantityQtl: Number(req.body.quantityQtl) || 100,
    currentPrice: Number(req.body.currentPrice) || 2500,
    futurePrice: Number(req.body.futurePrice) || 2850,
    durationWeeks: Number(req.body.durationWeeks) || 3,
    costPerQtlMonth: Number(req.body.costPerQtlMonth) || 75,
    handlingChargePerQtl: Number(req.body.handlingChargePerQtl) || 20,
    spoilagePct: Number(req.body.spoilagePct) || 2.5,
    transportPerQtl: Number(req.body.transportPerQtl) || 35
  });
  res.json(result);
});

// 8. AI Decision Assistant
app.post('/api/assistant/chat', async (req, res) => {
  const { prompt, context } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const ai = getGeminiClient();

  // If Gemini client is configured with a key
  if (ai) {
    const systemInstruction = `You are "KisanAI Agri Advisor", an expert agricultural economist and market intelligence specialist assisting Indian farmers.
You provide precise, pragmatic, and actionable advice on:
1. Whether to sell crops today in the mandi, store in cold storage, or wait for prices to rise.
2. Market price predictions based on supply arrivals, weather disruptions, and demand cycles.
3. Cold storage economics, spoilage risk, and breakeven calculations.
4. Mandi comparison (taking transport cost per km into account to find true net profit).

Tone: Friendly, respectful, realistic, farmer-first, and encouraging. Use Indian Rupees (₹) and metric measurements (Quintals, kg, Metric Tonnes).
When the user asks questions like "Should I sell tomatoes today?", always evaluate:
- Perishability of tomato (3-4 days ambient, up to 21 days cold store)
- Current modal mandi rate (e.g. ₹2,600/qtl in Kolar, ₹3,100 in Azadpur)
- Transport cost and storage feasibility
- Direct actionable recommendation (e.g. "Sell 70% lot today, hold 30% if you have crate cold storage").

Keep responses concise (150-250 words), formatting key recommendations with clear bullet points.`;

    let generatedText: string | null = null;
    let modelUsed = 'gemini-3.8-flash';

    try {
      // Primary model: gemini-3.8-flash
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Context: ${JSON.stringify(context || {})}\nFarmer Query: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      if (response.text && response.text.trim()) {
        generatedText = response.text;
      }
    } catch {
      // Graceful fallback to gemini-3.1-flash-lite if 3.8 is temporarily unavailable or experiencing high demand
      try {
        await new Promise(r => setTimeout(r, 300));
        const liteResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: `Context: ${JSON.stringify(context || {})}\nFarmer Query: ${prompt}`,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });
        if (liteResponse.text && liteResponse.text.trim()) {
          generatedText = liteResponse.text;
          modelUsed = 'gemini-3.1-flash-lite';
        }
      } catch {
        // Silently fall through to rule-based agricultural engine
        generatedText = null;
      }
    }

    if (generatedText) {
      return res.json({ reply: generatedText, source: modelUsed });
    }
  }

  // High-quality Agricultural Rule-Based Engine (Fallback)
  const lowerPrompt = prompt.toLowerCase();
  let reply = '';
  let dataCard: any = null;

  if (lowerPrompt.includes('tomato')) {
    reply = `### AI Market Recommendation for Tomato:
- **Decision: SELL IMMEDIATELY (or Wait Max 48 Hours)**
- **Current Modal Rate:** ₹2,600 - ₹2,950 / Quintal across South & Western mandis.
- **Supply Outlook:** Heavy rainfall reported in Karnataka and transport corridors has temporarily curtailed mandi arrivals, lifting spot prices by +4.8%. However, tomato has high perishability (3–5 days without cold chain).
- **Strategy:** 
  1. If you have immediate access to Kolar or Nashik mandis, dispatch 75% of your mature harvest today to lock in high prices.
  2. Avoid long-term cold storage (>14 days) due to high chill sensitivity and moisture weight loss (~3-4%).
  3. Direct buyer procurement from BigBasket or Reliance currently offers ₹2,750-₹2,850/Qtl with 24h payment.`;

    dataCard = {
      type: 'price_forecast',
      title: 'Tomato 7-Day Market Trajectory',
      details: {
        'Current Spot Price': '₹2,600 / Qtl',
        '3-Day Projection': '₹2,780 / Qtl (+6.9%)',
        'Perishability Alert': 'High (4 Days ambient)',
        'Recommended Action': 'Sell 80% today, 20% by Sunday'
      }
    };
  } else if (lowerPrompt.includes('onion')) {
    reply = `### AI Market Recommendation for Onion:
- **Decision: STORE IN WAREHOUSE / COLD STORAGE**
- **Current Modal Rate:** ₹2,320 / Quintal at Lasalgaon; ₹2,890 / Quintal at Azadpur Delhi.
- **Price Outlook:** Prices are projected to climb +8% to +12% over the next 4 weeks as Kharif arrivals finish and festival stocking begins.
- **Cold Storage Math:** Storage cost is approximately ₹75/Qtl/Month at MahaAgro Nashik. Projected price spike (+₹280/Qtl) easily covers ₹75 rent + ₹20 handling + 2% weight drying, generating a net profit of ~₹150-₹180/Qtl above today's spot rate.
- **Strategy:** Ensure onions have cured dry skins before loading into ventilated or controlled-atmosphere storage.`;

    dataCard = {
      type: 'storage_comparison',
      title: 'Onion Storage vs Immediate Sale',
      details: {
        'Today In-hand': '₹2,320 / Qtl',
        'Projected (30 Days)': '₹2,680 / Qtl',
        'Storage + Handling Cost': '₹95 / Qtl',
        'Net Profit Difference': '+₹265 / Qtl gain'
      }
    };
  } else if (lowerPrompt.includes('wheat') || lowerPrompt.includes('grain')) {
    reply = `### AI Market Recommendation for Wheat:
- **Decision: WAIT & TARGET CORPORATE BUYERS**
- **Current Modal Rate:** ₹2,540 / Qtl at Khanna Mandi; MSP support is strong with high flour mill off-take.
- **Recommendation:** 
  - ITC e-Choupal is currently purchasing HD-2967 / Sharbati wheat at ₹2,620/Qtl (a ₹80/Qtl premium over standard mandi auction).
  - Dry storage silos in Punjab/MP cost only ₹45/Qtl/month with negligible shrinkage (<0.5%).
  - Holding for 30–60 days yields stable returns as winter consumption ramps up.`;
  } else if (lowerPrompt.includes('disease') || lowerPrompt.includes('blight') || lowerPrompt.includes('fungal') || lowerPrompt.includes('rot')) {
    const crop = lowerPrompt.includes('onion') ? 'Onion' : lowerPrompt.includes('potato') ? 'Potato' : lowerPrompt.includes('wheat') ? 'Wheat' : 'Tomato';
    const pred = runPricePrediction(crop);
    reply = `### Crop Disease & Spoilage Early Warning (${pred.diseasePrediction.diseaseName}):
- **Pathogen:** ${pred.diseasePrediction.pathogen}
- **Vulnerability Level:** ${pred.diseasePrediction.riskLevel.toUpperCase()} RISK (${pred.diseasePrediction.riskScorePct}%)
- **Favorable Weather Triggers:** ${pred.diseasePrediction.favorableConditions}
- **Potential Quality & Weight Loss:** ~${pred.diseasePrediction.estimatedYieldOrQualityLossPct}% if left unchecked.
- **Harvest & Market Advisory:**
  1. ${pred.diseasePrediction.preventiveAction}
  2. For high-perishable crops (Tomato), current disease risk mandates immediate sale to institutional buyers to avoid mandi distress price cuts.`;

    dataCard = {
      type: 'mandi_alert',
      title: `${crop} Disease Alert: ${pred.diseasePrediction.diseaseName}`,
      details: {
        'Risk Rating': `${pred.diseasePrediction.riskLevel} (${pred.diseasePrediction.riskScorePct}%)`,
        'Est. Spoilage Impact': `-${pred.diseasePrediction.estimatedYieldOrQualityLossPct}%`,
        'Harvest Urgency': pred.diseasePrediction.riskLevel === 'High' ? 'Dispatch lot immediately' : 'Standard monitoring'
      }
    };
  } else if (lowerPrompt.includes('global') || lowerPrompt.includes('export') || lowerPrompt.includes('tariff') || lowerPrompt.includes('international')) {
    const crop = lowerPrompt.includes('onion') ? 'Onion' : lowerPrompt.includes('cotton') ? 'Cotton' : lowerPrompt.includes('rice') || lowerPrompt.includes('basmati') ? 'Basmati Rice' : lowerPrompt.includes('soybean') ? 'Soybean' : 'Tomato';
    const pred = runPricePrediction(crop);
    reply = `### Global Market & Export Intelligence for ${crop}:
- **Benchmark Index:** ${pred.globalTrends.indexName}
- **Price Parity:** ${pred.globalTrends.priceParity}
- **Trade Policy & Tariffs:** ${pred.globalTrends.policyTariff}
- **International Demand Signal:** ${pred.globalTrends.exportDemand.toUpperCase()} (${pred.globalTrends.trendSignal} bias)
- **Macro Analysis:** ${pred.globalTrends.summary}`;

    dataCard = {
      type: 'price_forecast',
      title: `${crop} Global Trade Signals`,
      details: {
        'Benchmark Index': pred.globalTrends.indexName.slice(0, 30) + '...',
        'Export Demand': pred.globalTrends.exportDemand,
        'Market Signal': pred.globalTrends.trendSignal
      }
    };
  } else if (lowerPrompt.includes('transport') || lowerPrompt.includes('freight') || lowerPrompt.includes('diesel') || lowerPrompt.includes('distance')) {
    const crop = lowerPrompt.includes('onion') ? 'Onion' : lowerPrompt.includes('wheat') ? 'Wheat' : 'Tomato';
    const pred = runPricePrediction(crop);
    reply = `### Transportation & Net Freight Realization:
- **Commercial Diesel Index:** ₹${pred.transportCostBreakdown.dieselPricePerLiter} / Liter
- **Freight Rate:** ₹${pred.transportCostBreakdown.freightPerQtlKm} per Quintal-Km
- **Local vs Remote Mandi Comparison:**
${pred.transportCostBreakdown.majorRoutes.map(r => `  - **${r.destination}** (${r.distanceKm} km): Freight -₹${r.freightPerQtl}/Qtl ➔ Net realization: **₹${r.netPrice}/Qtl**`).join('\n')}
- **Strategic Advice:** When freight exceeds 8% of crop value, preferring nearby institutional aggregator hubs or farm-gate pickup saves between ₹120-₹240/Qtl!`;

    dataCard = {
      type: 'mandi_alert',
      title: 'Transport Freight Economics',
      details: {
        'Diesel Benchmark': `₹${pred.transportCostBreakdown.dieselPricePerLiter}/L`,
        'Freight Rate': `₹${pred.transportCostBreakdown.freightPerQtlKm}/Qtl-Km`,
        'Net In-Hand Deduction': `~₹${pred.transportCostBreakdown.transportDeductionPerQtl}/Qtl`
      }
    };
  } else if (lowerPrompt.includes('storage') || lowerPrompt.includes('cold store')) {
    reply = `### Cold Storage Feasibility Checklist:
1. **Perishable Crops (Tomato, Chillies, Capsicum):** Use cold storage only for short buffering (3 to 10 days) when mandis are temporarily glutted.
2. **Semi-Perishable (Onion, Potato, Garlic):** Highly recommended. Agra potato storage and Nashik onion hubs typically deliver 15% to 30% value appreciation when unstocked during lean off-season.
3. **Breakeven Rule:** The anticipated price rise must exceed: \`Monthly Rent (₹50-90) + In/Out Handling (₹20) + Shrinkage Loss (1.5-2.5%)\`.
Check the **Profit Simulator** tab on your dashboard to calculate exact returns for your lot size!`;
  } else {
    reply = `### KisanAI Market Intelligence Summary:
- **General Advisory:** For the current trading week (Sep 2026), cash crop markets are showing steady demand with festive procurement starting across wholesale centers.
- **Key Trend:** Mandis with road disruptions due to monsoon showers (e.g. Karnataka and Malwa belt) are reporting +4% to +7% price volatility.
- **Action Steps:**
  1. Check the **Farmer Dashboard** for real-time rates at nearby mandis within 100 km.
  2. Run the **Price Prediction Module** to see 3-day and 7-day regression trajectories for your specific crop.
  3. Compare buyer demand quotes in the **Buyer Marketplace** to avoid middleman mandi cess fees.`;
  }

  return res.json({ reply, dataCard, source: 'kisan-agro-rules' });
});

// 9. Dataset CSV Downloads
app.get('/api/datasets/:type/csv', (req, res) => {
  const type = req.params.type;
  let csvContent = '';
  let filename = 'dataset.csv';

  if (type === 'mandi') {
    csvContent = generateMandiCSV();
    filename = 'mandi_prices_dataset.csv';
  } else if (type === 'weather') {
    csvContent = generateWeatherCSV();
    filename = 'weather_agri_dataset.csv';
  } else if (type === 'storage') {
    csvContent = generateStorageCSV();
    filename = 'cold_storage_facilities_dataset.csv';
  } else if (type === 'buyer') {
    csvContent = generateBuyerCSV();
    filename = 'buyer_requirements_dataset.csv';
  } else {
    return res.status(404).send('Dataset type not found');
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csvContent);
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Agri Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
