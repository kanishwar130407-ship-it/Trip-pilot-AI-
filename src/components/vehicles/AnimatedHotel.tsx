import React from 'react';
import { motion } from 'motion/react';
import { Hotel, Cloud, Sparkles, Key } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface AnimatedHotelProps {
  hotelName?: string;
  isBooked?: boolean;
  className?: string;
}

export const AnimatedHotel: React.FC<AnimatedHotelProps> = ({
  hotelName = 'Pine Valley Heritage Resort & Spa',
  isBooked = true,
  className = '',
}) => {
  const reduceAnimations = useTripStore((s) => s.reduceAnimations);

  if (reduceAnimations) {
    return (
      <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2">
          <Hotel className="w-5 h-5 text-[#FF7A1A]" />
          <span className="text-xs font-bold text-slate-200">{hotelName}</span>
        </div>
        <span className="text-xs text-teal-400 font-bold">Confirmed</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden select-none py-3 flex flex-col items-center justify-center ${className}`}>
      {/* Drifting Clouds Background */}
      <motion.div
        className="absolute top-1 left-4 text-slate-300 dark:text-slate-600 opacity-40 pointer-events-none"
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-7 h-7" />
      </motion.div>
      <motion.div
        className="absolute top-2 right-8 text-slate-300 dark:text-slate-600 opacity-30 pointer-events-none"
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-9 h-9" />
      </motion.div>

      {/* Modern Resort Building Architecture SVG */}
      <div className="relative flex items-end justify-center">
        <svg width="140" height="85" viewBox="0 0 160 100" fill="none" className="drop-shadow-xl">
          {/* Main Resort Structure */}
          <rect x="25" y="20" width="110" height="75" rx="5" fill="#0B1F3A" stroke="#1E293B" strokeWidth="2" />
          <rect x="35" y="10" width="90" height="15" rx="3" fill="#14B8A6" opacity="0.9" />

          {/* Roof Terrace Pergola */}
          <line x1="38" y1="10" x2="122" y2="10" stroke="#FF7A1A" strokeWidth="2.5" />

          {/* Windows (With staggered warm glow animation) */}
          {[
            { x: 38, y: 32 },
            { x: 62, y: 32 },
            { x: 86, y: 32 },
            { x: 110, y: 32 },
            { x: 38, y: 52 },
            { x: 62, y: 52 },
            { x: 86, y: 52 },
            { x: 110, y: 52 },
          ].map((win, idx) => (
            <motion.rect
              key={idx}
              x={win.x}
              y={win.y}
              width="14"
              height="12"
              rx="2"
              fill="#FEF08A"
              animate={{ opacity: [0.3, 1, 0.8] }}
              transition={{
                duration: 2.5,
                delay: idx * 0.25,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}

          {/* Grand Entrance Glass Doors */}
          <rect x="68" y="74" width="24" height="21" rx="2" fill="#38BDF8" opacity="0.8" />
          <line x1="80" y1="74" x2="80" y2="95" stroke="#0B1F3A" strokeWidth="1.5" />

          {/* Warm Entrance Porch Awning */}
          <path d="M62 74L98 74L92 68L68 68Z" fill="#FF7A1A" />
        </svg>

        {/* Rolling Suitcase Heading to Hotel Entrance */}
        <motion.div
          className="absolute bottom-1 left-2 pointer-events-none"
          animate={{ x: ['0px', '54px', '0px'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative">
            <svg width="20" height="24" viewBox="0 0 24 28" fill="none">
              {/* Suitcase Handle */}
              <path d="M9 2V6H15V2" stroke="#475569" strokeWidth="1.5" />
              {/* Suitcase Body */}
              <rect x="3" y="6" width="18" height="19" rx="3" fill="#FF7A1A" stroke="#0B1F3A" strokeWidth="1" />
              <line x1="3" y1="15" x2="21" y2="15" stroke="#FFFFFF" strokeWidth="1" />
              {/* Tiny Wheels */}
              <circle cx="6" cy="26" r="1.5" fill="#0F172A" />
              <circle cx="18" cy="26" r="1.5" fill="#0F172A" />
            </svg>
          </div>
        </motion.div>
      </div>

      <div className="text-center mt-2">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {hotelName}
        </span>
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-teal-600 dark:text-teal-400 mt-0.5">
          <Key className="w-3 h-3" />
          <span>Room Ready • Digital Check-In Verified</span>
        </div>
      </div>
    </div>
  );
};
