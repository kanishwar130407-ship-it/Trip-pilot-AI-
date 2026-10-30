import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Train,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Luggage,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  Compass,
  Info,
  Check,
  HelpCircle,
  Play,
  RotateCcw,
  Flame,
  Wallet,
  Bike,
  HeartHandshake,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { planTripWithAi } from '../services/apiService';
import { LivingTripGlobe } from '../components/3d/LivingTripGlobe';
import { EmptyState } from '../components/common/EmptyState';
import { translations } from '../i18n/translations';
import { TripModeType } from '../types/trip';

export const PlannerPage: React.FC = () => {
  const language = useTripStore((s) => s.language);
  const t = translations[language] || translations.en;

  const plannerForm = useTripStore((s) => s.plannerForm);
  const setPlannerField = useTripStore((s) => s.setPlannerField);
  const itinerary = useTripStore((s) => s.itinerary);
  const estimatedTotalCost = useTripStore((s) => s.estimatedTotalCost);
  const packingChecklist = useTripStore((s) => s.packingChecklist);
  const safetyNotes = useTripStore((s) => s.safetyNotes);
  const whyThisPlan = useTripStore((s) => s.whyThisPlan);
  const setItinerary = useTripStore((s) => s.setItinerary);
  const currentStep = useTripStore((s) => s.currentStep);
  const setStep = useTripStore((s) => s.setStep);
  const unlockStep = useTripStore((s) => s.unlockStep);
  const preloadDemoTrip = useTripStore((s) => s.preloadDemoTrip);
  const resetAllDemo = useTripStore((s) => s.resetAllDemo);
  const openHelpSheet = useTripStore((s) => s.openHelpSheet);
  const addToast = useTripStore((s) => s.addToast);
  const quickPlanMode = useTripStore((s) => s.quickPlanMode);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showGlobe, setShowGlobe] = useState(true);
  const [sourceBadge, setSourceBadge] = useState<'demo' | 'gemini'>('gemini');

  // Form field touched/validation states
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Budget fit evaluation
  const budgetRatio = estimatedTotalCost / (plannerForm.budget || 15000);
  const budgetFitStatus =
    budgetRatio <= 0.85
      ? 'under'
      : budgetRatio <= 1.05
      ? 'near'
      : 'over';

  const handleGenerate = async (targetPace?: 'Relaxed' | 'Balanced' | 'Packed') => {
    if (!plannerForm.destination.trim()) {
      addToast(
        language === 'ta' ? 'தயவுசெய்து சேருமிடத்தை உள்ளிடவும்' : 'Please enter a destination',
        'warning'
      );
      return;
    }

    setIsGenerating(true);
    const pace = targetPace || plannerForm.pace;
    setPlannerField('pace', pace);

    const payload = {
      ...plannerForm,
      pace,
      language,
    };

    const result = await planTripWithAi(payload);

    if (result.data) {
      setItinerary(
        result.data.itinerary || itinerary,
        result.data.estimatedTotalCost || estimatedTotalCost,
        result.data.packingChecklist || packingChecklist,
        result.data.safetyNotes || safetyNotes,
        result.data.whyThisPlan || whyThisPlan
      );
      setSourceBadge(result.source);
      addToast(
        language === 'ta'
          ? 'AI பயணத் திட்டம் வெற்றிகரமாக உருவாக்கப்பட்டது!'
          : 'AI itinerary planned successfully!',
        'success'
      );
    }

    setIsGenerating(false);
  };

  const handleFinish = () => {
    unlockStep(2);
    setStep(2); // navigate to package page
  };

  const handleQuickAction = (mode: TripModeType, dest: string, budget: number) => {
    quickPlanMode(mode);
    setPlannerField('destination', dest);
    setPlannerField('budget', budget);
    addToast(
      language === 'ta'
        ? `${dest} தேர்வு செய்யப்பட்டது (${mode})`
        : `Selected ${dest} for ${mode} trip`,
      'info'
    );
  };

  const stepNames: Record<number, { en: string; ta: string }> = {
    1: { en: '1. AI Itinerary Planner', ta: '1. AI பயண திட்டம்' },
    2: { en: '2. Curated Packages', ta: '2. பயண தொகுப்புகள்' },
    3: { en: '3. Traveler Verification & Payment', ta: '3. பயணியர் சரிபார்ப்பு' },
    4: { en: '4. Live Companion & Safety', ta: '4. நேரலை துணை & பாதுகாப்பு' },
    5: { en: '5. Autonomous Replanning', ta: '5. தன்னிச்சை மறுதிட்டமிடல்' },
    6: { en: '6. Trip Dossier & Memories', ta: '6. பயண ஆவணம்' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Persistent "Continue where you left off" Card */}
      {plannerForm.destination && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1F3A] to-slate-900 border border-slate-700/80 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FF7A1A]/20 border border-[#FF7A1A]/40 flex items-center justify-center text-[#FF7A1A] shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30">
                  {language === 'ta' ? 'தொடரவும்' : 'CONTINUE WHERE YOU LEFT OFF'}
                </span>
                <span className="text-xs text-slate-400">
                  {language === 'ta' ? stepNames[currentStep]?.ta : stepNames[currentStep]?.en}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                {plannerForm.from} ➔ {plannerForm.destination}
              </h3>
              <p className="text-xs text-slate-300">
                {itinerary.length} Days • {plannerForm.travelers} Traveler(s) • ₹{plannerForm.budget.toLocaleString()} Budget
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (currentStep === 1) {
                  handleFinish();
                } else {
                  setStep(currentStep);
                }
              }}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A1A] to-[#ff9342] hover:from-[#e86b12] hover:to-[#e67e2a] text-white font-bold text-xs shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{language === 'ta' ? 'பயணத்தைத் தொடரவும்' : 'Continue Trip'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                resetAllDemo();
                addToast(
                  language === 'ta' ? 'புதிய பயணம் தொடங்கியது' : 'Started fresh new trip',
                  'info'
                );
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'புதிய பயணம்' : 'Start New'}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0B1F3A] to-[#14B8A6]/20 p-6 rounded-3xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A1A]/20 border border-[#FF7A1A]/40 text-[#FF7A1A] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous AI Travel Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.planner.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {t.planner.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => preloadDemoTrip()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FF7A1A] hover:bg-[#ff8c38] text-white transition shadow-md shadow-[#FF7A1A]/30 flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.planner.demoPreload}</span>
          </button>
          <button
            onClick={() => setShowGlobe(!showGlobe)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>{showGlobe ? 'Hide 3D Globe' : 'Show 3D Globe'}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Category Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          {language === 'ta' ? 'விரைவு பயணங்கள்:' : 'Quick Plan:'}
        </span>
        <button
          onClick={() => handleQuickAction('weekend', 'Pondicherry', 8000)}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#FF7A1A] flex items-center gap-1.5 shrink-0 transition"
        >
          <Clock className="w-3.5 h-3.5 text-[#FF7A1A]" />
          <span>{language === 'ta' ? 'வார இறுதி பயணம்' : 'Plan weekend trip'}</span>
        </button>
        <button
          onClick={() => handleQuickAction('budget', 'Kodaikanal', 9500)}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#14B8A6] flex items-center gap-1.5 shrink-0 transition"
        >
          <Wallet className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>{language === 'ta' ? 'சிக்கன இடங்கள்' : 'Find budget destinations'}</span>
        </button>
        <button
          onClick={() => handleQuickAction('pilgrimage', 'Rameswaram', 12000)}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500 flex items-center gap-1.5 shrink-0 transition"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
          <span>{language === 'ta' ? 'புனித யாத்திரை' : 'Plan pilgrimage'}</span>
        </button>
        <button
          onClick={() => handleQuickAction('bike', 'Ooty', 10500)}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-red-500 flex items-center gap-1.5 shrink-0 transition"
        >
          <Bike className="w-3.5 h-3.5 text-red-500" />
          <span>{language === 'ta' ? 'பைக் பயணம்' : 'Plan bike trip'}</span>
        </button>
      </div>

      {/* 3D Living Globe Banner */}
      {showGlobe && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-3xl overflow-hidden glass-card shadow-lg border border-slate-200 dark:border-slate-800 p-2 relative"
        >
          <LivingTripGlobe
            fromCity={plannerForm.from}
            toCity={plannerForm.destination}
            className="w-full h-64 sm:h-80"
          />
        </motion.div>
      )}

      {/* Two Column Layout: Left Form & Right Itinerary Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editable Form Fields */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF7A1A]" />
                <span>Trip Parameters & Budget</span>
              </h2>
              <button
                type="button"
                onClick={() => preloadDemoTrip()}
                className="text-[11px] font-semibold text-[#14B8A6] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{language === 'ta' ? 'டெமோ விவரங்களை நிரப்பு' : 'Fill demo details'}</span>
              </button>
            </div>

            {/* From City & Destination */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF7A1A]" />
                  <span>{t.planner.fromLabel}</span>
                </label>
                <input
                  type="text"
                  name="from"
                  placeholder="e.g. Chennai"
                  value={plannerForm.from}
                  onChange={(e) => setPlannerField('from', e.target.value)}
                  onBlur={() => setTouched({ ...touched, from: true })}
                  className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#14B8A6]" />
                    <span>{t.planner.destLabel}</span>
                  </label>
                  {touched.destination && !plannerForm.destination && (
                    <span className="text-[10px] text-red-500 font-bold">Required</span>
                  )}
                </div>
                <input
                  type="text"
                  name="destination"
                  placeholder="e.g. Ooty"
                  value={plannerForm.destination}
                  onChange={(e) => setPlannerField('destination', e.target.value)}
                  onBlur={() => setTouched({ ...touched, destination: true })}
                  className={`w-full py-2.5 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                    touched.destination && !plannerForm.destination
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-[#14B8A6]'
                  }`}
                />
              </div>
            </div>

            {/* Start and End Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{t.planner.startDate}</span>
                </label>
                <input
                  type="date"
                  value={plannerForm.startDate}
                  onChange={(e) => setPlannerField('startDate', e.target.value)}
                  className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{t.planner.endDate}</span>
                </label>
                <input
                  type="date"
                  value={plannerForm.endDate}
                  onChange={(e) => setPlannerField('endDate', e.target.value)}
                  className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Travelers & Budget with Smart Help */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>{t.planner.travelers}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={plannerForm.travelers}
                  onChange={(e) => setPlannerField('travelers', Number(e.target.value))}
                  className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <IndianRupee className="w-3 h-3 text-emerald-500" />
                    <span>{t.planner.budget}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => openHelpSheet('budget')}
                    className="text-slate-400 hover:text-[#FF7A1A]"
                    title="Budget Tracker Help"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="number"
                  step="1000"
                  value={plannerForm.budget}
                  onChange={(e) => setPlannerField('budget', Number(e.target.value))}
                  className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            {/* Travel Mode & Stay Preference */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Train className="w-3 h-3 text-slate-400" />
                  <span>{t.planner.travelMode}</span>
                </label>
                <select
                  value={plannerForm.travelMode}
                  onChange={(e) => setPlannerField('travelMode', e.target.value)}
                  className="w-full py-2.5 px-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Train + Road">Train + Road (Scenic Cog)</option>
                  <option value="Private Cab">Private Cab (End-to-End)</option>
                  <option value="Flight + Cab">Flight + Cab</option>
                  <option value="Bus + Local">Bus + Local Transit</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t.planner.stayPref}
                </label>
                <select
                  value={plannerForm.stayPreference}
                  onChange={(e) => setPlannerField('stayPreference', e.target.value)}
                  className="w-full py-2.5 px-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Budget hotel / homestay">Budget Homestay</option>
                  <option value="3-Star Mountain Resort">3-Star Mountain Resort</option>
                  <option value="Heritage Colonial Bungalow">Heritage Colonial Bungalow</option>
                  <option value="Backpacker Hostel">Backpacker Hostel</option>
                </select>
              </div>
            </div>

            {/* Pace Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
                {t.planner.pace}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Relaxed', 'Balanced', 'Packed'] as const).map((p) => {
                  const isSel = plannerForm.pace === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleGenerate(p)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                        isSel
                          ? 'bg-[#FF7A1A] border-[#FF7A1A] text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {p === 'Relaxed'
                        ? t.planner.relaxed
                        : p === 'Balanced'
                        ? t.planner.balanced
                        : t.planner.packed}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#14B8A6] hover:from-[#14B8A6] hover:to-[#0B1F3A] text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FF7A1A]" />
                  <span>{t.planner.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FF7A1A]" />
                  <span>{t.planner.generateBtn}</span>
                </>
              )}
            </button>
          </div>

          {/* Budget Fit Indicator Card */}
          <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Estimated Trip Spend
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  budgetFitStatus === 'under'
                    ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
                    : budgetFitStatus === 'near'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-red-500/15 text-red-600 dark:text-red-400'
                }`}
              >
                {budgetFitStatus === 'under'
                  ? t.planner.budgetFitUnder
                  : budgetFitStatus === 'near'
                  ? t.planner.budgetFitNear
                  : t.planner.budgetFitOver}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{estimatedTotalCost.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">
                Target: ₹{plannerForm.budget.toLocaleString()}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetFitStatus === 'under'
                    ? 'bg-teal-500'
                    : budgetFitStatus === 'near'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, Math.round(budgetRatio * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Day-by-Day Itinerary & Packing Checklist */}
        <div className="lg:col-span-7 space-y-5">
          {itinerary.length === 0 ? (
            <EmptyState
              type="planner"
              onPrimaryAction={() => handleGenerate()}
              onSecondaryAction={() => preloadDemoTrip()}
            />
          ) : (
            <>
              {/* Why this plan box */}
              <div className="bg-amber-50 dark:bg-[#0B1F3A]/70 border border-amber-200/80 dark:border-amber-900/30 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#FF7A1A] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-[#FF7A1A] mr-1.5">{t.planner.whyThisPlan}:</span>
                  {whyThisPlan}
                </div>
              </div>

              {/* Day-by-Day Cards */}
              <div className="space-y-4">
                {itinerary.map((dayItem) => (
                  <div
                    key={dayItem.day}
                    className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#FF7A1A] text-white flex items-center justify-center text-xs font-bold">
                          {dayItem.day}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Day {dayItem.day}: {dayItem.title}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Day Total: ₹{dayItem.dayTotalCost.toLocaleString()}
                      </span>
                    </div>

                    {/* Activities list */}
                    <div className="space-y-2.5">
                      {dayItem.activities.map((act) => (
                        <div
                          key={act.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {act.time}
                              </span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {act.activity}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              📍 {act.location} • {act.notes}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium">
                              {act.weatherDependency}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {act.estimatedCost > 0 ? `₹${act.estimatedCost}` : 'Included'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Packing & Safety Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-[#FF7A1A]" />
                    <span>{t.planner.packingList}</span>
                  </h3>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    {packingChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-500" />
                    <span>{t.planner.safetyNotes}</span>
                  </h3>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    {safetyNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A1A] shrink-0 mt-1.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Glowing Finish Button to Package Page */}
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="py-3.5 px-8 rounded-2xl bg-[#FF7A1A] hover:bg-[#ff8c38] text-white text-sm font-bold shadow-xl shadow-[#FF7A1A]/30 flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <span>{t.planner.proceedBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
