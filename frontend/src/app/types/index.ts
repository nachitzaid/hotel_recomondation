export interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    role: "user" | "admin"
    avatar?: string
  }
  
  export interface Room {
    type: string
    price: number
    capacity: number
    amenities?: string[]
    images?: string[]
  }
  
  // Updated Hotel interface to fix all TypeScript errors
export interface Hotel {
  id: number | string;
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

// Add this interface to help with form state typing
export interface HotelFormState {
  name: string;
  location: string;
  rooms: string; // String for form input
  price: string; // String for form input
  status: "active" | "inactive" | "pending";
  verified: boolean;
  description: string;
  image: string;
  rating: string;
  pendingApproval: boolean;
}

  export interface Match {
    _id: string
    team1: string
    team2: string
    date: string
    time: string
    venue: string
    city: string
    group?: string
    round: string
    team1_score?: number | null
    team2_score?: number | null
    status: "scheduled" | "live" | "completed"
    highlights?: string
  }
  
  export interface Package {
    _id: string
    name: string
    description: string
    price: number
    includes: string[]
    hotel_id?: string
    match_ids?: string[]
    duration: number
    image?: string
  }
  
  export interface Reservation {
    _id: string
    user_id: string
    hotel_id: string
    room_type: string
    check_in: string
    check_out: string
    guests: number
    total_price: number
    status: "confirmed" | "cancelled" | "completed"
    payment_method: string
    special_requests?: string
  
    // Champs spécifiques à la Coupe du Monde
    match_ids?: string[]
    shuttle_service?: boolean
    package_id?: string
  }
  
  