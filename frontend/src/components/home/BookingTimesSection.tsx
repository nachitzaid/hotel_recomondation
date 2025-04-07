"use client"

import { Clock, Calendar, TrendingUp, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Hotel {
  id: string
  HotelName: string
  cityName: string
  countyName: string
  Description: string
  HotelRating: string
  Address: string
  Attractions: string
  FaxNumber: string
  PhoneNumber: string
  HotelWebsiteUrl: string
  image?: string
  price?: number
}

export default function BookingTimesSection() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels")
        const data = await res.json()
        console.log("Fetched data:", data) 

        const formatted = data.slice(0, 3).map((hotel: any) => ({
          id: hotel["_id"],
          HotelName: hotel["HotelName"],
          cityName: hotel["cityName"],
          countyName: hotel["countyName"],
          Description: hotel["Description"],
          HotelRating: hotel["HotelRating"],
          Address: hotel["Address"],
          Attractions: hotel["Attractions"],
          FaxNumber: hotel["FaxNumber"],
          PhoneNumber: hotel["PhoneNumber"],
          HotelWebsiteUrl: hotel["HotelWebsiteUrl"],
          image: "https://tse2.mm.bing.net/th?id=OIP.L-TMYC1WSSBHkPOc4uDZtAHaEv&pid=Api&P=0&h=180",
          price: Math.floor(Math.random() * (200 - 80 + 1)) + 80,
        }))

        setHotels(formatted)
      } catch (error) {
        console.error("Error fetching hotels:", error)
      }
    }

    fetchHotels()
  }, [])

  const toggleDescription = (hotelId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [hotelId]: !prev[hotelId],
    }))
  }

  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
      <div className="flex items-center mb-6">
        <Clock className="text-blue-600 mr-2 h-6 w-6" />
        <h2 className="text-2xl font-bold">Quand réserver pour la Coupe du Monde 2030</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all">
            <div className="h-32 w-full bg-gray-200 relative">
              <img
                src={hotel.image || "/placeholder.svg"}
                alt={hotel.HotelName}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="font-bold text-lg text-white">{hotel.HotelName}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center mt-2 text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-medium">Ville: </span>
                <span className="ml-2">{hotel.cityName}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {expandedDescriptions[hotel.id] ? hotel.Description : truncateDescription(hotel.Description)}
                {hotel.Description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(hotel.id)}
                    className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {expandedDescriptions[hotel.id] ? "Voir moins" : "Voir plus"}
                  </button>
                )}
              </div>
              <div className="mt-3 bg-green-100 text-green-800 px-3 py-2 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Hôtel: {hotel.HotelRating}</span>
                </div>
                <div className="font-semibold text-blue-600">à partir de {hotel.price} MAD</div>
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
  )
}