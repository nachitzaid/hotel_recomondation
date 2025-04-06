// types/index.ts

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

// Interface Hotel complète pour l'administration
export interface Hotel {
  _id: string
  countyCode: string
  countyName: string
  cityCode: number
  cityName: string
  HotelCode: number
  HotelName: string
  HotelRating: string
  Address: string
  Attractions: string
  Description: string
  FaxNumber: string
  HotelFacilities: string
  Map: string
  PhoneNumber: string
  PinCode: number
  HotelWebsiteUrl: string
  status: "active" | "inactive" | "pending"
  verified: boolean
  pendingApproval?: boolean // Rendu optionnel pour être compatible
  image?: string
  rooms?: number
  price?: number
  bookings?: number
  revenue?: string
}

// Interface pour le formulaire d'ajout/édition d'hôtel
export interface HotelFormState {
  HotelName: string
  cityName: string
  countyName: string
  countyCode: string
  HotelCode: number | string
  HotelRating: string
  Address: string
  Description: string
  PhoneNumber: string
  HotelWebsiteUrl: string
  status: "active" | "inactive" | "pending"
  verified: boolean
  pendingApproval?: boolean // Rendu optionnel également
  image?: string
  rooms?: number | string
  price?: number | string
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