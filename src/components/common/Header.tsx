import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Mic,
  Moon,
  Sun,
  Globe2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  X,
  Compass,
  Users,
  ShieldAlert,
  Flame,
  Heart,
  Utensils,
  Trees,
  Bike,
  Clock,
  Wallet,
  Crown,
  Menu,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';
import { DESTINATIONS } from '../../data/destinations';
import { SupportedLanguage, TripModeType } from '../../types/trip';
import { translations } from '../../i18n/translations';

const TRIP_MODES: {
  id: TripModeType;
  icon: React.FC<{ className?: string }>;
  en: string;
  ta: string;
}[] = [
  { id: 'family', icon: Users, en: 'Family Trip', ta: 'குடும்ப பயணம்' },
  { id: 'adventure', icon: Flame, en: 'Adventure', ta: 'சாஹச பயணம்' },
  { id: 'solo', icon: Compass, en: 'Solo Ride', ta: 'தனி பயணம்' },
  { id: 'friends', icon: Users, en: 'Friends Trip', ta: 'நண்பர்களுடன்' },
  { id: 'honeymoon', icon: Heart, en: 'Honeymoon', ta: 'தேனிலவு பயணம்' },
  { id: 'pilgrimage', icon: ShieldAlert, en: 'Pilgrimage', ta: 'புனித யாத்திரை' },
  { id: 'food', icon: Utensils, en: 'Food Tour', ta: 'உணவு சுற்றுலா' },
  { id: 'nature', icon: Trees, en: 'Nature Escape', ta: 'இயற்கை பயணம்' },
  { id: 'bike', icon: Bike, en: 'Bike Trip', ta: 'பைக் பயணம்' },
  { id: 'weekend', icon: Clock, en: 'Weekend Getaway', ta: 'வார இறுதி' },
  { id: 'budget', icon: Wallet, en: 'Budget Trip', ta: 'சிக்கன பயணம்' },
  { id: 'luxury', icon: Crown, en: 'Luxury Trip', ta: 'ஆடம்பர பயணம்' },
];

