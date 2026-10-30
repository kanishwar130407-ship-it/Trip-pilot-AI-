import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Package,
  ShieldCheck,
  Compass,
  RefreshCw,
  FileText,
  Lock,
  Check,
  Sparkles,
  Bot,
  AlertTriangle,
  Moon,
  Sun,
  Globe2,
  Sliders,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';
import { SupportedLanguage } from '../../types/trip';
import { translations } from '../../i18n/translations';

interface SidebarProps {
  isMobileDrawer?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileDrawer = false, onClose }) => {
  const currentStep = useTripStore((s) => s.currentStep);
  const maxUnlockedStep = useTripStore((s) => s.maxUnlockedStep);
  const completedSteps = useTripStore((s) => s.completedSteps);
  const setStep = useTripStore((s) => s.setStep);
  const language = useTripStore((s) => s.language);
  const setLanguage = useTripStore((s) => s.setLanguage);
  const darkMode = useTripStore((s) => s.darkMode);
  const toggleDarkMode = useTripStore((s) => s.toggleDarkMode);
  const reduce3dEffects = useTripStore((s) => s.reduce3dEffects);
  const toggleReduce3dEffects = useTripStore((s) => s.toggleReduce3dEffects);
  const reduceAnimations = useTripStore((s) => s.reduceAnimations);
  const toggleReduceAnimations = useTripStore((s) => s.toggleReduceAnimations);
  const toggleAssistant = useTripStore((s) => s.toggleAssistant);
  const setSosActive = useTripStore((s) => s.setSosActive);
  const preloadDemoTrip = useTripStore((s) => s.preloadDemoTrip);
  const resetAllDemo = useTripStore((s) => s.resetAllDemo);
  const addToast = useTripStore((s) => s.addToast);
  const userProfile = useTripStore((s) => s.userProfile);
  const bookingId = useTripStore((s) => s.bookingId);
  const isBooked = useTripStore((s) => s.isBooked);
  const t = translations[language] || translations.en;

  const NAV_ITEMS = [
    { step: 1, label: t.steps.planner, icon: Calendar, path: '/planner' },
    { step: 2, label: t.steps.package, icon: Package, path: '/package' },
    { step: 3, label: t.steps.verification, icon: ShieldCheck, path: '/verification' },
    { step: 4, label: t.steps.companion, icon: Compass, path: '/companion' },
    { step: 5, label: t.steps.replanning, icon: RefreshCw, path: '/replanning' },
    { step: 6, label: t.steps.dossier, icon: FileText, path: '/dossier' },
  ];

  // Completion percentage
  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / 5) * 100));

  const handleNavClick = (step: number) => {
    if (step > maxUnlockedStep) {
      addToast(
        language === 'ta'
          ? 'முதலில் முந்தைய படியை முடிக்கவும்.'
          : 'Complete the previous step first to unlock.',
        'warning'
      );
      return;
    }
    setStep(step);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-[#0B1F3A] text-white p-4 select-none overflow-y-auto border-r border-slate-800 ${
        isMobileDrawer ? 'w-72' : 'w-72 shadow-2xl'
      }`}
    >
      <div className="space-y-5">
        {/* Top Logo and Mobile Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div
            onClick={() => handleNavClick(1)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF7A1A] to-[#14B8A6] flex items-center justify-center text-white shadow-md shadow-[#FF7A1A]/30 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">TripPilot</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FF7A1A] text-white">AI</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {language === 'ta' ? 'தன்னியக்க பயண OS' : 'Autonomous Travel OS'}
              </p>
            </div>
          </div>

          {isMobileDrawer && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Profile Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-[#FF7A1A] flex items-center justify-center text-white font-extrabold text-xs shadow-inner">
              KR
            </div>
            <div>
              <div className="text-xs font-bold text-white line-clamp-1">{userProfile.name}</div>
              <div className="text-[10px] font-mono text-[#14B8A6]">
                {isBooked ? bookingId : 'Draft Trip'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              resetAllDemo();
              addToast(language === 'ta' ? 'மீட்டமைக்கப்பட்டது' : 'Trip demo reset', 'info');
            }}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg"
            title="Reset Demo State"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Trip Progress Card with Mini Bar */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#14B8A6]/10 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              {language === 'ta' ? 'பயண நிலை' : 'Trip Journey Progress'}
            </span>
            <span className="font-mono font-bold text-[#FF7A1A]">{progressPercent}%</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#14B8A6] to-[#FF7A1A]"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Step {currentStep} of 6</span>
            <span className="text-teal-400 font-medium">
              {NAV_ITEMS.find((n) => n.step === currentStep)?.label}
            </span>
          </div>
        </div>

        {/* 6-Step Navigation Menu */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isCurrent = currentStep === item.step;
            const isCompleted = completedSteps.includes(item.step) || currentStep > item.step;
            const isLocked = item.step > maxUnlockedStep;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => handleNavClick(item.step)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 relative ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#FF7A1A] to-[#ff8c38] text-white shadow-lg shadow-[#FF7A1A]/20 font-bold'
                    : isCompleted
                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    : isLocked
                    ? 'text-slate-400/80 hover:bg-slate-800/40 cursor-not-allowed'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {/* Glowing indicator bar on active */}
                {isCurrent && (
                  <span className="absolute left-0 inset-y-1 w-1 rounded-r-full bg-white" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-teal-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Status icon */}
                <div>
                  {isCompleted && !isCurrent ? (
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-white/70 opacity-60" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Action Shortcuts */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block px-1">
            {language === 'ta' ? 'விரைவு செயல்கள்' : 'Quick Actions'}
          </span>

          <button
            type="button"
            onClick={() => {
              preloadDemoTrip();
              addToast(language === 'ta' ? 'மாதிரி பயணம் ஏற்றப்பட்டது!' : 'Demo Trip loaded: Chennai to Ooty', 'success');
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FF7A1A]/10 hover:bg-[#FF7A1A]/20 text-[#FF7A1A] border border-[#FF7A1A]/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'மாதிரி பயணத்தை தொடங்கு' : 'Start Demo Trip (₹15k)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleAssistant();
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition"
          >
            <Bot className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'ta' ? 'AI உதவியாளரிடம் கேளுங்கள்' : 'Ask AI Travel Co-Pilot'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSosActive(true);
              setStep(4);
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency SOS Hotline (112/108)</span>
          </button>
        </div>
      </div>

      {/* Bottom Settings & Accessibility Section */}
      <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-400">
        {/* Language selector & Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-slate-900 text-white rounded-lg px-2 py-1 text-xs border border-slate-700"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="ml">മലയാളം</option>
            </select>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* 3D / Animation Toggles for low-end devices */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
          <button
            onClick={toggleReduce3dEffects}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${
              reduce3dEffects ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-slate-400 border-slate-700'
            }`}
          >
            {reduce3dEffects ? '3D Effects: OFF' : '3D Effects: ON'}
          </button>

          <button
            onClick={toggleReduceAnimations}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${
              reduceAnimations ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-slate-400 border-slate-700'
            }`}
          >
            {reduceAnimations ? 'Motion: MIN' : 'Motion: FULL'}
          </button>
        </div>

        <div className="text-[10px] text-slate-400/80 text-center font-mono pt-1">
          TripPilot AI • v2.6 Production Build
        </div>
      </div>
    </aside>
  );
};
