import React from 'react';
import { motion } from 'motion/react';
import { Car, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface AnimatedCarProps {
  riskLevel?: 'low' | 'medium' | 'high';
  isSosActive?: boolean;
  className?: string;
  speed?: number;
  weather?: string;
  routeLabel?: string;
}

export const AnimatedCar: React.FC<AnimatedCarProps> = ({
  riskLevel = 'medium',
  isSosActive = false,
  className = '',
  speed,
  weather,
  routeLabel,
}) => {
  const reduceAnimations = useTripStore((s) => s.reduceAnimations);

  const riskColors = {
    low: { stroke: '#14B8A6', glow: 'rgba(20, 184, 166, 0.4)', text: 'Safe Road Conditions' },
    medium: { stroke: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', text: 'Moderate Ghat Fog / Curves' },
    high: { stroke: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)', text: 'High Risk Alert' },
  }[riskLevel];

  if (reduceAnimations) {
    return (
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-[#FF7A1A]" />
          <span className="text-xs font-bold text-slate-200">Private Hill Transit Vehicle</span>
        </div>
        <span className="text-xs font-bold" style={{ color: riskColors.stroke }}>
          {riskColors.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden select-none py-3 ${className}`}>
      {/* Mountain Winding Road SVG Canvas */}
      <div className="relative h-20 flex items-center justify-center">
        <svg
          viewBox="0 0 500 80"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Road Surface (Dark Asphalt) */}
          <path
            d="M 10 40 Q 130 10 250 45 T 490 35"
            stroke="#1E293B"
            strokeWidth="32"
            strokeLinecap="round"
          />

          {/* Road Edge Glowing Rails based on Risk Level */}
          <path
            d="M 10 24 Q 130 -6 250 29 T 490 19"
            stroke={riskColors.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${riskColors.glow})` }}
          />
          <path
            d="M 10 56 Q 130 26 250 61 T 490 51"
            stroke={riskColors.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${riskColors.glow})` }}
          />

          {/* Dashed Center Road Divider */}
          <path
            d="M 10 40 Q 130 10 250 45 T 490 35"
            stroke="#F8FAFC"
            strokeWidth="1.5"
            strokeDasharray="10 8"
            opacity="0.85"
          />
        </svg>

        {/* Animated Moving Vehicle along winding road */}
        <motion.div
          className="absolute top-3 left-4 pointer-events-none"
          animate={{
            x: isSosActive ? '45%' : ['2%', '85%', '2%'],
            y: isSosActive ? '15%' : ['10%', '35%', '10%'],
            rotate: isSosActive ? 0 : [8, -6, 8],
          }}
          transition={{
            x: { duration: isSosActive ? 0.5 : 7, repeat: isSosActive ? 0 : Infinity, ease: 'easeInOut' },
            y: { duration: isSosActive ? 0.5 : 7, repeat: isSosActive ? 0 : Infinity, ease: 'easeInOut' },
            rotate: { duration: isSosActive ? 0.5 : 7, repeat: isSosActive ? 0 : Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="relative">
            {/* SOS Pulsing Radar Halo when SOS is engaged */}
            {isSosActive && (
              <span className="absolute -inset-4 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
            )}

            {/* Car Headlight Cone */}
            <div className="absolute right-[-60px] top-2 w-20 h-6 bg-gradient-to-r from-yellow-200/40 to-transparent blur-xs rotate-6 pointer-events-none" />

            {/* High-Fidelity SUV / Sedan SVG */}
            <svg width="68" height="34" viewBox="0 0 100 50" fill="none" className="drop-shadow-lg">
              {/* Ground Shadow */}
              <ellipse cx="50" cy="45" rx="42" ry="3.5" fill="rgba(0,0,0,0.3)" />

              {/* Lower Body */}
              <rect x="8" y="22" width="84" height="18" rx="4" fill="#0B1F3A" stroke="#334155" strokeWidth="1.5" />
              {/* Aero Accent Flare */}
              <path d="M12 30H90L85 36H15Z" fill="#FF7A1A" />

              {/* Upper Cabin */}
              <path d="M26 22L38 9H66L78 22Z" fill="#1E293B" stroke="#0B1F3A" strokeWidth="1" />

              {/* Front & Rear Tinted Windows */}
              <path d="M40 11L64 11L72 21H32Z" fill="#38BDF8" opacity="0.8" />

              {/* Headlights & Taillights */}
              <circle cx="90" cy="28" r="2.5" fill="#FEF08A" />
              <rect x="7" y="26" width="2" height="4" rx="1" fill="#EF4444" />

              {/* Wheels */}
              <circle cx="28" cy="40" r="6" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="72" cy="40" r="6" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="28" cy="40" r="2.5" fill="#E2E8F0" />
              <circle cx="72" cy="40" r="2.5" fill="#E2E8F0" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Status Pill */}
      <div className="flex items-center justify-between px-4 mt-1 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riskColors.stroke }} />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {routeLabel ? `${routeLabel} • ` : ''}{riskColors.text}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {isSosActive
            ? 'VEHICLE STOPPED • EMERGENCY RADAR ON'
            : `SPEED: ${speed ?? 32} KM/H • ${weather ? weather.toUpperCase() + ' • ' : ''}CRUISE ACTIVE`}
        </span>
      </div>
    </div>
  );
};
