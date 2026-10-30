import React from 'react';
import { motion } from 'motion/react';
import { Plane } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface AnimatedAirplaneProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'navy' | 'orange' | 'teal';
  flightState?: 'cruising' | 'takeoff' | 'landing';
  fromCode?: string;
  toCode?: string;
  className?: string;
}

export const AnimatedAirplane: React.FC<AnimatedAirplaneProps> = ({
  size = 'md',
  theme = 'orange',
  flightState = 'cruising',
  fromCode = 'MAA (Chennai)',
  toCode = 'CJB (Coimbatore/Ooty)',
  className = '',
}) => {
  const reduceAnimations = useTripStore((s) => s.reduceAnimations);

  const sizeClasses = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-36',
  }[size];

  const themeColors = {
    navy: '#0B1F3A',
    orange: '#FF7A1A',
    teal: '#14B8A6',
  }[theme];

  if (reduceAnimations) {
    return (
      <div className={`flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 ${className}`}>
        <span className="font-mono text-xs font-bold text-slate-300">{fromCode}</span>
        <Plane className="w-5 h-5 text-[#FF7A1A]" />
        <span className="font-mono text-xs font-bold text-slate-300">{toCode}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden select-none py-2 ${sizeClasses} ${className}`}>
      {/* Flight Route Baseline */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] ring-4 ring-[#14B8A6]/20" />
          <span className="text-[10px] font-mono font-bold text-slate-400 mt-1">{fromCode}</span>
        </div>

        {/* Curved / Dotted Flight Path */}
        <div className="flex-1 mx-4 h-0.5 border-b-2 border-dashed border-slate-300 dark:border-slate-700 relative">
          <motion.div
            className="absolute -top-1 h-2 bg-gradient-to-r from-transparent via-[#FF7A1A] to-transparent rounded-full"
            animate={{
              left: ['0%', '100%'],
              width: ['20px', '40px', '20px'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div className="flex flex-col items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A1A] ring-4 ring-[#FF7A1A]/20" />
          <span className="text-[10px] font-mono font-bold text-slate-400 mt-1">{toCode}</span>
        </div>
      </div>

      {/* Realistic Airliner SVG Motion */}
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none"
        animate={{
          x: ['-5%', '105%'],
          y: flightState === 'takeoff' ? ['20%', '-25%'] : flightState === 'landing' ? ['-25%', '20%'] : ['-4%', '4%', '-4%'],
          rotate: flightState === 'takeoff' ? [-8, -2] : flightState === 'landing' ? [2, 8] : [-1, 1, -1],
        }}
        transition={{
          x: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div className="relative flex items-center">
          {/* Contrail / Vapor Trail */}
          <div className="w-24 h-1 bg-gradient-to-l from-white/80 to-transparent blur-xs -mr-2" />

          {/* High-Fidelity Twin-Engine Airliner SVG */}
          <svg
            width="64"
            height="36"
            viewBox="0 0 120 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Soft Ground Shadow */}
            <ellipse cx="60" cy="65" rx="45" ry="4" fill="rgba(0,0,0,0.18)" />

            {/* Fuselage (Navy & White livery) */}
            <path
              d="M10 32C10 32 30 26 70 26C105 26 118 31 118 33C118 35 105 40 70 40C30 40 10 34 10 32Z"
              fill="#FFFFFF"
              stroke="#0B1F3A"
              strokeWidth="1.5"
            />
            {/* Aero Navy Accent Stripe */}
            <path
              d="M25 33C40 31 75 31 115 33C110 35 75 36 25 35Z"
              fill="#0B1F3A"
            />
            {/* Orange Tail Fin */}
            <path
              d="M12 32L5 10C5 10 14 9 24 16L28 32Z"
              fill={themeColors}
              stroke="#0B1F3A"
              strokeWidth="1"
            />
            {/* Main Swept Wing */}
            <path
              d="M50 34L68 56C71 58 76 57 75 54L68 34Z"
              fill="#E2E8F0"
              stroke="#0B1F3A"
              strokeWidth="1"
            />
            {/* Orange Winglet */}
            <path d="M68 56L72 58L74 54Z" fill={themeColors} />

            {/* Cockpit Windshield */}
            <path d="M104 29C108 30 112 31 113 32L107 33Z" fill="#14B8A6" />

            {/* Passenger Windows */}
            {[38, 48, 58, 68, 78, 88, 98].map((x) => (
              <circle key={x} cx={x} cy="33" r="1.3" fill="#14B8A6" />
            ))}

            {/* Under-wing Turbofan Engine with Exhaust Glow */}
            <rect x="58" y="44" width="16" height="7" rx="3.5" fill="#334155" stroke="#0B1F3A" strokeWidth="1" />
            <circle cx="73" cy="47.5" r="2.5" fill="#FF7A1A" opacity="0.9" />

            {/* Strobe Beacon Light */}
            <circle cx="62" cy="26" r="1.5" fill="#EF4444" className="animate-ping" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
