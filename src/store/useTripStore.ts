import { create } from 'zustand';
import {
  SupportedLanguage,
  TripModeType,
  TravelPackage,
  ItineraryDay,
  TravelerInfo,
  ExpenseItem,
  TrustedContact,
  DisruptionEvent,
  ReplanOption,
  ReplanHistoryRecord,
  LiveLocationData,
  ChatMessage,
} from '../types/trip';
import {
  DEFAULT_PACKAGES,
  DEMO_ITINERARY,
  DEMO_EXPENSES,
  DEMO_CONTACTS,
  DISRUPTION_PRESETS,
} from '../data/mockTripData';

interface TripStoreState {
  // Localization & Theme
  language: SupportedLanguage;
  darkMode: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleDarkMode: () => void;

  // Stepper & Progress
  currentStep: number;
  maxUnlockedStep: number;
  setStep: (step: number) => void;
  unlockStep: (step: number) => void;

  // Search & Global Filters
  searchQuery: string;
  selectedTripMode: TripModeType;
  setSearchQuery: (query: string) => void;
  setSelectedTripMode: (mode: TripModeType) => void;

  // Planner Form State
  plannerForm: {
    from: string;
    destination: string;
    destinationId: string;
    startDate: string;
    endDate: string;
    travelers: number;
    budget: number;
    travelMode: string;
    interests: string[];
    stayPreference: string;
    tripMode: TripModeType;
    pace: 'Relaxed' | 'Balanced' | 'Packed';
  };
  setPlannerField: <K extends keyof TripStoreState['plannerForm']>(
    field: K,
    value: TripStoreState['plannerForm'][K]
  ) => void;

  // Itinerary
  itinerary: ItineraryDay[];
  estimatedTotalCost: number;
  packingChecklist: string[];
  safetyNotes: string[];
  whyThisPlan: string;
  isGeneratingPlan: boolean;
  setItinerary: (days: ItineraryDay[], totalCost: number, packing: string[], safety: string[], why: string) => void;
  toggleActivityComplete: (dayIndex: number, actId: string) => void;

  // Packages
  packages: TravelPackage[];
  selectedPackage: TravelPackage | null;
  comparedPackageIds: string[];
  selectPackage: (pkg: TravelPackage) => void;
  toggleComparePackage: (pkgId: string) => void;

  // Verification & Travelers
  travelers: TravelerInfo[];
  couponCode: string;
  discountAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Net banking';
  bookingId: string;
  isBooked: boolean;
  bookedAt: string;
  setTraveler: (index: number, traveler: TravelerInfo) => void;
  addTraveler: () => void;
  removeTraveler: (index: number) => void;
  applyCoupon: (code: string) => boolean;
  setPaymentMethod: (pm: 'UPI' | 'Card' | 'Net banking') => void;
  completeBooking: () => void;

  // Companion Live State
  userLocation: LiveLocationData;
  isTrackingActive: boolean;
  isLiveSharing: boolean;
  shareDuration: '15m' | '1h' | 'trip';
  shareTrackingId: string;
  shareExpiresAt: number | null;
  isSosActive: boolean;
  trustedContacts: TrustedContact[];
  simulatedTripTimeMinutes: number;
  roadRiskLevel: 'low' | 'medium' | 'high';
  setUserLocation: (loc: Partial<LiveLocationData>) => void;
  toggleLiveSharing: (duration?: '15m' | '1h' | 'trip') => void;
  stopLiveSharing: () => void;
  setSosActive: (active: boolean) => void;
  addTrustedContact: (contact: Omit<TrustedContact, 'id'>) => void;
  removeTrustedContact: (id: string) => void;
  setSimulatedTripTimeMinutes: (minutes: number) => void;
  setRoadRiskLevel: (level: 'low' | 'medium' | 'high') => void;

  // UI Shell & Navigation Layout
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  completedSteps: number[];
  markStepCompleted: (step: number) => void;

  // Accessibility & Animation Settings
  reduce3dEffects: boolean;
  toggleReduce3dEffects: () => void;
  reduceAnimations: boolean;
  toggleReduceAnimations: () => void;

  // First-Time Product Tour
  tourCompleted: boolean;
  setTourCompleted: (completed: boolean) => void;
  resetTour: () => void;

  // Smart Help Modal ("?")
  activeHelpSheet: string | null;
  openHelpSheet: (feature: string) => void;
  closeHelpSheet: () => void;

