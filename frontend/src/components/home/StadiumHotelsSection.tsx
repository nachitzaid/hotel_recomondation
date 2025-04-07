"use client"

import { useEffect, useState } from "react"
import { Trophy, Calendar, TrendingUp, ShieldCheck, Heart, ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Hotel {
  id: string
  HotelName: string
  cityName: string
  countyName: string
  Description: string
  HotelRating: string
  price?: number
  image?: string
}

export default function StadiumHotelsSection() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels")
        if (!res.ok) throw new Error("Failed to fetch hotels")
        const data = await res.json()

        const formatted = data.map((hotel: any) => ({
          id: hotel._id || hotel.HotelCode?.toString(),
          HotelName: hotel.HotelName,
          cityName: hotel.cityName,
          countyName: hotel.countyName,
          Description: hotel.Description || "Hôtel bien situé avec des services de qualité.",
          HotelRating: hotel.HotelRating || "4.0",
          price: hotel.price || Math.floor(Math.random() * (200 - 80 + 1)) + 80,
          image: hotel.image || "https://tse3.mm.bing.net/th?id=OIP.VHeyQ91B5GAdbUQ6jKTEowHaE8&pid=Api&P=0&h=180"
        }))

        setHotels(formatted)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    )
  }

  const viewDetails = (id: string) => {
    router.push(`/hotels/${id}`)
  }

  const filteredHotels = activeTab === "all" 
    ? hotels 
    : hotels.filter(hotel => hotel.countyName.toLowerCase() === activeTab.toLowerCase())

  if (loading) return <div className="p-8 text-center">Chargement...</div>
  if (error) return <div className="p-8 text-center text-red-500">Erreur: {error}</div>

  return (
    <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="text-amber-500 mr-2 h-6 w-6" />
          <h2 className="text-2xl font-bold">Hôtels près des stades</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="espagne">Espagne</TabsTrigger>
            <TabsTrigger value="portugal">Portugal</TabsTrigger>
            <TabsTrigger value="maroc">Maroc</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all">
            <div className="h-48 w-full bg-gray-200 relative">
              <img
                src={hotel.image || "/placeholder-hotel.jpg"}
                alt={hotel.HotelName}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="font-bold text-lg text-white">{hotel.HotelName}</h3>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(hotel.id)
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
              >
                <Heart 
                  className={`h-5 w-5 ${favorites.includes(hotel.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
                />
              </button>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center mt-2 text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span>{hotel.cityName}, {hotel.countyName}</span>
              </div>
              
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {hotel.Description}
              </p>
              
              <div className="mt-3 bg-green-100 text-green-800 px-3 py-2 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Note: {hotel.HotelRating}/5</span>
                </div>
                <span className="font-semibold">{hotel.price} MAD/nuit</span>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Button 
                onClick={() => viewDetails(hotel.id)}
                className="w-full flex items-center justify-between"
                variant="outline"
              >
                Voir les détails
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 bg-blue-100 p-4 rounded-lg flex items-start">
        <ShieldCheck className="h-5 w-5 text-blue-700 mt-1 mr-3 flex-shrink-0" />
        <p className="text-blue-800 text-sm">
          <span className="font-bold">Conseil d'expert:</span> Réservez tôt pour obtenir les meilleurs prix près des stades. 
          Les hôtels affichent souvent des promotions pour les réservations anticipées.
        </p>
      </div>
    </section>
  )
}




//khdam ms bla detail 
//  "use client"

// import { useEffect, useState } from "react"
// import { Trophy, Calendar, TrendingUp, ShieldCheck, Heart, ChevronRight } from "lucide-react"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"

// interface Hotel {
//   id: string
//   HotelName: string
//   cityName: string
//   countyName: string
//   Description: string
//   HotelRating: string
//   Address: string
//   Attractions: string
//   price?: number
//   image?: string
// }

// export default function StadiumHotelsSection() {
//   const [hotels, setHotels] = useState<Hotel[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState("all")
//   const [favorites, setFavorites] = useState<number[]>([])
//   const router = useRouter()

//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         const res = await fetch("/api/hotels")
//         if (!res.ok) throw new Error("Failed to fetch hotels")
//         const data = await res.json()

//         const formatted = data.map((hotel: any) => ({
//           id: hotel["_id"] || hotel["HotelCode"],
//           HotelName: hotel["HotelName"],
//           cityName: hotel["cityName"],
//           countyName: hotel["countyName"],
//           Description: hotel["Description"] || "Hôtel bien situé avec des services de qualité.",
//           HotelRating: hotel["HotelRating"] || "4.0",
//           Address: hotel["Address"] || "",
//           Attractions: hotel["Attractions"] || "WiFi, Restaurant, Piscine",
//           price: hotel["price"] || Math.floor(Math.random() * (200 - 80 + 1)) + 80,
//           image: hotel["image"] || "/placeholder-hotel.jpg"
//         }))

//         setHotels(formatted)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchHotels()
//   }, [])

//   const toggleFavorite = (id: number) => {
//     setFavorites(prev => 
//       prev.includes(id) 
//         ? prev.filter(item => item !== id) 
//         : [...prev, id]
//     )
//   }

//   const viewDetails = (id: string) => {
//     router.push(`/hotel/${id}`)
//   }

//   const filteredHotels = activeTab === "all" 
//     ? hotels 
//     : hotels.filter(hotel => hotel.countyName.toLowerCase() === activeTab.toLowerCase())

//   if (loading) return <div className="p-8 text-center">Chargement...</div>
//   if (error) return <div className="p-8 text-center text-red-500">Erreur: {error}</div>

//   return (
//     <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Trophy className="text-amber-500 mr-2 h-6 w-6" />
//           <h2 className="text-2xl font-bold">Hôtels près des stades</h2>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList>
//             <TabsTrigger value="all">Tous</TabsTrigger>
//             <TabsTrigger value="espagne">Espagne</TabsTrigger>
//             <TabsTrigger value="portugal">Portugal</TabsTrigger>
//             <TabsTrigger value="maroc">Maroc</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {filteredHotels.map((hotel) => (
//           <Card key={hotel.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all">
//             <div className="h-48 w-full bg-gray-200 relative">
//               <img
//                 src={hotel.image}
//                 alt={hotel.HotelName}
//                 className="object-cover w-full h-full"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
//                 <h3 className="font-bold text-lg text-white">{hotel.HotelName}</h3>
//               </div>
//               <button 
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   toggleFavorite(Number(hotel.id))
//                 }}
//                 className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
//               >
//                 <Heart 
//                   className={`h-5 w-5 ${favorites.includes(Number(hotel.id)) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
//                 />
//               </button>
//             </div>
            
//             <CardContent className="p-4">
//               <div className="flex items-center mt-2 text-gray-700">
//                 <Calendar className="h-4 w-4 mr-2 text-blue-600" />
//                 <span>{hotel.cityName}, {hotel.countyName}</span>
//               </div>
              
//               <p className="mt-2 text-sm text-gray-600 line-clamp-3">
//                 {hotel.Description}
//               </p>
              
//               <div className="mt-3 bg-green-100 text-green-800 px-3 py-2 rounded-md flex items-center justify-between">
//                 <div className="flex items-center">
//                   <TrendingUp className="h-4 w-4 mr-2" />
//                   <span>Note: {hotel.HotelRating}/5</span>
//                 </div>
//                 <span className="font-semibold">{hotel.price} MAD/nuit</span>
//               </div>
//             </CardContent>
            
//             <CardFooter className="p-4 pt-0">
//               <Button 
//                 onClick={() => viewDetails(hotel.id)}
//                 className="w-full flex items-center justify-between"
//                 variant="outline"
//               >
//                 Voir les détails
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       <div className="mt-8 bg-blue-100 p-4 rounded-lg flex items-start">
//         <ShieldCheck className="h-5 w-5 text-blue-700 mt-1 mr-3 flex-shrink-0" />
//         <p className="text-blue-800 text-sm">
//           <span className="font-bold">Conseil d'expert:</span> Réservez tôt pour obtenir les meilleurs prix près des stades. 
//           Les hôtels affichent souvent des promotions pour les réservations anticipées.
//         </p>
//       </div>
//     </section>
//   )
// }






// "use client"

// import { useEffect, useState } from "react"
// import { Trophy, Calendar, TrendingUp, ShieldCheck } from "lucide-react"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"

// interface Hotel {
//   id: string
//   HotelName: string
//   cityName: string
//   countyName: string
//   Description: string
//   HotelRating: string
//   Address: string
//   Attractions: string
//   FaxNumber: string
//   PhoneNumber: string
//   HotelWebsiteUrl: string
//   image?: string
//   price?: number
// }

// interface StadiumHotelsSectionProps {
//   favorites: number[]
//   activeTab: string
//   onTabChange: (value: string) => void
//   onToggleFavorite: (id: number) => void
//   onViewDetails: (id: number) => void
// }

// export default function StadiumHotelsSection({
//   favorites,
//   activeTab,
//   onTabChange,
//   onToggleFavorite,
//   onViewDetails,
// }: StadiumHotelsSectionProps) {
//   const [hotels, setHotels] = useState<Hotel[]>([])
//   const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})

//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         const res = await fetch("/api/hotels")
//         const data = await res.json()

//         const formatted = data.map((hotel: any) => ({
//           id: hotel["_id"] || hotel["HotelCode"],
//           HotelName: hotel["HotelName"],
//           cityName: hotel["cityName"],
//           countyName: hotel["countyName"],
//           Description: hotel["Description"] || "Hôtel bien situé avec des services de qualité, idéal pour votre séjour pendant la Coupe du Monde 2030.",
//           HotelRating: hotel["HotelRating"] || "4.0",
//           Address: hotel["Address"] || "",
//           Attractions: hotel["Attractions"] || "WiFi, Restaurant, Piscine",
//           FaxNumber: hotel["FaxNumber"] || "",
//           PhoneNumber: hotel["PhoneNumber"] || "",
//           HotelWebsiteUrl: hotel["HotelWebsiteUrl"] || "",
//           image: hotel["image"] || "https://tse2.mm.bing.net/th?id=OIP.L-TMYC1WSSBHkPOc4uDZtAHaEv&pid=Api&P=0&h=180",
//           price: hotel["price"] || Math.floor(Math.random() * (200 - 80 + 1)) + 80,
//         }))

//         setHotels(formatted)
//       } catch (error) {
//         console.error("Error fetching hotels:", error)
//       }
//     }

//     fetchHotels()
//   }, [])

//   const toggleDescription = (hotelId: string) => {
//     setExpandedDescriptions((prev) => ({
//       ...prev,
//       [hotelId]: !prev[hotelId],
//     }))
//   }

//   const truncateDescription = (text: string, maxLength = 100) => {
//     if (!text || text.length <= maxLength) return text || ""
//     return text.substring(0, maxLength) + "..."
//   }

//   // Filter hotels based on active tab
//   const filteredHotels =
//     activeTab === "all" ? hotels : hotels.filter((hotel) => hotel.countyName.toLowerCase() === activeTab.toLowerCase())

//   return (
//     <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Trophy className="text-amber-500 mr-2 h-6 w-6" />
//           <h2 className="text-2xl font-bold">Hôtels près des stades</h2>
//         </div>

//         <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
//           <TabsList>
//             <TabsTrigger value="all">Tous</TabsTrigger>
//             <TabsTrigger value="espagne">Espagne 🇪🇸</TabsTrigger>
//             <TabsTrigger value="portugal">Portugal 🇵🇹</TabsTrigger>
//             <TabsTrigger value="maroc">Maroc 🇲🇦</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {filteredHotels.map((hotel) => (
//           <Card 
//             key={hotel.id} 
//             className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all cursor-pointer"
//             onClick={() => onViewDetails(Number(hotel.id))}
//           >
//             <div className="h-32 w-full bg-gray-200 relative">
//               <img
//                 src={hotel.image || "/placeholder.svg"}
//                 alt={hotel.HotelName}
//                 className="object-cover w-full h-full"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
//                 <h3 className="font-bold text-lg text-white">{hotel.HotelName}</h3>
//               </div>
//               <button 
//                 className={`absolute top-2 right-2 p-1 rounded-full ${favorites.includes(Number(hotel.id)) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'}`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onToggleFavorite(Number(hotel.id));
//                 }}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
//             <CardContent className="p-4">
//               <div className="flex items-center mt-2 text-gray-700">
//                 <Calendar className="h-4 w-4 mr-2 text-blue-600" />
//                 <span className="font-medium">Ville: </span>
//                 <span className="ml-2">{hotel.cityName}, {hotel.countyName}</span>
//               </div>
//               <div className="mt-2 text-sm text-gray-600">
//                 {expandedDescriptions[hotel.id] ? hotel.Description : truncateDescription(hotel.Description)}
//                 {hotel.Description && hotel.Description.length > 100 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleDescription(hotel.id);
//                     }}
//                     className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     {expandedDescriptions[hotel.id] ? "Voir moins" : "Voir plus"}
//                   </button>
//                 )}
//               </div>
//               <div className="mt-3 bg-green-100 text-green-800 px-3 py-2 rounded-md flex items-center justify-between">
//                 <div className="flex items-center">
//                   <TrendingUp className="h-4 w-4 mr-2" />
//                   <span>Hôtel: {hotel.HotelRating}</span>
//                 </div>
//                 <div className="font-semibold text-blue-600">à partir de {hotel.price} MAD</div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

      
//     </section>
//   )
// }