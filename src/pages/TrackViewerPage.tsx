import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass,
  Radio,
  ExternalLink,
  PhoneCall,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MessageCircle,
  Copy,
  Check,
  Navigation,
} from 'lucide-react';
import { getLiveLocation } from '../services/apiService';

export const TrackViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trackData, setTrackData] = useState<any>({
    latitude: 11.4102,
    longitude: 76.6950,
    speed: 28,
    accuracy: 8,
    address: 'Commercial Road near Charring Cross, Ooty, Tamil Nadu 643001',
    updatedAt: new Date().toLocaleTimeString(),
    trip: 'Chennai to Ooty 3-Day Journey',
    travelerName: 'Karthik Ramanathan',
    status: 'Active Live Sharing',
  });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch initial tracking data
    getLiveLocation(id).then((data) => {
      if (data) setTrackData((prev: any) => ({ ...prev, ...data }));
    });

    const interval = setInterval(async () => {
      const data = await getLiveLocation(id);
      if (data) {
        setTrackData((prev: any) => ({ ...prev, ...data }));
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [id]);

  const mapsLocationUrl = `https://www.google.com/maps/search/?api=1&query=${trackData.latitude},${trackData.longitude}`;
  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${trackData.latitude},${trackData.longitude}&travelmode=driving`;

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#071427] text-slate-900 dark:text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white dark:bg-[#0B1F3A] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0B1F3A] to-[#FF7A1A] flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-base font-extrabold">TripPilot AI Live Tracking</h1>
              <p className="text-xs text-slate-400">Tracking ID: {id}</p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Live Sharing ON</span>
          </span>
        </div>

        {/* Traveler & Journey Overview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Traveler: {trackData.travelerName || 'Karthik Ramanathan'}
          </div>
          <div className="text-xs text-slate-500">
            Trip: {trackData.trip || 'Chennai to Ooty 3-Day Journey'}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            📍 Current Location: {trackData.address}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-0.5">
            <span className="text-[10px] text-slate-400">Current Speed</span>
            <div className="text-base font-extrabold text-[#FF7A1A]">
              {trackData.speed || 28} km/h
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-0.5">
            <span className="text-[10px] text-slate-400">GPS Accuracy</span>
            <div className="text-base font-extrabold text-teal-600">
              ±{trackData.accuracy || 8} meters
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-0.5">
            <span className="text-[10px] text-slate-400">Latitude / Longitude</span>
            <div className="font-mono font-bold text-xs">
              {Number(trackData.latitude).toFixed(4)}°, {Number(trackData.longitude).toFixed(4)}°
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-0.5">
            <span className="text-[10px] text-slate-400">Last Synced</span>
            <div className="font-bold text-xs text-slate-700 dark:text-slate-300">
              {trackData.updatedAt || 'Just now'}
            </div>
          </div>
        </div>

        {/* Google Maps Actions */}
        <div className="space-y-2.5">
          <a
            href={mapsLocationUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#0B1F3A] dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 border border-slate-700 transition"
          >
            <ExternalLink className="w-4 h-4 text-[#14B8A6]" />
            <span>Open Current Location in Google Maps</span>
          </a>

          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#14B8A6] hover:bg-[#0f766e] text-white font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions to Traveler</span>
          </a>
        </div>

        {/* Emergency Quick Calls */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Need emergency dispatch?</span>
          <a
            href="tel:112"
            className="font-bold text-red-500 hover:underline flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 112</span>
          </a>
        </div>

        {/* Return to App link */}
        <div className="text-center">
          <Link
            to="/companion"
            className="text-xs text-[#FF7A1A] font-bold hover:underline"
          >
            &larr; Open Full TripPilot AI App
          </Link>
        </div>
      </div>
    </div>
  );
};
