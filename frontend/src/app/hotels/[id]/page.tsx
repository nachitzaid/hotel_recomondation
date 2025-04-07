import { notFound } from "next/navigation"
import { Star, MapPin, Phone, Info, Wifi, Coffee, Utensils, Car, Bath } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Hotel = {
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
}

async function getHotelById(id: string): Promise<Hotel | null> {
  try {
    const res = await fetch(`http://localhost:3000/api1/hotels/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch hotel:", res.statusText)
      return null
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching hotel:", error)
    return null
  }
}

export default async function HotelDetailsPage({ params }: { params: { id: string } }) {
  const hotel = await getHotelById(params.id)

  if (!hotel) {
    console.log("Hotel not found or error fetching data")
    return notFound()
  }

  const cleanedHotel = Object.fromEntries(Object.entries(hotel).map(([key, value]) => [key.trim(), value]))

  const rooms = [
    {
      name: "Chambre Standard",
      description: "Chambre confortable avec lit double.",
      price: 100,
      imageUrl: "https://tse1.mm.bing.net/th?id=OIP.MYgIs0W9NHWkSOseb_lQ2gHaE6&pid=Api&P=0&h=180",
      amenities: ["Wi-Fi", "TV", "Climatisation", "Salle de bain privée"],
    },
    {
      name: "Chambre Supérieure",
      description: "Chambre plus spacieuse avec vue sur le jardin.",
      price: 150,
      imageUrl: "https://tse4.mm.bing.net/th?id=OIP.LpYt3t3nms4Ngwz6dFudUAHaE_&pid=Api&P=0&h=180",
      amenities: ["Wi-Fi", "TV", "Climatisation", "Minibar", "Vue sur jardin"],
    },
    {
      name: "Suite",
      description: "Suite luxueuse avec salon séparé.",
      price: 250,
      imageUrl: "https://tse3.mm.bing.net/th?id=OIP.CUMVcgEW15IWeJLDYJs9GgHaDt&pid=Api&P=0&h=180",
      amenities: ["Wi-Fi", "TV", "Climatisation", "Salon séparé", "Baignoire", "Service en chambre"],
    },
  ]

  // Parse hotel rating to generate stars
  const ratingNumber = Number.parseInt(cleanedHotel.HotelRating) || 0

  // Split facilities into an array for better display
  const facilities = cleanedHotel.HotelFacilities
    ? cleanedHotel.HotelFacilities.split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://tse2.mm.bing.net/th?id=OIP.2e5EJ8mavTlIwZSQ3TQaUAHaEK&pid=Api&P=0&h=180"
          alt={cleanedHotel.HotelName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < ratingNumber ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <Badge variant="outline" className="bg-white/90 text-black ml-2">
                {cleanedHotel.HotelRating} étoiles
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{cleanedHotel.HotelName}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" />
              <p className="text-lg">
                {cleanedHotel.cityName}, {cleanedHotel.countyName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Reservation Bar (Mobile) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white shadow-md p-4 flex justify-between items-center">
        <div>
          <p className="font-bold text-xl">€{rooms[0].price}+</p>
          <p className="text-sm text-muted-foreground">par nuit</p>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-700">Réserver maintenant</Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6 bg-transparent border-b rounded-none h-auto p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-600 data-[state=active]:text-rose-600 pb-2"
                >
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger
                  value="rooms"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-600 data-[state=active]:text-rose-600 pb-2"
                >
                  Chambres
                </TabsTrigger>
                <TabsTrigger
                  value="facilities"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-600 data-[state=active]:text-rose-600 pb-2"
                >
                  Équipements
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-600 data-[state=active]:text-rose-600 pb-2"
                >
                  Emplacement
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="space-y-8">
                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg">
                    {cleanedHotel.Address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-rose-600" />
                        <span>{cleanedHotel.Address}</span>
                      </div>
                    )}
                    {cleanedHotel.PhoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-rose-600" />
                        <span>{cleanedHotel.PhoneNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {cleanedHotel.Description && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">À propos de cet hôtel</h2>
                      <div className="prose max-w-none">
                        <p dangerouslySetInnerHTML={{ __html: cleanedHotel.Description }} />
                      </div>
                    </div>
                  )}

                  {/* Attractions Preview */}
                  {cleanedHotel.Attractions && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Attractions à proximité</h2>
                      </div>
                      <div className="p-6 bg-gray-100 rounded-lg">
                        <p>{cleanedHotel.Attractions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Chambres disponibles</h2>
                  <div className="grid gap-6">
                    {rooms.map((room, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="grid md:grid-cols-[300px_1fr] h-full">
                          <div className="relative h-64 md:h-full">
                            <img
                              src={room.imageUrl || "/placeholder.svg"}
                              alt={room.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 flex flex-col">
                            <CardHeader className="p-0 pb-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-bold">{room.name}</h3>
                                  <p className="text-muted-foreground">{room.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold">€{room.price}</p>
                                  <p className="text-sm text-muted-foreground">par nuit</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-grow">
                              <div className="mt-4">
                                <h4 className="font-semibold mb-2">Équipements de la chambre</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {room.amenities.map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-rose-600"></div>
                                      <span className="text-sm">{amenity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="p-0 pt-4 flex justify-end">
                              <Button className="bg-rose-600 hover:bg-rose-700">Réserver</Button>
                            </CardFooter>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="facilities" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Équipements de l'hôtel</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {facilities.length > 0 ? (
                      facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
                          {index % 5 === 0 && <Wifi className="h-5 w-5 text-rose-600" />}
                          {index % 5 === 1 && <Coffee className="h-5 w-5 text-rose-600" />}
                          {index % 5 === 2 && <Utensils className="h-5 w-5 text-rose-600" />}
                          {index % 5 === 3 && <Car className="h-5 w-5 text-rose-600" />}
                          {index % 5 === 4 && <Bath className="h-5 w-5 text-rose-600" />}
                          <span>{facility}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-4 bg-gray-100 rounded-lg">
                        <p>{cleanedHotel.HotelFacilities || "Aucune information sur les équipements disponible."}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Emplacement</h2>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-rose-600" />
                      <p className="text-lg font-medium">{cleanedHotel.Address}</p>
                      <p className="text-muted-foreground">
                        {cleanedHotel.cityName}, {cleanedHotel.countyName}
                      </p>
                      {cleanedHotel.PinCode && (
                        <p className="text-muted-foreground">Code postal: {cleanedHotel.PinCode}</p>
                      )}
                    </div>
                  </div>

                  {cleanedHotel.Attractions && (
                    <div className="space-y-4 mt-8">
                      <h3 className="text-xl font-bold">Attractions à proximité</h3>
                      <div className="p-6 bg-gray-100 rounded-lg">
                        <p>{cleanedHotel.Attractions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <Card className="shadow-lg border-gray-200">
                <CardHeader className="pb-4">
                  <h3 className="text-xl font-bold">Réserver votre séjour</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">
                      €{rooms[0].price}
                      <span className="text-base font-normal text-muted-foreground"> / nuit</span>
                    </p>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < ratingNumber ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">{cleanedHotel.HotelRating} étoiles</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Arrivée</label>
                        <div className="border rounded-md p-2">
                          <input
                            type="date"
                            className="w-full outline-none"
                            defaultValue={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Départ</label>
                        <div className="border rounded-md p-2">
                          <input
                            type="date"
                            className="w-full outline-none"
                            defaultValue={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium">Voyageurs</label>
                      <div className="border rounded-md p-2">
                        <select className="w-full outline-none">
                          <option>1 adulte</option>
                          <option>2 adultes</option>
                          <option>2 adultes, 1 enfant</option>
                          <option>2 adultes, 2 enfants</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>€{rooms[0].price} x 3 nuits</span>
                      <span>€{rooms[0].price * 3}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de service</span>
                      <span>€{Math.round(rooms[0].price * 0.1 * 3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>€{Math.round(rooms[0].price * 0.05 * 3)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        €
                        {rooms[0].price * 3 +
                          Math.round(rooms[0].price * 0.1 * 3) +
                          Math.round(rooms[0].price * 0.05 * 3)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 h-12 text-lg">Réserver maintenant</Button>
                </CardFooter>
              </Card>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <p>Vous ne serez pas débité maintenant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}