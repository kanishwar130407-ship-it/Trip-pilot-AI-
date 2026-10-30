import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Check,
  X,
  History,
  ShieldCheck,
  TrendingDown,
  Clock,
  ArrowRight,
  CloudRain,
  Train,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { DISRUPTION_PRESETS } from '../data/mockTripData';
import { ReplanOption } from '../types/trip';
import { replanWithAi } from '../services/apiService';
import { translations } from '../i18n/translations';

export const ReplanningPage: React.FC = () => {
  const language = useTripStore((s) => s.language);
  const t = translations[language] || translations.en;

  const activeDisruption = useTripStore((s) => s.activeDisruption);
  const replanOptions = useTripStore((s) => s.replanOptions);
  const replanHistory = useTripStore((s) => s.replanHistory);
  const triggerDisruption = useTripStore((s) => s.triggerDisruption);
  const applyReplanOption = useTripStore((s) => s.applyReplanOption);
  const dismissDisruption = useTripStore((s) => s.dismissDisruption);
  const plannerForm = useTripStore((s) => s.plannerForm);
  const estimatedTotalCost = useTripStore((s) => s.estimatedTotalCost);

  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const handleApply = (opt: ReplanOption) => {
    applyReplanOption(opt);
    setAppliedNotice(`Successfully applied: "${opt.title}"`);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B1F3A] to-[#FF7A1A]/20 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A1A]/20 border border-[#FF7A1A]/40 text-[#FF7A1A] text-xs font-semibold uppercase tracking-wider mb-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Autonomous AI Disruption Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t.replanning.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {t.replanning.subtitle}
        </p>
      </div>

      {/* Applied Notice */}
      {appliedNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-teal-500/15 border border-teal-500/40 text-teal-800 dark:text-teal-200 text-xs font-bold flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-teal-500 stroke-[3]" />
          <span>{appliedNotice}</span>
        </motion.div>
      )}

      {/* Simulation triggers strip */}
      <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF7A1A]" />
            <span>Simulate Disruption Event</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Click to test AI instant recovery
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {DISRUPTION_PRESETS.map((d) => {
            const isActive = activeDisruption?.id === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => triggerDisruption(d.id)}
                className={`p-3 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#FF7A1A]/10 border-[#FF7A1A] ring-2 ring-[#FF7A1A] shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                  {d.title}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="capitalize">{d.severity}</span>
                  <span className="text-[#FF7A1A] font-semibold">{d.safetyRisk} Risk</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Disruption & AI Options Card */}
      {activeDisruption ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: What happened & Impact */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-red-500/30 dark:border-red-500/20 shadow-md space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-xs font-bold text-red-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>Active Disruption Detected</span>
                </span>
                <button
                  onClick={dismissDisruption}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activeDisruption.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {activeDisruption.description}
                </p>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Cost Delta</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeDisruption.impactCost > 0 ? `+₹${activeDisruption.impactCost}` : '₹0'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Time Delay</span>
                  <span className="text-xs font-bold text-amber-500">
                    {activeDisruption.impactTime}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Risk Status</span>
                  <span className="text-xs font-bold text-red-500">
                    {activeDisruption.safetyRisk}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI Replan Alternatives */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#14B8A6]" />
              <span>AI Replan Solutions (Guaranteed to finish trip safely)</span>
            </h2>

            <div className="space-y-3">
              {replanOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-teal-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {opt.title}
                    </h3>
                    <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">
                      Confidence: {opt.confidenceScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {opt.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <strong>Budget Diff:</strong>{' '}
                      <span className={opt.costDifference <= 0 ? 'text-teal-600 font-bold' : 'text-amber-500'}>
                        {opt.costDifference <= 0
                          ? `Saves ₹${Math.abs(opt.costDifference)}`
                          : `+₹${opt.costDifference}`}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <strong>Time:</strong> {opt.timeImpact}
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <strong>Risk Level:</strong>{' '}
                      <span className="font-bold text-teal-600">{opt.riskLevel}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-[11px] text-slate-500 italic">
                    Trade-off: {opt.tradeOffs}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleApply(opt)}
                      className="py-2.5 px-6 rounded-xl bg-[#14B8A6] hover:bg-[#0f766e] text-white text-xs font-bold shadow-md shadow-teal-500/30 flex items-center gap-1.5 active:scale-95 transition"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{t.replanning.approveOption}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#0B1F3A] border border-slate-200 dark:border-slate-800 space-y-2">
          <ShieldCheck className="w-10 h-10 text-teal-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            All Routes Clear & On Schedule
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Zero active weather or transport disruptions detected on Chennai to Ooty route. Click any simulation event above to test instant replanning.
          </p>
        </div>
      )}

      {/* Replan History Audit Trail */}
      <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-4 h-4 text-[#FF7A1A]" />
          <span>{t.replanning.history}</span>
        </h2>

        {replanHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">
            No previous replan actions taken during this trip.
          </p>
        ) : (
          <div className="space-y-2">
            {replanHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {rec.timestamp}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {rec.disruption}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{rec.summary}</p>
                </div>

                <span
                  className={`text-xs font-bold shrink-0 ${
                    rec.costDelta <= 0 ? 'text-teal-600' : 'text-amber-500'
                  }`}
                >
                  {rec.costDelta <= 0 ? `Saved ₹${Math.abs(rec.costDelta)}` : `+₹${rec.costDelta}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
