import React from 'react';
import { Calendar, Package, Compass, RefreshCw, FileText, AlertTriangle } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';
import { translations } from '../../i18n/translations';

export const BottomNav: React.FC = () => {
  const currentStep = useTripStore((s) => s.currentStep);
  const setStep = useTripStore((s) => s.setStep);
  const maxUnlockedStep = useTripStore((s) => s.maxUnlockedStep);
  const language = useTripStore((s) => s.language);
  const setSosActive = useTripStore((s) => s.setSosActive);
  const t = translations[language] || translations.en;

  const tabs = [
    { step: 1, icon: Calendar, label: t.steps.planner },
    { step: 2, icon: Package, label: t.steps.package },
    { step: 4, icon: Compass, label: t.steps.companion, isCenter: true },
    { step: 5, icon: RefreshCw, label: t.steps.replanning },
    { step: 6, icon: FileText, label: t.steps.dossier },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#071427]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40 md:hidden pb-safe">
      <div className="flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentStep === tab.step;
          const isLocked = tab.step > maxUnlockedStep;

          if (tab.isCenter) {
            return (
              <button
                key={tab.step}
                type="button"
                onClick={() => setStep(tab.step)}
                className="flex flex-col items-center -mt-5 relative group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-[#FF7A1A] ring-4 ring-[#FF7A1A]/30 shadow-[#FF7A1A]/50 scale-105'
                      : 'bg-gradient-to-tr from-[#0B1F3A] to-[#14B8A6]'
                  }`}
                >
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-white mt-1">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.step}
              type="button"
              disabled={isLocked}
              onClick={() => setStep(tab.step)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
                isActive
                  ? 'text-[#FF7A1A] font-bold'
                  : isLocked
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
