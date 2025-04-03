export interface Hotel {
    id: number
    name: string
    location: string
    price: number
    originalPrice?: number
    rating: number
    image: string
    amenities: string[]
    deal?: boolean
    worldCupVenue?: boolean
    distanceToStadium?: string
    country: string
    matchesHosted?: string[]
  }
  
  export interface PopularSearch {
    id: number
    term: string
    count: number
    flag: string
  }
  
  export interface HostCountry {
    name: string
    flag: string
    stadiums: number
    matches: number
  }
  
  export interface BookingTime {
    id: number
    destination: string
    bestMonth: string
    savingsPercent: number
    image: string
  }
  
  // Host countries data
  export const hostCountries: HostCountry[] = [
    { name: "Espagne", flag: "🇪🇸", stadiums: 8, matches: 20 },
    { name: "Portugal", flag: "🇵🇹", stadiums: 5, matches: 15 },
    { name: "Maroc", flag: "🇲🇦", stadiums: 6, matches: 15 },
  ]
  
  // Sample hotel data - updated for World Cup 2030
  export const hotels: Hotel[] = [
    {
      id: 1,
      name: "Stade de France Hotel",
      location: "Saint-Denis, France",
      country: "France",
      price: 349,
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=300&text=Stade+de+France",
      amenities: ["Wifi", "Breakfast", "TV", "Spa"],
      worldCupVenue: true,
      distanceToStadium: "500m",
      matchesHosted: ["Quart de finale", "Match de groupe A"],
    },
    {
      id: 2,
      name: "Santiago Bernabéu View",
      location: "Madrid, Espagne",
      country: "Espagne",
      price: 399,
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=300&text=Santiago+Bernabéu",
      amenities: ["Wifi", "Pool", "Breakfast", "Stadium View"],
      worldCupVenue: true,
      distanceToStadium: "300m",
      matchesHosted: ["Demi-finale", "Match de groupe B", "Huitième de finale"],
    },
    {
      id: 3,
      name: "Sporting Lisbon Lodge",
      location: "Lisbonne, Portugal",
      country: "Portugal",
      price: 319,
      rating: 4.5,
      image: "/placeholder.svg?height=200&width=300&text=Sporting+Lisbon",
      amenities: ["Wifi", "Breakfast", "Fan Zone", "Shuttle"],
      worldCupVenue: true,
      distanceToStadium: "1.2km",
      matchesHosted: ["Match de groupe C", "Match de groupe D"],
    },
    {
      id: 4,
      name: "Camp Nou Experience",
      location: "Barcelone, Espagne",
      country: "Espagne",
      price: 429,
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=300&text=Camp+Nou",
      amenities: ["Wifi", "Breakfast", "TV", "Stadium Tours"],
      worldCupVenue: true,
      distanceToStadium: "600m",
      matchesHosted: ["Quart de finale", "Match de groupe E", "Huitième de finale"],
    },
    {
      id: 8,
      name: "Rabat Royal Stadium Hotel",
      location: "Rabat, Maroc",
      country: "Maroc",
      price: 289,
      rating: 4.6,
      image: "/placeholder.svg?height=200&width=300&text=Rabat+Stadium",
      amenities: ["Wifi", "Pool", "Restaurant", "Shuttle"],
      worldCupVenue: true,
      distanceToStadium: "800m",
      matchesHosted: ["Match de groupe F", "Match de groupe G"],
    },
    {
      id: 9,
      name: "Porto FC View Hotel",
      location: "Porto, Portugal",
      country: "Portugal",
      price: 309,
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=300&text=Porto+Stadium",
      amenities: ["Wifi", "Breakfast", "Bar", "Stadium View"],
      worldCupVenue: true,
      distanceToStadium: "400m",
      matchesHosted: ["Match de groupe H", "Huitième de finale"],
    },
    {
      id: 10,
      name: "Casablanca Stadium Suites",
      location: "Casablanca, Maroc",
      country: "Maroc",
      price: 339,
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=300&text=Casablanca+Stadium",
      amenities: ["Wifi", "Pool", "Restaurant", "Fan Zone"],
      worldCupVenue: true,
      distanceToStadium: "700m",
      matchesHosted: ["Demi-finale", "Match de groupe A", "Huitième de finale"],
    },
    {
      id: 11,
      name: "Valencia CF Hotel",
      location: "Valencia, Espagne",
      country: "Espagne",
      price: 279,
      rating: 4.4,
      image: "/placeholder.svg?height=200&width=300&text=Valencia+Stadium",
      amenities: ["Wifi", "Breakfast", "Gym", "Shuttle"],
      worldCupVenue: true,
      distanceToStadium: "1km",
      matchesHosted: ["Match de groupe B", "Match de groupe C"],
    },
  ]
  
  // Hot deals data - World Cup specials
  export const hotDeals: Hotel[] = [
    {
      id: 5,
      name: "Supporter Package Hotel",
      location: "Casablanca, Maroc",
      country: "Maroc",
      price: 259,
      originalPrice: 399,
      rating: 4.6,
      image: "/placeholder.svg?height=200&width=300&text=Supporter+Package",
      amenities: ["Wifi", "Pool", "Fan Zone", "Match Tickets"],
      deal: true,
      worldCupVenue: true,
      distanceToStadium: "1.5km",
      matchesHosted: ["Match de groupe D", "Match de groupe E"],
    },
    {
      id: 6,
      name: "Football Fans Resort",
      location: "Séville, Espagne",
      country: "Espagne",
      price: 229,
      originalPrice: 349,
      rating: 4.4,
      image: "/placeholder.svg?height=200&width=300&text=Fans+Resort",
      amenities: ["Wifi", "Breakfast", "Sports Bar", "Shuttle"],
      deal: true,
      worldCupVenue: true,
      distanceToStadium: "2km",
      matchesHosted: ["Match de groupe F", "Match de groupe G"],
    },
    {
      id: 7,
      name: "Stadium View Suites",
      location: "Rabat, Maroc",
      country: "Maroc",
      price: 199,
      originalPrice: 299,
      rating: 4.3,
      image: "/placeholder.svg?height=200&width=300&text=Stadium+View",
      amenities: ["Wifi", "Breakfast", "Stadium Views", "Match Day Package"],
      deal: true,
      worldCupVenue: true,
      distanceToStadium: "800m",
      matchesHosted: ["Match de groupe H", "Match de groupe A"],
    },
  ]
  
  // Best booking times - For World Cup matches
  export const bookingTimes: BookingTime[] = [
    {
      id: 1,
      destination: "Matches de groupe",
      bestMonth: "6 mois avant",
      savingsPercent: 35,
      image: "/placeholder.svg?height=150&width=200&text=Matches+de+groupe",
    },
    {
      id: 2,
      destination: "Quarts de finale",
      bestMonth: "9 mois avant",
      savingsPercent: 45,
      image: "/placeholder.svg?height=150&width=200&text=Quarts+de+finale",
    },
    {
      id: 3,
      destination: "Finale",
      bestMonth: "12 mois avant",
      savingsPercent: 60,
      image: "/placeholder.svg?height=150&width=200&text=Finale",
    },
  ]
  
  // Popular searches - World Cup host cities
  export const popularSearches: PopularSearch[] = [
    { id: 1, term: "Madrid", count: 28500, flag: "🇪🇸" },
    { id: 2, term: "Lisbonne", count: 23700, flag: "🇵🇹" },
    { id: 3, term: "Casablanca", count: 19300, flag: "🇲🇦" },
    { id: 4, term: "Barcelone", count: 18800, flag: "🇪🇸" },
    { id: 5, term: "Paris", count: 17900, flag: "🇫🇷" },
    { id: 6, term: "Rabat", count: 14200, flag: "🇲🇦" },
    { id: 7, term: "Porto", count: 12800, flag: "🇵🇹" },
    { id: 8, term: "Séville", count: 11500, flag: "🇪🇸" },
  ]
  
  