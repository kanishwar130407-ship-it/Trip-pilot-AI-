import { SupportedLanguage } from '../types/trip';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  skip: string;
  steps: {
    planner: string;
    package: string;
    verification: string;
    companion: string;
    replanning: string;
    dossier: string;
  };
  tripModes: Record<string, { label: string; desc: string }>;
  search: {
    placeholder: string;
    recent: string;
    popular: string;
    nearMe: string;
    noResults: string;
    voiceSearching: string;
    listening: string;
  };
  planner: {
    title: string;
    subtitle: string;
    fromLabel: string;
    destLabel: string;
    startDate: string;
    endDate: string;
    travelers: string;
    budget: string;
    travelMode: string;
    interests: string;
    stayPref: string;
    pace: string;
    relaxed: string;
    balanced: string;
    packed: string;
    generateBtn: string;
    generating: string;
    whyThisPlan: string;
    packingList: string;
    safetyNotes: string;
    proceedBtn: string;
    demoPreload: string;
    budgetFitUnder: string;
    budgetFitNear: string;
    budgetFitOver: string;
  };
  package: {
    title: string;
    subtitle: string;
    bestForYou: string;
    compareTitle: string;
    selectPackage: string;
    compareBtn: string;
    finishBtn: string;
    fitScore: string;
    rating: string;
    inclusions: string;
    exclusions: string;
    refundPolicy: string;
  };
  verification: {
    title: string;
    subtitle: string;
    tripSummary: string;
    travelerDetails: string;
    addTraveler: string;
    applyCoupon: string;
    couponPlaceholder: string;
    couponApplied: string;
    basePrice: string;
    taxes: string;
    discount: string;
    totalAmount: string;
    paymentMethod: string;
    payConfirm: string;
    bookingSuccess: string;
    bookingId: string;
    continueToCompanion: string;
  };
  companion: {
    title: string;
    subtitle: string;
    todayTimeline: string;
    liveLocation: string;
    startSharing: string;
    stopSharing: string;
    sharingActive: string;
    sosButton: string;
    sosTriggered: string;
    roadRisk: string;
    riskLow: string;
    riskMedium: string;
    riskHigh: string;
    weatherAdvisory: string;
    alternateDests: string;
    budgetTracker: string;
    voiceAssistant: string;
    voiceTranslator: string;
    offlineEmergency: string;
    doctorAssistance: string;
    groupDecision: string;
    navigation: string;
  };
  replanning: {
    title: string;
    subtitle: string;
    simulateDisruption: string;
    whatHappened: string;
    impact: string;
    aiOptions: string;
    approveOption: string;
    history: string;
  };
  dossier: {
    title: string;
    subtitle: string;
    downloadPdf: string;
    shareTrip: string;
    emergencyContacts: string;
    hospitalList: string;
    policeList: string;
    itineraryDetails: string;
    expensesTotal: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    speakBtn: string;
    applyToTrip: string;
    demoBadge: string;
    geminiLiveBadge: string;
  };
  common: {
    resetDemo: string;
    demoActive: string;
    liveSharingOn: string;
    offlineMode: string;
    close: string;
    cancel: string;
    save: string;
    edit: string;
    remove: string;
    viewInGoogleMaps: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'TripPilot AI',
    tagline: 'Plan. Travel. Replan. Stay safe.',
    skip: 'Skip Intro',
    steps: {
      planner: 'Planner',
      package: 'Package',
      verification: 'Verification',
      companion: 'Companion',
      replanning: 'Replanning',
      dossier: 'Dossier',
    },
    tripModes: {
      family: { label: 'Family Trip', desc: 'Safe, elder-friendly, kid-safe sights' },
      adventure: { label: 'Adventure', desc: 'Trekking, camping, river rafting' },
      solo: { label: 'Solo Ride', desc: 'Safe routes, hostels, live tracking' },
      friends: { label: 'Friends Trip', desc: 'Group spots, night outs, split bills' },
      honeymoon: { label: 'Honeymoon', desc: 'Scenic resorts, sunset spots, privacy' },
      pilgrimage: { label: 'Pilgrimage', desc: 'Temples, darshan timings & stay' },
      food: { label: 'Food Tour', desc: 'Local delicacies, street eats, coffee trails' },
      nature: { label: 'Nature Escape', desc: 'Tea estates, waterfalls, viewpoints' },
      bike: { label: 'Bike Trip', desc: 'Scenic ghat roads, fuel stops, twisties' },
      weekend: { label: 'Weekend Getaway', desc: 'Quick 2-day escapes within 250km' },
      budget: { label: 'Budget Trip', desc: 'Homestays, public transit, street food' },
      luxury: { label: 'Luxury Trip', desc: '5-star resorts, private cab, gourmet' },
    },
    search: {
      placeholder: 'Search places (e.g. Ooty, Rameswaram, Dubai, Kodaikanal)...',
      recent: 'Recent Searches',
      popular: 'Popular Destinations',
      nearMe: 'Near Me',
      noResults: 'No destinations found. Try searching Tamil Nadu hill stations or heritage circuits.',
      voiceSearching: 'Listening for voice search...',
      listening: 'Listening...',
    },
    planner: {
      title: 'Plan Your Trip with AI',
      subtitle: 'Tailored itineraries crafted in seconds with real-time budget fit',
      fromLabel: 'From City',
      destLabel: 'Destination',
      startDate: 'Start Date',
      endDate: 'End Date',
      travelers: 'Travelers',
      budget: 'Total Budget (₹)',
      travelMode: 'Preferred Travel Mode',
      interests: 'Interests & Vibes',
      stayPref: 'Stay Preference',
      pace: 'Trip Pace',
      relaxed: 'Relaxed',
      balanced: 'Balanced',
      packed: 'Packed',
      generateBtn: 'Generate AI Itinerary',
      generating: 'AI Agent is crafting your plan...',
      whyThisPlan: 'Why this plan?',
      packingList: 'Smart Packing Checklist',
      safetyNotes: 'Safety & Advisory Notes',
      proceedBtn: 'Select Package',
      demoPreload: 'Auto-fill Demo Trip (Chennai → Ooty under ₹15k)',
      budgetFitUnder: 'Comfortably Under Budget',
      budgetFitNear: 'Near Target Budget',
      budgetFitOver: 'Over Budget',
    },
    package: {
      title: 'Choose Your Package',
      subtitle: 'Transparent pricing with transport, accommodation, and curated activities',
      bestForYou: 'Best For You',
      compareTitle: 'Compare Packages',
      selectPackage: 'Select Package',
      compareBtn: 'Compare 2 Packages',
      finishBtn: 'Proceed to Verification & Booking',
      fitScore: 'AI Fit Score',
      rating: 'Rating',
      inclusions: 'Inclusions',
      exclusions: 'Exclusions',
      refundPolicy: 'Refund Policy',
    },
    verification: {
      title: 'Traveler Details & Payment',
      subtitle: 'Instant mock verification and zero-friction booking',
      tripSummary: 'Trip Summary',
      travelerDetails: 'Traveler Information',
      addTraveler: '+ Add Traveler',
      applyCoupon: 'Apply',
      couponPlaceholder: 'Enter coupon (e.g. PILOT10, TAMILNADU15)',
      couponApplied: 'Coupon Applied!',
      basePrice: 'Package Price',
      taxes: 'Taxes & GST (5%)',
      discount: 'Discounts & Offers',
      totalAmount: 'Total Payable',
      paymentMethod: 'Select Mock Payment',
      payConfirm: 'Confirm & Book Trip',
      bookingSuccess: 'Your trip is successfully booked!',
      bookingId: 'Booking Reference',
      continueToCompanion: 'Launch Live Companion',
    },
    companion: {
      title: 'Live Journey Companion',
      subtitle: 'Real-time navigation, road risk detection, safety sentinel, and smart optimizer',
      todayTimeline: "Today's Schedule & Timeline",
      liveLocation: 'Live Location Tracker',
      startSharing: 'Start Sharing Live Location',
      stopSharing: 'Stop Sharing',
      sharingActive: 'Live location sharing is active',
      sosButton: 'EMERGENCY SOS',
      sosTriggered: 'SOS ACTIVATED - Alerts prepared for contacts and emergency services',
      roadRisk: 'Smart Route Risk Detection',
      riskLow: 'Low Risk Route',
      riskMedium: 'Moderate Ghat Caution',
      riskHigh: 'High Risk - Heavy Fog / Slippery Ghat',
      weatherAdvisory: 'Destination Condition Intelligence',
      alternateDests: 'Smart Alternative Destinations',
      budgetTracker: 'Live Budget & Expense Splitter',
      voiceAssistant: 'Voice Assistant',
      voiceTranslator: 'Voice & Travel Translator',
      offlineEmergency: 'Offline Emergency Vault',
      doctorAssistance: 'Doctor & Symptom Checker',
      groupDecision: 'Group Travel Decision AI',
      navigation: 'Street Navigation & Ghat Alerts',
    },
    replanning: {
      title: 'Autonomous Replanning Engine',
      subtitle: 'AI detects weather, road, or transit disruptions and calculates safe detours instantly',
      simulateDisruption: 'Simulate Journey Disruption',
      whatHappened: 'What Happened?',
      impact: 'Trip Impact Analysis',
      aiOptions: 'AI Replan Alternatives',
      approveOption: 'Apply This Replan',
      history: 'Replan Audit Trail',
    },
    dossier: {
      title: 'Smart Trip Dossier',
      subtitle: 'All-in-one verifiable digital trip document with offline readiness',
      downloadPdf: 'Print / Save PDF',
      shareTrip: 'Share Trip Dossier',
      emergencyContacts: 'Emergency Directory',
      hospitalList: 'Nearest Medical Facilities',
      policeList: 'Local Police Stations',
      itineraryDetails: 'Complete Schedule',
      expensesTotal: 'Expenditure Summary',
    },
    assistant: {
      title: 'TripPilot AI Assistant',
      subtitle: 'Your intelligent 24/7 travel co-pilot',
      inputPlaceholder: 'Ask anything about your route, safety, food, or replan...',
      speakBtn: 'Voice Input',
      applyToTrip: 'Apply to Itinerary',
      demoBadge: 'Realistic Demo Data',
      geminiLiveBadge: 'Gemini AI Active',
    },
    common: {
      resetDemo: 'Reset Demo',
      demoActive: 'Demo Mode',
      liveSharingOn: 'Live Sharing is ON',
      offlineMode: 'Offline Emergency Cache Active',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      remove: 'Remove',
      viewInGoogleMaps: 'Open in Google Maps',
    },
  },
  ta: {
    appName: 'TripPilot AI',
    tagline: 'திட்டமிடுங்கள். பயணியுங்கள். மாற்றுங்கள். பாதுகாப்பாக இருங்கள்.',
    skip: 'அறிமுகத்தைத் தவிர்',
    steps: {
      planner: 'திட்டமிடுதல்',
      package: 'தொகுப்பு',
      verification: 'சரிபார்ப்பு',
      companion: 'துணைவர்',
      replanning: 'மறுதிட்டமிடல்',
      dossier: 'பயண ஆவணம்',
    },
    tripModes: {
      family: { label: 'குடும்ப பயணம்', desc: 'பாதுகாப்பான இடங்கள், முதியோர் மற்றும் குழந்தைகளுக்கான வசதிகள்' },
      adventure: { label: 'சாஹச பயணம்', desc: 'டிரெக்கிங், முகாம், படகு சவாரி' },
      solo: { label: 'தனி பயணம்', desc: 'பாதுகாப்பான வழிகள், விடுதிகள், நேரலை கண்காணிப்பு' },
      friends: { label: 'நண்பர்களுடன் பயணம்', desc: 'குழுவாக விளையாட்டுகள், இரவு நேரக் கொண்டாட்டம், செலவுப் பகிர்வு' },
      honeymoon: { label: 'தேனிலவு பயணம்', desc: 'இயற்கை எழில் கொஞ்சும் ரிசார்ட்டுகள், தனிமை மற்றும் அமைதி' },
      pilgrimage: { label: 'புனித யாத்திரை', desc: 'கோயில்கள், தரிசன நேரங்கள் மற்றும் தங்கும் இடங்கள்' },
      food: { label: 'உணவு சுற்றுலா', desc: 'பாரம்பரிய சுவைகள், தெருவோர உணவுகள், பில்டர் காபி' },
      nature: { label: 'இயற்கை பயணம்', desc: 'தேயிலைத் தோட்டங்கள், அருவிகள், மலைக் காட்சிகள்' },
      bike: { label: 'பைக் பயணம்', desc: 'மலைப்பாதை வளைவுகள், எரிபொருள் நிலையங்கள்' },
      weekend: { label: 'வார இறுதி சுற்றுலா', desc: '200 கி.மீ-க்குள் 2 நாள் விரைவுப் பயணம்' },
      budget: { label: 'சிக்கன பயணம்', desc: 'குறைந்த செலவு தங்குமிடம், பொதுப் போக்குவரத்து' },
      luxury: { label: 'ஆடம்பர பயணம்', desc: '5-நட்சத்திர விடுதிகள், பிரத்யேக வாகனம்' },
    },
    search: {
      placeholder: 'இடங்களைத் தேடுங்கள் (எ.கா: ஊட்டி, ராமேஸ்வரம், கொடைக்கானல், துபாய்)...',
      recent: 'சமீபத்திய தேடல்கள்',
      popular: 'பிரபலமான இடங்கள்',
      nearMe: 'என் அருகில்',
      noResults: 'இடங்கள் எதுவும் கிடைக்கவில்லை. தமிழ்நாடு மலைவாசஸ்தலங்களை முயலுங்கள்.',
      voiceSearching: 'குரல் தேடல் கேட்கிறது...',
      listening: 'கேட்கிறது...',
    },
    planner: {
      title: 'உங்கள் பயணத்தைத் திட்டமிடுங்கள்',
      subtitle: 'நொடிகளில் உங்கள் வரவு செலவுக்கு ஏற்றவாறு AI மூலம் உருவாக்கப்படும் திட்டம்',
      fromLabel: 'புறப்படும் ஊர்',
      destLabel: 'செல்லும் இடம்',
      startDate: 'தொடக்க தேதி',
      endDate: 'முடிவு தேதி',
      travelers: 'பயணிகள் எண்ணிக்கை',
      budget: 'மொத்த பட்ஜெட் (₹)',
      travelMode: 'பயண முறை',
      interests: 'விருப்பங்கள் & சுவாரசியங்கள்',
      stayPref: 'தங்குமிட விருப்பம்',
      pace: 'பயண வேகம்',
      relaxed: 'நிதானமான',
      balanced: 'சமநிலையான',
      packed: 'அதிக இடங்கள்',
      generateBtn: 'AI பயணத் திட்டத்தை உருவாக்கு',
      generating: 'AI உங்கள் திட்டத்தை உருவாக்குகிறது...',
      whyThisPlan: 'இந்த திட்டத்தின் சிறப்பு என்ன?',
      packingList: 'ஸ்மார்ட் பேக்கிங் பட்டியல்',
      safetyNotes: 'பாதுகாப்பு குறிப்புகள்',
      proceedBtn: 'தொகுப்பைத் தேர்ந்தெடுக்கவும்',
      demoPreload: 'மாதிரி பயணம் (சென்னை → ஊட்டி ₹15,000-க்குள்)',
      budgetFitUnder: 'பட்ஜெட்டுக்கு மிகக் குறைவு',
      budgetFitNear: 'பட்ஜெட்டுக்கு ஏற்றது',
      budgetFitOver: 'பட்ஜெட்டை விட அதிகம்',
    },
    package: {
      title: 'உங்கள் பயணத் தொகுப்பைத் தேர்ந்தெடுங்கள்',
      subtitle: 'போக்குவரத்து, தங்குமிடம், மற்றும் செயல்பாடுகள் அடங்கிய வெளிப்படையான கட்டணங்கள்',
      bestForYou: 'உங்களுக்கு மிகவும் ஏற்றது',
      compareTitle: 'தொகுப்புகளை ஒப்பிடுக',
      selectPackage: 'தொகுப்பைத் தேர்வு செய்க',
      compareBtn: '2 தொகுப்புகளை ஒப்பிடு',
      finishBtn: 'சரிபார்ப்பு மற்றும் பதிவுக்குச் செல்லவும்',
      fitScore: 'AI பொருத்தம்',
      rating: 'மதிப்பீடு',
      inclusions: 'அடங்கியவை',
      exclusions: 'சேர்க்கப்படாதவை',
      refundPolicy: 'திரும்பப் பெறும் கொள்கை',
    },
    verification: {
      title: 'பயணி விவரங்கள் & கட்டணம்',
      subtitle: 'உடனடி மாதிரி சரிபார்ப்பு மற்றும் எளிதான முன்பதிவு',
      tripSummary: 'பயண சுருக்கம்',
      travelerDetails: 'பயணி தகவல்கள்',
      addTraveler: '+ புதிய பயணியைச் சேர்க்க',
      applyCoupon: 'பயன்படுத்து',
      couponPlaceholder: 'கூப்பன் குறியீடு (எ.கா: PILOT10, TAMILNADU15)',
      couponApplied: 'கூப்பன் ஏற்றுக்கொள்ளப்பட்டது!',
      basePrice: 'தொகுப்புக் கட்டணம்',
      taxes: 'ஜிஎஸ்டி & வரிகள் (5%)',
      discount: 'தள்ளுபடி',
      totalAmount: 'செலுத்த வேண்டிய மொத்தத் தொகை',
      paymentMethod: 'மாதிரி பணம் செலுத்தும் முறை',
      payConfirm: 'பயணத்தை உறுதி செய்க',
      bookingSuccess: 'பதிவு வெற்றிகரமாக முடிந்தது!',
      bookingId: 'முன்பதிவு எண்',
      continueToCompanion: 'துணைவர் திரைக்குச் செல்லவும்',
    },
    companion: {
      title: 'நேரலை பயணத் துணைவர்',
      subtitle: 'நேரலை வழிகாட்டல், சாலை ஆபத்து எச்சரிக்கை, மற்றும் பாதுகாப்பு கண்காணிப்பு',
      todayTimeline: 'இன்றைய பயண அட்டவணை',
      liveLocation: 'நேரலை இருப்பிட கண்காணிப்பு',
      startSharing: 'நேரலை இருப்பிடத்தைப் பகிரத் தொடங்குங்கள்',
      stopSharing: 'பகிர்வதை நிறுத்து',
      sharingActive: 'நேரலை இருப்பிடப் பகிர்வு செயலில் உள்ளது',
      sosButton: 'அவசர SOS உதவி',
      sosTriggered: 'SOS இயங்குகிறது - அவசர எண்களுக்கும் உறவினர்களுக்கும் செய்தி அனுப்பப்படுகிறது',
      roadRisk: 'ஸ்மார்ட் சாலை அபாயக் கண்டறிதல்',
      riskLow: 'குறைந்த ஆபத்து உள்ள பாதை',
      riskMedium: 'மலைப்பாதை வளைவு எச்சரிக்கை',
      riskHigh: 'அதிக ஆபத்து - பனிமூட்டம் / வழுக்கும் சாலை',
      weatherAdvisory: 'வானிலை மற்றும் நிலைமை ஆலோசனை',
      alternateDests: 'மாற்று சுற்றுலாத் தலங்கள்',
      budgetTracker: 'செலவு கண்காணிப்பாளர் & பகிர்வு',
      voiceAssistant: 'குரல் வழி உதவியாளர்',
      voiceTranslator: 'குரல் மொழிபெயர்ப்பாளர்',
      offlineEmergency: 'ஆஃப்லைன் அவசரத் தகவல் பெட்டகம்',
      doctorAssistance: 'மருத்துவ உதவி & அறிகுறி சரிபார்ப்பு',
      groupDecision: 'குழு பயண முடிவு AI',
      navigation: 'சாலை வழிசெலுத்தல்',
    },
    replanning: {
      title: 'தானியங்கி மறுதிட்டமிடல் என்ஜின்',
      subtitle: 'வானிலை அல்லது போக்குவரத்து தடங்கல்களைக் கண்டறிந்து மாற்று வழிகளை AI வழங்குகிறது',
      simulateDisruption: 'தடங்கலை உருவகப்படுத்துக',
      whatHappened: 'என்ன நடந்தது?',
      impact: 'பயணத்தின் மீதான பாதிப்பு',
      aiOptions: 'AI மாற்று வழிகள்',
      approveOption: 'இந்த மாற்றத்தை ஏற்றுக்கொள்',
      history: 'மறுதிட்டமிடல் வரலாறு',
    },
    dossier: {
      title: 'ஸ்மார்ட் பயண ஆவணம்',
      subtitle: 'அனைத்து விவரங்களும் அடங்கிய ஆஃப்லைன் டிஜிட்டல் ஆவணம்',
      downloadPdf: 'PDF அச்சிடு / பதிவிறக்கு',
      shareTrip: 'பயண ஆவணத்தைப் பகிர்',
      emergencyContacts: 'அவசர தொடர்புகள்',
      hospitalList: 'அருகிலுள்ள மருத்துவமனைகள்',
      policeList: 'காவல் நிலையங்கள்',
      itineraryDetails: 'முழுமையான கால அட்டவணை',
      expensesTotal: 'மொத்த செலவு விவரம்',
    },
    assistant: {
      title: 'TripPilot AI உதவியாளர்',
      subtitle: 'உங்கள் ஸ்மார்ட் பயணத் துணை',
      inputPlaceholder: 'பாதை, பாதுகாப்பு, உணவு, தங்குமிடம் பற்றி கேளுங்கள்...',
      speakBtn: 'குரல் உள்ளீடு',
      applyToTrip: 'திட்டத்தில் சேர்',
      demoBadge: 'மாதிரித் தரவு',
      geminiLiveBadge: 'ஜெமினி AI நேரலை',
    },
    common: {
      resetDemo: 'மீட்டமைக்க',
      demoActive: 'மாதிரி பயன்முறை',
      liveSharingOn: 'இருப்பிடப் பகிர்வு இயக்கத்தில் உள்ளது',
      offlineMode: 'ஆஃப்லைன் அவசர சேமிப்பகம் தயார்',
      close: 'மூடுக',
      cancel: 'ரத்து செய்',
      save: 'சேமி',
      edit: 'மாற்று',
      remove: 'நீக்கு',
      viewInGoogleMaps: 'Google Maps-ல் பார்க்க',
    },
  },
  hi: {
    appName: 'TripPilot AI',
    tagline: 'योजना बनाएं। यात्रा करें। री-प्लान करें। सुरक्षित रहें।',
    skip: 'छोड़ें',
    steps: {
      planner: 'योजना',
      package: 'पैकेज',
      verification: 'सत्यापन',
      companion: 'साथी',
      replanning: 'पुनर्निर्धारण',
      dossier: 'दस्तावेज़',
    },
    tripModes: {
      family: { label: 'पारिवारिक यात्रा', desc: 'सुरक्षित और बुजुर्गों के अनुकूल' },
      adventure: { label: 'रोमांचक यात्रा', desc: 'ट्रेकिंग, कैंपिंग, रिवर राफ्टिंग' },
      solo: { label: 'एकल यात्रा', desc: 'सुरक्षित मार्ग, हॉस्टल, लाइव ट्रैकिंग' },
      friends: { label: 'दोस्तों संग', desc: 'ग्रुप स्पॉट्स, मस्ती, खर्च विभाजन' },
      honeymoon: { label: 'हनीमून', desc: 'सुंदर रिसॉर्ट्स, सूर्यास्त और शांति' },
      pilgrimage: { label: 'तीर्थ यात्रा', desc: 'मंदिर दर्शन और आवास' },
      food: { label: 'फूड टूर', desc: 'स्थानीय व्यंजन और स्ट्रीट फूड' },
      nature: { label: 'प्रकृति यात्रा', desc: 'चाय के बागान, झरने, व्यू पॉइंट्स' },
      bike: { label: 'बाइक ट्रिप', desc: 'पहाड़ी मोड़ और ईंधन स्टॉप्स' },
      weekend: { label: 'वीकेंड ट्रिप', desc: 'त्वरित 2 दिवसीय यात्रा' },
      budget: { label: 'बजट ट्रिप', desc: 'होमस्टे और सार्वजनिक परिवहन' },
      luxury: { label: 'लक्जरी ट्रिप', desc: '5-स्टार रिसॉर्ट्स और निजी वाहन' },
    },
    search: {
      placeholder: 'स्थान खोजें (उदा: ऊटी, मनाली, गोवा, दुबई)...',
      recent: 'हाल की खोजें',
      popular: 'लोकप्रिय स्थल',
      nearMe: 'मेरे पास',
      noResults: 'कोई परिणाम नहीं मिला।',
      voiceSearching: 'आवाज सुन रहे हैं...',
      listening: 'सुन रहे हैं...',
    },
    planner: {
      title: 'AI के साथ अपनी यात्रा की योजना बनाएं',
      subtitle: 'बजट और प्राथमिकताओं के अनुसार त्वरित यात्रा योजना',
      fromLabel: 'प्रारंभिक शहर',
      destLabel: 'गंतव्य',
      startDate: 'प्रारंभ तिथि',
      endDate: 'समाप्ति तिथि',
      travelers: 'यात्री संख्या',
      budget: 'कुल बजट (₹)',
      travelMode: 'यात्रा का साधन',
      interests: 'रुचियां',
      stayPref: 'रहने की पसंद',
      pace: 'यात्रा गति',
      relaxed: 'आरामदेह',
      balanced: 'संतुलित',
      packed: 'व्यस्त',
      generateBtn: 'AI योजना बनाएं',
      generating: 'AI आपकी योजना तैयार कर रहा है...',
      whyThisPlan: 'यह योजना क्यों?',
      packingList: 'पैकिंग सूची',
      safetyNotes: 'सुरक्षा नोट',
      proceedBtn: 'पैकेज चुनें',
      demoPreload: 'डेमो लोड करें (चेन्नई → ऊटी ₹15,000 में)',
      budgetFitUnder: 'बजट के अंदर',
      budgetFitNear: 'बजट के करीब',
      budgetFitOver: 'बजट से अधिक',
    },
    package: {
      title: 'अपना पैकेज चुनें',
      subtitle: 'होटल, परिवहन और गतिविधियों के साथ स्पष्ट मूल्य निर्धारण',
      bestForYou: 'आपके लिए सर्वश्रेष्ठ',
      compareTitle: 'पैकेज तुलना',
      selectPackage: 'पैकेज चुनें',
      compareBtn: '2 पैकेजों की तुलना करें',
      finishBtn: 'सत्यापन के लिए आगे बढ़ें',
      fitScore: 'AI स्कोर',
      rating: 'रेटिंग',
      inclusions: 'शामिल है',
      exclusions: 'शामिल नहीं',
      refundPolicy: 'रिफंड नीति',
    },
    verification: {
      title: 'यात्री विवरण और भुगतान',
      subtitle: 'त्वरित सत्यापन और आसान बुकिंग',
      tripSummary: 'यात्रा सारांश',
      travelerDetails: 'यात्री विवरण',
      addTraveler: '+ यात्री जोड़ें',
      applyCoupon: 'लागू करें',
      couponPlaceholder: 'कूपन कोड (उदा: PILOT10)',
      couponApplied: 'कूपन लागू हुआ!',
      basePrice: 'पैकेज मूल्य',
      taxes: 'कर और जीएसटी (5%)',
      discount: 'छूट',
      totalAmount: 'कुल देय राशि',
      paymentMethod: 'भुगतान विकल्प',
      payConfirm: 'बुकिंग पुष्टि करें',
      bookingSuccess: 'आपकी यात्रा सफलतापूर्वक बुक हो गई है!',
      bookingId: 'बुकिंग संदर्भ',
      continueToCompanion: 'कंपेनियन स्क्रीन पर जाएं',
    },
    companion: {
      title: 'लाइव यात्रा साथी',
      subtitle: 'नेविगेशन, सड़क जोखिम और सुरक्षा निगरानी',
      todayTimeline: 'आज की समय सारिणी',
      liveLocation: 'लाइव स्थान ट्रैकिंग',
      startSharing: 'लाइव लोकेशन साझा करें',
      stopSharing: 'साझा करना रोकें',
      sharingActive: 'लाइव लोकेशन शेयरिंग सक्रिय है',
      sosButton: 'आपातकालीन SOS',
      sosTriggered: 'SOS सक्रिय - अलर्ट भेजे जा रहे हैं',
      roadRisk: 'स्मार्ट सड़क जोखिम जांच',
      riskLow: 'कम जोखिम मार्ग',
      riskMedium: 'मध्यम घाट सावधानी',
      riskHigh: 'उच्च जोखिम - भारी कोहरा या फिसलन',
      weatherAdvisory: 'मौसम और स्थिति सलाह',
      alternateDests: 'वैकल्पिक गंतव्य',
      budgetTracker: 'बजट और खर्च ट्रैकर',
      voiceAssistant: 'वॉयस असिस्टेंट',
      voiceTranslator: 'वॉयस अनुवादक',
      offlineEmergency: 'ऑफ़लाइन आपातकालीन डेटा',
      doctorAssistance: 'चिकित्सा सहायता',
      groupDecision: 'ग्रुप डिसीजन AI',
      navigation: 'सड़क नेविगेशन',
    },
    replanning: {
      title: 'स्वायत्त री-प्लानिंग इंजन',
      subtitle: 'मौसम या रुकावटों के आधार पर AI नए विकल्प सुझाता है',
      simulateDisruption: 'रुकावट का अनुकरण करें',
      whatHappened: 'क्या हुआ?',
      impact: 'प्रभाव विश्लेषण',
      aiOptions: 'AI वैकल्पिक योजनाएं',
      approveOption: 'यह योजना लागू करें',
      history: 'पुनर्निर्धारण इतिहास',
    },
    dossier: {
      title: 'स्मार्ट यात्रा दस्तावेज़',
      subtitle: 'सभी यात्रा विवरणों के साथ ऑफ़लाइन उपलब्ध दस्तावेज़',
      downloadPdf: 'PDF डाउनलोड करें',
      shareTrip: 'दस्तावेज़ साझा करें',
      emergencyContacts: 'आपातकालीन संपर्क',
      hospitalList: 'निकटतम अस्पताल',
      policeList: 'पुलिस स्टेशन',
      itineraryDetails: 'पूरी समय सारिणी',
      expensesTotal: 'कुल खर्च',
    },
    assistant: {
      title: 'TripPilot AI सहायक',
      subtitle: 'आपका स्मार्ट यात्रा साथी',
      inputPlaceholder: 'मार्ग, सुरक्षा, होटल या भोजन के बारे में पूछें...',
      speakBtn: 'बोलें',
      applyToTrip: 'योजना में जोड़ें',
      demoBadge: 'डेमो डेटा',
      geminiLiveBadge: 'जेमिनी AI सक्रिय',
    },
    common: {
      resetDemo: 'रीसेट करें',
      demoActive: 'डेमो मोड',
      liveSharingOn: 'लाइव शेयरिंग चालू है',
      offlineMode: 'ऑफ़लाइन मोड सक्रिय',
      close: 'बंद करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      edit: 'संपादित करें',
      remove: 'हटाएं',
      viewInGoogleMaps: 'Google Maps में खोलें',
    },
  },
  te: {
    appName: 'TripPilot AI',
    tagline: 'ప్రణాళిక వేయండి. ప్రయాణించండి. రీ-ప్లాన్ చేయండి. సురక్షితంగా ఉండండి.',
    skip: 'దాటవేయి',
    steps: {
      planner: 'ప్లానర్',
      package: 'ప్యాకేజీ',
      verification: 'ధృవీకరణ',
      companion: 'తోడుగా',
      replanning: 'రీ-ప్లానింగ్',
      dossier: 'పత్రం',
    },
    tripModes: {
      family: { label: 'కుటుంబ ప్రయాణం', desc: 'సురక్షితమైన ప్రదేశాలు, పెద్దలకు అనువైనవి' },
      adventure: { label: 'సాహస యాత్ర', desc: 'ట్రెక్కింగ్, క్యాంపింగ్, రాఫ్టింగ్' },
      solo: { label: 'ఒంటరి ప్రయాణం', desc: 'సురక్షిత మార్గాలు, లైవ్ ట్రాకింగ్' },
      friends: { label: 'స్నేహితులతో', desc: 'గ్రూప్ ఎంజాయ్మెంట్, ఖర్చుల విభజన' },
      honeymoon: { label: 'హనీమూన్', desc: 'ప్రకృతి రమణీయ దృశ్యాలు, ప్రశాంతత' },
      pilgrimage: { label: 'తీర్థయాత్ర', desc: 'దేవాలయాలు, దర్శన సమయాలు' },
      food: { label: 'ఫుడ్ టూర్', desc: 'స్థానిక వంటకాలు మరియు రుచులు' },
      nature: { label: 'ప్రకృతి విహారం', desc: 'టీ తోటలు, జలపాతాలు' },
      bike: { label: 'బైక్ ట్రిప్', desc: 'కొండ మార్గాలు, మలుపులు' },
      weekend: { label: 'వీకెండ్ ట్రిప్', desc: 'త్వరిత 2 రోజుల విహారం' },
      budget: { label: 'బడ్జెట్ ట్రిప్', desc: 'తక్కువ ఖర్చుతో ప్రయాణం' },
      luxury: { label: 'లగ్జరీ ట్రిప్', desc: '5-స్టార్ రిసార్ట్స్, ప్రత్యేక కారు' },
    },
    search: {
      placeholder: 'ప్రదేశాలను శోధించండి (ఉదా: ఊటీ, కొడైకెనాల్, తిరుపతి, దుబాయ్)...',
      recent: 'ఇటీవలి శోధనలు',
      popular: 'ప్రసిద్ధ ప్రదేశాలు',
      nearMe: 'నా దగ్గరలో',
      noResults: 'ఫలితాలు ఏవీ కనుగొనబడలేదు.',
      voiceSearching: 'వాయిస్ వింటున్నాం...',
      listening: 'వింటున్నాం...',
    },
    planner: {
      title: 'AI తో మీ ప్రయాణాన్ని ప్లాన్ చేసుకోండి',
      subtitle: 'బడ్జెట్ ప్రకారం క్షణాల్లో తయారయ్యే వ్యక్తిగత ప్రణాళిక',
      fromLabel: 'బయలుదేరే నగరం',
      destLabel: 'గమ్యస్థానం',
      startDate: 'ప్రారంభ తేదీ',
      endDate: 'ముగింపు తేదీ',
      travelers: 'ప్రయాణికుల సంఖ్య',
      budget: 'మొత్తం బడ్జెట్ (₹)',
      travelMode: 'ప్రయాణ మార్గం',
      interests: 'ఆసక్తులు',
      stayPref: 'వసతి ప్రాధాన్యత',
      pace: 'వేగం',
      relaxed: 'ప్రశాంతమైన',
      balanced: 'సమతుల్య',
      packed: 'చురుకైన',
      generateBtn: 'AI ప్రణాళికను రూపొందించండి',
      generating: 'AI ప్రణాళికను సిద్ధం చేస్తోంది...',
      whyThisPlan: 'ఈ ప్రణాళిక ఎందుకు?',
      packingList: 'ప్యాకింగ్ జాబితా',
      safetyNotes: 'భద్రతా సూచనలు',
      proceedBtn: 'ప్యాకేజీని ఎంచుకోండి',
      demoPreload: 'డెమో ప్రయాణం (చెన్నై → ఊటీ ₹15,000 లోపు)',
      budgetFitUnder: 'బడ్జెట్ లోపల',
      budgetFitNear: 'బడ్జెట్ సమీపంలో',
      budgetFitOver: 'బడ్జెట్ మించింది',
    },
    package: {
      title: 'మీ ప్యాకేజీని ఎంచుకోండి',
      subtitle: 'రవాణా, హోటల్ మరియు కార్యకలాపాలతో కూడిన పారదర్శక ధరలు',
      bestForYou: 'మీకు అత్యంత అనువైనది',
      compareTitle: 'ప్యాకేజీల పోలిక',
      selectPackage: 'ప్యాకేజీని ఎంచుకోండి',
      compareBtn: '2 ప్యాకేజీలను పోల్చండి',
      finishBtn: 'ధృవీకరణకు కొనసాగండి',
      fitScore: 'AI స్కోరు',
      rating: 'రేటింగ్',
      inclusions: 'చేర్చబడినవి',
      exclusions: 'చేర్చబడనివి',
      refundPolicy: 'రీఫండ్ విధానం',
    },
    verification: {
      title: 'ప్రయాణికుల వివరాలు & చెల్లింపు',
      subtitle: 'తక్షణ ధృవీకరణ మరియు బుకింగ్',
      tripSummary: 'ప్రయాణ సారాంశం',
      travelerDetails: 'ప్రయాణికుల సమాచారం',
      addTraveler: '+ ప్రయాణికుడిని జోడించండి',
      applyCoupon: 'వర్తించు',
      couponPlaceholder: 'కూపన్ కోడ్ (ఉదా: PILOT10)',
      couponApplied: 'కూపన్ వర్తించబడింది!',
      basePrice: 'ప్యాకేజీ ధర',
      taxes: 'పన్నులు & GST (5%)',
      discount: 'రాయితీ',
      totalAmount: 'మొత్తం చెల్లించవలసినది',
      paymentMethod: 'చెల్లింపు విధానం',
      payConfirm: 'బుకింగ్‌ను నిర్ధారించండి',
      bookingSuccess: 'మీ ప్రయాణం విజయవంతంగా బుక్ చేయబడింది!',
      bookingId: 'బుకింగ్ రిఫరెన్స్',
      continueToCompanion: 'లైవ్ తోడుగా తెరవండి',
    },
    companion: {
      title: 'లైవ్ ప్రయాణ సహచరుడు',
      subtitle: 'ప్రత్యక్ష మార్గదర్శనం మరియు భద్రతా హెచ్చరికలు',
      todayTimeline: 'నేటి కాలపట్టిక',
      liveLocation: 'లైవ్ లొకేషన్ ట్రాకర్',
      startSharing: 'లొకేషన్ షేర్ చేయండి',
      stopSharing: 'షేరింగ్ ఆపండి',
      sharingActive: 'లైవ్ లొకేషన్ షేరింగ్ నడుస్తోంది',
      sosButton: 'అత్యవసర SOS',
      sosTriggered: 'SOS యాక్టివేట్ అయ్యింది',
      roadRisk: 'రోడ్డు ప్రమాద హెచ్చరిక',
      riskLow: 'తక్కువ ప్రమాదం',
      riskMedium: 'మధ్యస్థ కొండ మలుపుల జాగ్రత్త',
      riskHigh: 'తీవ్ర ప్రమాదం - పొగమంచు లేదా జారే రోడ్డు',
      weatherAdvisory: 'వాతావరణ సలహా',
      alternateDests: 'ప్రత్యామ్నాయ ప్రదేశాలు',
      budgetTracker: 'బడ్జెట్ & ఖర్చుల ట్రాకర్',
      voiceAssistant: 'వాయిస్ అసిస్టెంట్',
      voiceTranslator: 'వాయిస్ అనువాదకుడు',
      offlineEmergency: 'ఆఫ్‌లైన్ అత్యవసర సమాచారం',
      doctorAssistance: 'వైద్య సహాయం',
      groupDecision: 'గ్రూప్ నిర్ణయ AI',
      navigation: 'వీధి నావిగేషన్',
    },
    replanning: {
      title: 'ఆటోమేటిక్ రీ-ప్లానింగ్ ఇంజిన్',
      subtitle: 'వాతావరణం లేదా రహదారి అడ్డంకులకు తక్షణ ప్రత్యామ్నాయాలు',
      simulateDisruption: 'అడ్డంకిని అనుకరించండి',
      whatHappened: 'ఏమి జరిగింది?',
      impact: 'ప్రయాణ ప్రభావం',
      aiOptions: 'AI ప్రత్యామ్నాయాలు',
      approveOption: 'ఈ మార్పును ఆమోదించండి',
      history: 'రీ-ప్లాన్ చరిత్ర',
    },
    dossier: {
      title: 'స్మార్ట్ ప్రయాణ పత్రం',
      subtitle: 'ఆఫ్‌లైన్‌లో లభించే పూర్తి ప్రయాణ వివరాలు',
      downloadPdf: 'PDF డౌన్‌లోడ్ చేయండి',
      shareTrip: 'పత్రాన్ని షేర్ చేయండి',
      emergencyContacts: 'అత్యవసర నంబర్లు',
      hospitalList: 'సమీప ఆసుపత్రులు',
      policeList: 'పోలీస్ స్టేషన్లు',
      itineraryDetails: 'పూర్తి ప్రణాళిక',
      expensesTotal: 'మొత్తం ఖర్చులు',
    },
    assistant: {
      title: 'TripPilot AI అసిస్టెంట్',
      subtitle: 'మీ 24/7 స్మార్ట్ ప్రయాణ తోడు',
      inputPlaceholder: 'మార్గం, భద్రత, ఆహారం గురించి అడగండి...',
      speakBtn: 'మాట్లాడండి',
      applyToTrip: 'ప్లాన్‌కు జోడించు',
      demoBadge: 'డెమో సమాచారం',
      geminiLiveBadge: 'జెమిని AI లైవ్',
    },
    common: {
      resetDemo: 'రీసెట్ చేయండి',
      demoActive: 'డెమో మోడ్',
      liveSharingOn: 'లైవ్ షేరింగ్ ఆన్‌లో ఉంది',
      offlineMode: 'ఆఫ్‌లైన్ నిల్వ సిద్ధంగా ఉంది',
      close: 'మూసివేయి',
      cancel: 'రద్దు చేయి',
      save: 'సేవ్ చేయి',
      edit: 'మార్చు',
      remove: 'తొలగించు',
      viewInGoogleMaps: 'Google Maps లో తెరవండి',
    },
  },
  ml: {
    appName: 'TripPilot AI',
    tagline: 'ആസൂത്രണം ചെയ്യുക. യാത്ര ചെയ്യുക. പുനഃക്രമീകരിക്കുക. സുരക്ഷിതമായിരിക്കുക.',
    skip: 'ഒഴിവാക്കുക',
    steps: {
      planner: 'പ്ലാനർ',
      package: 'പാക്കേജ്',
      verification: 'സ്ഥിരീകരണം',
      companion: 'സഹയാത്രികൻ',
      replanning: 'പുനഃക്രമീകരണം',
      dossier: 'യാത്രാ രേഖ',
    },
    tripModes: {
      family: { label: 'കുടുംബ യാത്ര', desc: 'മുതിർന്നവർക്കും കുട്ടികൾക്കും സുരക്ഷിതം' },
      adventure: { label: 'സാഹസിക യാത്ര', desc: 'ട്രെക്കിംഗ്, ക്യാമ്പിംഗ്, റാഫ്റ്റിംഗ്' },
      solo: { label: 'ഏകാംഗ യാത്ര', desc: 'സുരക്ഷിത റൂട്ടുകൾ, ലൈവ് ട്രാക്കിംഗ്' },
      friends: { label: 'സുഹൃത്തുക്കളോടൊപ്പം', desc: 'ഗ്രൂപ്പ് യാത്ര, ചെലവ് പങ്കിടൽ' },
      honeymoon: { label: 'മധുവിധു', desc: 'മനോഹരമായ റിസോർട്ടുകൾ, സ്വകാര്യത' },
      pilgrimage: { label: 'തീർത്ഥാടനം', desc: 'ക്ഷേത്രങ്ങൾ, ദർശന സമയം' },
      food: { label: 'ഫുഡ് ടൂർ', desc: 'നാടൻ ഭക്ഷണങ്ങളും രുചികളും' },
      nature: { label: 'പ്രകൃതി യാത്ര', desc: 'തേയിലത്തോട്ടങ്ങൾ, വെള്ളച്ചാട്ടങ്ങൾ' },
      bike: { label: 'ബൈക്ക് ട്രിപ്പ്', desc: 'ചുരം റോഡുകൾ, മനോഹര റൂട്ടുകൾ' },
      weekend: { label: 'വാരാന്ത്യ യാത്ര', desc: 'വേഗത്തിലുള്ള 2 ദിവസത്തെ യാത്ര' },
      budget: { label: 'ചെലവ് കുറഞ്ഞ യാത്ര', desc: 'ഹോംസ്റ്റേകൾ, പൊതുഗതാഗതം' },
      luxury: { label: 'ആഡംബര യാത്ര', desc: '5-സ്റ്റാർ റിസോർട്ടുകൾ, പ്രത്യേക വാഹനം' },
    },
    search: {
      placeholder: 'സ്ഥലങ്ങൾ തിരയുക (ഉദാ: ഊട്ടി, മൂന്നാർ, കൊടൈക്കനാൽ, ദുബായ്)...',
      recent: 'സമീപകാല തിരയലുകൾ',
      popular: 'പ്രശസ്ത സ്ഥലങ്ങൾ',
      nearMe: 'എന്റെ അടുത്ത്',
      noResults: 'ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല.',
      voiceSearching: 'ശബ്ദം ശ്രദ്ധിക്കുന്നു...',
      listening: 'കേൾക്കുന്നു...',
    },
    planner: {
      title: 'AI ഉപയോഗിച്ച് യാത്ര പ്ലാൻ ചെയ്യാം',
      subtitle: 'നിങ്ങളുടെ ബജറ്റിന് അനുയോജ്യമായ യാത്രാ പദ്ധതി നിമിഷങ്ങൾക്കുള്ളിൽ',
      fromLabel: 'പുറപ്പെടുന്ന സ്ഥലം',
      destLabel: 'യാത്രാ ലക്ഷ്യം',
      startDate: 'ആരംഭ തീയതി',
      endDate: 'സമാപന തീയതി',
      travelers: 'യാത്രക്കാരുടെ എണ്ണം',
      budget: 'ആകെ ബജറ്റ് (₹)',
      travelMode: 'യാത്രാ രീതി',
      interests: 'താൽപ്പര്യങ്ങൾ',
      stayPref: 'താമസ സൗകര്യം',
      pace: 'യാത്രാ വേഗത',
      relaxed: 'ശാന്തമായ',
      balanced: 'സന്തുലിതമായ',
      packed: 'കൂടുതൽ സ്ഥലങ്ങൾ',
      generateBtn: 'AI യാത്രാ പദ്ധതി തയ്യാറാക്കൂ',
      generating: 'AI പദ്ധതി തയ്യാറാക്കുന്നു...',
      whyThisPlan: 'എന്തുകൊണ്ട് ഈ പദ്ധതി?',
      packingList: 'പാക്കിംഗ് ലിസ്റ്റ്',
      safetyNotes: 'സുരക്ഷാ നിർദ്ദേശങ്ങൾ',
      proceedBtn: 'പാക്കേജ് തിരഞ്ഞെടുക്കുക',
      demoPreload: 'ഡെമോ യാത്ര (ചെന്നൈ → ഊട്ടി ₹15,000-ൽ താഴെ)',
      budgetFitUnder: 'ബജറ്റിനേക്കാൾ കുറവ്',
      budgetFitNear: 'ബജറ്റിന് അനുയോജ്യം',
      budgetFitOver: 'ബജറ്റിൽ കൂടുതൽ',
    },
    package: {
      title: 'നിങ്ങളുടെ പാക്കേജ് തിരഞ്ഞെടുക്കൂ',
      subtitle: 'യാത്ര, താമസം എന്നിവ ഉൾപ്പെടുന്ന വ്യക്തമായ നിരക്കുകൾ',
      bestForYou: 'ഏറ്റവും അനുയോജ്യം',
      compareTitle: 'പാക്കേജ് താരതമ്യം',
      selectPackage: 'പാക്കേജ് തിരഞ്ഞെടുക്കൂ',
      compareBtn: '2 പാക്കേജുകൾ താരതമ്യം ചെയ്യുക',
      finishBtn: 'സ്ഥിരീകരണത്തിലേക്ക് പോവുക',
      fitScore: 'AI ഫിറ്റ് സ്കോർ',
      rating: 'റേറ്റിംഗ്',
      inclusions: 'ഉൾപ്പെടുന്നവ',
      exclusions: 'ഉൾപ്പെടാത്തവ',
      refundPolicy: 'റീഫണ്ട് നയം',
    },
    verification: {
      title: 'യാത്രക്കാരുടെ വിവരങ്ങളും പേയ്‌മെന്റും',
      subtitle: 'തൽക്ഷണ സ്ഥിരീകരണവും ബുക്കിംഗും',
      tripSummary: 'യാത്രാ സംഗ്രഹം',
      travelerDetails: 'യാത്രക്കാരുടെ വിവരങ്ങൾ',
      addTraveler: '+ യാത്രക്കാരനെ ചേർക്കുക',
      applyCoupon: 'ബാധകമാക്കുക',
      couponPlaceholder: 'കൂപ്പൺ കോഡ് (ഉദാ: PILOT10)',
      couponApplied: 'കൂപ്പൺ സ്വീകരിച്ചു!',
      basePrice: 'പാക്കേജ് തുക',
      taxes: 'നികുതികൾ (5%)',
      discount: 'ഇളവുകൾ',
      totalAmount: 'ആകെ അടയ്ക്കേണ്ട തുക',
      paymentMethod: 'പേയ്‌മെന്റ് രീതി',
      payConfirm: 'ബുക്കിംഗ് ഉറപ്പാക്കുക',
      bookingSuccess: 'ബുക്കിംഗ് വിജയകരമായി പൂർത്തിയായി!',
      bookingId: 'ബുക്കിംഗ് ഐഡി',
      continueToCompanion: 'ലൈവ് കമ്പാനിയനിലേക്ക് കടക്കൂ',
    },
    companion: {
      title: 'ലൈവ് യാത്രാ സഹയാത്രികൻ',
      subtitle: 'തത്സമയ നാവിഗേഷനും സുരക്ഷാ നിരീക്ഷണവും',
      todayTimeline: 'ഇന്നത്തെ സമയപ്പട്ടിക',
      liveLocation: 'ലൈവ് ലൊക്കേഷൻ ട്രാക്കർ',
      startSharing: 'ലൊക്കേഷൻ ഷെയർ ചെയ്യുക',
      stopSharing: 'ഷെയറിംഗ് നിർത്തുക',
      sharingActive: 'ലൊക്കേഷൻ ഷെയറിംഗ് പ്രവർത്തിക്കുന്നു',
      sosButton: 'അടിയന്തര SOS',
      sosTriggered: 'SOS പ്രവർത്തിക്കുന്നു',
      roadRisk: 'റോഡ് സുരക്ഷാ പരിശോധന',
      riskLow: 'കുറഞ്ഞ അപകടസാധ്യത',
      riskMedium: 'ചുരം റോഡ് ജാഗ്രത',
      riskHigh: 'കൂടിയ അപകടസാധ്യത - കനത്ത മൂടൽമഞ്ഞ്',
      weatherAdvisory: 'കാലാവസ്ഥ മുന്നറിയിപ്പ്',
      alternateDests: 'മറ്റ് യാത്രാ സ്ഥലങ്ങൾ',
      budgetTracker: 'ബജറ്റും ചെലവുകളും',
      voiceAssistant: 'വോയ്സ് അസിസ്റ്റന്റ്',
      voiceTranslator: 'വോയ്സ് വിവർത്തകൻ',
      offlineEmergency: 'ഓഫ്‌ലൈൻ അടിയന്തര വിവരങ്ങൾ',
      doctorAssistance: 'ഡോക്ടറുടെ സഹായം',
      groupDecision: 'ഗ്രൂപ്പ് ഡിസിഷൻ AI',
      navigation: 'റോഡ് നാവിഗേഷൻ',
    },
    replanning: {
      title: 'പുനഃക്രമീകരണ സംവിധാനം',
      subtitle: 'തടസ്സങ്ങൾ വരുമ്പോൾ AI ഉടനടി പുതിയ പ്ലാൻ നൽകുന്നു',
      simulateDisruption: 'തടസ്സം അനുകരിക്കുക',
      whatHappened: 'എന്താണ് സംഭവിച്ചത്?',
      impact: 'യാത്രാ ആഘാതം',
      aiOptions: 'AI മാതൃകാ പ്ലാനുകൾ',
      approveOption: 'ഈ പ്ലാൻ സ്വീകരിക്കുക',
      history: 'പുനഃക്രമീകരണ ചരിത്രം',
    },
    dossier: {
      title: 'സ്മാർട്ട് യാത്രാ രേഖ',
      subtitle: 'ഓഫ്‌ലൈനായി ഉപയോഗിക്കാവുന്ന പൂർണ്ണ യാത്രാ രേഖ',
      downloadPdf: 'PDF ഡൗൺലോഡ് ചെയ്യുക',
      shareTrip: 'രേഖ പങ്കിടുക',
      emergencyContacts: 'അടിയന്തര നമ്പറുകൾ',
      hospitalList: 'അടുത്തുള്ള ആശുപത്രികൾ',
      policeList: 'പോലീസ് സ്റ്റേഷനുകൾ',
      itineraryDetails: 'പൂർണ്ണ ഷെഡ്യൂൾ',
      expensesTotal: 'ആകെ ചെലവുകൾ',
    },
    assistant: {
      title: 'TripPilot AI അസിസ്റ്റന്റ്',
      subtitle: 'നിങ്ങളുടെ സ്മാർട്ട് യാത്രാ തുണ',
      inputPlaceholder: 'റൂട്ട്, ഭക്ഷണം, സുരക്ഷ എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ...',
      speakBtn: 'സംസാരിക്കൂ',
      applyToTrip: 'പ്ലാനിലേക്ക് ചേർക്കുക',
      demoBadge: 'ഡെമോ ഡാറ്റ',
      geminiLiveBadge: 'ജെമിനി AI തത്സമയം',
    },
    common: {
      resetDemo: 'റീസെറ്റ് ചെയ്യുക',
      demoActive: 'ഡെമോ മോഡ്',
      liveSharingOn: 'ലൈവ് ഷെയറിംഗ് ഓൺ ആണ്',
      offlineMode: 'ഓഫ്‌ലൈൻ സ്റ്റോറേജ് തയ്യാറാണ്',
      close: 'അടയ്ക്കുക',
      cancel: 'റദ്ദാക്കുക',
      save: 'സേവ് ചെയ്യുക',
      edit: 'മാറ്റുക',
      remove: 'ഒഴിവാക്കുക',
      viewInGoogleMaps: 'Google Maps-ൽ തുറക്കുക',
    },
  },
};
