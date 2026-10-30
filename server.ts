import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory live tracking store for /track/:id
const liveTrackingStore = new Map<string, any>();

// Helper to initialize Gemini client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Plan endpoint
app.post('/api/gemini/plan', async (req: Request, res: Response) => {
  const { from, destination, startDate, endDate, travelers, budget, travelMode, interests, stayPreference, tripMode, pace, language } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are TripPilot AI, an autonomous travel operating system.
Plan a realistic ${pace || 'Balanced'} trip from ${from} to ${destination} for ${travelers} travelers with total budget ₹${budget}.
Trip Mode: ${tripMode}. Interests: ${interests ? interests.join(', ') : 'Sightseeing'}. Preferred Travel Mode: ${travelMode}.
Language for text content: ${language === 'ta' ? 'Tamil' : 'English'}.

Return ONLY strict valid JSON matching this exact structure, with no markdown, no code fence, no surrounding text:
{
  "from": "${from}",
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "travelers": ${travelers},
  "budget": ${budget},
  "travelMode": "${travelMode}",
  "interests": ${JSON.stringify(interests || [])},
  "stayPreference": "${stayPreference}",
  "tripMode": "${tripMode}",
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 Title",
      "activities": [
        {
          "time": "08:00 AM",
          "activity": "Activity Name",
          "location": "Location",
          "estimatedCost": 300,
          "travelRoute": "Route info",
          "notes": "Helpful traveler tips",
          "category": "Sightseeing",
          "weatherDependency": "Outdoor"
        }
      ],
      "dayTotalCost": 3500
    }
  ],
  "estimatedTotalCost": 12400,
  "packingChecklist": ["Item 1", "Item 2"],
  "safetyNotes": ["Safety Note 1", "Safety Note 2"],
  "whyThisPlan": "Explanation of why this plan fits the budget and intent."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text?.trim() || '';
      // Strip potential json markdown block if Gemini included it
      const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleaned);

      return res.json({ source: 'gemini', data: parsed });
    } catch (err) {
      console.warn('Gemini plan API failed or rate-limited, falling back to smart demo plan:', err);
    }
  }

  // Graceful fallback to realistic data
  return res.json({
    source: 'demo',
    data: {
      from: from || 'Chennai',
      destination: destination || 'Ooty (Udhagamandalam)',
      startDate: startDate || '2026-11-05',
      endDate: endDate || '2026-11-07',
      travelers: Number(travelers) || 2,
      budget: Number(budget) || 15000,
      travelMode: travelMode || 'Train + Road',
      interests: interests || ['Nature', 'Tea estates', 'Viewpoints', 'Local food'],
      stayPreference: stayPreference || 'Budget hotel / homestay',
      tripMode: tripMode || 'nature',
      estimatedTotalCost: Math.min(Number(budget) || 15000, 12400),
      whyThisPlan: `Optimized for ${travelers || 2} travelers exploring ${destination || 'Ooty'} under ₹${budget || 15000}. Balances the signature mountain toy train, panoramic peaks, serene lake boating, and local tea estate tours with built-in buffer time.`,
      packingChecklist: [
        'Light woolens and sweaters (Nilgiris temperatures dip to 12°C at night)',
        'Comfortable trail walking shoes for tea gardens',
        'Compact umbrella for unexpected hill showers',
        'Motion sickness medication for Kallar ghat road hairpins',
        'Universal power adapter and camera cards',
      ],
      safetyNotes: [
        'Evening ghat fog on NH181 between Mettupalayam and Coonoor requires headlights and careful driving.',
        'Beware of wild elephants and Indian bison near forest edges; remain inside vehicle.',
        'Emergency dial: 112 (National Emergency), 108 (Ambulance), 100 (Police).',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Highland Arrival & Heritage Tea Trails',
          dayTotalCost: 4600,
          activities: [
            {
              time: '08:00 AM',
              activity: 'Nilgiri Mountain Railway Heritage Train Ride',
              location: 'Mettupalayam - Coonoor - Ooty line',
              estimatedCost: 600,
              travelRoute: 'Scenic mountain rail through 16 tunnels',
              notes: 'UNESCO World Heritage steam cog railway ride with panoramic valley vistas.',
              category: 'Transport',
              weatherDependency: 'Rain-Safe',
            },
            {
              time: '12:30 PM',
              activity: 'Check-in & Traditional Banana Leaf Lunch',
              location: 'Commercial Road / Charing Cross',
              estimatedCost: 750,
              travelRoute: '10 mins cab from station',
              notes: 'Steaming sambar, hill vegetables, and fresh filter coffee.',
              category: 'Food',
              weatherDependency: 'Indoor',
            },
            {
              time: '03:30 PM',
              activity: 'Government Botanical Gardens Walk',
              location: 'Botanical Gardens, Ooty',
              estimatedCost: 250,
              travelRoute: 'Town center walk',
              notes: 'Terraced lawns with 1,000+ exotic floral species and fossil tree.',
              category: 'Sightseeing',
              weatherDependency: 'Outdoor',
            },
            {
              time: '06:00 PM',
              activity: 'Doddabetta Tea Factory & Chocolate Workshop',
              location: 'Doddabetta Road',
              estimatedCost: 500,
              travelRoute: '15 mins hill drive',
              notes: 'Watch CTC tea processing and sample handmade dark fudge chocolates.',
              category: 'Food',
              weatherDependency: 'Indoor',
            },
          ],
        },
        {
          day: 2,
          title: 'Summit Panoramas & Pykara Lake Cascades',
          dayTotalCost: 4800,
          activities: [
            {
              time: '08:30 AM',
              activity: 'Doddabetta Peak Telescope Summit View',
              location: 'Doddabetta Summit (8,652 ft)',
              estimatedCost: 300,
              travelRoute: 'Uphill scenic road',
              notes: 'Highest peak in South India outside Anamudi. Crisp mountain views.',
              category: 'Sightseeing',
              weatherDependency: 'Outdoor',
            },
            {
              time: '12:00 PM',
              activity: 'Pykara Waterfalls & Speedboat Boating',
              location: 'Pykara Lake, Mysore Highway',
              estimatedCost: 1100,
              travelRoute: '40 mins pine forest drive',
              notes: 'Speedboat cruise across emerald lake waters surrounded by shola forest.',
              category: 'Adventure',
              weatherDependency: 'Outdoor',
            },
            {
              time: '04:30 PM',
              activity: 'Shooting Point Pine Forest Trail Walk',
              location: 'Kamaraj Sagar Dam / Shooting Medu',
              estimatedCost: 500,
              travelRoute: 'Return route drive',
              notes: 'Serene pine woods with soft pine-needle trails and horse riding.',
              category: 'Leisure',
              weatherDependency: 'Outdoor',
            },
            {
              time: '07:30 PM',
              activity: 'Campfire & Nilgiri Badaga Specialty Dinner',
              location: 'Resort Lawn',
              estimatedCost: 900,
              travelRoute: 'Resort grounds',
              notes: 'Traditional millet porridge, sandage, and hot ginger spiced tea.',
              category: 'Food',
              weatherDependency: 'Rain-Safe',
            },
          ],
        },
        {
          day: 3,
          title: 'Coonoor Ridges & Homeward Departure',
          dayTotalCost: 3000,
          activities: [
            {
              time: '09:00 AM',
              activity: "Sim's Park & Catherine Falls Lookout",
              location: 'Upper Coonoor',
              estimatedCost: 450,
              travelRoute: '35 mins scenic descent',
              notes: 'Terraced botanical park featuring rare temperate trees.',
              category: 'Sightseeing',
              weatherDependency: 'Outdoor',
            },
            {
              time: '01:00 PM',
              activity: 'Nilgiri Varkey & Hill Spice Souvenir Walk',
              location: 'Coonoor Bedford Bazaar',
              estimatedCost: 800,
              travelRoute: 'Town market walk',
              notes: 'Freshly baked Nilgiri Varkey, eucalyptus oil, and cardamom.',
              category: 'Leisure',
              weatherDependency: 'Indoor',
            },
            {
              time: '05:30 PM',
              activity: 'Transfer to Coimbatore Junction for Return Train',
              location: 'Coimbatore Railway Station',
              estimatedCost: 1150,
              travelRoute: 'Smooth highway descent',
              notes: 'Board evening overnight train back home relaxed and rejuvenated.',
              category: 'Transport',
              weatherDependency: 'Rain-Safe',
            },
          ],
        },
      ],
    },
  });
});

