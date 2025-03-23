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
  
  export interface Hotel {
    _id: string
    name: string
    location: string
    city: string
    description: string
    rating: number
    price: number
    image: string
    amenities: string[]
    rooms: Room[]
  
    // Champs spécifiques à la Coupe du Monde
    distance_to_venues?: Record<string, number>
    world_cup_package?: boolean
    match_day_shuttle?: boolean
    fan_zone_nearby?: boolean
    public_transport?: string[]
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
  
  