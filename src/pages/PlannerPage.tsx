import React, { useState } from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { planTripWithAi } from '../services/apiService';
import { LivingTripGlobe } from '../components/3d/LivingTripGlobe';
import { translations } from '../i18n/translations';

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
  const setStep = useTripStore((s) => s.setStep);
  const unlockStep = useTripStore((s) => s.unlockStep);
  const preloadDemoTrip = useTripStore((s) => s.preloadDemoTrip);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showGlobe, setShowGlobe] = useState(true);
  const [sourceBadge, setSourceBadge] = useState<'demo' | 'gemini'>('gemini');

  // Budget fit evaluation
  const budgetRatio = estimatedTotalCost / (plannerForm.budget || 15000);
  const budgetFitStatus =
    budgetRatio <= 0.85
      ? 'under'
      : budgetRatio <= 1.05
      ? 'near'
      : 'over';

  const handleGenerate = async (targetPace?: 'Relaxed' | 'Balanced' | 'Packed') => {
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
    }

    setIsGenerating(false);
  };

  const handleFinish = () => {
    unlockStep(2);
    setStep(2); // navigate to package page
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
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
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#FF7A1A]" />
              <span>Trip Parameters & Budget</span>
            </h2>

            {/* From City & Destination */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF7A1A]" />
                  <span>{t.planner.fromLabel}</span>
                </label>
                <input
                  type="text"
                  value={plannerForm.from}
                  onChange={(e) => setPlannerField('from', e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#14B8A6]" />
                  <span>{t.planner.destLabel}</span>
                </label>
                <input
                  type="text"
                  value={plannerForm.destination}
                  onChange={(e) => setPlannerField('destination', e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
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
                  className="w-full py-2 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
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
                  className="w-full py-2 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Travelers & Budget */}
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
                  className="w-full py-2 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-emerald-500" />
                  <span>{t.planner.budget}</span>
                </label>
                <input
                  type="number"
                  step="1000"
                  value={plannerForm.budget}
                  onChange={(e) => setPlannerField('budget', Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
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
                  className="w-full py-2 px-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
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
                  className="w-full py-2 px-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
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
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
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
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#14B8A6] hover:from-[#14B8A6] hover:to-[#0B1F3A] text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
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
            {itinerary.map((dayItem, dIdx) => (
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
        </div>
      </div>
    </div>
  );
};