  // Toast Notification System
  toasts: { id: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }[];
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Notifications
  notifications: { id: string; title: string; time: string; read: boolean; type: 'info' | 'alert' | 'success' }[];
  markNotificationsRead: () => void;

  // User Profile
  userProfile: {
    name: string;
    avatar: string;
    email: string;
    bookingId: string;
  };

  // Saved & Recent Trips
  recentDestinations: string[];
  savedTrips: { id: string; title: string; destination: string; date: string; cost: number; mode: string }[];
  quickPlanMode: (mode: TripModeType) => void;

  // Budget & Expenses
  expenses: ExpenseItem[];
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  removeExpense: (id: string) => void;

  // Replanning
  activeDisruption: DisruptionEvent | null;
  replanOptions: ReplanOption[];
  replanHistory: ReplanHistoryRecord[];
  triggerDisruption: (disruptionId: string) => void;
  applyReplanOption: (option: ReplanOption) => void;
  dismissDisruption: () => void;

  // AI Assistant Drawer
  isAssistantOpen: boolean;
  assistantMessages: ChatMessage[];
  hasUnreadAssistantAlert: boolean;
  isTtsEnabled: boolean;
  toggleAssistant: () => void;
  openAssistantWithQuery: (query: string) => void;
  addAssistantMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearAssistantChat: () => void;
  toggleTts: () => void;

  // Demo Actions
  isDemoFilling: boolean;
  preloadDemoTrip: () => Promise<void>;
  resetAllDemo: () => void;
}

const INITIAL_LOCATION: LiveLocationData = {
  latitude: 11.4102,
  longitude: 76.6950,
  speed: 28,
  accuracy: 12,
  lastUpdated: new Date().toLocaleTimeString(),
  address: 'Commercial Road near Charring Cross, Ooty, Tamil Nadu 643001',
  distanceTravelledKm: 42.4,
  etaNextActivity: '24 mins',
  batteryLevel: 88,
};

const INITIAL_TRAVELER: TravelerInfo = {
  id: 't-1',
  fullName: 'Karthik Ramanathan',
  age: 28,
  gender: 'male',
  phone: '9840123456',
  email: 'karthik.ramanathan@example.com',
  idType: 'Aadhaar',
  idNumber: '4839 2019 9283',
  emergencyContact: '9840123456',
  mealPreference: 'Veg',
  specialAssistance: 'None',
};

const INITIAL_SECOND_TRAVELER: TravelerInfo = {
  id: 't-2',
  fullName: 'Priya Karthik',
  age: 26,
  gender: 'female',
  phone: '9840234567',
  email: 'priya.karthik@example.com',
  idType: 'Aadhaar',
  idNumber: '8910 4421 7732',
  emergencyContact: '9840123456',
  mealPreference: 'Veg',
  specialAssistance: 'None',
};