// 2. Chat Assistant endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, tripContext, language } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are TripPilot AI, a knowledgeable, friendly, and protective travel co-pilot specialized in global and Indian travel, with profound expertise in Tamil Nadu hill stations, heritage circuits, and road safety.
Current Trip Context: ${JSON.stringify(tripContext || {})}.
User Language: ${language === 'ta' ? 'Tamil' : 'English'}.
User Message: "${message}"

Give a concise, helpful, and actionable answer. If relevant, include:
- A brief bulleted tip or safety note.
- Suggest 2-3 brief follow-up prompt chips as JSON at the end if possible, or mention specific recommendations.
Respond in ${language === 'ta' ? 'natural, fluent Tamil (with English technical terms like GPS, ETA, SOS)' : 'English'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        source: 'gemini',
        reply: response.text?.trim() || 'I am ready to help you navigate your journey!',
      });
    } catch (err) {
      console.warn('Gemini chat failed, using realistic fallback:', err);
    }
  }

  // Realistic fallback assistant replies
  const lower = (message || '').toLowerCase();
  let fallbackReply = "Vanakkam! I'm your TripPilot AI companion. Your Chennai to Ooty trip is in great shape with a balanced itinerary under ₹15,000. Let me know if you need road risk updates, restaurant picks, or packing advice!";

  if (lower.includes('safe') || lower.includes('safety') || lower.includes('risk') || lower.includes('ghat')) {
    fallbackReply = language === 'ta'
      ? 'கல்லார் மலைப்பாதையில் (Kallar Ghat Road) தற்போது மிதமான பனிமூட்டம் உள்ளது. 14 கொண்டை ஊசி வளைவுகளில் எச்சரிக்கையுடன் செல்லவும். உங்கள் நேரலை இருப்பிடப் பகிர்வு (Live Sharing) ஆன்-ல் உள்ளது. அவசர உதவிக்கு 112 அல்லது 108 அழைக்கலாம்.'
      : 'Road Risk is currently MODERATE on the Kallar Ghat section (NH181). Fog has been reported around hairpin curves #8-12. Please keep headlights on low beam and avoid sharp overtaking. Your live tracking is active for family safety.';
  } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('eat') || lower.includes('உணவு')) {
    fallbackReply = language === 'ta'
      ? 'ஊட்டியில் தவறவிடக்கூடாத உணவுகள்: புகழ்பெற்ற நீலகிரி வர்க்கி (Nilgiri Varkey), ஹோம்மேட் டார்க் சாக்லேட், நஹார் ஹோட்டல் ஃபில்டர் காபி, மற்றும் படகர் பாரம்பரிய சமையல் (Badaga Thali). மதிய உணவுக்கு ஹோட்டல் நஹார் சிறந்த தேர்வு!'
      : 'Top food recommendations for Ooty: Fresh hot Nilgiri Varkey from West Republic Bakery, artisan dark truffles from King Star Chocolates, traditional Badaga thali at Apsara, and hot filter coffee at Hotel Nahar.';
  } else if (lower.includes('cheap') || lower.includes('budget') || lower.includes('save') || lower.includes('பட்ஜெட்')) {
    fallbackReply = language === 'ta'
      ? 'பட்ஜெட்டைச் சேமிக்க: தனியார் டாக்ஸிக்கு பதிலாக உள்ளூர் பேருந்து அல்லது ஷேரிங் ஜீப் பயன்படுத்தலாம் (₹800 மிச்சம்). உணவுக்காக பெரிய ஹோட்டல்களை விடுத்து பாரம்பரிய உணவகங்களைத் தேர்ந்தெடுக்கவும்.'
      : 'To optimize your budget: 1) Use the public heritage bus between Ooty and Coonoor instead of a private cab for day 3 (saves ~₹900). 2) Opt for lunch at local TTDC Cafes near Pykara. 3) Book boating slots before 11 AM for standard tariff.';
  } else if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('மருத்துவமனை')) {
    fallbackReply = language === 'ta'
      ? 'அருகிலுள்ள மருத்துவமனை: ஊட்டி அரசு தலைமை மருத்துவமனை (GH Ooty) - 1.2 கி.மீ தொலைவில் உள்ளது. தொலைபேசி: 0423-2442212. அவசர ஆம்புலன்ஸ் எண்: 108.'
      : 'Nearest medical center: Government District Headquarter Hospital (GH Ooty) on Hospital Road, 1.2 km away (0423-2442212). For immediate ambulance dispatch, dial 108.';
  }

  return res.json({ source: 'demo', reply: fallbackReply });
});

