import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Compass,
  AlertTriangle,
  MapPin,
  Share2,
  PhoneCall,
  Clock,
  Shield,
  ShieldAlert,
  Sliders,
  Sparkles,
  Volume2,
  Mic,
  Plus,
  Users,
  Navigation,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Stethoscope,
  HeartPulse,
  Radio,
  FileText,
  Bookmark,
  Send,
  HelpCircle,
  Eye,
  X,
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { RoadRisk3D } from '../components/3d/RoadRisk3D';
import { ControlCenter3D } from '../components/3d/ControlCenter3D';
import { AnimatedCar } from '../components/vehicles/AnimatedCar';
import { AnimatedTrain } from '../components/vehicles/AnimatedTrain';
import { EmptyState } from '../components/common/EmptyState';
import {
  MOCK_HOSPITALS,
  MOCK_POLICE_STATIONS,
  TRAVEL_PHRASES,
} from '../data/mockTripData';
import {
  translateTextWithAi,
  askAssistantAi,
  postLiveLocation,
} from '../services/apiService';
import { translations } from '../i18n/translations';

export const CompanionPage: React.FC = () => {
  const language = useTripStore((s) => s.language);
  const t = translations[language] || translations.en;

  const plannerForm = useTripStore((s) => s.plannerForm);
  const itinerary = useTripStore((s) => s.itinerary);
  const toggleActivityComplete = useTripStore((s) => s.toggleActivityComplete);
  const userLocation = useTripStore((s) => s.userLocation);
  const setUserLocation = useTripStore((s) => s.setUserLocation);
  const isLiveSharing = useTripStore((s) => s.isLiveSharing);
  const shareTrackingId = useTripStore((s) => s.shareTrackingId);
  const shareDuration = useTripStore((s) => s.shareDuration);
  const toggleLiveSharing = useTripStore((s) => s.toggleLiveSharing);
  const stopLiveSharing = useTripStore((s) => s.stopLiveSharing);
  const isSosActive = useTripStore((s) => s.isSosActive);
  const setSosActive = useTripStore((s) => s.setSosActive);
  const trustedContacts = useTripStore((s) => s.trustedContacts);
  const addTrustedContact = useTripStore((s) => s.addTrustedContact);
  const removeTrustedContact = useTripStore((s) => s.removeTrustedContact);
  const roadRiskLevel = useTripStore((s) => s.roadRiskLevel);
  const setRoadRiskLevel = useTripStore((s) => s.setRoadRiskLevel);
  const expenses = useTripStore((s) => s.expenses);
  const addExpense = useTripStore((s) => s.addExpense);
  const removeExpense = useTripStore((s) => s.removeExpense);
  const simulatedTripTimeMinutes = useTripStore((s) => s.simulatedTripTimeMinutes);
  const setSimulatedTripTimeMinutes = useTripStore((s) => s.setSimulatedTripTimeMinutes);
  const setStep = useTripStore((s) => s.setStep);
  const triggerDisruption = useTripStore((s) => s.triggerDisruption);
  const openHelpSheet = useTripStore((s) => s.openHelpSheet);
  const addToast = useTripStore((s) => s.addToast);

  // Active sub-tab in Companion dashboard
  const [activeTab, setActiveTab] = useState<
    'overview' | 'safety' | 'budget' | 'translator' | 'group' | 'health' | 'nav'
  >('overview');

  // 3D Mission Control & Sharing Confirm Modals
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [showSharingConfirm, setShowSharingConfirm] = useState(false);

  // Location tracking state
  const [hasLocationPermission, setHasLocationPermission] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Voice translator state
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Tamil');
  const [phraseInput, setPhraseInput] = useState('');
  const [translatedResult, setTranslatedResult] = useState('');
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  // New Expense form
  const [newExpCat, setNewExpCat] = useState<'Food' | 'Transport' | 'Stay' | 'Activities' | 'Shopping'>('Food');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpNote, setNewExpNote] = useState('');
  const [newExpPaidBy, setNewExpPaidBy] = useState('Karthik');

  // Contact form
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRel, setContactRel] = useState('Family');

  // Healthcare Symptom checker chat
  const [symptomInput, setSymptomInput] = useState('');
  const [symptomChat, setSymptomChat] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Hello. Tell me what symptoms or altitude discomfort you are experiencing (e.g. headache, motion sickness, nausea). Remember: This is AI guidance, not a medical prescription.',
    },
  ]);
  const [isSymptomLoading, setIsSymptomLoading] = useState(false);

  // Group decision AI
  const [groupMembers, setGroupMembers] = useState([
    { name: 'Karthik', budget: 15000, interest: 'Tea Estates & Photography', mustHave: 'Toy Train Ride' },
    { name: 'Priya', budget: 14000, interest: 'Lake Boating & Cafes', mustHave: 'Pykara Speedboat' },
    { name: 'Arun', budget: 12000, interest: 'Ghat Road Riding', mustHave: 'Sunset Point' },
  ]);
  const [groupPlanResult, setGroupPlanResult] = useState<string | null>(null);
  const [groupVotes, setGroupVotes] = useState<Record<string, 'approve' | 'suggest' | 'reject'>>({
    Karthik: 'approve',
    Priya: 'approve',
  });

  // Track ID link
  const trackingUrl = `${window.location.origin}/#/track/${shareTrackingId}`;

  // Periodic location updater
  useEffect(() => {
    if (!isLiveSharing) return;
    const interval = setInterval(() => {
      // Small simulated drift or real geolocation
      const newLat = 11.4102 + (Math.random() - 0.5) * 0.002;
      const newLng = 76.6950 + (Math.random() - 0.5) * 0.002;
      const updateData = {
        latitude: newLat,
        longitude: newLng,
        speed: Math.floor(25 + Math.random() * 15),
        accuracy: 8,
        lastUpdated: new Date().toLocaleTimeString(),
        address: 'Commercial Road near Charring Cross, Ooty, Tamil Nadu 643001',
      };
      setUserLocation(updateData);
      postLiveLocation(shareTrackingId, updateData);
    }, 7000);

    return () => clearInterval(interval);
  }, [isLiveSharing, shareTrackingId]);

  // Handle Voice Translator Speech Synthesis
  const speakTranslation = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = langCode === 'Tamil' ? 'ta-IN' : 'en-IN';
    window.speechSynthesis.speak(utt);
  };

  const handleTranslate = async (textToTranslate?: string) => {
    const text = textToTranslate || phraseInput;
    if (!text.trim()) return;
    setIsTranslating(true);
    const res = await translateTextWithAi(text, sourceLang, targetLang);
    setTranslatedResult(res.translation);
    speakTranslation(res.translation, targetLang);
    setIsTranslating(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpAmount) return;
    addExpense({
      category: newExpCat,
      amount: Number(newExpAmount),
      note: newExpNote || `${newExpCat} expense`,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      paidBy: newExpPaidBy,
    });
    setNewExpAmount('');
    setNewExpNote('');
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    addTrustedContact({
      name: contactName,
      phone: contactPhone,
      relationship: contactRel,
      isPrimary: trustedContacts.length === 0,
    });
    setContactName('');
    setContactPhone('');
  };

  // Symptom checker
  const handleSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim() || isSymptomLoading) return;

    const userMsg = symptomInput;
    setSymptomChat((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setSymptomInput('');
    setIsSymptomLoading(true);

    const tripContext = {
      destination: plannerForm.destination,
      altitude: '2,240 m (Ooty)',
      nearestHospital: MOCK_HOSPITALS[0].name,
    };

    const res = await askAssistantAi(
      `Traveler symptom advice: "${userMsg}". Note: Nilgiri hill station travel. Always include safety disclaimer.`,
      tripContext,
      language
    );

    setSymptomChat((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    setIsSymptomLoading(false);
  };

  // Group decision generator
  const handleGenerateGroupPlan = () => {
    setGroupPlanResult(
      'Balanced Compromise: Start with Nilgiri Toy Train (Karthik & Priya priority), schedule Pykara speedboat at 11:30 AM before winds pick up, and take the scenic Kotagiri ghat curves for Arun at sunset. Estimated budget per person: ₹4,800.'
    );
  };

  // Financial chart data
  const totalBudget = plannerForm.budget || 15000;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const COLORS = ['#FF7A1A', '#14B8A6', '#0B1F3A', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with SOS Alert Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0B1F3A] to-[#14B8A6]/20 p-6 rounded-3xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
              Live Trip Companion Active
            </span>
            {isLiveSharing && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Live Sharing ON
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.companion.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {plannerForm.from} &rarr; {plannerForm.destination} • 2 Travelers
          </p>
        </div>

        {/* Top Actions: 3D Mission Control & SOS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsControlCenterOpen(true)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#14B8A6] to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white flex items-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>{language === 'ta' ? '3D மிஷன் கண்ட்ரோல்' : '3D Mission Control'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSosActive(!isSosActive)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl active:scale-95 ${
                isSosActive
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/40 shadow-red-600/50'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isSosActive ? 'SOS ENGAGED' : t.companion.sosButton}</span>
            </button>
            <button
              type="button"
              onClick={() => openHelpSheet('sos')}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              title="SOS Emergency Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SOS Active Emergency Alert Banner */}
      {isSosActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-red-600/10 border-2 border-red-500 text-red-700 dark:text-red-300 space-y-3"
        >
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 animate-bounce" />
            <span>{t.companion.sosTriggered}</span>
          </div>
          <p className="text-xs leading-relaxed">
            GPS location captured: <strong>11.4102° N, 76.6950° E</strong> (Commercial Road, Ooty).
            Pre-configured WhatsApp and SMS emergency links have been prepared for your trusted contacts.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href="tel:112"
              className="py-2 px-4 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 112 (National Emergency)</span>
            </a>
            <a
              href="tel:108"
              className="py-2 px-4 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Call 108 (Nilgiri Ambulance)</span>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `EMERGENCY SOS from TripPilot AI: I need immediate assistance! My current location: https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Broadcast SOS on WhatsApp</span>
            </a>
          </div>
        </motion.div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Timeline & Location' },
          { id: 'safety', label: 'Safety & Road Risk' },
          { id: 'budget', label: 'Budget & Splitter' },
          { id: 'translator', label: 'Voice Translator' },
          { id: 'health', label: 'Doctor & Symptoms' },
          { id: 'group', label: 'Group Decisions' },
          { id: 'nav', label: 'Street Navigation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#FF7A1A] text-white shadow-md shadow-[#FF7A1A]/30'
                : 'bg-white dark:bg-[#0B1F3A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW (Timeline, Simulation Slider & Live Location Sharing) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Today's Timeline with simulation time slider */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF7A1A]" />
                  <span>{t.companion.todayTimeline}</span>
                </h2>

                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  Simulated Time: {Math.floor(simulatedTripTimeMinutes / 60)}:
                  {String(simulatedTripTimeMinutes % 60).padStart(2, '0')} PM
                </span>
              </div>

              {/* Trip Time Simulation Slider */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Simulate Journey Time:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Day 1 Schedule Slider
                  </span>
                </div>
                <input
                  type="range"
                  min="450"
                  max="1200"
                  value={simulatedTripTimeMinutes}
                  onChange={(e) => setSimulatedTripTimeMinutes(Number(e.target.value))}
                  className="w-full accent-[#FF7A1A] cursor-pointer"
                />
              </div>

              {/* Day 1 activities with toggle complete */}
              <div className="space-y-3">
                {itinerary[0]?.activities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => toggleActivityComplete(0, act.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      act.completed
                        ? 'bg-emerald-500/5 border-emerald-500/30 opacity-75'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm hover:border-[#FF7A1A]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          act.completed
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {act.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {act.time}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              act.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {act.activity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {act.location} • {act.notes}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 shrink-0">
                      {act.estimatedCost > 0 ? `₹${act.estimatedCost}` : 'Included'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Location Tracker & Share Links */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Location Card */}
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span>{t.companion.liveLocation}</span>
                </h2>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  High GPS Accuracy (±{userLocation.accuracy}m)
                </span>
              </div>

              {/* Live Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Coordinates</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {userLocation.latitude.toFixed(4)}° N, {userLocation.longitude.toFixed(4)}° E
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Current Speed</span>
                  <span className="font-bold text-[#FF7A1A]">{userLocation.speed} km/h</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Distance Covered</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {userLocation.distanceTravelledKm} km
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Next Stop ETA</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {userLocation.etaNextActivity}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                📍 {userLocation.address}
              </div>

              {/* Live Sharing Controls */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Live Location Sharing
                    </span>
                    <button
                      type="button"
                      onClick={() => openHelpSheet('live_sharing')}
                      className="text-slate-400 hover:text-[#FF7A1A]"
                      title="Learn about Location Sharing"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (isLiveSharing) {
                        stopLiveSharing();
                        addToast(
                          language === 'ta'
                            ? 'இருப்பிடப் பகிர்வு நிறுத்தப்பட்டது'
                            : 'Live location sharing stopped',
                          'info'
                        );
                      } else {
                        setShowSharingConfirm(true);
                      }
                    }}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                      isLiveSharing
                        ? 'bg-red-500/10 text-red-600 border border-red-500/30'
                        : 'bg-[#14B8A6] text-white shadow-md'
                    }`}
                  >
                    {isLiveSharing ? t.companion.stopSharing : t.companion.startSharing}
                  </button>
                </div>

                {isLiveSharing && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[11px] text-teal-900 dark:text-teal-200 flex items-center justify-between">
                      <span className="font-mono truncate mr-2">Link: {trackingUrl}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(trackingUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 1500);
                        }}
                        className="p-1 text-teal-700 hover:text-teal-900 dark:text-teal-300"
                        title="Copy Tracking Link"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Share Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `I am traveling! Track my live journey on TripPilot AI: ${trackingUrl} (Last updated: ${userLocation.lastUpdated})`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Share on WhatsApp</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Google Maps</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFETY & ROAD RISK */}
      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Smart Road Risk Detection with 3D Hill Road */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#FF7A1A]" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.companion.roadRisk}
                  </h2>
                  <button
                    type="button"
                    onClick={() => openHelpSheet('road_risk')}
                    className="text-slate-400 hover:text-[#FF7A1A]"
                    title="Road Risk Telemetry Guide"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {(['low', 'medium', 'high'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoadRiskLevel(r)}
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border transition ${
                        roadRiskLevel === r
                          ? r === 'high'
                            ? 'bg-red-500 text-white border-red-500'
                            : r === 'medium'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-teal-500 text-white border-teal-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Animated Hill Road & Car */}
              <RoadRisk3D riskLevel={roadRiskLevel} className="w-full h-48 sm:h-56" />

              {/* Realistic Animated Vehicle telemetry */}
              <div className="my-2">
                <AnimatedCar
                  speed={userLocation.speed}
                  riskLevel={roadRiskLevel}
                  weather={roadRiskLevel === 'high' ? 'fog' : 'clear'}
                  isSosActive={isSosActive}
                  routeLabel={`${plannerForm.from || 'Chennai'} → ${plannerForm.destination || 'Ooty'}`}
                />
              </div>

              {/* Risk Reasons & Alternate Routes */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Route Risk Factors (Kallar Ghat - NH 181):</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300">
                  <li>Dense fog patches between Hairpins #7 and #14 after 5:30 PM.</li>
                  <li>Moderate heavy vehicle traffic descending from Coonoor.</li>
                  <li>Road surface damp from afternoon hill mist. Low beam headlights recommended.</li>
                </ul>
              </div>

              {/* 2 Safer Alternative Routes */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  AI Recommended Safer Alternatives:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-teal-600">Via Kotagiri Bypass (SH 15)</span>
                    <p className="text-[11px] text-slate-500">
                      Gentler slopes, minimal fog, adds +14 km (+25 mins) but 60% lower accident score.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-blue-600">Daylight Convoy Descent</span>
                    <p className="text-[11px] text-slate-500">
                      Descend before 4:30 PM with state transport bus convoy. Zero detour required.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerDisruption('disrupt-rain');
                    setStep(5); // Replanning page
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0B1F3A] dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 border border-slate-700 transition"
                >
                  Reroute in Autonomous Replanning Engine &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Trusted Contacts & Emergency Hospital List */}
          <div className="lg:col-span-5 space-y-5">
            {/* Trusted Contacts Card */}
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF7A1A]" />
                <span>Trusted Emergency Contacts ({trustedContacts.length}/5)</span>
              </h2>

              <div className="space-y-2">
                {trustedContacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {c.isPrimary && (
                          <span className="text-[9px] px-1.5 rounded-full bg-[#14B8A6]/20 text-[#14B8A6]">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {c.phone} • {c.relationship}
                      </div>
                    </div>

                    <a
                      href={`tel:${c.phone.replace(/\D/g, '')}`}
                      className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 hover:bg-teal-500/20"
                      title="Call Contact"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Add contact form */}
              {trustedContacts.length < 5 && (
                <form onSubmit={handleAddContact} className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="py-1.5 px-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="py-1.5 px-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold"
                  >
                    + Add Trusted Contact
                  </button>
                </form>
              )}
            </div>

            {/* Nearest Hospitals */}
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-red-500" />
                <span>Nearest Medical Facilities (Ooty & Coonoor)</span>
              </h2>

              <div className="space-y-2">
                {MOCK_HOSPITALS.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{h.name}</span>
                      <span className="text-[10px] text-teal-600 font-semibold">{h.distance}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{h.address}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">🕒 {h.time}</span>
                      <a
                        href={`tel:${h.phone}`}
                        className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{h.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUDGET & EXPENSE SPLITTER */}
      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Budget Overview Chart & Add Expense */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Total Trip Budget & Spend Analytics</span>
              </h2>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Total Budget</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₹{totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Total Spent</span>
                  <span className="text-base font-extrabold text-[#FF7A1A]">
                    ₹{totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Remaining</span>
                  <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
                    ₹{remainingBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Recharts Pie Chart */}
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Add Expense Form */}
              <form onSubmit={handleAddExpense} className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  + Add Live Expense
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <select
                    value={newExpCat}
                    onChange={(e) => setNewExpCat(e.target.value as any)}
                    className="py-2 px-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Stay">Stay</option>
                    <option value="Activities">Activities</option>
                    <option value="Shopping">Shopping</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />

                  <input
                    type="text"
                    placeholder="Note (e.g. Lunch)"
                    value={newExpNote}
                    onChange={(e) => setNewExpNote(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />

                  <button
                    type="submit"
                    className="py-2 px-3 rounded-xl bg-[#FF7A1A] text-white text-xs font-bold shadow-md shadow-[#FF7A1A]/30"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Friends Trip Expense Splitter */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#14B8A6]" />
                <span>Friends Trip Expense Splitter</span>
              </h2>

              <p className="text-xs text-slate-500">
                Automatic equal split calculation between Karthik and Priya:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Karthik</div>
                    <div className="text-[11px] text-slate-400">Paid: ₹4,570</div>
                  </div>
                  <span className="text-xs font-bold text-teal-600">Owed: ₹815</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Priya</div>
                    <div className="text-[11px] text-slate-400">Paid: ₹6,270</div>
                  </div>
                  <span className="text-xs font-bold text-amber-600">Settles: -₹815</span>
                </div>
              </div>

              {/* Settlement Suggestion */}
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-900 dark:text-teal-200">
                💡 <strong>Settlement Plan:</strong> Karthik transfers <strong>₹815</strong> to Priya via UPI to balance all expenses equally.
              </div>

              {/* Expense History List */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Logged Expenses ({expenses.length})
                </span>
                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {exp.note}
                        </span>
                        <span className="text-slate-400 ml-1">({exp.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#FF7A1A]">₹{exp.amount}</span>
                        <button
                          onClick={() => removeExpense(exp.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VOICE & TRAVEL TRANSLATOR */}
      {activeTab === 'translator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#FF7A1A]" />
                <span>Travel Voice & Text Translator</span>
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold mb-1 block">
                    Source Language
                  </label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full py-1.5 px-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Malayalam">Malayalam (മലയാളം)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold mb-1 block">
                    Target Language
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full py-1.5 px-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Malayalam">Malayalam (മലയാളം)</option>
                  </select>
                </div>
              </div>

              {/* Input box */}
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={phraseInput}
                  onChange={(e) => setPhraseInput(e.target.value)}
                  placeholder="Type or speak a travel phrase (e.g. Where is the nearest hospital?)..."
                  className="w-full p-3 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTranslate()}
                    disabled={isTranslating}
                    className="flex-1 py-2 rounded-xl bg-[#FF7A1A] text-white text-xs font-bold shadow-md shadow-[#FF7A1A]/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isTranslating ? 'Translating...' : 'Translate & Speak'}</span>
                  </button>
                </div>
              </div>

              {/* Translation Output Box */}
              {translatedResult && (
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-950 dark:text-teal-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-teal-600 dark:text-teal-400">
                    <span>{targetLang} Translation</span>
                    <button
                      onClick={() => speakTranslation(translatedResult, targetLang)}
                      className="p-1 text-teal-600 hover:text-teal-800"
                      title="Speak Again"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold">{translatedResult}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Essential Phrases in Tamil/English */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#14B8A6]" />
                <span>Offline Quick Emergency & Travel Phrases</span>
              </h2>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {TRAVEL_PHRASES.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#FF7A1A] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <button
                        onClick={() => speakTranslation(item.ta, 'Tamil')}
                        className="text-teal-600 hover:text-teal-700 p-1"
                        title="Pronounce in Tamil"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {item.en}
                    </div>
                    <div className="text-xs font-bold text-[#14B8A6] font-tamil">
                      {item.ta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DOCTOR & SYMPTOM CHECKER */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Emergency Healthcare & Symptom Checker
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    High altitude and ghat travel wellness assistance
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-h-72 overflow-y-auto space-y-3">
                {symptomChat.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#FF7A1A] text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSymptomSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="Describe dizziness, fever, stomach ache, motion sickness..."
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!symptomInput.trim() || isSymptomLoading}
                  className="py-2.5 px-4 rounded-xl bg-[#FF7A1A] text-white font-bold text-xs"
                >
                  Ask
                </button>
              </form>

              {/* Strict Medical Disclaimer */}
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-[11px] text-red-900 dark:text-red-200 leading-snug">
                ⚠️ <strong>Medical Disclaimer:</strong> This is an AI symptom checker, not a medical diagnosis. In case of serious chest pain, breathing difficulty, or severe trauma, call 108 or 112 immediately.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Nilgiris Doctor & Ambulance Direct Calls
              </h3>
              <div className="space-y-2">
                <a
                  href="tel:108"
                  className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4" />
                    <span>Dial 108 Emergency Ambulance</span>
                  </span>
                  <span>Toll Free</span>
                </a>

                <a
                  href="tel:04232442212"
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-between border border-slate-200 dark:border-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-500" />
                    <span>Ooty GH Casualty Ward</span>
                  </span>
                  <span className="text-[11px] text-slate-400">0423-2442212</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GROUP DECISION AI */}
      {activeTab === 'group' && (
        <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF7A1A]" />
                <span>Group Travel Decision AI</span>
              </h2>
              <p className="text-xs text-slate-500">
                Balances conflicting budgets, must-haves, and pace into an optimal group compromise
              </p>
            </div>
            <button
              onClick={handleGenerateGroupPlan}
              className="py-2 px-4 rounded-xl bg-[#FF7A1A] text-white font-bold text-xs shadow-md shadow-[#FF7A1A]/30"
            >
              Generate AI Compromise Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {groupMembers.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
              >
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {m.name}
                </div>
                <div>
                  <strong>Max Budget:</strong> ₹{m.budget.toLocaleString()}
                </div>
                <div>
                  <strong>Interest:</strong> {m.interest}
                </div>
                <div>
                  <strong>Must-Have:</strong> {m.mustHave}
                </div>
              </div>
            ))}
          </div>

          {groupPlanResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-950 dark:text-teal-200 space-y-3"
            >
              <div className="font-bold text-sm text-[#FF7A1A] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Compromise Recommendation:</span>
              </div>
              <p className="leading-relaxed">{groupPlanResult}</p>

              {/* Group Voting Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-teal-500/30">
                <span className="font-bold">Your Vote:</span>
                <button className="px-3 py-1 rounded-full bg-teal-600 text-white font-bold text-xs">
                  ✓ Approve
                </button>
                <button className="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs">
                  Suggest Change
                </button>
                <button className="px-3 py-1 rounded-full bg-slate-700 text-white font-bold text-xs">
                  Reject
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 7: STREET NAVIGATION */}
      {activeTab === 'nav' && (
        <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#14B8A6]" />
              <span>Street Navigation & Turn-by-Turn Directions</span>
            </h2>
            <span className="text-xs font-bold text-[#FF7A1A]">
              Destination: Botanical Gardens, Ooty
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                step: '1',
                instruction: 'Head north on Commercial Road toward Charring Cross roundabout',
                dist: '450 m',
              },
              {
                step: '2',
                instruction: 'Take the 2nd exit onto Garden Road at the fountain circle',
                dist: '1.2 km',
              },
              {
                step: '3',
                instruction: 'Watch for hairpin turn near Lower Bazaar. Keep headlights active in mist.',
                dist: '300 m',
              },
              {
                step: '4',
                instruction: 'Destination Government Botanical Gardens will be on your left',
                dist: 'Arrival',
              },
            ].map((dir, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-bold text-xs">
                    {dir.step}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{dir.instruction}</span>
                </div>
                <span className="font-bold text-slate-500 text-[11px] shrink-0">{dir.dist}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transparent Location Sharing Confirmation Dialog */}
      <AnimatePresence>
        {showSharingConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0B1F3A] border border-slate-200 dark:border-slate-700 p-6 shadow-2xl text-slate-900 dark:text-white space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <h3 className="font-extrabold text-base">
                    {language === 'ta' ? 'இருப்பிடப் பகிர்வை உறுதிசெய்க' : 'Confirm Live Location Sharing'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSharingConfirm(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  {language === 'ta' ? 'பகிரப்படும் தரவுகள்:' : 'Exact Data Shared:'}
                </div>
                <div className="flex justify-between">
                  <span>GPS Coordinates:</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                    {userLocation.latitude.toFixed(4)}° N, {userLocation.longitude.toFixed(4)}° E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle Speed:</span>
                  <span className="font-bold">{userLocation.speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Activity ETA:</span>
                  <span className="font-bold text-amber-500">{userLocation.etaNextActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expiry Duration:</span>
                  <span className="font-bold">1 Hour (Auto-Revokes)</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'ta'
                  ? 'இந்த இணைப்பு தனிப்பட்டதாகும். நீங்கள் இணைப்பைப் பகிரும் நபர்கள் மட்டுமே உங்கள் பயண வரைபடத்தைக் காண முடியும். எந்த நேரத்திலும் நிறுத்தலாம்.'
                  : 'Only persons with your unique link can view this live tracking map. You can revoke access at any second.'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    toggleLiveSharing('1h');
                    setShowSharingConfirm(false);
                    addToast(
                      language === 'ta'
                        ? 'இருப்பிடப் பகிர்வு தொடங்கப்பட்டது! இணைப்பு உருவாக்கப்பட்டது.'
                        : 'Live sharing active! Private tracking URL created.',
                      'success'
                    );
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#14B8A6] to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-500/25 active:scale-95 transition-all"
                >
                  {language === 'ta' ? 'உறுதிசெய்து பகிர்க' : 'Enable & Generate Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSharingConfirm(false)}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3D Mission Control Center Modal */}
      <ControlCenter3D
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
      />
    </div>
  );
};