export const useTripStore = create<TripStoreState>((set, get) => {
  // Read saved theme & language
  const savedLang = (localStorage.getItem('trippilot_lang') as SupportedLanguage) || 'en';
  const savedDark = localStorage.getItem('trippilot_dark') === 'true' || true; // default dark for Aero tech vibe

  if (savedDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return {
    language: savedLang,
    darkMode: savedDark,
    setLanguage: (lang) => {
      localStorage.setItem('trippilot_lang', lang);
      set({ language: lang });
    },
    toggleDarkMode: () => {
      const next = !get().darkMode;
      localStorage.setItem('trippilot_dark', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      set({ darkMode: next });
    },

    currentStep: 1,
    maxUnlockedStep: 6, // fully explorable in demo mode as requested
    setStep: (step) => set({ currentStep: step }),
    unlockStep: (step) => set((s) => ({ maxUnlockedStep: Math.max(s.maxUnlockedStep, step) })),

    // UI Shell & Navigation Layout
    sidebarOpen: false,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    completedSteps: [1, 2, 3],
    markStepCompleted: (step) =>
      set((s) => ({ completedSteps: Array.from(new Set([...s.completedSteps, step])) })),

    // Accessibility & Animation Settings
    reduce3dEffects: localStorage.getItem('trippilot_reduce_3d') === 'true',
    toggleReduce3dEffects: () => {
      const next = !get().reduce3dEffects;
      localStorage.setItem('trippilot_reduce_3d', String(next));
      set({ reduce3dEffects: next });
    },
    reduceAnimations: localStorage.getItem('trippilot_reduce_anim') === 'true',
    toggleReduceAnimations: () => {
      const next = !get().reduceAnimations;
      localStorage.setItem('trippilot_reduce_anim', String(next));
      set({ reduceAnimations: next });
    },

    // First-Time Product Tour
    tourCompleted: localStorage.getItem('trippilot_tour_done') === 'true',
    setTourCompleted: (completed) => {
      localStorage.setItem('trippilot_tour_done', String(completed));
      set({ tourCompleted: completed });
    },
    resetTour: () => {
      localStorage.removeItem('trippilot_tour_done');
      set({ tourCompleted: false });
    },

    // Smart Help Modal ("?")
    activeHelpSheet: null,
    openHelpSheet: (feature) => set({ activeHelpSheet: feature }),
    closeHelpSheet: () => set({ activeHelpSheet: null }),

    // Toast Notification System
    toasts: [],
    addToast: (message, type = 'info') => {
      const id = 't-' + Date.now();
      set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
      setTimeout(() => get().removeToast(id), 3500);
    },
    removeToast: (id) =>
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

    // Notifications
    notifications: [
      {
        id: 'n-1',
        title: 'Route Advisory: Kallar Ghat evening fog expected after 5:30 PM',
        time: '12 mins ago',
        read: false,
        type: 'alert',
      },
      {
        id: 'n-2',
        title: 'Booking Confirmed: Classic Comfort Package (TP-2026-7842)',
        time: '1 hour ago',
        read: false,
        type: 'success',
      },
      {
        id: 'n-3',
        title: 'Live Location Sharing initialized with 3 trusted contacts',
        time: '2 hours ago',
        read: true,
        type: 'info',
      },
    ],
    markNotificationsRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),

    // User Profile
    userProfile: {
      name: 'Karthik Ramanathan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      email: 'karthik.ramanathan@example.com',
      bookingId: 'TP-2026-7842',
    },

    // Saved & Recent Trips
    recentDestinations: ['Ooty', 'Rameswaram', 'Kodaikanal', 'Coonoor', 'Dubai'],
    savedTrips: [
      {
        id: 'st-1',
        title: 'Nilgiri Mountain Rail & Tea Highlands',
        destination: 'Ooty (Udhagamandalam)',
        date: 'Nov 5 - 7, 2026',
        cost: 12400,
        mode: 'nature',
      },
      {
        id: 'st-2',
        title: 'Shore Temple & Heritage Coastal Ride',
        destination: 'Mahabalipuram',
        date: 'Dec 12 - 14, 2026',
        cost: 6800,
        mode: 'weekend',
      },
    ],
    quickPlanMode: (mode) => {
      set({ selectedTripMode: mode, currentStep: 1 });
      get().setPlannerField('tripMode', mode);
    },

    searchQuery: '',
    selectedTripMode: 'nature',
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedTripMode: (mode) => set({ selectedTripMode: mode }),

    plannerForm: {
      from: 'Chennai',
      destination: 'Ooty (Udhagamandalam)',
      destinationId: 'ooty',
      startDate: '2026-11-05',
      endDate: '2026-11-07',
      travelers: 2,
      budget: 15000,
      travelMode: 'Train + Road',
      interests: ['Nature', 'Tea estates', 'Viewpoints', 'Local food'],
      stayPreference: 'Budget hotel / homestay',
      tripMode: 'nature',
      pace: 'Balanced',
    },
    setPlannerField: (field, value) =>
      set((state) => ({
        plannerForm: { ...state.plannerForm, [field]: value },
      })),

    itinerary: DEMO_ITINERARY,
    estimatedTotalCost: 12400,
    packingChecklist: [
      'Warm woolens, sweaters, and thermals (Ooty night drops to 11°C)',
      'Comfortable hiking or walking shoes with good grip for tea trails',
      'Compact umbrella or lightweight raincoat for sudden mountain drizzle',
      'Motion sickness tablets for 14 hairpin bends on Kallar ghat road',
      'Power bank and camera memory cards for picturesque vantage points',
      'Government ID copies and Nilgiri e-pass confirmation (if applicable)',
    ],
    safetyNotes: [
      'Ghat roads between Mettupalayam & Coonoor have dense fog after 6:00 PM; avoid high-speed overtaking.',
      'Wild gaur (Indian bison) are occasionally spotted near Doddabetta and Pykara forests; maintain a safe distance.',
      'Only drink bottled or boiled water; high altitude tap water is chilly and requires acclimatization.',
      'Emergency numbers: 112 (National Helpline), 108 (Nilgiris Medical Ambulance), 100 (Police).',
    ],
    whyThisPlan:
      'Curated for 2 travelers seeking scenic Nilgiri tranquility under ₹15,000. It features the UNESCO Toy Train arrival, summit views at Doddabetta, high-speed boating at Pykara Lake, and artisan chocolate & tea tasting in Coonoor with generous buffer time.',
    isGeneratingPlan: false,
    setItinerary: (days, totalCost, packing, safety, why) =>
      set({
        itinerary: days,
        estimatedTotalCost: totalCost,
        packingChecklist: packing,
        safetyNotes: safety,
        whyThisPlan: why,
      }),
    toggleActivityComplete: (dayIndex, actId) =>
      set((state) => {
        const next = [...state.itinerary];
        const day = next[dayIndex];
        if (day) {
          day.activities = day.activities.map((a) =>
            a.id === actId ? { ...a, completed: !a.completed } : a
          );
        }
        return { itinerary: next };
      }),

    packages: DEFAULT_PACKAGES,
    selectedPackage: DEFAULT_PACKAGES[1], // Classic Comfort is AI-recommended
    comparedPackageIds: ['budget', 'standard'],
    selectPackage: (pkg) => set({ selectedPackage: pkg }),
    toggleComparePackage: (pkgId) =>
      set((state) => {
        const exists = state.comparedPackageIds.includes(pkgId);
        if (exists) {
          return { comparedPackageIds: state.comparedPackageIds.filter((id) => id !== pkgId) };
        }
        if (state.comparedPackageIds.length >= 2) {
          return { comparedPackageIds: [state.comparedPackageIds[1], pkgId] };
        }
        return { comparedPackageIds: [...state.comparedPackageIds, pkgId] };
      }),

    travelers: [INITIAL_TRAVELER, INITIAL_SECOND_TRAVELER],
    couponCode: '',
    discountAmount: 0,
    paymentMethod: 'UPI',
    bookingId: 'TP-2026-7842',
    isBooked: true,
    bookedAt: '2026-10-30 09:15 AM',
    setTraveler: (index, traveler) =>
      set((state) => {
        const next = [...state.travelers];
        next[index] = traveler;
        return { travelers: next };
      }),
    addTraveler: () =>
      set((state) => ({
        travelers: [
          ...state.travelers,
          {
            id: `t-${state.travelers.length + 1}`,
            fullName: '',
            age: 25,
            gender: 'male',
            phone: '',
            email: '',
            idType: 'Aadhaar',
            idNumber: '',
            mealPreference: 'Veg',
          },
        ],
      })),
    removeTraveler: (index) =>
      set((state) => ({
        travelers: state.travelers.filter((_, i) => i !== index),
      })),
    applyCoupon: (code) => {
      const clean = code.trim().toUpperCase();
      if (clean === 'PILOT10') {
        const disc = 1240;
        set({ couponCode: clean, discountAmount: disc });
        return true;
      }
      if (clean === 'TAMILNADU15') {
        const disc = 1860;
        set({ couponCode: clean, discountAmount: disc });
        return true;
      }
      return false;
    },
    setPaymentMethod: (pm) => set({ paymentMethod: pm }),
    completeBooking: () => {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const newId = `TP-2026-${randNum}`;
      set({
        isBooked: true,
        bookingId: newId,
        bookedAt: new Date().toLocaleString(),
        currentStep: 4,
        maxUnlockedStep: 6,
      });
    },

    userLocation: INITIAL_LOCATION,
    isTrackingActive: true,
    isLiveSharing: true,
    shareDuration: '1h',
    shareTrackingId: 'pilot-ooty-live-9284',
    shareExpiresAt: Date.now() + 60 * 60 * 1000,
    isSosActive: false,
    trustedContacts: DEMO_CONTACTS,
    simulatedTripTimeMinutes: 300,
    roadRiskLevel: 'medium', // ghat road caution
    setUserLocation: (loc) =>
      set((state) => ({ userLocation: { ...state.userLocation, ...loc } })),
    toggleLiveSharing: (duration = '1h') => {
      const current = get().isLiveSharing;
      if (current) {
        set({ isLiveSharing: false, shareExpiresAt: null });
      } else {
        const mins = duration === '15m' ? 15 : duration === '1h' ? 60 : 72 * 60;
        set({
          isLiveSharing: true,
          shareDuration: duration,
          shareTrackingId: `track-${Math.random().toString(36).substring(2, 9)}`,
          shareExpiresAt: Date.now() + mins * 60 * 1000,
        });
      }
    },
    stopLiveSharing: () => set({ isLiveSharing: false, shareExpiresAt: null }),
    setSosActive: (active) => set({ isSosActive: active }),
    addTrustedContact: (contact) =>
      set((state) => ({
        trustedContacts: [
          ...state.trustedContacts,
          { ...contact, id: `c-${Date.now()}` },
        ],
      })),
    removeTrustedContact: (id) =>
      set((state) => ({
        trustedContacts: state.trustedContacts.filter((c) => c.id !== id),
      })),
    setSimulatedTripTimeMinutes: (minutes) => set({ simulatedTripTimeMinutes: minutes }),
    setRoadRiskLevel: (level) => set({ roadRiskLevel: level }),

    expenses: DEMO_EXPENSES,
    addExpense: (expense) =>
      set((state) => ({
        expenses: [...state.expenses, { ...expense, id: `exp-${Date.now()}` }],
      })),
    removeExpense: (id) =>
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      })),

    activeDisruption: DISRUPTION_PRESETS[0], // Heavy rainstorm simulation ready
    replanOptions: [
      {
        id: 'opt-1',
        title: 'Indoor Cultural & Heritage Circuit',
        description: 'Swap outdoor Doddabetta Peak & Pykara lake with Government Tea Museum, Tribal Research Centre, and Highfield Artisan Factory in Coonoor.',
        newRouteOrActivity: 'Tea Museum + Tribal Heritage Centre + Artisan Chocolate Tour',
        costDifference: -400,
        timeImpact: 'Zero delay; completely indoor & dry',
        riskLevel: 'Low',
        tradeOffs: 'Skips hilltop panoramic views today in favor of rich cultural exploration.',
        confidenceScore: 96,
      },
      {
        id: 'opt-2',
        title: 'Afternoon Weather Window Detour',
        description: 'Wait for fog dispersal until 1:30 PM with hot Badaga lunch; take covered Jeep to Avalanche Lake instead.',
        newRouteOrActivity: 'Avalanche Eco Sanctuary Safari in 4x4 covered safari',
        costDifference: +300,
        timeImpact: '+1 hr schedule adjustment',
        riskLevel: 'Medium',
        tradeOffs: 'Higher safari cost, but permits outdoor lake views once fog lifts.',
        confidenceScore: 88,
      },
    ],
    replanHistory: [
      {
        id: 'rh-1',
        timestamp: 'Day 1 - 02:30 PM',
        disruption: 'Kallar Ghat Hairpin Bend Minor Congestion',
        selectedOption: 'Diverted via Kotagiri Scenic Bypass Road',
        costDelta: +120,
        summary: 'Saved 45 minutes of idling traffic and enjoyed serene Kotagiri tea valleys.',
      },
    ],
    triggerDisruption: (disruptionId) => {
      const found = DISRUPTION_PRESETS.find((d) => d.id === disruptionId) || DISRUPTION_PRESETS[0];
      set({
        activeDisruption: found,
        hasUnreadAssistantAlert: true,
        replanOptions: [
          {
            id: `opt-${Date.now()}-1`,
            title: `Safety-First Alternate for ${found.title}`,
            description: `AI recommended route detour avoiding high-risk sectors while saving ${found.impactCost > 0 ? '₹' + found.impactCost : 'budget'}.`,
            newRouteOrActivity: 'Shift to covered heritage points & sheltered transit',
            costDifference: -250,
            timeImpact: 'Recovers 1.5 hours',
            riskLevel: 'Low',
            tradeOffs: 'Replaces outdoor activity with curated sheltered experience',
            confidenceScore: 94,
          },
          {
            id: `opt-${Date.now()}-2`,
            title: 'Express Schedule Adjustment',
            description: 'Pushes outdoor session to tomorrow morning 8 AM when conditions clear.',
            newRouteOrActivity: 'Reschedule Doddabetta to Day 2 Sunrise',
            costDifference: 0,
            timeImpact: 'Minimal schedule swap',
            riskLevel: 'Low',
            tradeOffs: 'Earlier wake up call tomorrow',
            confidenceScore: 92,
          },
        ],
      });
    },
    applyReplanOption: (option) => {
      const active = get().activeDisruption;
      const historyRecord: ReplanHistoryRecord = {
        id: `rh-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        disruption: active ? active.title : 'Manual Route Optimization',
        selectedOption: option.title,
        costDelta: option.costDifference,
        summary: `${option.description} (${option.timeImpact})`,
      };
      set((state) => ({
        replanHistory: [historyRecord, ...state.replanHistory],
        activeDisruption: null,
        replanOptions: [],
        estimatedTotalCost: state.estimatedTotalCost + option.costDifference,
      }));
    },
    dismissDisruption: () => set({ activeDisruption: null, replanOptions: [] }),

    isAssistantOpen: false,
    assistantMessages: [
      {
        id: 'msg-init',
        sender: 'assistant',
        text: 'Vanakkam! I am your TripPilot AI Travel Co-pilot. I have loaded your Chennai to Ooty trip. How can I assist you with your itinerary, ghat road safety, or local food recommendations today?',
        timestamp: 'Just now',
        suggestedChips: [
          'Is my route to Ooty safe right now?',
          'What is the best local food in Ooty?',
          'Suggest cheaper alternatives to stay under ₹15,000',
          'Translate "Where is the nearest hospital?" to Tamil',
        ],
      },
    ],
    hasUnreadAssistantAlert: false,
    isTtsEnabled: true,
    toggleAssistant: () =>
      set((s) => ({ isAssistantOpen: !s.isAssistantOpen, hasUnreadAssistantAlert: false })),
    openAssistantWithQuery: (query) => {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((s) => ({
        isAssistantOpen: true,
        assistantMessages: [...s.assistantMessages, newMsg],
      }));
    },
    addAssistantMessage: (msg) =>
      set((s) => ({
        assistantMessages: [
          ...s.assistantMessages,
          {
            ...msg,
            id: `msg-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      })),
    clearAssistantChat: () =>
      set({
        assistantMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: 'Chat cleared. How can I assist your trip right now?',
            timestamp: 'Just now',
          },
        ],
      }),
    toggleTts: () => set((s) => ({ isTtsEnabled: !s.isTtsEnabled })),

    isDemoFilling: false,
    preloadDemoTrip: async () => {
      set({ isDemoFilling: true });
      // simulated fill animation sequence
      const form = {
        from: 'Chennai',
        destination: 'Ooty (Udhagamandalam)',
        destinationId: 'ooty',
        startDate: '2026-11-05',
        endDate: '2026-11-07',
        travelers: 2,
        budget: 15000,
        travelMode: 'Train + Road',
        interests: ['Nature', 'Tea estates', 'Viewpoints', 'Local food'],
        stayPreference: 'Budget hotel / homestay',
        tripMode: 'nature' as TripModeType,
        pace: 'Balanced' as const,
      };

      set({
        plannerForm: form,
        itinerary: DEMO_ITINERARY,
        estimatedTotalCost: 12400,
        packages: DEFAULT_PACKAGES,
        selectedPackage: DEFAULT_PACKAGES[1],
        travelers: [INITIAL_TRAVELER, INITIAL_SECOND_TRAVELER],
        isBooked: true,
        isDemoFilling: false,
      });
    },
    resetAllDemo: () => {
      localStorage.removeItem('trippilot_lang');
      set({
        currentStep: 1,
        maxUnlockedStep: 6,
        plannerForm: {
          from: 'Chennai',
          destination: 'Ooty (Udhagamandalam)',
          destinationId: 'ooty',
          startDate: '2026-11-05',
          endDate: '2026-11-07',
          travelers: 2,
          budget: 15000,
          travelMode: 'Train + Road',
          interests: ['Nature', 'Tea estates', 'Viewpoints', 'Local food'],
          stayPreference: 'Budget hotel / homestay',
          tripMode: 'nature',
          pace: 'Balanced',
        },
        itinerary: DEMO_ITINERARY,
        estimatedTotalCost: 12400,
        packages: DEFAULT_PACKAGES,
        selectedPackage: DEFAULT_PACKAGES[1],
        travelers: [INITIAL_TRAVELER, INITIAL_SECOND_TRAVELER],
        couponCode: '',
        discountAmount: 0,
        isBooked: true,
        bookingId: 'TP-2026-7842',
        expenses: DEMO_EXPENSES,
        isSosActive: false,
        isLiveSharing: true,
      });
    },
  };
});
