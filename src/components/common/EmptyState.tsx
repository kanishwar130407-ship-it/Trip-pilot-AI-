import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, HelpCircle, LucideIcon, ArrowRight, RefreshCw, Package, MapPin, FileCheck2 } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface EmptyStateProps {
  type?: 'planner' | 'package' | 'companion' | 'replanning' | 'dossier' | 'generic';
  headline?: string;
  supportingText?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: LucideIcon;
  badge?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  headline,
  supportingText,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon: CustomIcon,
  badge,
}) => {
  const language = useTripStore((s) => s.language);
  const preloadDemoTrip = useTripStore((s) => s.preloadDemoTrip);
  const openHelpSheet = useTripStore((s) => s.openHelpSheet);
  const setStep = useTripStore((s) => s.setStep);

  // Default presets based on type
  const PRESETS: Record<
    string,
    {
      headline: string;
      headlineTa: string;
      supporting: string;
      supportingTa: string;
      primary: string;
      primaryTa: string;
      secondary: string;
      secondaryTa: string;
      icon: LucideIcon;
      color: string;
      helpSheet?: string;
      primaryAction: () => void;
    }
  > = {
    planner: {
      headline: 'Tell us where you want to go — or try Demo Mode',
      headlineTa: 'எங்கு செல்ல விரும்புகிறீர்கள் என்று கூறுங்கள் — அல்லது டெமோ பயன்முறையை முயற்சிக்கவும்',
      supporting: 'Plan an autonomous AI itinerary with real routes, live weather, and budget optimization.',
      supportingTa: 'உண்மையான வழித்தடங்கள், நேரலை வானிலை மற்றும் பட்ஜெட் பகுப்பாய்வுடன் கூடிய AI பயண திட்டம்.',
      primary: 'Explore Destinations',
      primaryTa: 'இடங்களை ஆராயுங்கள்',
      secondary: 'Try Ooty Demo Trip',
      secondaryTa: 'ஊட்டி டெமோவை முயற்சிக்கவும்',
      icon: MapPin,
      color: 'from-orange-500 to-amber-500',
      helpSheet: 'trip_mode',
      primaryAction: () => {},
    },
    package: {
      headline: 'Choose a package that fits your budget',
      headlineTa: 'உங்கள் பட்ஜெட்டுக்கு ஏற்ற தொகுப்பைத் தேர்ந்தெடுக்கவும்',
      supporting: 'Generate an itinerary first to unlock budget-tiered curated packages, stays, and verified transport.',
      supportingTa: 'முதலில் பயணத் திட்டத்தை உருவாக்கி, பட்ஜெட்டுக்கு ஏற்ற தொகுப்புகள் மற்றும் தங்குமிடங்களைத் திறக்கவும்.',
      primary: 'Go to Trip Planner',
      primaryTa: 'திட்டமிடலுக்குச் செல்க',
      secondary: 'Load Demo Packages',
      secondaryTa: 'டெமோ தொகுப்புகளை ஏற்று',
      icon: Package,
      color: 'from-teal-500 to-cyan-500',
      helpSheet: 'budget',
      primaryAction: () => setStep(1),
    },
    companion: {
      headline: 'Your live trip dashboard will appear after booking',
      headlineTa: 'முன்பதிவு செய்த பிறகு உங்கள் நேரலை பயண கட்டுப்பாட்டகம் தோன்றும்',
      supporting: 'Real-time GPS tracking, hill road risk monitoring, trusted contacts sharing, and offline SOS guide.',
      supportingTa: 'நேரலை ஜிபிஎஸ் டிராக்கிங், மலைப்பாதை ஆபத்து பகுப்பாய்வு, குடும்ப பகிர்வு மற்றும் ஆஃப்லைன் SOS.',
      primary: 'Review & Book Trip',
      primaryTa: 'முன்பதிவு செய்யுங்கள்',
      secondary: 'Simulate Demo Journey',
      secondaryTa: 'டெமோ பயணத்தை உருவகப்படுத்துங்கள்',
      icon: Compass,
      color: 'from-blue-600 to-teal-500',
      helpSheet: 'live_sharing',
      primaryAction: () => setStep(3),
    },
    replanning: {
      headline: 'No disruptions detected. Simulate one to see AI replanning',
      headlineTa: 'எந்த தடங்கலும் கண்டறியப்படவில்லை. AI மாற்றியமைப்பை காண ஒன்றை உருவகப்படுத்தவும்',
      supporting: 'When landslides, heavy rains, train cancellations, or cab strikes occur, Gemini autonomously re-routes in 3 seconds.',
      supportingTa: 'மழை, நிலச்சரிவு அல்லது ரயில் ரத்து ஏற்படும் போது, ஜெமினி 3 நொடிகளில் மாற்று வழியை வழங்கும்.',
      primary: 'Simulate Road Blockage',
      primaryTa: 'சாலை தடையை உருவகப்படுத்துங்கள்',
      secondary: 'View Replanning Guide',
      secondaryTa: 'வழிகாட்டுதலைப் பார்க்கவும்',
      icon: RefreshCw,
      color: 'from-amber-500 to-orange-600',
      helpSheet: 'replanning',
      primaryAction: () => {},
    },
    dossier: {
      headline: 'Complete your trip to generate a shareable dossier',
      headlineTa: 'பகிர்ந்து கொள்ளக்கூடிய பயண ஆவணத்தை உருவாக்க பயணத்தை முடிக்கவும்',
      supporting: 'Download verified PDF expense receipts, emergency health cards, day-by-day photo memory timeline, and carbon offset report.',
      supportingTa: 'ஜிஎஸ்டி ரசீதுகள், அவசர மருத்துவ அட்டை, புகைப்பட நினைவுகள் மற்றும் கார்பன் அறிக்கை ஆகியவற்றை பதிவிறக்கவும்.',
      primary: 'Go to Companion Tracker',
      primaryTa: 'துணை டிராக்கருக்குச் செல்க',
      secondary: 'Load Sample Dossier',
      secondaryTa: 'மாதிரி ஆவணத்தைக் காட்டு',
      icon: FileCheck2,
      color: 'from-emerald-500 to-teal-600',
      helpSheet: 'dossier',
      primaryAction: () => setStep(4),
    },
    generic: {
      headline: 'No items to display right now',
      headlineTa: 'தற்போது காட்ட உருப்படிகள் எதுவும் இல்லை',
      supporting: 'Get started by creating a new plan or trying demo data.',
      supportingTa: 'புதிய திட்டத்தை உருவாக்குவதன் மூலம் தொடங்கவும் அல்லது டெமோவை முயற்சிக்கவும்.',
      primary: 'Start Planning',
      primaryTa: 'திட்டமிடத் தொடங்குங்கள்',
      secondary: 'Try Demo Mode',
      secondaryTa: 'டெமோவை முயற்சிக்கவும்',
      icon: Sparkles,
      color: 'from-slate-700 to-slate-900',
      primaryAction: () => setStep(1),
    },
  };

  const currentPreset = PRESETS[type] || PRESETS.generic;
  const FinalIcon = CustomIcon || currentPreset.icon;

  const displayHeadline = headline || (language === 'ta' ? currentPreset.headlineTa : currentPreset.headline);
  const displaySupporting = supportingText || (language === 'ta' ? currentPreset.supportingTa : currentPreset.supporting);
  const displayPrimary = primaryActionLabel || (language === 'ta' ? currentPreset.primaryTa : currentPreset.primary);
  const displaySecondary = secondaryActionLabel || (language === 'ta' ? currentPreset.secondaryTa : currentPreset.secondary);

  const handlePrimary = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      currentPreset.primaryAction();
    }
  };

  const handleSecondary = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else if (currentPreset.helpSheet) {
      openHelpSheet(currentPreset.helpSheet);
    } else {
      preloadDemoTrip();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto my-8 p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl text-center flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-[#FF7A1A]/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {badge && (
        <span className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          {badge}
        </span>
      )}

      {/* Floating Low-Poly Animated Icon Bubble */}
      <div className="relative mb-6">
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${currentPreset.color} flex items-center justify-center text-white shadow-xl shadow-orange-500/20`}
        >
          <FinalIcon className="w-10 h-10 stroke-[2.2]" />
        </motion.div>

        {/* Orbiting accent dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-2 pointer-events-none"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#14B8A6] shadow-md border-2 border-white dark:border-slate-900" />
        </motion.div>
      </div>

      {/* Headline */}
      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight max-w-md mb-2.5">
        {displayHeadline}
      </h3>

      {/* Supporting Text */}
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-8">
        {displaySupporting}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
        <button
          onClick={handlePrimary}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF7A1A] to-[#ff9342] hover:from-[#e86b12] hover:to-[#e67e2a] text-white font-bold text-sm shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          <span>{displayPrimary}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleSecondary}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>{displaySecondary}</span>
        </button>
      </div>
    </motion.div>
  );
};
