// Types for MongoDB hotels collection
export interface Hotel {
  // Core MongoDB fields
  _id: string;
  countyCode: string;         // Code pays (ex: "MA" pour Maroc)
  countyName: string;         // Nom du pays (ex: "Morocco")
  cityCode: number;           // Code ville (ex: 100349)
  cityName: string;           // Nom ville (ex: "Afourer")
  HotelCode: number;          // Code hôtel (ex: 1224821)
  HotelName: string;          // Nom hôtel (ex: "Chems Le Tazarkount")
  HotelRating: string;        // Classement (ex: "FourStar")
  Address: string;            // Adresse complète
  Attractions: string;        // Description des attractions
  Description: string;        // Description HTML
  FaxNumber: string;          // Numéro fax
  HotelFacilities: string;    // Liste des équipements
  Map: string;                // Coordonnées GPS "lat|lng"
  PhoneNumber: string;        // Numéro téléphone
  PinCode: number;            // Code postal
  HotelWebsiteUrl: string;    // URL site web

  // Status fields
  status: "active" | "inactive" | "pending";
  verified: boolean;
  pendingApproval: boolean;

  // Optional fields
  image?: string;             // URL image
  rooms?: number;             // Nombre de chambres
  price?: number;             // Prix moyen
  bookings?: number;          // Nombre réservations
  revenue?: string;           // Chiffre d'affaires (ex: "1250€")
  amenities?: string[];       // Équipements (alternative à HotelFacilities)
}

// Form state for hotel creation/editing
export interface HotelFormState {
  // Required fields
  HotelName: string;
  cityName: string;
  countyName: string;
  HotelRating: "OneStar" | "TwoStar" | "ThreeStar" | "FourStar" | "FiveStar";
  status: "active" | "inactive" | "pending";

  // Location fields
  countyCode: string;
  cityCode?: number;
  Address: string;
  PinCode?: number;
  Map?: string;

  // Contact info
  PhoneNumber: string;
  FaxNumber?: string;
  HotelWebsiteUrl?: string;

  // Descriptive fields
  Description: string;
  Attractions?: string;
  HotelFacilities?: string;

  // Business fields
  verified: boolean;
  pendingApproval: boolean;
  rooms?: number;
  price?: number;
  image?: string;
}

// Simplified hotel for listings
export interface HotelSummary {
  _id: string;
  HotelName: string;
  cityName: string;
  countyName: string;
  HotelRating: string;
  status: string;
  image?: string;
  price?: number;
}

// Search filters
export interface HotelFilters {
  minRating?: number;
  maxPrice?: number;
  status?: "active" | "inactive" | "pending";
  country?: string;
  city?: string;
  amenities?: string[];
}

// Pagination response
export interface PaginatedHotelResponse {
  data: Hotel[];
  total: number;
  page: number;
  limit: number;
}

// Popular searches
export interface PopularSearch {
  id: number;
  term: string;
  count: number;
  flag: string;
}

// Host country info
export interface HostCountry {
  code: string;
  name: string;
  flag: string;
  stadiums: number;
  matches: number;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "manager";
  favorites?: string[];       // Array of hotel _ids
}

// Reservation types
export interface Reservation {
  _id: string;
  userId: string;
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

// Analytics data
export interface HotelAnalytics {
  totalHotels: number;
  activeHotels: number;
  countries: { name: string; count: number }[];
  averageRating: number;
  occupancyRate: number;
}

// Legacy types for compatibility (if needed)
export interface LegacyHotel {
  id: string | number;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  rating: string;
  status: "active" | "inactive" | "pending";
  verified: boolean;
  pendingApproval: boolean;
  rooms: number;
  bookings: number;
  revenue: string;
}

// Helper function to convert to legacy format
export function toLegacyHotel(hotel: Hotel): LegacyHotel {
  return {
    id: hotel._id,
    name: hotel.HotelName,
    location: `${hotel.cityName}, ${hotel.countyName}`,
    description: hotel.Description,
    image: hotel.image || '/placeholder.svg',
    price: hotel.price || 0,
    rating: hotel.HotelRating.replace('Star', ''),
    status: hotel.status,
    verified: hotel.verified,
    pendingApproval: hotel.pendingApproval,
    rooms: hotel.rooms || 0,
    bookings: hotel.bookings || 0,
    revenue: hotel.revenue || '0€'
  };
}