// Updated Hotel interface to fix all TypeScript errors
export interface Hotel {
  id:  string | number;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  rating: string; // Changed from number to string to match code usage
  status: "active" | "inactive" | "pending"; // Strictly typed string literal union
  verified: boolean;
  pendingApproval: boolean;
  rooms: number;
  bookings: number;
  revenue: string;
  // Optional properties
  amenities?: string[];
  country?: string;
  originalPrice?: number;
  deal?: boolean;
  worldCupVenue?: boolean;
  distanceToStadium?: string;
  matchesHosted?: string[];
}

export interface PopularSearch {
  id: number;
  term: string;
  count: number;
  flag: string;
}

export interface HostCountry {
  name: string;
  flag: string;
  stadiums: number;
  matches: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  // ... autres propriétés
}

export interface Reservation {
  id: number;
  userId: number;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  // ... autres propriétés
}

// Add this type to your code to help with form state typing
export interface HotelFormState {
  name: string;
  location: string;
  rooms: string;
  price: string;
  status: "active" | "inactive" | "pending";
  verified: boolean;
  description: string;
  image: string;
  rating: string;
  pendingApproval: boolean;
}