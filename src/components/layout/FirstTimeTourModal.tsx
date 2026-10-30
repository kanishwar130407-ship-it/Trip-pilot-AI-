import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Search,
  Sparkles,
  ShieldAlert,
  Bot,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

export const FirstTimeTourModal: React.FC = () => {
  const tourCompleted = useTripStore((s) => s.tourCompleted);
  const setTourCompleted = useTripStore((s) => s.setTourCompleted);
  const language = useTripStore((s) => s.language);

  const [stepIndex, setStepIndex] = useState(0);

  if (tourCompleted) return null;

  const TOUR_STEPS = [
    {
      icon: Compass,
      title: language === 'ta' ? 'TripPilot AI-க்கு வரவேற்கிறோம்' : 'Welcome to TripPilot AI',
      subtitle: language === 'ta' ? 'திட்டமிடுங்கள். பயணியுங்கள். மாற்றுங்கள். பாதுகாப்பாக இருங்கள்.' : 'Plan. Travel. Replan. Stay safe.',
      description:
        language === 'ta'
          ? 'முழுமையான இந்திய மற்றும் உலகளாவிய சுற்றுலா திட்டமிடும் தன்னியக்க AI தளம்.'
          : 'Your autonomous AI travel co-pilot that plans trips, tracks live safety, and automatically replans disruptions.',
      badge: 'Step 1 of 5 • Intro',
    },
    {
      icon: Search,
      title: language === 'ta' ? 'உலகளாவிய தேடல் & பயண முறைகள்' : 'Global Search & 12 Trip Modes',
      subtitle: language === 'ta' ? 'தமிழ்நாடு, இந்தியா & சர்வதேச இடங்கள்' : 'Tamil Nadu, Pan-India & Global Destinations',
      description:
        language === 'ta'
          ? 'குடும்பம், சாகசம், பைக் பயணம், தனி பயணம், அல்லது ஆன்மிகம் என உங்கள் விருப்பத்திற்கேற்ப பயண முறையைத் தேர்வு செய்யுங்கள்.'
          : 'Filter by Family, Adventure, Bike, Solo, or Pilgrimage modes. Type in English or Tamil with instant voice search.',
      badge: 'Step 2 of 5 • Discovery',
    },
    {
      icon: Sparkles,
      title: language === 'ta' ? 'AI பயணத் திட்டமிடுதல் & மாதிரி பயணம்' : 'AI Trip Planner & Instant Demo',
      subtitle: language === 'ta' ? 'நொடிகளில் வரவு-செலவுக்கு ஏற்ற திட்டம்' : 'Personalized itineraries tailored to budget in seconds',
      description:
        language === 'ta'
          ? 'ஒரே கிளிக்கில் மாதிரி பயணத்தை (சென்னை → ஊட்டி ₹15,000-க்குள்) லோட் செய்து திட்டமிடுதலைச் சோதிக்கலாம்.'
          : 'Test the one-click Demo Mode (Chennai to Ooty under ₹15k) to see day-by-day itineraries, budget fit, and smart packing lists.',
      badge: 'Step 3 of 5 • Planning',
    },
    {
      icon: ShieldAlert,
      title: language === 'ta' ? 'நேரலை பாதுகாப்பு & அவசர SOS' : 'Live Safety Sentinel & SOS',
      subtitle: language === 'ta' ? 'மலைப்பாதை அபாய எச்சரிக்கை & நேரலை இருப்பிடப் பகிர்வு' : 'Real-time road risk alerts and encrypted location sharing',
      description:
        language === 'ta'
          ? 'கல்லார் மலைப்பாதை வளைவுகள், பனிமூட்டம் ஆகியவற்றை முன்கூட்டியே அறிந்து, அவசர காலத்தில் 112 மற்றும் 108-ஐ உடனடியாக அழைக்கலாம்.'
          : 'Monitor winding ghat road risks with 3D terrain glowing alerts. Emergency SOS broadcasts live GPS coordinates immediately.',
      badge: 'Step 4 of 5 • Safety',
    },
    {
      icon: Bot,
      title: language === 'ta' ? '24/7 AI உதவியாளர் & மொழிபெயர்ப்பு' : '24/7 Travel Co-Pilot & Translation',
      subtitle: language === 'ta' ? 'குரல் வழி உரையாடல் & மொழிபெயர்ப்பாளர்' : 'Speech-enabled assistant with 5 Indian languages',
      description:
        language === 'ta'
          ? 'திரையின் கீழ் வலது மூலையில் உள்ள 3D உதவியாளர் வழியாக எந்த நேரத்திலும் கேள்விகள் கேட்கலாம்.'
          : 'Ask anything anytime via the bottom-right 3D Orb. Speaks fluent English, Tamil, Hindi, Telugu, and Malayalam.',
      badge: 'Step 5 of 5 • Assistant',
    },
  ];

  const current = TOUR_STEPS[stepIndex];
  const Icon = current.icon;

  const handleFinish = (dontShowAgain: boolean) => {
    setTourCompleted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          key={stepIndex}
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#0B1F3A] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl text-slate-900 dark:text-white space-y-6"
        >
          {/* Header row with step badge and close */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/30">
              {current.badge}
            </span>
            <button
              onClick={() => handleFinish(true)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              title="Skip Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Spotlight Illustration */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B1F3A] via-[#14B8A6] to-[#FF7A1A] p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-[#071427] rounded-2xl flex items-center justify-center text-white">
                <Icon className="w-8 h-8 text-[#FF7A1A]" />
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black">{current.title}</h2>
              <p className="text-xs font-semibold text-[#14B8A6] mt-0.5">{current.subtitle}</p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              {current.description}
            </p>
          </div>

          {/* Step dots indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  stepIndex === i
                    ? 'w-6 bg-[#FF7A1A]'
                    : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              className="py-2 px-3.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'முந்தைய' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleFinish(true)}
              className="text-[11px] text-slate-400 hover:text-[#FF7A1A] font-medium"
            >
              {language === 'ta' ? 'தவிர்' : 'Skip Tour'}
            </button>

            {stepIndex < TOUR_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStepIndex((prev) => prev + 1)}
                className="py-2.5 px-5 rounded-xl bg-[#FF7A1A] hover:bg-[#ff8c38] text-white text-xs font-bold shadow-md shadow-[#FF7A1A]/30 flex items-center gap-1.5 active:scale-95 transition"
              >
                <span>{language === 'ta' ? 'அடுத்தது' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#14B8A6] to-emerald-500 text-white text-xs font-bold shadow-md shadow-teal-500/30 flex items-center gap-1.5 active:scale-95 transition"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{language === 'ta' ? 'தொடங்குக' : 'Get Started'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