export const Header: React.FC = () => {
  const language = useTripStore((s) => s.language);
  const setLanguage = useTripStore((s) => s.setLanguage);
  const darkMode = useTripStore((s) => s.darkMode);
  const toggleDarkMode = useTripStore((s) => s.toggleDarkMode);

  const selectedTripMode = useTripStore((s) => s.selectedTripMode);
  const setSelectedTripMode = useTripStore((s) => s.setSelectedTripMode);
  const setPlannerField = useTripStore((s) => s.setPlannerField);
  const setStep = useTripStore((s) => s.setStep);
  const setSosActive = useTripStore((s) => s.setSosActive);
  const preloadDemoTrip = useTripStore((s) => s.preloadDemoTrip);
  const resetAllDemo = useTripStore((s) => s.resetAllDemo);
  const toggleSidebar = useTripStore((s) => s.toggleSidebar);
  const notifications = useTripStore((s) => s.notifications);
  const markNotificationsRead = useTripStore((s) => s.markNotificationsRead);
  const openHelpSheet = useTripStore((s) => s.openHelpSheet);

  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Ooty',
    'Rameswaram',
    'Kodaikanal',
    'Dubai',
  ]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const t = translations[language] || translations.en;

  // Filter destinations based on query (English or Tamil)
  const filteredDestinations = DESTINATIONS.filter((d) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.nameTa.includes(query) ||
      d.stateOrCountry.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.popularActivities.some((act) => act.toLowerCase().includes(q))
    );
  }).slice(0, 6);

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Web Speech API Voice Search
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your destination.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsSearchOpen(true);
    };

    recognition.start();
  };

  const handleSelectDestination = (dest: (typeof DESTINATIONS)[0]) => {
    setPlannerField('destination', dest.name);
    setPlannerField('destinationId', dest.id);
    setPlannerField('tripMode', selectedTripMode);
    if (!recentSearches.includes(dest.name)) {
      setRecentSearches([dest.name, ...recentSearches.slice(0, 4)]);
    }
    setQuery(dest.name);
    setIsSearchOpen(false);
    setStep(1); // navigate to planner
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Default to nearby South India / Tamil Nadu hill stations
          setQuery('Ooty');
          setIsSearchOpen(true);
        },
        () => {
          setQuery('Chennai');
          setIsSearchOpen(true);
        }
      );
    }
  };

  return (
    <header className="bg-white/90 dark:bg-[#071427]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors z-40 relative">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setStep(1)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B1F3A] to-[#FF7A1A] flex items-center justify-center text-white shadow-md shadow-[#FF7A1A]/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  TripPilot
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {language === 'ta' ? 'சுயசார்பு பயண வழிகாட்டி' : 'Autonomous Travel OS'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar (with English/Tamil support) */}
        <div ref={searchContainerRef} className="flex-1 max-w-xl relative min-w-[240px]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={t.search.placeholder}
              className="w-full pl-10 pr-20 py-2 rounded-full text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] transition shadow-inner"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-1.5 rounded-full transition ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-[#FF7A1A]'
                }`}
                title="Voice Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search Dropdown / Suggestions */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#0B1F3A] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Filtered Results */}
              {filteredDestinations.length > 0 ? (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                    {language === 'ta' ? 'பொருந்தும் இடங்கள்' : 'Matching Destinations'}
                  </div>
                  <div className="space-y-1">
                    {filteredDestinations.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => handleSelectDestination(dest)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#FF7A1A]/10 text-[#FF7A1A] flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{dest.name}</span>
                              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal">
                                {dest.nameTa}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {dest.stateOrCountry} • ₹{dest.approxBudgetPerDay}/day
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {dest.safetyScore}% Safe
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : query.trim() ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  {t.search.noResults}
                </div>
              ) : null}

              {/* Popular destinations & Near me */}
              {!query.trim() && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {t.search.popular}
                    </span>
                    <button
                      onClick={handleNearMe}
                      className="text-[11px] font-medium text-[#14B8A6] flex items-center gap-1 hover:underline"
                    >
                      <MapPin className="w-3 h-3" />
                      {t.search.nearMe}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Ooty', 'Madurai', 'Rameswaram', 'Kodaikanal', 'Dubai', 'Munnar', 'Goa', 'Mahabalipuram'].map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          const found = DESTINATIONS.find((d) => d.name.toLowerCase().includes(p.toLowerCase()));
                          if (found) handleSelectDestination(found);
                          else {
                            setQuery(p);
                            setPlannerField('destination', p);
                          }
                        }}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7A1A]/10 hover:text-[#FF7A1A] dark:hover:text-[#FF7A1A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {recentSearches.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {t.search.recent}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setQuery(r);
                              const found = DESTINATIONS.find((d) => d.name.toLowerCase().includes(r.toLowerCase()));
                              if (found) handleSelectDestination(found);
                            }}
                            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            • {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Tools: Lang, Dark mode, Demo prefill, SOS button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Multilingual Selector */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#FF7A1A]"
              title="Change Language"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>
                {language === 'ta'
                  ? 'தமிழ்'
                  : language === 'hi'
                  ? 'हिन्दी'
                  : language === 'te'
                  ? 'తెలుగు'
                  : language === 'ml'
                  ? 'മലയാളം'
                  : 'EN'}
              </span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-white dark:bg-[#0B1F3A] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 w-32 z-50">
              {[
                { id: 'en', label: 'English' },
                { id: 'ta', label: 'தமிழ் (Tamil)' },
                { id: 'hi', label: 'हिन्दी (Hindi)' },
                { id: 'te', label: 'తెలుగు (Telugu)' },
                { id: 'ml', label: 'മലയാളം (Malayalam)' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id as SupportedLanguage)}
                  className={`text-left px-3 py-1.5 text-xs hover:bg-[#FF7A1A]/10 hover:text-[#FF7A1A] transition ${
                    language === l.id ? 'font-bold text-[#FF7A1A]' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (!isNotificationsOpen) markNotificationsRead();
              }}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#FF7A1A] transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF7A1A] ring-2 ring-white dark:ring-[#071427]" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#0B1F3A] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'ta' ? 'அறிவிப்புகள்' : 'Trip Alerts & Updates'}
                  </span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">Live</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#FF7A1A] transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Preload Demo Trip */}
          <button
            onClick={() => preloadDemoTrip()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/30 hover:bg-[#FF7A1A]/20 transition"
            title="Load sample 3-day Chennai to Ooty trip"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'மாதிரி பயணம்' : 'Demo Trip'}</span>
          </button>

          {/* Reset Demo button */}
          <button
            onClick={() => resetAllDemo()}
            className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition"
            title={t.common.resetDemo}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Quick SOS button */}
          <button
            onClick={() => {
              setSosActive(true);
              setStep(4); // Companion page
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 active:scale-95 transition"
            title="Emergency SOS"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Trip Mode Selector Pills */}
      <div className="max-w-7xl mx-auto px-4 pb-2 pt-0.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap uppercase tracking-wider pr-0.5">
              {language === 'ta' ? 'பயண முறை:' : 'Trip Mode:'}
            </span>
            <button
              onClick={() => openHelpSheet('trip_mode')}
              className="p-0.5 text-slate-400 hover:text-[#FF7A1A] transition"
              title="Learn about Trip Modes"
              aria-label="Help on Trip Modes"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          {TRIP_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedTripMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setSelectedTripMode(mode.id);
                  setPlannerField('tripMode', mode.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#0B1F3A] dark:bg-white text-white dark:text-[#0B1F3A] ring-2 ring-[#FF7A1A] shadow-md shadow-[#FF7A1A]/20 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF7A1A]' : 'text-slate-400'}`} />
                <span>{language === 'ta' ? mode.ta : mode.en}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
