"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Star, Wifi, Utensils, Tv, Car, Coffee, Users, CalendarDays } from "lucide-react"

// Types
interface Room {
  type: string
  price: number
  capacity: number
}

interface Hotel {
  id: string
  name: string
  location: string
  rating: number
  price: number
  image: string
  description: string
  amenities: string[]
  rooms: Room[]
}

// Données simulées pour les hôtels
const hotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Hôtel Paris",
    location: "Paris, France",
    rating: 4.8,
    price: 250,
    image: "/placeholder.svg?height=400&width=800",
    description:
      "Un hôtel luxueux au cœur de Paris avec vue sur la Tour Eiffel. Profitez d'un séjour inoubliable dans l'une de nos chambres élégantes, dégustez une cuisine raffinée dans notre restaurant étoilé et détendez-vous dans notre spa de renommée mondiale. À quelques pas des Champs-Élysées et des principales attractions parisiennes.",
    amenities: [
      "Wifi gratuit",
      "Restaurant",
      "Spa",
      "Salle de sport",
      "Service en chambre",
      "Parking",
      "Climatisation",
      "Bar",
    ],
    rooms: [
      { type: "Chambre Standard", price: 250, capacity: 2 },
      { type: "Chambre Deluxe", price: 350, capacity: 2 },
      { type: "Suite Junior", price: 450, capacity: 3 },
      { type: "Suite Présidentielle", price: 950, capacity: 4 },
    ],
  },
  {
    id: "2",
    name: "Seaside Resort",
    location: "Nice, France",
    rating: 4.5,
    price: 180,
    image: "/placeholder.svg?height=400&width=800",
    description:
      "Profitez de la mer Méditerranée dans ce resort en bord de plage. Notre établissement offre un accès direct à une plage privée, plusieurs piscines extérieures et un service attentionné. Idéal pour des vacances en famille ou en couple, vous pourrez profiter du soleil de la Côte d'Azur tout en vous relaxant dans un cadre idyllique.",
    amenities: [
      "Plage privée",
      "Piscines",
      "Restaurant",
      "Bar",
      "Wifi gratuit",
      "Climatisation",
      "Activités nautiques",
    ],
    rooms: [
      { type: "Chambre Vue Jardin", price: 180, capacity: 2 },
      { type: "Chambre Vue Mer", price: 220, capacity: 2 },
      { type: "Suite Familiale", price: 320, capacity: 4 },
      { type: "Villa Privée", price: 580, capacity: 6 },
    ],
  },
  {
    id: "3",
    name: "Mountain Lodge",
    location: "Chamonix, France",
    rating: 4.7,
    price: 210,
    image: "/placeholder.svg?height=400&width=800",
    description:
      "Un chalet confortable avec vue imprenable sur le Mont Blanc. Notre lodge de montagne combine le charme rustique avec le confort moderne. En hiver, profitez d'un accès direct aux pistes de ski, et en été, explorez les nombreux sentiers de randonnée. Notre restaurant sert une cuisine locale et notre spa vous aidera à vous détendre après une journée active.",
    amenities: [
      "Accès aux pistes",
      "Spa",
      "Restaurant",
      "Cheminée",
      "Wifi gratuit",
      "Local à ski",
      "Terrasse panoramique",
    ],
    rooms: [
      { type: "Chambre Alpine", price: 210, capacity: 2 },
      { type: "Suite Panoramique", price: 310, capacity: 2 },
      { type: "Chalet Familial", price: 410, capacity: 5 },
      { type: "Penthouse", price: 610, capacity: 4 },
    ],
  },
  {
    id: "4",
    name: "City Center Hotel",
    location: "Lyon, France",
    rating: 4.3,
    price: 150,
    image: "/placeholder.svg?height=400&width=800",
    description:
      "Idéalement situé au centre-ville, parfait pour les voyages d'affaires. Notre hôtel moderne offre tout le confort nécessaire pour un séjour réussi à Lyon. À proximité des principales attractions touristiques et du quartier d'affaires, vous pourrez facilement vous déplacer dans la ville. Nos chambres sont conçues pour allier fonctionnalité et élégance.",
    amenities: ["Wifi gratuit", "Centre d'affaires", "Restaurant", "Salle de fitness", "Parking", "Climatisation"],
    rooms: [
      { type: "Chambre Business", price: 150, capacity: 1 },
      { type: "Chambre Supérieure", price: 180, capacity: 2 },
      { type: "Suite Executive", price: 250, capacity: 2 },
      { type: "Appartement", price: 320, capacity: 4 },
    ],
  },
]

// Icônes pour les équipements
const amenityIcons: Record<string, React.ReactNode> = {
  "Wifi gratuit": <Wifi className="h-4 w-4" />,
  Restaurant: <Utensils className="h-4 w-4" />,
  Télévision: <Tv className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  "Service en chambre": <Coffee className="h-4 w-4" />,
}

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Trouver l'hôtel correspondant à l'ID
  const hotel = hotels.find((h) => h.id === params.id)

  if (!hotel) {
    return <div className="container mx-auto py-8 text-center">Hôtel non trouvé</div>
  }

  const handleReservation = () => {
    if (!selectedRoom) {
      alert("Veuillez sélectionner une chambre")
      return
    }

    if (!isLoggedIn) {
      // Rediriger vers la page de connexion
      router.push("/login")
    } else {
      // Rediriger vers la page de réservation
      router.push(`/hotels/${hotel.id}/reservation?room=${selectedRoom}`)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href="/hotels" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Retour aux hôtels
        </Link>
        <div className="relative h-80 w-full rounded-lg overflow-hidden mb-6">
          <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <div className="flex items-center mt-2 text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {hotel.location}
            </div>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
              <span className="font-medium">{hotel.rating}</span>
              <span className="text-gray-500 ml-1">(120 avis)</span>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-2xl font-bold">À partir de {hotel.price}€</p>
            <p className="text-sm text-gray-500">par nuit</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex border-b mb-4">
          <button className="px-4 py-2 border-b-2 border-blue-600 font-medium">Description</button>
          <button className="px-4 py-2 text-gray-500">Chambres</button>
          <button className="px-4 py-2 text-gray-500">Équipements</button>
          <button className="px-4 py-2 text-gray-500">Emplacement</button>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <p className="text-lg">{hotel.description}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Chambres disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotel.rooms.map((room) => (
            <div
              key={room.type}
              className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
                selectedRoom === room.type ? "border-blue-600 ring-2 ring-blue-600" : ""
              }`}
              onClick={() => setSelectedRoom(room.type)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{room.type}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    Jusqu'à {room.capacity} personnes
                  </div>
                </div>
                {selectedRoom === room.type && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Sélectionnée</span>
                )}
              </div>

              <div className="h-40 bg-gray-200 rounded-md my-4">
                <img
                  src={`/placeholder.svg?height=160&width=320&text=${encodeURIComponent(room.type)}`}
                  alt={room.type}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <ul className="text-sm space-y-1 mb-4">
                <li>• Petit-déjeuner inclus</li>
                <li>• Wifi gratuit</li>
                <li>• Annulation gratuite jusqu'à 24h avant</li>
              </ul>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold">{room.price}€</p>
                  <p className="text-xs text-gray-500">par nuit</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleReservation}
            disabled={!selectedRoom}
            className={`flex items-center px-6 py-3 rounded-md font-medium ${
              selectedRoom ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Réserver maintenant
          </button>
        </div>
      </div>
    </div>
  )
}

