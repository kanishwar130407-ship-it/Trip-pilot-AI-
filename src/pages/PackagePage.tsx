import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Check,
  Star,
  ShieldCheck,
  ArrowRight,
  Split,
  X,
  Hotel,
  Car,
  UtensilsCrossed,
  Info,
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { TravelPackage } from '../types/trip';
import { AirshipsComparison3D } from '../components/3d/AirshipsComparison3D';
import { translations } from '../i18n/translations';

export const PackagePage: React.FC = () => {
  const language = useTripStore((s) => s.language);
  const t = translations[language] || translations.en;

  const packages = useTripStore((s) => s.packages);
  const selectedPackage = useTripStore((s) => s.selectedPackage);
  const selectPackage = useTripStore((s) => s.selectPackage);
  const comparedPackageIds = useTripStore((s) => s.comparedPackageIds);
  const toggleComparePackage = useTripStore((s) => s.toggleComparePackage);
  const setStep = useTripStore((s) => s.setStep);
  const unlockStep = useTripStore((s) => s.unlockStep);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [show3DAirships, setShow3DAirships] = useState(true);

  const handleSelect = (pkg: TravelPackage) => {
    selectPackage(pkg);
  };

  const handleFinish = () => {
    unlockStep(3);
    setStep(3); // Verification page
  };

  const comparedPackages = packages.filter((p) =>
    comparedPackageIds.includes(p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0B1F3A] to-[#FF7A1A]/20 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A1A]/20 border border-[#FF7A1A]/40 text-[#FF7A1A] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Package Comparison Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.package.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {t.package.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedPackageIds.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
            >
              <Split className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>
                {t.package.compareBtn} ({comparedPackageIds.length}/2)
              </span>
            </button>
          )}

          <button
            onClick={() => setShow3DAirships(!show3DAirships)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {show3DAirships ? 'Hide 3D Airships' : 'Show 3D Airships'}
          </button>
        </div>
      </div>

      {/* 3D Package Airships visual */}
      {show3DAirships && (
        <AirshipsComparison3D
          selectedPackageId={selectedPackage?.id || 'standard'}
          onSelectPackage={(id) => {
            const found = packages.find((p) => p.id === id);
            if (found) selectPackage(found);
          }}
        />
      )}

      {/* 4 Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {packages.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;
          const isCompared = comparedPackageIds.includes(pkg.id);

          return (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -4 }}
              onClick={() => handleSelect(pkg)}
              className={`rounded-3xl p-5 cursor-pointer transition-all duration-200 relative flex flex-col justify-between border ${
                isSelected
                  ? 'bg-white dark:bg-[#0B1F3A] border-[#FF7A1A] ring-2 ring-[#FF7A1A] shadow-xl shadow-[#FF7A1A]/10'
                  : 'bg-white dark:bg-[#0B1F3A]/70 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top badges: AI Best For You / Fit Score */}
                <div className="flex items-center justify-between mb-3">
                  {pkg.isAiRecommended ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#FF7A1A] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{t.package.bestForYou}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {pkg.id.toUpperCase()}
                    </span>
                  )}

                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                    Fit: {pkg.fitScore}%
                  </span>
                </div>

                {/* Package Name & Price */}
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                  {language === 'ta' ? pkg.nameTa : pkg.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-black text-[#FF7A1A]">
                    ₹{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">/ 2 travelers</span>
                </div>

                {/* Rating & reviews */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{pkg.rating}</span>
                  </span>
                  <span>({pkg.reviewCount} reviews)</span>
                </div>

                {/* Details list */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                  <div className="flex items-start gap-2">
                    <Car className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{pkg.transportDetails}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Hotel className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{pkg.hotelDetails}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{pkg.meals}</span>
                  </div>
                </div>

                {/* AI Reason for Standard Package */}
                {pkg.recommendationReason && (
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-[11px] text-orange-900 dark:text-orange-200 leading-snug mb-3">
                    💡 {pkg.recommendationReason}
                  </div>
                )}
              </div>

              {/* Bottom selection & compare checkbox */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComparePackage(pkg.id);
                  }}
                  className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-medium border transition ${
                    isCompared
                      ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {isCompared ? '✓ Added to Compare' : '+ Compare'}
                </button>

                <div
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#FF7A1A] text-white shadow-md shadow-[#FF7A1A]/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Selected Package</span>
                    </>
                  ) : (
                    <span>Select Package</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bottom Bar when package selected */}
      {selectedPackage && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-16 md:bottom-6 z-30 bg-white/95 dark:bg-[#0B1F3A]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7A1A]/10 text-[#FF7A1A] flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Selected Package</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {selectedPackage.name} — ₹{selectedPackage.price.toLocaleString()}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-[#FF7A1A] hover:bg-[#ff8c38] text-white text-xs font-bold shadow-lg shadow-[#FF7A1A]/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>{t.package.finishBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Side-by-Side Comparison Modal */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Split className="w-5 h-5 text-[#FF7A1A]" />
                  <span>Side-by-Side Package Comparison</span>
                </h3>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {comparedPackages.length < 2 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Please select 2 packages from the cards above using the "+ Compare" button.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {comparedPackages.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {p.name}
                        </span>
                        <span className="text-sm font-black text-[#FF7A1A]">
                          ₹{p.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-[11px] space-y-2 text-slate-600 dark:text-slate-300">
                        <div>
                          <strong>Transport:</strong> {p.transportDetails}
                        </div>
                        <div>
                          <strong>Stay:</strong> {p.hotelDetails}
                        </div>
                        <div>
                          <strong>Meals:</strong> {p.meals}
                        </div>
                        <div>
                          <strong>Refund Policy:</strong> {p.refundEstimate}
                        </div>
                        <div>
                          <strong>Fit Score:</strong> {p.fitScore}%
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          selectPackage(p);
                          setIsCompareModalOpen(false);
                        }}
                        className="w-full py-2 rounded-xl text-xs font-bold bg-[#FF7A1A] text-white"
                      >
                        Choose this package
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
