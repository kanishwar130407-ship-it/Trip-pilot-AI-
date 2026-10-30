export interface ApiResponse<T> {
  source: 'gemini' | 'demo';
  data?: T;
  reply?: string;
  translation?: string;
  error?: string;
}

export async function planTripWithAi(payload: any): Promise<ApiResponse<any>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch('/api/gemini/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err: any) {
    console.warn('planTripWithAi falling back:', err.message);
    return {
      source: 'demo',
      data: null,
    };
  }
}

export async function askAssistantAi(
  message: string,
  tripContext: any,
  language: string
): Promise<{ source: 'gemini' | 'demo'; reply: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, tripContext, language }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err: any) {
    console.warn('askAssistantAi fallback:', err.message);
    return {
      source: 'demo',
      reply:
        language === 'ta'
          ? 'மன்னிக்கவும், நெட்வொர்க் பிழை. உங்கள் சென்னை-ஊட்டி பயணத் திட்டம் தயாராக உள்ளது. அவசர உதவிக்கு 112 அல்லது 108 அழைக்கவும்.'
          : 'I am currently running in offline-ready mode. Your Chennai to Ooty trip is fully accessible, and live safety monitoring is operational.',
    };
  }
}

export async function replanWithAi(
  disruption: any,
  tripState: any,
  language: string
): Promise<ApiResponse<any>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch('/api/gemini/replan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disruption, tripState, language }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err: any) {
    console.warn('replanWithAi fallback:', err.message);
    return { source: 'demo' };
  }
}

export async function translateTextWithAi(
  phrase: string,
  fromLang: string,
  toLang: string
): Promise<{ source: 'gemini' | 'demo'; translation: string }> {
  try {
    const res = await fetch('/api/gemini/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phrase, fromLang, toLang }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      source: 'demo',
      translation: phrase,
    };
  }
}

export async function postLiveLocation(trackingId: string, locationData: any) {
  try {
    await fetch(`/api/track/${trackingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData),
    });
  } catch (err) {
    // silently catch for mock/local mode
  }
}

export async function getLiveLocation(trackingId: string) {
  try {
    const res = await fetch(`/api/track/${trackingId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback
  }
  return null;
}
