import React from 'react';
import { motion } from 'motion/react';
import { Train as TrainIcon, MapPin } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface AnimatedTrainProps {
  isStoppedAtStation?: boolean;
  stationName?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const AnimatedTrain: React.FC<AnimatedTrainProps> = ({
  isStoppedAtStation = false,
  stationName = 'Mettupalayam (Nilgiri Express)',
  speed = 'normal',
  className = '',
}) => {
  const reduceAnimations = useTripStore((s) => s.reduceAnimations);

  const STATIONS = ['Chennai Central', 'Katpadi', 'Salem', 'Coimbatore', 'Mettupalayam'];

  if (reduceAnimations) {
    return (
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2">
          <TrainIcon className="w-5 h-5 text-[#FF7A1A]" />
          <span className="text-xs font-bold text-slate-300">Nilgiri Mountain Express Rail</span>
        </div>
        <span className="text-xs font-mono text-teal-400">Station: {stationName}</span>
      </div>
    );
  }

  const duration = speed === 'fast' ? 7 : speed === 'slow' ? 14 : 10;

  return (
    <div className={`relative w-full overflow-hidden select-none py-4 ${className}`}>
      {/* Top Station Waypoints Bar */}
      <div className="flex items-center justify-between px-6 mb-3 text-[10px] font-mono text-slate-400">
        {STATIONS.map((st, i) => (
          <span key={st} className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${i === 4 ? 'bg-[#FF7A1A]' : 'bg-[#14B8A6]'}`} />
            <span className="hidden sm:inline">{st}</span>
          </span>
        ))}
      </div>

      {/* Railway Track with Ballast & Sleepers */}
      <div className="relative h-10 flex items-center">
        {/* Ground Ballast gravel line */}
        <div className="absolute inset-x-0 bottom-2.5 h-2 bg-slate-300 dark:bg-slate-700/80 rounded" />

        {/* Steel Rail lines (Twin parallel) */}
        <div className="absolute inset-x-0 bottom-3.5 h-0.5 bg-slate-400 dark:bg-slate-500" />
        <div className="absolute inset-x-0 bottom-1.5 h-0.5 bg-slate-400 dark:bg-slate-500" />

        {/* Ties / Wooden Sleepers */}
        <div className="absolute inset-x-0 bottom-1 flex justify-around pointer-events-none opacity-40">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="w-1.5 h-4 bg-amber-950/80 dark:bg-amber-800 rounded-xs" />
          ))}
        </div>

        {/* Moving Train Group */}
        <motion.div
          className="absolute bottom-3 left-0 pointer-events-none flex items-end gap-1.5"
          animate={{
            x: isStoppedAtStation ? '40%' : ['-30%', '110%'],
          }}
          transition={{
            duration: isStoppedAtStation ? 0.8 : duration,
            repeat: isStoppedAtStation ? 0 : Infinity,
            ease: isStoppedAtStation ? 'easeOut' : 'linear',
          }}
        >
          {/* Locomotive (WAP-7 / Nilgiri Mountain Steam Style) */}
          <div className="relative flex items-end">
            <svg width="84" height="42" viewBox="0 0 110 50" fill="none" className="drop-shadow-md">
              {/* Locomotive Body */}
              <rect x="10" y="10" width="80" height="28" rx="4" fill="#0B1F3A" stroke="#1E293B" strokeWidth="1.5" />
              {/* Front Aerodynamic Nose */}
              <path d="M90 14L104 28C105 32 105 38 90 38Z" fill="#FF7A1A" />
              {/* Cab Windows */}
              <rect x="74" y="15" width="14" height="10" rx="2" fill="#14B8A6" />
              {/* Side Air Louvers */}
              <line x1="25" y1="18" x2="65" y2="18" stroke="#FF7A1A" strokeWidth="2" />
              <line x1="25" y1="23" x2="65" y2="23" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Headlight beam */}
              <circle cx="102" cy="28" r="3" fill="#FEF08A" />
              {/* Wheels */}
              <circle cx="22" cy="40" r="5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="36" cy="40" r="5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="70" cy="40" r="5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="84" cy="40" r="5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            </svg>
          </div>

          {/* Passenger Carriage 1 */}
          <div className="relative flex items-end">
            <svg width="76" height="38" viewBox="0 0 100 45" fill="none" className="drop-shadow-sm">
              <rect x="5" y="8" width="90" height="26" rx="3" fill="#1E293B" stroke="#0B1F3A" strokeWidth="1.5" />
              <line x1="5" y1="18" x2="95" y2="18" stroke="#14B8A6" strokeWidth="2" />
              {/* Windows */}
              {[15, 30, 45, 60, 75].map((wx) => (
                <rect key={wx} x={wx} y="11" width="9" height="7" rx="1.5" fill="#38BDF8" opacity="0.9" />
              ))}
              {/* Wheels */}
              <circle cx="20" cy="36" r="4.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="32" cy="36" r="4.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="68" cy="36" r="4.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="80" cy="36" r="4.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
            </svg>
          </div>

          {/* Passenger Carriage 2 */}
          <div className="relative flex items-end">
            <svg width="76" height="38" viewBox="0 0 100 45" fill="none" className="drop-shadow-sm">
              <rect x="5" y="8" width="90" height="26" rx="3" fill="#1E293B" stroke="#0B1F3A" strokeWidth="1.5" />
              <line x1="5" y1="18" x2="95" y2="18" stroke="#FF7A1A" strokeWidth="2" />
              {[15, 30, 45, 60, 75].map((wx) => (
                <rect key={wx} x={wx} y="11" width="9" height="7" rx="1.5" fill="#FEF08A" opacity="0.9" />
              ))}
              <circle cx="20" cy="36" r="4.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="32" cy="36" r="4.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="68" cy="36" r="4.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="80" cy="36" r="4.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
            </svg>
          </div>
        </motion.div>
      </div>

      {isStoppedAtStation && (
        <div className="flex justify-center mt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/40 text-[#14B8A6] text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Train Halted at {stationName}</span>
          </span>
        </div>
      )}
    </div>
  );
};
