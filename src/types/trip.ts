export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml';

export type TripModeType =
  | 'family'
  | 'adventure'
  | 'solo'
  | 'friends'
  | 'honeymoon'
  | 'pilgrimage'
  | 'food'
  | 'nature'
  | 'bike'
  | 'weekend'
  | 'budget'
  | 'luxury';

export interface Destination {
  id: string;
  name: string;
  nameTa: string;
  nameHi?: string;
  nameTe?: string;
  nameMl?: string;
  stateOrCountry: string;
  region: 'tamilnadu' | 'india' | 'global';
  description: string;
  descriptionTa: string;
  bestSeason: string;
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  approxBudgetPerDay: number;
  popularActivities: string[];
  nearbyAttractions: string[];
  safetyLevel: 'high' | 'moderate' | 'caution';
  safetyScore: number; // 0 - 100
  suitableTripModes: TripModeType[];
  suggestedStayAreas: string[];
  localFoodHighlights: string[];
  accessibilityNotes?: string;
  lat: number;
  lng: number;
  weatherMock: {
    temp: number;
    condition: string;
    humidity: number;
    airQuality: string;
    crowdLevel: 'Low' | 'Moderate' | 'High' | 'Festival Rush';
  };
}

export interface Activity {
  id: string;
  time: string;
  activity: string;
  location: string;
  estimatedCost: number;
  travelRoute: string;
  notes: string;
  category: 'Sightseeing' | 'Food' | 'Transport' | 'Stay' | 'Adventure' | 'Leisure';
  weatherDependency: 'Indoor' | 'Outdoor' | 'Rain-Safe';
  completed?: boolean;
}

export interface ItineraryDay {
  day: number;
  date?: string;
  title: string;
  activities: Activity[];
  dayTotalCost: number;
}

export interface TravelPackage {
  id: 'budget' | 'standard' | 'premium' | 'family';
  name: string;
  nameTa: string;
  price: number;
  transportDetails: string;
  hotelDetails: string;
  meals: string;
  activities: string;
  cancellationPolicy: string;
  suitabilityNote: string;
  inclusions: string[];
  exclusions: string[];
  refundEstimate: string;
  rating: number;
  reviewCount: number;
  fitScore: number;
  isAiRecommended?: boolean;
  recommendationReason?: string;
}

export interface TravelerInfo {
  id: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  idType: 'Aadhaar' | 'Passport' | 'Voter ID' | 'Driving License';
  idNumber: string;
  emergencyContact?: string;
  specialAssistance?: string;
  mealPreference: 'Veg' | 'Non-Veg' | 'Jain' | 'Any';
}

export interface ExpenseItem {
  id: string;
  category: 'Stay' | 'Food' | 'Transport' | 'Activities' | 'Shopping' | 'Emergency';
  amount: number;
  note: string;
  date: string;
  paymentMethod: 'UPI' | 'Card' | 'Cash';
  paidBy?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface DisruptionEvent {
  id: string;
  type: 'rain' | 'train_delay' | 'road_closure' | 'landslide' | 'heat' | 'hotel_issue' | 'attraction_closed' | 'medical' | 'budget_overrun' | 'crowd_surge';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impactCost: number;
  impactTime: string;
  safetyRisk: 'Low' | 'Medium' | 'High';
}

export interface ReplanOption {
  id: string;
  title: string;
  description: string;
  newRouteOrActivity: string;
  costDifference: number; // positive = extra, negative = saved
  timeImpact: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  tradeOffs: string;
  confidenceScore: number; // 0 - 100
}

export interface ReplanHistoryRecord {
  id: string;
  timestamp: string;
  disruption: string;
  selectedOption: string;
  costDelta: number;
  summary: string;
}

export interface LiveLocationData {
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: number;
  altitude?: number | null;
  heading?: number | null;
  lastUpdated: string;
  address?: string;
  distanceTravelledKm: number;
  etaNextActivity: string;
  batteryLevel?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedChips?: string[];
  actionType?: 'apply_itinerary' | 'replan' | 'reduce_budget' | 'view_safety';
  actionData?: any;
}
