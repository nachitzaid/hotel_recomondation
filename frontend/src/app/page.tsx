"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import HotelDashboardHeader from "./HotelDashboardHeader"
import CountdownTimer from "@/components/ui/countdown-timer"
import {
  Star,
  MapPin,
  Wifi,
  Coffee,
  Tv,
  Bath,
  Heart,
  Clock,
  TrendingUp,
  Search,
  Flame,
  Trophy,
  Flag,
  Users,
  Calendar,
  Globe,
  Ticket,
  Plane,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Hotel {
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

interface PopularSearch {
  id: number
  term: string
  count: number
  flag: string
}

interface HostCountry {
  name: string
  flag: string
  stadiums: number
  matches: number
}

export default function HomePage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("worldCupFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (searchParams: any) => {
    console.log("Search params:", searchParams)
    // In a real implementation, we would redirect to the search page
    if (searchParams.destination) {
      router.push(`/hotels?location=${searchParams.destination}`)
    }
  }

  const handleViewDetails = (hotelId: number) => {
    // Navigate to hotel details page
    router.push(`/hotels/${hotelId}`)
  }

  const toggleFavorite = (id: number) => {
    let newFavorites: number[]

    if (favorites.includes(id)) {
      newFavorites = favorites.filter((hotelId) => hotelId !== id)
    } else {
      newFavorites = [...favorites, id]
    }

    setFavorites(newFavorites)
    localStorage.setItem("worldCupFavorites", JSON.stringify(newFavorites))
  }

  // Host countries data
  const hostCountries: HostCountry[] = [
    { name: "Espagne", flag: "🇪🇸", stadiums: 8, matches: 20 },
    { name: "Portugal", flag: "🇵🇹", stadiums: 5, matches: 15 },
    { name: "Maroc", flag: "🇲🇦", stadiums: 6, matches: 15 },
  ]

  // Sample hotel data - updated for World Cup 2030
  const hotels: Hotel[] = [
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
  const hotDeals: Hotel[] = [
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
  const bookingTimes = [
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
  const popularSearches: PopularSearch[] = [
    { id: 1, term: "Madrid", count: 28500, flag: "🇪🇸" },
    { id: 2, term: "Lisbonne", count: 23700, flag: "🇵🇹" },
    { id: 3, term: "Casablanca", count: 19300, flag: "🇲🇦" },
    { id: 4, term: "Barcelone", count: 18800, flag: "🇪🇸" },
    { id: 5, term: "Paris", count: 17900, flag: "🇫🇷" },
    { id: 6, term: "Rabat", count: 14200, flag: "🇲🇦" },
    { id: 7, term: "Porto", count: 12800, flag: "🇵🇹" },
    { id: 8, term: "Séville", count: 11500, flag: "🇪🇸" },
  ]

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "breakfast":
        return <Coffee className="h-4 w-4" />
      case "tv":
        return <Tv className="h-4 w-4" />
      case "spa":
      case "pool":
        return <Bath className="h-4 w-4" />
      case "stadium view":
      case "stadium views":
        return <Trophy className="h-4 w-4" />
      case "fan zone":
        return <Flag className="h-4 w-4" />
      case "shuttle":
        return <Plane className="h-4 w-4" />
      case "match tickets":
      case "match day package":
        return <Ticket className="h-4 w-4" />
      case "sports bar":
      case "stadium tours":
        return <Users className="h-4 w-4" />
      default:
        return null
    }
  }

  const calculateDiscount = (original?: number, current?: number) => {
    if (!original || !current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  // Filter hotels based on active tab
  const filteredHotels =
    activeTab === "all" ? hotels : hotels.filter((hotel) => hotel.country.toLowerCase() === activeTab.toLowerCase())

  const getCountryFlag = (country: string): string => {
    switch (country.toLowerCase()) {
      case "espagne":
        return "🇪🇸"
      case "portugal":
        return "🇵🇹"
      case "maroc":
        return "🇲🇦"
      case "france":
        return "🇫🇷"
      default:
        return "🏳️"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <HotelDashboardHeader onSearch={handleSearch} />

      {/* World Cup 2030 Banner */}
      <div className="relative bg-gradient-to-r from-red-700 via-amber-600 to-green-700 py-12 text-white text-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/placeholder.svg?height=100&width=100&text=⚽')",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Coupe du Monde 2030</h1>
          <p className="text-xl mb-8">Réservez votre hébergement pour le plus grand événement sportif mondial</p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {hostCountries.map((country) => (
              <div
                key={country.name}
                className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 flex flex-col items-center"
              >
                <span className="text-4xl mb-2">{country.flag}</span>
                <p className="font-bold text-lg">{country.name}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span>{country.stadiums} stades</span>
                  <span>{country.matches} matchs</span>
                </div>
              </div>
            ))}
          </div>

          <CountdownTimer targetDate="2030-06-12T18:00:00" />

          <div className="mt-8">
            <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
              <Ticket className="mr-2 h-5 w-5" />
              Explorer les forfaits match + hôtel
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto py-16 px-4">
        {/* Hot Hotel Deals */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Flame className="text-red-500 mr-2 h-6 w-6" />
            <h2 className="text-2xl font-bold">Offres spéciales Coupe du Monde</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotDeals.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0">
                <div className="relative">
                  <div className="h-48 w-full bg-gray-200">
                    <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
                  </div>
                  {hotel.deal && hotel.originalPrice && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                      -{calculateDiscount(hotel.originalPrice, hotel.price)}%
                    </Badge>
                  )}
                  {hotel.worldCupVenue && (
                    <Badge className="absolute top-2 left-16 bg-blue-600 hover:bg-blue-700 flex items-center">
                      <Trophy className="h-3 w-3 mr-1" /> Stade Coupe du Monde
                    </Badge>
                  )}
                  <button
                    onClick={() => toggleFavorite(hotel.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                  >
                    <Heart
                      className={`h-5 w-5 ${favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{hotel.name}</h3>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{hotel.location}</span>
                        <span className="ml-1">{getCountryFlag(hotel.country)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center">
                      <Star className="h-4 w-4 fill-blue-700 mr-1" />
                      {hotel.rating}
                    </Badge>
                  </div>

                  {hotel.distanceToStadium && (
                    <div className="flex items-center text-green-600 mt-2 text-sm font-medium">
                      <Trophy className="h-3 w-3 mr-1" />À {hotel.distanceToStadium} du stade
                    </div>
                  )}

                  {hotel.matchesHosted && hotel.matchesHosted.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-blue-700">Matchs à proximité:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hotel.matchesHosted.map((match, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-xs">
                            {match}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        {getAmenityIcon(amenity)}
                        <span className="ml-1">{amenity}</span>
                      </div>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">+{hotel.amenities.length - 3}</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-lg text-red-600">{hotel.price}€</span>
                    {hotel.originalPrice && (
                      <span className="text-gray-500 text-sm line-through ml-2">{hotel.originalPrice}€</span>
                    )}
                    <span className="text-gray-500 text-sm block"> / nuit</span>
                  </div>
                  <Button onClick={() => handleViewDetails(hotel.id)} className="bg-blue-600 hover:bg-blue-700">
                    Détails
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Best Time to Book */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
          <div className="flex items-center mb-6">
            <Clock className="text-blue-600 mr-2 h-6 w-6" />
            <h2 className="text-2xl font-bold">Quand réserver pour la Coupe du Monde 2030</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookingTimes.map((item) => (
              <Card key={item.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all">
                <div className="h-32 w-full bg-gray-200 relative">
                  <Image src={item.image || "/placeholder.svg"} alt={item.destination} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="font-bold text-lg text-white">{item.destination}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mt-2 text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">Meilleur moment: </span>
                    <span className="ml-2">{item.bestMonth}</span>
                  </div>
                  <div className="mt-3 bg-green-100 text-green-800 px-3 py-2 rounded-md flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Économisez jusqu'à {item.savingsPercent}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 bg-blue-100 p-4 rounded-lg flex items-start">
            <ShieldCheck className="h-5 w-5 text-blue-700 mt-1 mr-3 flex-shrink-0" />
            <p className="text-blue-800 text-sm">
              <span className="font-bold">Conseil d'expert:</span> Pour les matchs à élimination directe, les prix des
              hôtels augmentent considérablement après que les équipes qualifiées sont connues. Réservez à l'avance et
              choisissez une politique d'annulation flexible pour maximiser vos économies.
            </p>
          </div>
        </section>

        {/* Popular Searches */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Search className="text-purple-600 mr-2 h-6 w-6" />
            <h2 className="text-2xl font-bold">Villes hôtes les plus recherchées</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {popularSearches.map((search) => (
              <Button
                key={search.id}
                variant="outline"
                className="rounded-full hover:bg-purple-50 hover:border-purple-300"
                onClick={() => router.push(`/hotels?location=${search.term}`)}
              >
                <span className="mr-2">{search.flag}</span>
                <span className="font-medium">{search.term}</span>
                <span className="ml-2 text-xs text-gray-500">({search.count.toLocaleString()})</span>
              </Button>
            ))}
          </div>
        </section>

        {/* Popular Stadiums Hotels */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Trophy className="text-amber-500 mr-2 h-6 w-6" />
              <h2 className="text-2xl font-bold">Hôtels près des stades</h2>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="espagne">Espagne 🇪🇸</TabsTrigger>
                <TabsTrigger value="portugal">Portugal 🇵🇹</TabsTrigger>
                <TabsTrigger value="maroc">Maroc 🇲🇦</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0">
                <div className="relative">
                  <div className="h-48 w-full bg-gray-200">
                    <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
                  </div>
                  {hotel.worldCupVenue && (
                    <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-700 flex items-center">
                      <Trophy className="h-3 w-3 mr-1" /> Stade Coupe du Monde
                    </Badge>
                  )}
                  <button
                    onClick={() => toggleFavorite(hotel.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                  >
                    <Heart
                      className={`h-5 w-5 ${favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{hotel.name}</h3>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{hotel.location}</span>
                        <span className="ml-1">{getCountryFlag(hotel.country)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center">
                      <Star className="h-4 w-4 fill-blue-700 mr-1" />
                      {hotel.rating}
                    </Badge>
                  </div>

                  {hotel.distanceToStadium && (
                    <div className="flex items-center text-green-600 mt-2 text-sm font-medium">
                      <Trophy className="h-3 w-3 mr-1" />À {hotel.distanceToStadium} du stade
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        {getAmenityIcon(amenity)}
                        <span className="ml-1">{amenity}</span>
                      </div>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">+{hotel.amenities.length - 3}</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-lg">{hotel.price}€</span>
                    <span className="text-gray-500 text-sm"> / nuit</span>
                  </div>
                  <Button onClick={() => handleViewDetails(hotel.id)} className="bg-green-500 hover:bg-green-600">
                    À propos
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* World Cup Experience Section */}
        <section className="mt-16 mb-16">
          <div className="flex items-center mb-6">
            <Globe className="text-blue-600 mr-2 h-6 w-6" />
            <h2 className="text-2xl font-bold">L'expérience Coupe du Monde 2030</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Forfaits Match + Hôtel</h3>
                <p className="text-gray-600">
                  Réservez votre hébergement et vos billets de match ensemble pour bénéficier de réductions exclusives
                  et d'un accès prioritaire.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Flag className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fan Zones Officielles</h3>
                <p className="text-gray-600">
                  Séjournez près des fan zones officielles pour vivre l'ambiance de la Coupe du Monde même sans billet
                  pour les matchs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="rounded-full bg-amber-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Plane className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Navettes Inter-Pays</h3>
                <p className="text-gray-600">
                  Profitez de nos services de navette entre l'Espagne, le Portugal et le Maroc pour suivre votre équipe
                  tout au long du tournoi.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-red-900 to-green-900 text-white py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">WorldCup Hotels</h3>
              <p className="text-gray-300">
                Réservez votre séjour pour la Coupe du Monde 2030 en Espagne, Portugal et Maroc.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Hôtels
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Stades
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Calendrier des matchs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Villes Hôtes</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Madrid
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Lisbonne
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Casablanca
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Barcelone
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: info@worldcuphotels2030.com</li>
                <li>Téléphone: +33 1 23 45 67 89</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} WorldCup Hotels 2030. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

