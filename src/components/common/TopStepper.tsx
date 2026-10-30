import React from 'react';
import { Check, Lock, ChevronRight } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';
import { translations } from '../../i18n/translations';

const STEP_KEYS = [
  { step: 1, key: 'planner', path: '/planner' },
  { step: 2, key: 'package', path: '/package' },
  { step: 3, key: 'verification', path: '/verification' },
  { step: 4, key: 'companion', path: '/companion' },
  { step: 5, key: 'replanning', path: '/replanning' },
  { step: 6, key: 'dossier', path: '/dossier' },
] as const;

export const TopStepper: React.FC = () => {
  const currentStep = useTripStore((s) => s.currentStep);
  const maxUnlockedStep = useTripStore((s) => s.maxUnlockedStep);
  const setStep = useTripStore((s) => s.setStep);
  const language = useTripStore((s) => s.language);
  const t = translations[language] || translations.en;

  const handleStepClick = (targetStep: number) => {
    // Check if unlocked
    if (targetStep <= maxUnlockedStep) {
      setStep(targetStep);
    }
  };

  return (
    <div className="w-full bg-white/70 dark:bg-[#0B1F3A]/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 py-2.5 px-4 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4">
        {STEP_KEYS.map((item, index) => {
          const isCurrent = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          const isLocked = item.step > maxUnlockedStep;
          const label = t.steps[item.key as keyof typeof t.steps];

          return (
            <React.Fragment key={item.step}>
              <button
                type="button"
                onClick={() => handleStepClick(item.step)}
                disabled={isLocked}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#FF7A1A] text-white shadow-md shadow-[#FF7A1A]/30 scale-105'
                    : isCompleted
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20'
                    : isLocked
                    ? 'opacity-40 text-slate-400 cursor-not-allowed'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
                title={isLocked ? 'Complete previous steps to unlock' : label}
              >
                {/* Step indicator circle */}
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-white text-[#FF7A1A]'
                      : isCompleted
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : isLocked ? <Lock className="w-2.5 h-2.5" /> : item.step}
                </span>

                <span>{label}</span>
              </button>

              {index < STEP_KEYS.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
