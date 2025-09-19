import type { HelicopterOption, Location, Route, MatchingStep } from '../types';
import { getAssetPath } from '../utils/assets';

export const MOCK_LOCATIONS: Location[] = [
  {
    name: 'Vancouver Downtown',
    code: 'YVR',
    coordinates: { lat: 49.2827, lng: -123.1207 },
    type: 'helipad'
  },
  {
    name: 'Whistler Village',
    code: 'WSV',
    coordinates: { lat: 50.1163, lng: -122.9574 },
    type: 'resort'
  },
  {
    name: 'Seattle Downtown',
    code: 'SEA',
    coordinates: { lat: 47.6062, lng: -122.3321 },
    type: 'helipad'
  },
  {
    name: 'Victoria Harbour',
    code: 'VIC',
    coordinates: { lat: 48.4284, lng: -123.3656 },
    type: 'helipad'
  }
];

export const DEFAULT_ROUTE: Route = {
  departure: MOCK_LOCATIONS[0], // Vancouver
  arrival: MOCK_LOCATIONS[1],   // Whistler
  distance: 120,
  estimatedDuration: 15
};

export const MOCK_HELICOPTERS: HelicopterOption[] = [
  {
    id: 1,
    price: 1200,
    duration: 15,
    pilot: {
      name: "Captain Mike Johnson",
      rating: 4.8,
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      experience: "15 years experience",
      totalFlights: 3240,
      specializations: ["Mountain Flying", "VIP Transport"]
    },
    helicopter: {
      model: "Bell 407",
      capacity: 6,
      photo: getAssetPath("images/helicopters/Bell 407.png"),
      year: 2019,
      maxRange: 694,
      cruiseSpeed: 246
    },
    matchScore: 0.95,
    availableSlots: ["2:00 PM", "4:30 PM", "6:00 PM"],
    departureTime: "2:00 PM",
    arrivalTime: "2:15 PM"
  },
  {
    id: 2,
    price: 980,
    duration: 18,
    pilot: {
      name: "Captain Sarah Chen",
      rating: 4.9,
      photo: "https://images.unsplash.com/photo-1594824694996-eff99a1fa09b?w=150&h=150&fit=crop&crop=face",
      experience: "12 years experience",
      totalFlights: 2850,
      specializations: ["Scenic Tours", "Emergency Response"]
    },
    helicopter: {
      model: "Airbus H125",
      capacity: 5,
      photo: getAssetPath("images/helicopters/Airbus H125.png"),
      year: 2020,
      maxRange: 610,
      cruiseSpeed: 224
    },
    matchScore: 0.88,
    availableSlots: ["2:15 PM", "5:00 PM", "7:30 PM"],
    departureTime: "2:15 PM",
    arrivalTime: "2:33 PM"
  },
  {
    id: 3,
    price: 1450,
    duration: 12,
    pilot: {
      name: "Captain David Rodriguez",
      rating: 4.7,
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      experience: "18 years experience",
      totalFlights: 4120,
      specializations: ["Corporate Transport", "High-altitude Flying"]
    },
    helicopter: {
      model: "Robinson R66",
      capacity: 4,
      photo: getAssetPath("images/helicopters/Robinson R66.png"),
      year: 2021,
      maxRange: 648,
      cruiseSpeed: 259
    },
    matchScore: 0.82,
    availableSlots: ["1:45 PM", "3:30 PM", "5:15 PM"],
    departureTime: "1:45 PM",
    arrivalTime: "1:57 PM"
  }
];

export const MATCHING_STEPS: MatchingStep[] = [
  {
    id: 1,
    message: "🔍 Searching helicopters within 50km radius...",
    icon: "search",
    completed: false,
    progress: 25
  },
  {
    id: 2,
    message: "👨‍✈️ Checking pilot availability...",
    icon: "user-check",
    completed: false,
    progress: 50
  },
  {
    id: 3,
    message: "🌤️ Analyzing weather conditions...",
    icon: "cloud-sun",
    completed: false,
    progress: 75
  },
  {
    id: 4,
    message: "💰 Calculating optimal pricing...",
    icon: "calculator",
    completed: false,
    progress: 100
  }
];

export const PASSENGER_OPTIONS = [
  { value: 1, label: "1 Passenger" },
  { value: 2, label: "2 Passengers" },
  { value: 3, label: "3 Passengers" },
  { value: 4, label: "4 Passengers" },
  { value: 5, label: "5 Passengers" },
  { value: 6, label: "6 Passengers" },
  { value: 7, label: "7 Passengers" },
  { value: 8, label: "8 Passengers" }
];

export const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"
];

export const DEFAULT_SEARCH_CRITERIA = {
  route: DEFAULT_ROUTE,
  passengers: 3,
  departureDate: new Date().toISOString().split('T')[0],
  departureTime: "2:00 PM"
};