// 3. Replan endpoint
app.post('/api/gemini/replan', async (req: Request, res: Response) => {
  const { disruption, tripState, language } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are TripPilot AI Disruption Recovery Engine.
Disruption: ${JSON.stringify(disruption)}.
Current Trip: ${JSON.stringify(tripState || {})}.
Language: ${language === 'ta' ? 'Tamil' : 'English'}.

Propose 2 realistic replan options with trade-offs and confidence scores. Return ONLY strict JSON:
{
  "options": [
    {
      "id": "opt-1",
      "title": "Title of Option 1",
      "description": "Clear explanation of alternative route or indoor activity",
      "newRouteOrActivity": "New Activity or Route",
      "costDifference": -300,
      "timeImpact": "+30 mins",
      "riskLevel": "Low",
      "tradeOffs": "What is skipped or changed",
      "confidenceScore": 95
    }
  ]
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const cleaned = response.text?.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim() || '';
      const parsed = JSON.parse(cleaned);
      return res.json({ source: 'gemini', data: parsed });
    } catch (err) {
      console.warn('Gemini replan failed, using fallback:', err);
    }
  }

  return res.json({
    source: 'demo',
    data: {
      options: [
        {
          id: 'opt-demo-1',
          title: 'Indoor Heritage & Tea Museum Circuit',
          description: 'Reroutes from rain-affected Doddabetta Peak to the covered Government Tea Factory & Tribal Research Museum.',
          newRouteOrActivity: 'Tea Factory Tour + Honey Museum + Artisan Chocolate Making',
          costDifference: -350,
          timeImpact: 'Zero delay; completely sheltered',
          riskLevel: 'Low',
          tradeOffs: 'Skips summit vista in exchange for cultural immersion.',
          confidenceScore: 96,
        },
        {
          id: 'opt-demo-2',
          title: 'Afternoon Weather Window Detour',
          description: 'Pause for Badaga lunch at town center until 1:30 PM; proceed to covered botanical glasshouse.',
          newRouteOrActivity: 'Botanical Glasshouse & Italian Garden',
          costDifference: 0,
          timeImpact: '+45 mins reschedule',
          riskLevel: 'Low',
          tradeOffs: 'Slightly shorter outdoor duration.',
          confidenceScore: 91,
        },
      ],
    },
  });
});

