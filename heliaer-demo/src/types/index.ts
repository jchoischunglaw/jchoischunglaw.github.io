export interface Pilot {
  name: string;
  rating: number;
  photo: string;
  experience: string;
  totalFlights?: number;
  specializations?: string[];
}

export interface Helicopter {
  model: string;
  capacity: number;
  photo: string;
  year?: number;
  maxRange?: number;
  cruiseSpeed?: number;
}

export interface HelicopterOption {
  id: number;
  price: number;
  duration: number;
  pilot: Pilot;
  helicopter: Helicopter;
  matchScore: number;
  availableSlots?: string[];
  departureTime?: string;
  arrivalTime?: string;
}

export interface Route {
  departure: Location;
  arrival: Location;
  distance: number;
  estimatedDuration: number;
}

export interface Location {
  name: string;
  code: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'airport' | 'helipad' | 'hotel' | 'resort' | 'custom';
}

export interface SearchCriteria {
  route: Route;
  passengers: number;
  departureDate: string;
  departureTime: string;
  preferences?: {
    priceRange?: [number, number];
    pilotRatingMin?: number;
    helicopterAge?: number;
  };
}

export interface MatchingStep {
  id: number;
  message: string;
  icon: string;
  completed: boolean;
  progress: number;
}

export interface MatchingState {
  isMatching: boolean;
  currentStep: number;
  steps: MatchingStep[];
  results: HelicopterOption[];
  error?: string;
}

export type AppScreen = 'auth' | 'search' | 'matching' | 'results' | 'booking' | 'confirmation';

export interface AppState {
  currentScreen: AppScreen;
  searchCriteria: SearchCriteria | null;
  matchingState: MatchingState;
  selectedOption: HelicopterOption | null;
  bookingData: BookingData | null;
}

// Authentication types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'customer' | 'pilot' | 'operator';
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'customer' | 'pilot' | 'operator';
  phone?: string;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthScreen = 'login' | 'signup' | 'forgot-password';

// Booking types
export interface PassengerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  identification: {
    type: 'passport' | 'license' | 'national-id';
    number: string;
    expiryDate: string;
    issuingAuthority: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  specialRequirements?: string;
}

export interface BookingData {
  id: string;
  selectedOption: HelicopterOption;
  searchCriteria: SearchCriteria;
  passengers: PassengerInfo[];
  bookingReference: string;
  totalPrice: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialInstructions?: string;
}

export interface BookingFormData {
  passengers: PassengerInfo[];
  specialInstructions?: string;
  agreeToTerms: boolean;
  agreeToSafety: boolean;
}

export interface BookingFormErrors {
  [key: string]: string | BookingFormErrors;
}