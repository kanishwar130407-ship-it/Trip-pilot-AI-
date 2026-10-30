import React from 'react';
import { motion } from 'motion/react';
import { Bus, MapPin } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface AnimatedBusProps {
  isStopped?: boolean;
  stopName?: string;
  className?: string;
}

export const AnimatedBus: React.FC<AnimatedBusProps> = ({
  isStopped = false,
  stopName = 'Ooty Main Bus Terminus',
  className = '',
}) => {
  const reduceAnimations = useTripStore((s) => s.reduceAnimations);

  if (reduceAnimations) {
    return (
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-[#14B8A6]" />
          <span className="text-xs font-bold text-slate-300">Nilgiri Super Luxury AC Coach</span>
        </div>
        <span className="text-xs font-mono text-teal-400">Stop: {stopName}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden select-none py-3 ${className}`}>
      {/* Highway Asphalt Road Surface */}
      <div className="relative h-12 flex items-center">
        <div className="absolute inset-x-0 bottom-1 h-7 bg-slate-800 dark:bg-slate-900 rounded-lg border-t border-slate-700">
          {/* Dashed White Center Lane Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-around pointer-events-none">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-5 h-0.5 bg-white/70 rounded-full" />
            ))}
          </div>
        </div>

        {/* Realistic Multi-Axle Volvo Coach SVG */}
        <motion.div
          className="absolute bottom-2 left-0 pointer-events-none"
          animate={{
            x: isStopped ? '45%' : ['-20%', '110%'],
            y: isStopped ? 0 : [0, -1.5, 0],
          }}
          transition={{
            x: { duration: isStopped ? 0.6 : 8, repeat: isStopped ? 0 : Infinity, ease: 'linear' },
            y: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="relative flex items-center">
            {/* Bus Headlight Beam */}
            <div className="absolute left-[92px] top-4 w-28 h-6 bg-gradient-to-r from-yellow-200/40 via-yellow-200/15 to-transparent blur-xs pointer-events-none -rotate-3" />

            <svg width="105" height="46" viewBox="0 0 120 50" fill="none" className="drop-shadow-lg">
              {/* Soft Ground Shadow */}
              <ellipse cx="60" cy="46" rx="52" ry="3" fill="rgba(0,0,0,0.25)" />

              {/* Main Coach Body (Aero White & Navy) */}
              <rect x="10" y="8" width="98" height="32" rx="4" fill="#FFFFFF" stroke="#0B1F3A" strokeWidth="1.5" />
              {/* Sweeping Teal & Orange Livery Stripe */}
              <path d="M10 26C30 26 50 32 108 30V38C60 38 40 36 10 38Z" fill="#14B8A6" />
              <path d="M10 22C40 22 65 27 108 26V29C60 29 35 25 10 25Z" fill="#FF7A1A" />

              {/* Front Aerodynamic Windshield */}
              <path d="M96 9L106 18C108 20 108 26 108 28H96Z" fill="#0B1F3A" />
              <path d="M97 10L105 18C106 20 106 25 106 27H97Z" fill="#38BDF8" opacity="0.85" />

              {/* Tinted Passenger Windows */}
              {[15, 29, 43, 57, 71, 85].map((wx) => (
                <rect key={wx} x={wx} y="11" width="11" height="11" rx="1.5" fill="#0F172A" />
              ))}

              {/* Headlights & Taillights */}
              <circle cx="106" cy="34" r="2.5" fill="#FEF08A" />
              <rect x="9.5" y="32" width="2" height="4" rx="1" fill="#EF4444" />

              {/* Multi-axle Wheels (Front, Rear Dual) */}
              <circle cx="28" cy="40" r="5.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="82" cy="40" r="5.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="95" cy="40" r="5.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            </svg>
          </div>
        </motion.div>
      </div>

      {isStopped && (
        <div className="flex justify-center mt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Bus Boarding at {stopName}</span>
          </span>
        </div>
      )}
    </div>
  );
};