// 4. Translate endpoint
app.post('/api/gemini/translate', async (req: Request, res: Response) => {
  const { phrase, fromLang, toLang } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Translate this travel phrase from ${fromLang} to ${toLang}. Return ONLY the direct translated phrase without commentary:
"${phrase}"`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return res.json({ source: 'gemini', translation: response.text?.trim() });
    } catch (err) {
      console.warn('Gemini translate failed, using rule-based fallback:', err);
    }
  }

  // Quick fallback translation
  return res.json({
    source: 'demo',
    translation: `[${toLang.toUpperCase()}]: ${phrase}`,
  });
});

// 5. Live Tracking endpoints
app.post('/api/track/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  liveTrackingStore.set(id, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  res.json({ success: true, trackingId: id });
});

app.get('/api/track/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = liveTrackingStore.get(id);
  if (!data) {
    // Return sample demo tracking data
    return res.json({
      trackingId: id,
      latitude: 11.4102,
      longitude: 76.6950,
      speed: 26,
      accuracy: 8,
      address: 'Near Charring Cross, Commercial Road, Ooty, Tamil Nadu',
      updatedAt: new Date().toLocaleTimeString(),
      trip: 'Chennai to Ooty 3-Day Journey',
      travelerName: 'Karthik Ramanathan',
      status: 'Active Live Sharing',
    });
  }
  return res.json(data);
});

// Static / Frontend setup
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TripPilot AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
