import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Check,
  Plane,
  Train,
  Bus,
  Car,
  Hotel,
  ArrowRight,
  QrCode,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';
import { AnimatedAirplane } from './AnimatedAirplane';
import { AnimatedTrain } from './AnimatedTrain';
import { AnimatedBus } from './AnimatedBus';
import { AnimatedCar } from './AnimatedCar';
import { AnimatedHotel } from './AnimatedHotel';

interface BookingSuccessVehicleModalProps {
  isOpen: boolean;
  onProceed: () => void;
}

export const BookingSuccessVehicleModal: React.FC<BookingSuccessVehicleModalProps> = ({
  isOpen,
  onProceed,
}) => {
  const bookingId = useTripStore((s) => s.bookingId);
  const plannerForm = useTripStore((s) => s.plannerForm);
  const selectedPackage = useTripStore((s) => s.selectedPackage);
  const travelers = useTripStore((s) => s.travelers);
  const language = useTripStore((s) => s.language);

  // Trigger celebration confetti on mount
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF7A1A', '#14B8A6', '#0B1F3A', '#FEF08A'],
        });
      } catch (err) {
        // fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mode = plannerForm.travelMode.toLowerCase();
  const isFlight = mode.includes('flight');
  const isTrain = mode.includes('train');
  const isBus = mode.includes('bus');
  const isCar = mode.includes('cab') || mode.includes('road');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="bg-white dark:bg-[#071427] rounded-3xl p-6 sm:p-8 max-w-xl w-full text-center border border-teal-500/40 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Top Animated Green Checkmark */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#14B8A6] to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/40">
            <Check className="w-9 h-9 stroke-[3] animate-bounce" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'பதிவு உறுதிசெய்யப்பட்டது' : 'Booking Verified & Confirmed'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {language === 'ta' ? 'உங்கள் பயணம் தயாராகிவிட்டது!' : 'Your Journey is Ready!'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Autonomous safety sentinel and real-time live GPS tracking have been activated.
            </p>
          </div>

          {/* Mode-Specific Vehicle Live Animation Widget */}
          <div className="rounded-2xl p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            {isFlight ? (
              <AnimatedAirplane flightState="takeoff" fromCode={plannerForm.from} toCode={plannerForm.destination} />
            ) : isTrain ? (
              <AnimatedTrain isStoppedAtStation stationName="Coimbatore / Mettupalayam" />
            ) : isBus ? (
              <AnimatedBus isStopped stopName={plannerForm.destination} />
            ) : (
              <AnimatedCar riskLevel="low" />
            )}
          </div>

          {/* Boarding Pass / Ticket Summary Slip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#14B8A6]/20 border border-[#FF7A1A]/40 text-white text-left space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span className="text-[10px] font-mono text-slate-300 block">OFFICIAL BOOKING ID</span>
                <span className="text-lg font-mono font-black text-[#FF7A1A] tracking-wider">{bookingId}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <QrCode className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Sector</span>
                <span className="font-bold">{plannerForm.from} &rarr; {plannerForm.destination}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Package & Travelers</span>
                <span className="font-bold">{selectedPackage?.name} ({travelers.length} Pax)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Dates</span>
                <span className="font-bold">{plannerForm.startDate} to {plannerForm.endDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Confirmed & Active</span>
                </span>
              </div>
            </div>
          </div>

          {/* Large Action Continue Button */}
          <button
            type="button"
            onClick={onProceed}
            className="w-full py-4 rounded-2xl bg-[#FF7A1A] hover:bg-[#ff8c38] text-white font-black text-sm shadow-xl shadow-[#FF7A1A]/40 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>{language === 'ta' ? 'நேரலை துணைவரைத் தொடங்குக' : 'Launch Live Companion Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
