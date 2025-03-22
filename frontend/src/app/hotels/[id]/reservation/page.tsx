"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, CreditCard, Building, ArrowLeft, Users, CalendarDays, BedDouble } from "lucide-react"

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
  image: string
  rooms: Room[]
}

// Données simulées pour les hôtels
const hotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Hôtel Paris",
    location: "Paris, France",
    image: "/placeholder.svg?height=200&width=300",
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
    image: "/placeholder.svg?height=200&width=300",
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
    image: "/placeholder.svg?height=200&width=300",
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
    image: "/placeholder.svg?height=200&width=300",
    rooms: [
      { type: "Chambre Business", price: 150, capacity: 1 },
      { type: "Chambre Supérieure", price: 180, capacity: 2 },
      { type: "Suite Executive", price: 250, capacity: 2 },
      { type: "Appartement", price: 320, capacity: 4 },
    ],
  },
]

export default function ReservationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomType = searchParams.get("room")

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 3)))
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Trouver l'hôtel correspondant à l'ID
  const hotel = hotels.find((h) => h.id === params.id)

  if (!hotel) {
    return <div className="container mx-auto py-8 text-center">Hôtel non trouvé</div>
  }

  // Trouver la chambre sélectionnée
  const selectedRoom = hotel.rooms.find((r) => r.type === roomType)

  if (!selectedRoom) {
    return <div className="container mx-auto py-8 text-center">Chambre non trouvée</div>
  }

  // Calculer le nombre de nuits
  const nights = endDate && date ? Math.ceil((endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)) : 0

  // Calculer le prix total
  const totalPrice = selectedRoom.price * nights
  const taxesAndFees = totalPrice * 0.1 // 10% de taxes et frais
  const grandTotal = totalPrice + taxesAndFees

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler une requête API
    setTimeout(() => {
      setIsSubmitting(false)
      // Rediriger vers une page de confirmation
      router.push(`/hotels/${params.id}/reservation/confirmation`)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href={`/hotels/${params.id}`} className="text-blue-600 hover:underline mb-4 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux détails de l'hôtel
        </Link>
        <h1 className="text-3xl font-bold mb-2">Réservation</h1>
        <p className="text-gray-600">Complétez les informations ci-dessous pour finaliser votre réservation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Détails du séjour
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="check-in">Date d'arrivée</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-1"
                          id="check-in"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          locale={fr}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="check-out">Date de départ</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-1"
                          id="check-out"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          locale={fr}
                          disabled={(date) => date <= (date || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Nombre de voyageurs</Label>
                  <div className="flex items-center mt-1">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    <Input
                      type="number"
                      id="guests"
                      defaultValue={2}
                      min={1}
                      max={selectedRoom.capacity}
                      className="w-20"
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      (Max: {selectedRoom.capacity} {selectedRoom.capacity > 1 ? "personnes" : "personne"})
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 rounded-md">
                  <BedDouble className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium">{selectedRoom.type}</p>
                    <p className="text-sm text-gray-600">
                      {selectedRoom.price}€ / nuit • Capacité: {selectedRoom.capacity}{" "}
                      {selectedRoom.capacity > 1 ? "personnes" : "personne"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name">Prénom</Label>
                    <Input id="first-name" placeholder="Votre prénom" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="last-name">Nom</Label>
                    <Input id="last-name" placeholder="Votre nom" required className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="+33 6 12 34 56 78" required className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="special-requests">Demandes spéciales (optionnel)</Label>
                  <textarea
                    id="special-requests"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Informez-nous de toute demande particulière..."
                  ></textarea>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card">Carte de crédit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="card-number">Numéro de carte</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" required className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Date d'expiration</Label>
                        <Input id="expiry" placeholder="MM/AA" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="card-name">Nom sur la carte</Label>
                      <Input id="card-name" placeholder="J. DUPONT" required className="mt-1" />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    J'accepte les{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      conditions générales
                    </a>{" "}
                    et la{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      politique de confidentialité
                    </a>
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Traitement en cours..." : "Confirmer la réservation"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Résumé de la réservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-md overflow-hidden">
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">{hotel.location}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    {date && endDate
                      ? `${format(date, "d MMMM", { locale: fr })} - ${format(endDate, "d MMMM yyyy", {
                          locale: fr,
                        })}`
                      : "Dates non sélectionnées"}
                  </span>
                </div>
                <div className="flex items-center">
                  <BedDouble className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{selectedRoom.type}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">2 adultes</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    {selectedRoom.price}€ x {nights} nuits
                  </span>
                  <span>{totalPrice}€</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes et frais</span>
                  <span>{taxesAndFees.toFixed(2)}€</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{grandTotal.toFixed(2)}€</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <p className="font-medium text-blue-800">Politique d'annulation</p>
                <p className="text-blue-700 mt-1">
                  Annulation gratuite jusqu'à 24 heures avant l'arrivée. Après cette période, des frais peuvent
                  s'appliquer.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

