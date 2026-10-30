import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, Shield, Lock, Eye, Lightbulb, Check } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

export const SmartHelpModal: React.FC = () => {
  const activeHelpSheet = useTripStore((s) => s.activeHelpSheet);
  const closeHelpSheet = useTripStore((s) => s.closeHelpSheet);
  const language = useTripStore((s) => s.language);

  if (!activeHelpSheet) return null;

  const HELP_TOPICS: Record<
    string,
    {
      titleEn: string;
      titleTa: string;
      whatEn: string;
      whatTa: string;
      dataEn: string;
      dataTa: string;
      privacyEn: string;
      privacyTa: string;
      exampleEn: string;
      exampleTa: string;
    }
  > = {
    trip_mode: {
      titleEn: 'Trip Mode Personalization',
      titleTa: 'பயண முறை தனிப்பயனாக்கம்',
      whatEn: 'Adapts itinerary pacing, recommended hotels, attractions, and packing checklists according to your travel party style.',
      whatTa: 'உங்கள் பயணக் குழுவின் விருப்பத்திற்கேற்ப அட்டவணை, தங்குமிடம் மற்றும் பேக்கிங் பட்டியலை அமைக்கிறது.',
      dataEn: 'Selected trip mode pill (Family, Adventure, Solo, Bike, etc.).',
      dataTa: 'தேர்ந்தெடுக்கப்பட்ட பயண முறை (குடும்பம், சாகசம், தனி, பைக் போன்றவை).',
      privacyEn: 'Stored locally in your browser. No personal profiling or third-party ad tracking.',
      privacyTa: 'உங்கள் உலாவியில் மட்டுமே சேமிக்கப்படுகிறது. விளம்பரக் கண்காணிப்பு இல்லை.',
      exampleEn: '"Family Trip" prioritizes barrier-free elderly viewpoints and children parks over steep trekking paths.',
      exampleTa: '"குடும்ப பயணம்" கடினமான மலைப்பாதைகளுக்குப் பதிலாக பாதுகாப்பான பூங்காக்களை முன்னிலைப்படுத்தும்.',
    },
    budget: {
      titleEn: 'Budget Fit & Burn-Rate Tracker',
      titleTa: 'வரவு-செலவு கண்காணிப்பாளர்',
      whatEn: 'Calculates day-by-day cost estimations across transport, stay, food, and activities with under/near/over budget warnings.',
      whatTa: 'போக்குவரத்து, தங்குமிடம், உணவு மற்றும் செயல்பாடுகளுக்கான நாள் வாரியான செலவைக் கணக்கிடுகிறது.',
      dataEn: 'Target budget number and user-entered expense items.',
      dataTa: 'இலக்கு பட்ஜெட் மற்றும் நீங்கள் பதிவு செய்யும் செலவுகள்.',
      privacyEn: 'All monetary figures remain on your device and are never shared with credit bureaus or payment gateways.',
      privacyTa: 'நிதி விவரங்கள் அனைத்தும் உங்கள் சாதனத்தில் மட்டுமே இருக்கும்.',
      exampleEn: 'If dining exceeds daily burn rate by ₹1,200, Gemini suggests nearby authentic affordable TTDC cafes.',
      exampleTa: 'செலவு பட்ஜெட்டை விட அதிகமானால் மலிவான உணவகங்களை AI பரிந்துரைக்கும்.',
    },
    live_sharing: {
      titleEn: 'Live Location Sharing & Tracking Links',
      titleTa: 'நேரலை இருப்பிடப் பகிர்வு',
      whatEn: 'Generates a private, time-limited /track/{id} web link to let loved ones view your journey on a map in real-time.',
      whatTa: 'உங்கள் குடும்பத்தினர் உங்கள் பயணத்தை வரைபடத்தில் நேரலையாகப் பார்க்க காலவரையறை கொண்ட தனிப்பயன் இணைப்பை உருவாக்குகிறது.',
      dataEn: 'GPS latitude, longitude, vehicle speed, and estimated time of arrival.',
      dataTa: 'ஜிபிஎஸ் அட்சரேகை, தீர்க்கரேகை, பயண வேகம் மற்றும் சேருமிடம்.',
      privacyEn: 'Strictly opt-in with automated expiry after 15 mins, 1 hr, or trip end. You can stop sharing at any second.',
      privacyTa: 'தானியங்கி காலாவதி வசதி கொண்டது. எந்த நேரத்திலும் நிறுத்தலாம்.',
      exampleEn: 'Sharing link with parents via WhatsApp sends: "I am here: maps.google.com/?q=11.4102,76.6950".',
      exampleTa: 'வாட்ஸ்அப் வழியாக பெற்றோருக்கு நேரலை வரைபட இணைப்பை அனுப்பலாம்.',
    },
    road_risk: {
      titleEn: 'Smart Ghat Road Risk Detection',
      titleTa: 'ஸ்மார்ட் மலைப்பாதை அபாயக் கண்டறிதல்',
      whatEn: 'Analyzes live Nilgiri meteorological fog reports, hairpin curve density, and road surface conditions to assign Low, Medium, or High scores.',
      whatTa: 'நீலகிரி வானிலை, 14 கொண்டை ஊசி வளைவுகள் மற்றும் பனிமூட்டத்தை ஆய்வு செய்து ஆபத்து அளவைக் கணக்கிடுகிறது.',
      dataEn: 'Geographic hill sector coordinates, time of day, and weather alerts.',
      dataTa: 'மலைப்பாதை அமைவிடம், பயண நேரம் மற்றும் வானிலை எச்சரிக்கைகள்.',
      privacyEn: 'Public road safety sensors and weather bulletins only. No in-cabin vehicle telemetry collected.',
      privacyTa: 'பொது வானிலை மற்றும் சாலைத் தகவல்கள் மட்டுமே பயன்படுத்தப்படுகின்றன.',
      exampleEn: 'When Kallar Ghat develops thick fog after 5:30 PM, the 3D road turns red and suggests the Kotagiri detour.',
      exampleTa: 'மாலை 5:30 மணிக்கு மேல் பனிமூட்டம் அதிகமாகும்போது கோத்தகிரி மாற்றுப் பாதையைப் பரிந்துரைக்கும்.',
    },
    sos: {
      titleEn: 'Emergency SOS Sentinel',
      titleTa: 'அவசர SOS உதவி',
      whatEn: 'Immediate one-tap emergency trigger that captures GPS coordinates, shows nearest hospitals, and dials 112/108.',
      whatTa: 'ஒரே தொடுதலில் ஜிபிஎஸ் இருப்பிடத்தைப் பதிவுசெய்து, அருகிலுள்ள மருத்துவமனைகளைக் காட்டி, 112/108 எண்களை அழைக்கும்.',
      dataEn: 'Current device geolocation and saved trusted contact phone numbers.',
      dataTa: 'தற்போதைய சாதன இருப்பிடம் மற்றும் நீங்கள் சேமித்த அவசர எண்கள்.',
      privacyEn: 'Only broadcasts when you explicitly press the SOS button. Never tracks silently in the background.',
      privacyTa: 'நீங்கள் SOS பொத்தானை அழுத்தும்போது மட்டுமே இயங்கும். ரகசிய கண்காணிப்பு இல்லை.',
      exampleEn: 'Dialing 108 instantly connects you to the Nilgiris District Emergency Trauma ambulance dispatch center.',
      exampleTa: '108-ஐ அழைத்தால் உடனடியாக நீலகிரி அவசர ஆம்புலன்ஸ் சேவைக்கு இணைப்பு கிடைக்கும்.',
    },
    replanning: {
      titleEn: 'Autonomous AI Replanning Engine',
      titleTa: 'தானியங்கி மறுதிட்டமிடல் என்ஜின்',
      whatEn: 'Detects disruptions like heavy rainfall, landslides, train delays, or budget deficits and calculates safe detours.',
      whatTa: 'கனமழை, நிலச்சரிவு அல்லது ரயில் தாமதங்களைக் கண்டறிந்து மாற்றுப் பயணத் திட்டங்களை வழங்குகிறது.',
      dataEn: 'Active disruption event context, remaining days, and package budget balance.',
      dataTa: 'தற்போதைய தடங்கல் விவரம், மீதமுள்ள நாட்கள் மற்றும் பட்ஜெட்.',
      privacyEn: 'Evaluated locally or via private server-side Gemini API. Never stored beyond your session.',
      privacyTa: 'உங்கள் அமர்வுக்கு வெளியே எந்த தகவலும் சேமிக்கப்படாது.',
      exampleEn: 'When Doddabetta Peak is closed by fog, AI redirects you to the covered Government Tea Museum without extra cost.',
      exampleTa: 'பனிமூட்டத்தால் சிகரம் மூடப்பட்டால், கட்டணம் இல்லாத தேயிலை அருங்காட்சியகத்திற்கு மாற்றிவிடும்.',
    },
    payment: {
      titleEn: 'Zero-Risk Mock Payment & Verification',
      titleTa: 'மாதிரி கட்டணம் & முன்பதிவு',
      whatEn: 'A safe, simulated checkout flow to experience the booking confirmation, ticket generation, and PNR creation.',
      whatTa: 'உண்மையான பணம் செலுத்தாமல் பயண முன்பதிவு அனுபவத்தை முழுமையாகப் பெற உதவும் மாதிரி முறை.',
      dataEn: 'Traveler passenger manifest details and mock UPI/Card choice.',
      dataTa: 'பயணி விவரங்கள் மற்றும் மாதிரி கட்டண தேர்வு.',
      privacyEn: 'No real credit cards, bank accounts, or OTPs are required. No financial data is ever collected.',
      privacyTa: 'உண்மையான வங்கி அட்டை அல்லது கடவுச்சொல் தேவையில்லை. பூஜ்ஜிய ஆபத்து.',
      exampleEn: 'Entering any mock UPI ID completes booking in 2 seconds and generates your official TP-2026-XXXX reference.',
      exampleTa: 'எந்தவொரு மாதிரி UPI ஐடியையும் உள்ளிட்டால் 2 நொடிகளில் முன்பதிவு எண் உருவாக்கப்படும்.',
    },
  };

  const topic = HELP_TOPICS[activeHelpSheet] || HELP_TOPICS.trip_mode;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-full max-w-lg bg-white dark:bg-[#0B1F3A] rounded-t-3xl sm:rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl text-slate-900 dark:text-white space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF7A1A]/10 text-[#FF7A1A] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold">
                {language === 'ta' ? topic.titleTa : topic.titleEn}
              </h3>
            </div>
            <button
              onClick={closeHelpSheet}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details Sections */}
          <div className="space-y-3 text-xs leading-relaxed">
            {/* What this does */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-[#FF7A1A] flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'இது என்ன செய்கிறது?' : 'What this feature does'}</span>
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {language === 'ta' ? topic.whatTa : topic.whatEn}
              </p>
            </div>

            {/* Data used */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-teal-600 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'பயன்படுத்தப்படும் தரவு' : 'Data it uses'}</span>
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {language === 'ta' ? topic.dataTa : topic.dataEn}
              </p>
            </div>

            {/* Privacy */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-blue-600 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'தனியுரிமை பாதுகாப்பு' : 'Privacy & security'}</span>
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {language === 'ta' ? topic.privacyTa : topic.privacyEn}
              </p>
            </div>

            {/* Practical Example */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1 text-amber-900 dark:text-amber-200">
              <span className="font-bold flex items-center gap-1.5">
                <span>💡 {language === 'ta' ? 'நடைமுறை உதாரணம்' : 'Real-world example'}</span>
              </span>
              <p>{language === 'ta' ? topic.exampleTa : topic.exampleEn}</p>
            </div>
          </div>

          {/* Got it action button */}
          <button
            type="button"
            onClick={closeHelpSheet}
            className="w-full py-3 rounded-2xl bg-[#0B1F3A] dark:bg-white text-white dark:text-[#0B1F3A] font-bold text-xs shadow-md transition-all active:scale-95"
          >
            {language === 'ta' ? 'புரிந்தது' : 'Got it'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
